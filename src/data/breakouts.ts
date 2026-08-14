import type { Breakout } from './types';
import { activeListone } from './listone';
import { normalizeName, surnameOf } from '../lib/names';

let seq = 0;
const id = () => `bo${++seq}`;

const b = (team: string, name: string, role: Breakout['role'], reason: string): Breakout => ({
  id: id(),
  team,
  name,
  role,
  reason,
});

export const breakouts: Breakout[] = [
  // ---------------- Inter ----------------
  b('Inter', 'Pio Esposito', 'ATT', 'Terzo centravanti dietro Lautaro e Thuram: nella seconda stagione in A può puntare alla doppia cifra con largo minutaggio in coppe.'),
  b('Inter', 'Diouf', 'DIF', 'Pre-season convincente da esterno basso, si è guadagnato il ruolo di prima alternativa a Spence davanti a Luis Henrique.'),
  b('Inter', 'Bonny', 'ATT', 'Quarto centravanti nelle gerarchie, jolly low-cost da subentro con buon impatto mostrato a fine mercato scorso.'),

  // ---------------- Napoli ----------------
  b('Napoli', 'Vergara', 'CEN', 'Testato da Allegri come mezzala dinamica, in ballottaggio diretto con Anguissa.'),
  b('Napoli', 'Marianucci', 'DIF', 'Reparto arretrato più debole della rosa dopo l\'infortunio di Buongiorno: ampio margine per uno spazio da titolare.'),
  b('Napoli', 'Lang', 'ATT', 'Nuovo colpo in entrata dal PSV: il club ha rifiutato un prestito all\'Atalanta, segno di fiducia nel suo utilizzo.'),

  // ---------------- Juventus ----------------
  b('Juventus', 'Alajbegovic', 'CEN', 'Definito il vero jolly del mercato bianconero, scommessa tecnica per rubare spazio sulla trequarti.'),
  b('Juventus', 'Ekhator', 'ATT', 'Arrivato dal Genoa, scommessa a pochi crediti con qualità già intraviste nonostante lo stop iniziale per infortunio.'),
  b('Juventus', 'Conceição', 'CEN', 'Tra i più positivi nelle ultime amichevoli, candidato a più spazio sulla trequarti offensiva.'),

  // ---------------- Roma ----------------
  b('Roma', 'Castro', 'ATT', 'Arrivato dal Bologna, scelto personalmente da Gasperini come erede di Dovbyk: veste la maglia numero 9 da titolare designato.'),
  b('Roma', 'Pisilli', 'CEN', 'Blindato sul mercato da Gasperini, in ballottaggio con Soulé e Pellegrini con spazio garantito dagli impegni di Champions.'),
  b('Roma', 'Rensch', 'DIF', 'Ex Ajax, alternativa economica a Molina, utilizzabile anche da esterno a tutta fascia.'),
  b('Roma', 'Ziolkowski', 'DIF', 'Giovane centrale polacco classe 2005, fisico e forte di testa: ricambio con margini di crescita nel reparto arretrato.'),

  // ---------------- Sassuolo ----------------
  b('Sassuolo', 'Bakola', 'CEN', '18 anni, tecnica e personalità già evidenti in ritiro: candidato a ritagliarsi spazio a centrocampo nel nuovo sistema di Aquilani.'),
  b('Sassuolo', 'Volpato', 'CEN', 'Dopo stagioni di alti e bassi mostra finalmente continuità, con gol nell\'ultima amichevole contro l\'Augsburg.'),
  b('Sassuolo', 'Adžić', 'ATT', 'Arrivato dalla Juventus, qualità e personalità da trequartista/seconda punta: jolly offensivo con ampio margine di utilizzo.'),
  b('Sassuolo', 'Domínguez', 'ATT', 'Ala sinistra prelevata dal Bologna, nuova arma per l\'attacco neroverde.'),

  // ---------------- Genoa ----------------
  b('Genoa', 'Norton-Cuffy', 'DIF', 'Terzino inglese già valutato 15M, seguito da club di Premier League: favorito per una maglia da titolare a destra.'),
  b('Genoa', 'Barbini', 'DIF', 'Centrale classe 2006 promosso dalla Primavera, in rampa di lancio per fare esperienza in prima squadra.'),
  b('Genoa', 'Nuredini', 'ATT', 'Punta centrale classe 2007, prodotto del vivaio con margini di crescita da sfruttare a gara in corso.'),
  b('Genoa', 'Sow', 'CEN', 'Centrocampista arrivato dal Sevilla, rinforzo internazionale ancora poco conosciuto in Serie A.'),

  // ---------------- Parma ----------------
  b('Parma', 'Diallo', 'ATT', 'Ala classe 2007 che si ispira a Neymar: uno dei prospetti più attesi del nuovo mercato gialloblù.'),
  b('Parma', 'Zouin', 'ATT', 'Esterno offensivo italo-marocchino classe 2006, appena blindato con un contratto lungo, segno di fiducia della società.'),
  b('Parma', 'Touré', 'ATT', 'Ex Atalanta, cerca il riscatto personale già dalla Coppa Italia: rincalzo offensivo di categoria superiore.'),

  // ---------------- Cagliari ----------------
  b('Cagliari', 'Felici', 'ATT', 'Ala sinistra che può dare profondità e imprevedibilità all\'attacco rossoblù.'),
  b('Cagliari', 'Fazzini', 'CEN', 'Centrocampista di qualità in prestito dalla Fiorentina, valutato 8,5M: ottimo negli inserimenti.'),
  b('Cagliari', 'Winks', 'CEN', 'Ex Tottenham/Leicester, metronomo internazionale a basso costo per la mediana di Pisacane.'),
  b('Cagliari', 'Maldini', 'ATT', 'In prestito con opzione dall\'Atalanta, talento mai davvero rilanciato: può trovare spazio da trequartista.'),

  // ---------------- Milan ----------------
  b('Milan', 'Camarda', 'ATT', 'Vice-Ramos, molto applaudito nelle amichevoli estive: Capello ne chiede spazio da titolare a gara.'),
  b('Milan', 'Diawara', 'CEN', 'Classe 2006, può trovare minutaggio tra campionato ed Europa League.'),
  b('Milan', 'Chukwu', 'DIF', 'Tra i migliori nelle amichevoli (7 in pagella vs Celtic), insidia le rotazioni sulla fascia.'),

  // ---------------- Atalanta ----------------
  b('Atalanta', 'Samardžić', 'CEN', 'Con Sarri può avere più spazio da mezzala: scommessa a basso costo.'),
  b('Atalanta', 'Gaetano', 'CEN', 'Nuovo arrivo dal Cagliari (ufficiale), intesa già buona con Scamacca nelle amichevoli.'),
  b('Atalanta', 'Bernasconi', 'DIF', 'Soluzione low cost sulla corsia, in crescita nelle rotazioni.'),
  b('Atalanta', 'Ahanor', 'DIF', 'Giovane in ballottaggio per una maglia da titolare, da recuperare dall\'infortunio.'),

  // ---------------- Como ----------------
  b('Como', 'Liberali', 'CEN', 'Ha scelto il progetto Fàbregas rifiutando il Milan: jolly offensivo con ampio minutaggio previsto.'),
  b('Como', 'Diao', 'ATT', 'Scommessa dal potenziale elevato secondo gli osservatori fantacalcistici.'),
  b('Como', 'Baturina', 'CEN', 'Può ritagliarsi spazio importante nella trequarti di Fàbregas.'),
  b('Como', 'Kaiki', 'DIF', 'Uno dei difensori low cost più interessanti per rendimento atteso.'),

  // ---------------- Fiorentina ----------------
  b('Fiorentina', 'Atta', 'CEN', 'Colpo di mercato di Paratici, già a segno nelle amichevoli precampionato.'),
  b('Fiorentina', 'Oulai', 'CEN', 'Ottime sensazioni nel precampionato, minutaggio in crescita nel nuovo assetto di Grosso.'),
  b('Fiorentina', 'Jiménez', 'DIF', 'Esterno con licenza di spingere, può avere una maglia da titolare a sinistra.'),
  b('Fiorentina', 'Valdepeñas', 'DIF', 'Può conquistare spazio sulla fascia nelle rotazioni viola.'),

  // ---------------- Bologna ----------------
  b('Bologna', 'Piccoli', 'ATT', 'Nuovo acquisto dalla Fiorentina, forte ballottaggio con Dovbyk per la maglia da titolare.'),
  b('Bologna', 'Pobega', 'CEN', 'Riscattato dal Milan, corsa e inserimenti: scommessa a centrocampo per Tedesco.'),
  b('Bologna', 'Moro', 'CEN', 'Il nuovo assetto tattico di Tedesco può valorizzarne qualità e gestione palla.'),
  b('Bologna', 'Cambiaghi', 'ATT', 'Parte da rincalzo ma può risultare decisivo a gara in corso.'),

  // ---------------- Lazio ----------------
  b('Lazio', 'Ratkov', 'ATT', 'Prima punta titolare designata da Gattuso dopo i gol nel precampionato.'),
  b('Lazio', 'Pedraza', 'DIF', 'Nuovo terzino sinistro, titolare quasi certo con Tavares fuori forma/in uscita.'),
  b('Lazio', 'Hautekiet', 'DIF', 'Neo-acquisto belga, completa la coppia centrale con Doekhi in una difesa che gioca alta.'),
  b('Lazio', 'Belahyane', 'CEN', 'Da rincalzo a possibile titolare, spazio lasciato da Cataldi reduce da lungo infortunio.'),

  // ---------------- Torino ----------------
  b('Torino', 'Comuzzo', 'DIF', 'Giovane ex Fiorentina, si sta imponendo per un posto da titolare in difesa.'),
  b('Torino', 'Fitz-Jim', 'CEN', 'Ex Ajax, in ballottaggio per un posto in mediana nel nuovo assetto di Abate.'),
  b('Torino', 'Cacciamani', 'CEN', 'Prodotto Primavera già debuttante in A, ha rifiutato interesse della Roma per restare.'),
  b('Torino', 'Njie', 'ATT', 'Esterno 2005 seguito da club di Premier League, possibile spazio in attacco.'),

  // ---------------- Udinese ----------------
  b('Udinese', 'Chakvetadze', 'CEN', 'Nuovo arrivo dal Watford, centrocampista offensivo georgiano candidato a spazio in mediana.'),
  b('Udinese', 'Gómez', 'CEN', 'Trequartista spagnolo preso dall\'Athletic Bilbao, profilo da inserimento offensivo poco noto in Italia.'),
  b('Udinese', 'Zanoli', 'DIF', 'Ex Napoli, eredita la maglia da titolare sulla fascia destra lasciata da Kristensen (ceduto all\'Atalanta).'),

  // ---------------- Lecce ----------------
  b('Lecce', 'Geubbels', 'ATT', 'Nuovo arrivo di fisicità e talento mai sbocciato altrove, in ballottaggio diretto con Stulić per un posto da titolare.'),
  b('Lecce', 'Dalla Vecchia', 'CEN', 'Trattativa avanzata dal Torino: può inserirsi subito in mediana con buon minutaggio.'),
  b('Lecce', 'Pierotti', 'ATT', 'Argentino versatile già indicato come pedina fissa da Di Francesco, ma ancora poco conosciuto al grande pubblico.'),

  // ---------------- Monza ----------------
  b('Monza', 'Mariani', 'CEN', 'Arrivato dalla Primavera della Roma con contratto triennale: scommessa a centrocampo per Jurić.'),
  b('Monza', 'Varesis', 'DIF', 'Giovane greco preso a titolo definitivo dalla Fiorentina, alternativa pronta in una difesa da ricostruire.'),
  b('Monza', 'Robinson', 'ATT', '21 anni, prestito secco dal Southampton: profilo fresco per il nuovo assetto di Jurić.'),
  b('Monza', 'Akinsanmiro', 'CEN', 'Dall\'Inter, corteggiato già da febbraio: può prendersi subito la mediana con Pessina infortunato.'),

  // ---------------- Frosinone ----------------
  b('Frosinone', 'Grillitsch', 'CEN', 'Austriaco di esperienza internazionale, arriva a costo contenuto: può diventare il metronomo a sorpresa della mediana.'),
  b('Frosinone', 'Schmid', 'CEN', 'Altro colpo austriaco, dinamismo e inserimenti ancora poco noti ai fantallenatori.'),
  b('Frosinone', 'Masini', 'CEN', 'Prestito con obbligo dal Genoa: categoria superiore e margini di crescita in un centrocampo rinnovato.'),

  // ---------------- Venezia ----------------
  b('Venezia', 'Sohm', 'CEN', 'Svizzero arrivato dalla Fiorentina con diritto di riscatto, subito nelle rotazioni titolari.'),
  b('Venezia', 'Okoro', 'ATT', 'Confermato da Stroppa nonostante gli interessamenti: può avere lo spazio da titolare mancatogli altrove.'),
  b('Venezia', 'Adorante', 'ATT', 'Ha detto no al Pisa, resta il terminale offensivo di riferimento con margini di crescita in categoria superiore.'),
];

for (const breakout of breakouts) {
  const surname = surnameOf(normalizeName(breakout.name));
  const sameRole = activeListone.filter((entry) => entry.role === breakout.role);
  const exact = sameRole.filter((entry) => normalizeName(entry.name).split(' ')[0] === surname);
  const candidates = exact.length > 0 ? exact : sameRole.filter((entry) => normalizeName(entry.name).includes(surname));
  const teamNorm = normalizeName(breakout.team);
  const best = candidates.find((entry) => normalizeName(entry.team) === teamNorm) ?? candidates[0];

  if (best) {
    breakout.market = {
      price: best.price,
      fvm: best.fvm,
      listoneTeam: best.team,
      listoneName: best.name,
      listoneId: best.id,
    };
  }
}
