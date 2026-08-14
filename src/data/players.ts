import type { Player } from './types';
import { activeListone } from './listone';
import { normalizeName, surnameOf } from '../lib/names';

let seq = 0;
const id = () => `p${++seq}`;

const p = (
  name: string,
  team: string,
  role: Player['role'],
  category: Player['category'],
  note: string,
  risk?: Player['risk'],
): Player => ({ id: id(), name, team, role, category, note, risk });

export const players: Player[] = [
  // ---------------- PORTIERI ----------------
  p('Josep Martínez', 'Inter', 'POR', 'Top', 'Promosso titolare: Sommer non ha rinnovato ed è partito da svincolato a fine contratto (30/6/2026).', 'Basso'),
  p('Alex Meret', 'Napoli', 'POR', 'Top', 'Base del blocco difensivo di Allegri.', 'Basso'),
  p('Michele Di Gregorio', 'Juventus', 'POR', 'Top', 'Portiere titolare di una delle difese più solide.', 'Basso'),
  p('Jean Butez', 'Como', 'POR', 'Value Pick', 'Il possesso palla del Como minimizza i tiri concessi.', 'Basso'),
  p('Maduka Okoye', 'Udinese', 'POR', 'Value Pick', 'Titolare inamovibile della porta friulana.', 'Basso'),
  p('Marco Carnesecchi', 'Atalanta', 'POR', 'Value Pick', 'Buon rapporto tenuta/costo nel nuovo assetto Sarri.', 'Medio'),
  p('Justin Bijlow', 'Genoa', 'POR', 'Scommessa', 'Alto volume di parate (P>3.6), ideale per Modificatore Difesa.', 'Medio'),
  p('Elia Caprile', 'Cagliari', 'POR', 'Scommessa', 'Alto volume di parate, ideale per Modificatore Difesa.', 'Medio'),
  p('Zion Suzuki', 'Parma', 'POR', 'Trappola', '⚠ Aggiornamento 14/08: in uscita verso il PSG (~35M), Juventus alla finestra — il listone ufficiale non riflette ancora la cessione. Rischio di comprare un portiere che lascia il club.', 'Alto'),
  p('Wladimiro Falcone', 'Lecce', 'POR', 'Low-cost', 'Presenza sicura a 1 credito, valorizzato dal Modificatore.', 'Basso'),
  p('Palmisani', 'Frosinone', 'POR', 'Low-cost', 'Copertura economica a 1 credito.', 'Basso'),
  p('Filip Stankovic', 'Venezia', 'POR', 'Low-cost', 'Nuovo titolare della neopromossa: Joronen ha lasciato il club (ora al Palermo).', 'Basso'),
  p('Ivan Provedel', 'Inter', 'POR', 'Low-cost', 'Arrivato dalla Lazio come riserva di Josep Martínez.', 'Basso'),
  p('Mile Svilar', 'Roma', 'POR', 'Rischioso', 'Rendimento a rischio per le transizioni concesse dal sistema ultra-offensivo di Gasperini.', 'Alto'),
  p('David De Gea', 'Fiorentina', 'POR', 'Rischioso', 'Profilo esposto a discontinuità di rendimento.', 'Alto'),
  p('Vanja Milinković-Savić', 'Napoli', 'POR', 'Trappola', 'Passato al Napoli: fa da riserva a Meret, minutaggio da verificare.', 'Alto'),

  // ---------------- DIFENSORI ----------------
  p('Federico Dimarco', 'Inter', 'DIF', 'Top', 'Leader per xA e pericolosità sui piazzati.', 'Basso', ),
  p('Wesley', 'Roma', 'DIF', 'Top', 'Convertito a quinto di spinta da Gasperini.', 'Medio'),
  p('Alessandro Bastoni', 'Inter', 'DIF', 'Top', 'Centrale titolare inamovibile, ottimo anche da Modificatore.', 'Basso'),
  p('Gleison Bremer', 'Juventus', 'DIF', 'Top', 'Rientro dall\'infortunio, top per il Modificatore Difesa.', 'Basso'),
  p('Nahuel Molina', 'Roma', 'DIF', 'Value Pick', 'Trasferimento ufficiale dall\'Atlético Madrid (10/08/2026): quinto di spinta nel nuovo assetto giallorosso.', 'Medio'),
  p('Trevoh Chalobah', 'Como', 'DIF', 'Value Pick', 'Trasferimento ufficiale dal Chelsea (battuta la concorrenza dell\'Inter): centrale fisico e aggressivo in pressing per la difesa del Como.', 'Medio'),
  p('Oumar Solet', 'Udinese', 'DIF', 'Value Pick', 'Profilo ad alto rendimento per il Modificatore Difesa.', 'Basso'),
  p('Bartesaghi', 'Milan', 'DIF', 'Value Pick', 'Ampiezza sulla corsia nel 3-4-2-1 di Amorim.', 'Medio'),
  p('Juan Miranda', 'Bologna', 'DIF', 'Value Pick', 'Difensore regolare da assist nel sistema Tedesco.', 'Basso'),
  p('John Stones', 'Inter', 'DIF', 'Scommessa', 'Rinforzo di alto livello, da monitorare per adattamento e minutaggio.', 'Medio'),
  p('Radu Drăgușin', 'Fiorentina', 'DIF', 'Scommessa', 'Guida la difesa viola, alto potenziale di crescita.', 'Medio'),
  p('Yann Bisseck', 'Inter', 'DIF', 'Scommessa', 'Ceiling alto ma condizionato dal turnover con Stones e Pavard.', 'Medio'),
  p('Giuseppe Aurelio', 'Cagliari', 'DIF', 'Scommessa', 'Firma definitiva dallo Spezia fino al 2029: alternativa mancina ad Adam Obert.', 'Alto'),
  p('Marcus Pedersen', 'Torino', 'DIF', 'Low-cost', 'Corsia esterna molto avanzata nel 3-5-2 di Abate.', 'Basso'),
  p('Gabriele Zappa', 'Cagliari', 'DIF', 'Low-cost', 'Presenza costante a basso costo.', 'Basso'),
  p('Hassane Kamara', 'Udinese', 'DIF', 'Low-cost', 'Presenza costante a basso costo.', 'Basso'),
  p('Emanuele Valeri', 'Parma', 'DIF', 'Low-cost', 'Presenza costante a basso costo.', 'Basso'),
  p('Mario Hermoso', 'Roma', 'DIF', 'Rischioso', 'Esposto ai duelli individuali a tutto campo di Gasperini, alto tasso di cartellini.', 'Alto'),
  p('Dodô', 'Fiorentina', 'DIF', 'Rischioso', 'In uscita o in ballottaggio con Jiménez e João Mário.', 'Alto'),
  p('Benjamin Pavard', 'Inter', 'DIF', 'Trappola', 'Penalizzato dal turnover con Bisseck e Stones.', 'Medio'),
  p('Gianluca Mancini', 'Roma', 'DIF', 'Trappola', 'Rischio elevato per malus da ammonizione nel pressing alto.', 'Alto'),

  // ---------------- CENTROCAMPISTI ----------------
  p('Hakan Çalhanoğlu', 'Inter', 'CEN', 'Top', 'Primo rigorista e perno di manovra dell\'Inter.', 'Basso'),
  p('Kevin De Bruyne', 'Napoli', 'CEN', 'Top', 'Fulcro creativo del 4-3-3 di Allegri.', 'Medio'),
  p('Christian Pulisic', 'Milan', 'CEN', 'Top', 'Riferimento offensivo del Milan di Amorim. Aggiornamento 14/08: frattura da stress alla fibula, fuori 3-6 settimane — rischio salito nel breve termine.', 'Alto'),
  p('Scott McTominay', 'Napoli', 'CEN', 'Top', 'Inserimenti senza palla, top per gol da centrocampo.', 'Basso'),
  p('Nico Paz', 'Como', 'CEN', 'Value Pick', 'Distributore primario di giocate chiave e tiratore di piazzati nel Como.', 'Basso'),
  p('Martin Baturina', 'Como', 'CEN', 'Value Pick', 'Distributore primario di giocate chiave nel sistema di Fàbregas.', 'Basso'),
  p('Nicolò Zaniolo', 'Udinese', 'CEN', 'Value Pick', 'Spostato sulla trequarti da Runjaić.', 'Medio'),
  p('Ederson', 'Atalanta', 'CEN', 'Value Pick', 'Mezzala di inserimento nel nuovo 4-3-3 di Sarri.', 'Medio'),
  p('Franco Mastantuono', 'Fiorentina', 'CEN', 'Scommessa', 'Trequartista puro di grandi prospettive.', 'Alto'),
  p('Vasilije Adžić', 'Sassuolo', 'CEN', 'Scommessa', 'Alta varianza, profilo emergente.', 'Alto'),
  p('Lazar Samardžić', 'Atalanta', 'CEN', 'Scommessa', 'Alta varianza nel nuovo assetto Sarri.', 'Alto'),
  p('Eberechi Akinsanmiro', 'Monza', 'CEN', 'Scommessa', 'Alta varianza, profilo emergente.', 'Alto'),
  p('Jurgen Ekkelenkamp', 'Udinese', 'CEN', 'Low-cost', 'Sostanza a basso costo a centrocampo.', 'Basso'),
  p('Florian Grillitsch', 'Frosinone', 'CEN', 'Low-cost', 'Firmato a parametro zero dalla neopromossa: sostanza a basso costo a centrocampo.', 'Basso'),
  p('Hans Nicolussi Caviglia', 'Parma', 'CEN', 'Low-cost', 'Sostanza a basso costo a centrocampo.', 'Basso'),
  p('Jesper Karlström', 'Udinese', 'CEN', 'Low-cost', 'Sostanza a basso costo a centrocampo.', 'Basso'),
  p('Teun Koopmeiners', 'Juventus', 'CEN', 'Rischioso', 'Concorrenza sulla trequarti della Juventus, rotazioni per le coppe.', 'Medio'),
  p('Mattia Zaccagni', 'Lazio', 'CEN', 'Rischioso', 'Certezza di titolarità ma dipendente dalla fase offensiva della Lazio.', 'Medio'),
  p('Davide Frattesi', 'Inter', 'CEN', 'Trappola', 'Profilo di alto livello ma fortemente limitato dal turnover di Chivu.', 'Medio'),
  p('Piotr Zieliński', 'Inter', 'CEN', 'Trappola', 'Profilo di alto livello ma fortemente limitato dal turnover di Chivu.', 'Medio'),

  // ---------------- ATTACCANTI ----------------
  p('Lautaro Martínez', 'Inter', 'ATT', 'Top', 'Punto di riferimento assoluto del reparto offensivo.', 'Basso'),
  p('Donyell Malen', 'Roma', 'ATT', 'Top', 'Grandi volumi di tiro nel sistema di Gasperini.', 'Medio'),
  p('Moise Kean', 'Fiorentina', 'ATT', 'Top', 'Rigorista titolare, primo slot d\'attacco viola.', 'Basso'),
  p('Marcus Thuram', 'Inter', 'ATT', 'Top', 'Seconda punta di riferimento nell\'attacco nerazzurro.', 'Basso'),
  p('Gonçalo Ramos', 'Milan', 'ATT', 'Value Pick', 'Centravanti titolare del Milan di Amorim.', 'Medio'),
  p('Randal Kolo Muani', 'Juventus', 'ATT', 'Value Pick', 'Punta centrale nel 4-2-3-1 di Spalletti.', 'Medio'),
  p('Gianluca Scamacca', 'Atalanta', 'ATT', 'Value Pick', 'Perno centrale del nuovo attacco sarriano.', 'Alto'),
  p('Tasos Douvikas', 'Como', 'ATT', 'Value Pick', 'Supportato dalle giocate di Nico Paz e Baturina.', 'Medio'),
  p('Santiago Castro', 'Roma', 'ATT', 'Scommessa', 'Trasferito per 35 milioni di euro, potenziale di crescita elevato.', 'Alto'),
  p('Kevin Carlos', 'Cagliari', 'ATT', 'Scommessa', 'Ufficiale dal Nizza in prestito con opzione (10/08/2026): centravanti fisico a upside elevato.', 'Alto'),
  p('Ange-Yoan Bonny', 'Inter', 'ATT', 'Scommessa', 'Rincalzo di livello nell\'attacco nerazzurro, rigorista di riserva.', 'Medio'),
  p('Assane Diao', 'Como', 'ATT', 'Scommessa', 'Upside elevato nell\'attacco di Fàbregas.', 'Alto'),
  p('Keinan Davis', 'Udinese', 'ATT', 'Low-cost', 'Titolare e primo rigorista dell\'Udinese.', 'Basso'),
  p('Mateo Pellegrino', 'Parma', 'ATT', 'Trappola', '⚠ Aggiornamento 14/08: ceduto alla Fiorentina per circa 30M — il listone ufficiale non riflette ancora la cessione. Non è più un attaccante del Parma.', 'Alto'),
  p('Antonio Raimondo', 'Frosinone', 'ATT', 'Low-cost', 'Riferimento offensivo low-cost del Frosinone.', 'Basso'),
  p('Lorenzo Colombo', 'Genoa', 'ATT', 'Low-cost', 'Riferimento offensivo low-cost del Genoa, ora anche 1° rigorista della squadra.', 'Basso'),
  p('Artem Dovbyk', 'Bologna', 'ATT', 'Rischioso', 'In costante alternanza con Dallinga.', 'Alto'),
  p('Rasmus Højlund', 'Napoli', 'ATT', 'Rischioso', 'Soggetto alle rotazioni di Allegri.', 'Alto'),
  p('Jonathan David', 'Juventus', 'ATT', 'Trappola', 'Vlahovic è partito da svincolato (in trattativa col Besiktas): David resta il vero rischio in attacco Juve, ingaggio pesante ma minutaggio da verificare con l\'arrivo di Kolo Muani.', 'Alto'),
  p('Álvaro Morata', 'Como', 'ATT', 'Trappola', 'Belotti ha lasciato il Como da tempo: Morata resta relegato a riserva dietro Douvikas nelle gerarchie di Fàbregas.', 'Alto'),
];

