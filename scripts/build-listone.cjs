const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2] || '/tmp/listone_2026_27.xlsx';
const wb = XLSX.readFile(SRC);

function sheetToPlayers(sheetName, extra) {
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  // row0 = title, row1 = headers, row2+ = data
  const out = [];
  for (let i = 2; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0 || r[0] === '') continue;
    const [id, role, roleMantra, name, team, qtA, qtI, diff, qtAM, qtIM, diffM, fvm, fvmM] = r;
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

const active = sheetToPlayers('Tutti', { transferredOut: false });
const ceduti = sheetToPlayers('Ceduti', { transferredOut: true });

const all = [...active, ...ceduti];
console.log('Active:', active.length, 'Ceduti:', ceduti.length, 'Total:', all.length);

const outPath = path.join(__dirname, '..', 'src', 'data', 'listone.json');
fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
console.log('Written to', outPath);
