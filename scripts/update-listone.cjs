// Pipeline automatica: riscarica il listone ufficiale Fantacalcio 2026/27 e
// rigenera src/data/listone.json. Pensato per girare da GitHub Actions
// (cron giornaliero) ma funziona anche in locale con `node scripts/update-listone.cjs`.
//
// Fonte primaria: pagina di download di chiccheinformatiche.com (mirror pubblico,
// nessun login richiesto). L'URL viene estratto dinamicamente dalla pagina — se
// l'estrazione fallisce si ricade su un URL fisso noto funzionante.
// Nota: fantacalcio.it richiede un login (401 senza sessione autenticata),
// quindi non è utilizzabile qui senza credenziali.
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DOWNLOAD_PAGE =
  'https://www.chiccheinformatiche.com/download-listone-fantacalcio-2026-2027-in-excel-quotazioni-ruoli-e-file-completo-fantagazzetta/';
const FALLBACK_DOWNLOAD_URL = 'https://www.chiccheinformatiche.com/download/138813/';
const MIN_EXPECTED_PLAYERS = 400; // guardia di sicurezza: sotto questa soglia, non salvare
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'listone.json');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function resolveDownloadUrl() {
  try {
    const res = await fetch(DOWNLOAD_PAGE, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`pagina download: HTTP ${res.status}`);
    const html = await res.text();
    const match = html.match(/https:\/\/www\.chiccheinformatiche\.com\/download\/\d+\/[^"'\s]*/);
    if (match) return match[0];
    console.warn('Link di download non trovato nella pagina, uso il fallback fisso.');
  } catch (err) {
    console.warn('Impossibile leggere la pagina di download, uso il fallback fisso:', err.message);
  }
  return FALLBACK_DOWNLOAD_URL;
}

async function downloadXlsx(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download xlsx: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('spreadsheet') && !contentType.includes('excel')) {
    throw new Error(`content-type inatteso: ${contentType} (probabile pagina di errore, non un .xlsx)`);
  }
  return buf;
}

function sheetToPlayers(wb, sheetName, extra) {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) throw new Error(`Foglio "${sheetName}" non trovato nel file scaricato.`);
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const out = [];
  for (let i = 2; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0 || r[0] === '') continue;
    const [id, role, roleMantra, name, team, qtA, qtI, , qtAM, qtIM, , fvm, fvmM] = r;
    if (!name || !team) continue;
    out.push({
      id: String(id),
      name: String(name).trim(),
      team: String(team).trim(),
      role: String(role).trim(),
      roleMantra: String(roleMantra).trim(),
      price: Number(qtA) || 0,
      priceInitial: Number(qtI) || 0,
      priceMantra: Number(qtAM) || 0,
      priceMantraInitial: Number(qtIM) || 0,
      fvm: Number(fvm) || 0,
      fvmMantra: Number(fvmM) || 0,
      ...extra,
    });
  }
  return out;
}

async function main() {
  const url = await resolveDownloadUrl();
  console.log('Scarico da:', url);
  const buf = await downloadXlsx(url);

  const wb = XLSX.read(buf, { type: 'buffer' });
  const active = sheetToPlayers(wb, 'Tutti', { transferredOut: false });
  const ceduti = sheetToPlayers(wb, 'Ceduti', { transferredOut: true });
  const all = [...active, ...ceduti];

  console.log(`Attivi: ${active.length}, Ceduti: ${ceduti.length}, Totale: ${all.length}`);

  if (active.length < MIN_EXPECTED_PLAYERS) {
    throw new Error(
      `Solo ${active.length} giocatori attivi trovati (soglia minima ${MIN_EXPECTED_PLAYERS}) — probabile scrape corrotto, NON sovrascrivo listone.json.`,
    );
  }

  const previous = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : null;
  const next = JSON.stringify(all, null, 2);

  if (previous === next) {
    console.log('Nessuna variazione rispetto al listone attuale.');
    return;
  }

  fs.writeFileSync(OUT_PATH, next);
  console.log('listone.json aggiornato:', OUT_PATH);
}

main().catch((err) => {
  console.error('Aggiornamento listone FALLITO:', err.message);
  process.exit(1);
});