// Proiezioni de-biased (Sezione E) — arricchiscono i giocatori corrispondenti.
const projections: Array<{
  name: string;
  team: string;
  expectedMinutes: string;
  setPieces: string;
  xG90: number;
  xA90: number;
  goalsRange: [number, number];
  assistsRange: [number, number];
  floorFP: number;
  ceilingFP: number;
}> = [
  { name: 'Lautaro Martínez', team: 'Inter', expectedMinutes: '2600-2900', setPieces: 'Rigorista 2° / No', xG90: 0.62, xA90: 0.18, goalsRange: [18, 22], assistsRange: [4, 6], floorFP: 16.5, ceilingFP: 24.0 },
  { name: 'Donyell Malen', team: 'Roma', expectedMinutes: '2400-2700', setPieces: 'No / No', xG90: 0.54, xA90: 0.15, goalsRange: [14, 18], assistsRange: [3, 5], floorFP: 13.0, ceilingFP: 20.0 },
  { name: 'Moise Kean', team: 'Fiorentina', expectedMinutes: '2700-3000', setPieces: 'Rigorista 1° / No', xG90: 0.48, xA90: 0.10, goalsRange: [13, 17], assistsRange: [2, 4], floorFP: 12.0, ceilingFP: 18.5 },
  { name: 'Kevin De Bruyne', team: 'Napoli', expectedMinutes: '2200-2500', setPieces: 'Rigori 2° / Puniz. / Corner', xG90: 0.28, xA90: 0.42, goalsRange: [6, 9], assistsRange: [11, 15], floorFP: 14.0, ceilingFP: 21.0 },
  { name: 'Christian Pulisic', team: 'Milan', expectedMinutes: '2500-2800', setPieces: 'Rigori 3° / Puniz. / Corner', xG90: 0.38, xA90: 0.25, goalsRange: [9, 12], assistsRange: [6, 8], floorFP: 12.5, ceilingFP: 17.5 },
  { name: 'Nico Paz', team: 'Como', expectedMinutes: '2600-2900', setPieces: 'Rigori 2° / Puniz. / Corner', xG90: 0.32, xA90: 0.30, goalsRange: [7, 10], assistsRange: [7, 10], floorFP: 12.0, ceilingFP: 18.0 },
  { name: 'Riccardo Orsolini', team: 'Bologna', expectedMinutes: '2300-2600', setPieces: 'Rigorista 1° / Puniz. / Corner', xG90: 0.41, xA90: 0.20, goalsRange: [10, 13], assistsRange: [4, 6], floorFP: 11.5, ceilingFP: 17.0 },
  { name: 'Federico Dimarco', team: 'Inter', expectedMinutes: '2200-2500', setPieces: 'No / Puniz. / Corner', xG90: 0.12, xA90: 0.32, goalsRange: [3, 5], assistsRange: [8, 11], floorFP: 10.5, ceilingFP: 15.5 },
  { name: 'Wesley', team: 'Roma', expectedMinutes: '2500-2800', setPieces: 'No / No', xG90: 0.15, xA90: 0.22, goalsRange: [4, 6], assistsRange: [5, 8], floorFP: 9.0, ceilingFP: 14.5 },
  { name: 'Gianluca Scamacca', team: 'Atalanta', expectedMinutes: '2100-2500', setPieces: 'Rigorista 4° / No', xG90: 0.51, xA90: 0.12, goalsRange: [11, 15], assistsRange: [3, 5], floorFP: 10.0, ceilingFP: 17.5 },
  { name: 'Gonçalo Ramos', team: 'Milan', expectedMinutes: '2300-2700', setPieces: 'No / No', xG90: 0.49, xA90: 0.11, goalsRange: [12, 16], assistsRange: [2, 4], floorFP: 11.0, ceilingFP: 17.0 },
  { name: 'Keinan Davis', team: 'Udinese', expectedMinutes: '2400-2800', setPieces: 'Rigorista 1° / No', xG90: 0.35, xA90: 0.14, goalsRange: [8, 11], assistsRange: [3, 5], floorFP: 9.5, ceilingFP: 14.0 },
  { name: 'Oumar Solet', team: 'Udinese', expectedMinutes: '2800-3100', setPieces: 'No / No', xG90: 0.06, xA90: 0.04, goalsRange: [1, 2], assistsRange: [1, 2], floorFP: 8.0, ceilingFP: 10.5 },
];

for (const proj of projections) {
  const player = players.find((pl) => pl.name === proj.name && pl.team === proj.team);
  if (player) {
    player.projection = {
      expectedMinutes: proj.expectedMinutes,
      setPieces: proj.setPieces,
      xG90: proj.xG90,
      xA90: proj.xA90,
      goalsRange: proj.goalsRange,
      assistsRange: proj.assistsRange,
      floorFP: proj.floorFP,
      ceilingFP: proj.ceilingFP,
    };
  }
}

export const playersWithProjection = players.filter((pl) => pl.projection);

// ---------------------------------------------------------------------------
// Verifica contro il listone ufficiale Fantacalcio.it 2026/27 (scaricato il
// 13/08/2026). Il dataset curato sopra viene dalla ricerca AI del documento
// originale e può contenere trasferimenti o squadre non più aggiornati: ogni
// giocatore viene incrociato col listone reale e marcato `verified` solo se
// nome e squadra coincidono con certezza.
for (const player of players) {
  const surname = surnameOf(normalizeName(player.name));
  const sameRole = activeListone.filter((entry) => entry.role === player.role);
  const exact = sameRole.filter((entry) => normalizeName(entry.name).split(' ')[0] === surname);
  const candidates = exact.length > 0
    ? exact
    : sameRole.filter((entry) => normalizeName(entry.name).includes(surname));

  const teamNorm = normalizeName(player.team);
  const sameTeamMatch = candidates.find((entry) => normalizeName(entry.team) === teamNorm);
  const best = sameTeamMatch ?? candidates[0];

  if (best) {
    player.market = {
      price: best.price,
      fvm: best.fvm,
      listoneTeam: best.team,
      listoneName: best.name,
      listoneId: best.id,
    };
    // Il listone ufficiale è la fonte di verità sulla squadra attuale: se il
    // giocatore è stato trovato ma con una squadra diversa (trasferimento),
    // la correggiamo automaticamente invece di lasciare il dato obsoleto.
    if (!sameTeamMatch) {
      player.team = best.team;
      player.teamCorrected = true;
    }
    player.verified = true;
  } else {
    player.verified = false;
  }
}

// Trasferimenti reali confermati da fonti giornalistiche ma non ancora
// presenti nello snapshot del listone scaricato dalla pipeline automatica:
// non sono errori, solo dati in attesa di sincronizzazione lato Fantacalcio.it.
// Nahuel Molina, Trevoh Chalobah, Giuseppe Aurelio, Florian Grillitsch e
// Kevin Carlos non sono più in questa lista: sono stati aggiunti manualmente
// a listone.json (id ufficiali fantacalcio.it) in attesa che il mirror
// scaricato li includa, quindi risultano già `verified`.
const PENDING_SYNC: [string, string][] = [];
for (const [name, team] of PENDING_SYNC) {
  const player = players.find((pl) => pl.name === name && pl.team === team);
  if (player) player.pendingSync = true;
}
