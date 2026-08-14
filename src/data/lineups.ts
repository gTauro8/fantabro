export interface Lineup {
  team: string; // corrisponde a Team.id
  formation: string;
  goalkeeper: string;
  defenders: string[];
  midfielders: string[];
  attackingMid?: string[];
  forwards: string[];
  battles: string;
}

/**
 * Probabili formazioni tipo per l'avvio della stagione 2026/27, aggregate da
 * fonti pubbliche (sosfanta.com, DAZN, goal.com, fantacalcio-online.com) il
 * 14/08/2026. Non sono notizie ufficiali di giornata: sono una stima
 * "squadra tipo" utile in fase d'asta per capire chi è titolare inamovibile
 * e chi è in ballottaggio — vanno verificate con le probabili formazioni
 * reali quando si avvicina ogni giornata di campionato.
 */
export const lineups: Lineup[] = [
  {
    team: 'inter',
    formation: '3-5-2',
    goalkeeper: 'Martinez Jo.',
    defenders: ['Akanji', 'Stones', 'Bastoni'],
    midfielders: ['Luis Henrique', 'Barella', 'Çalhanoğlu', 'Zieliński', 'Dimarco'],
    forwards: ['Lautaro Martínez', 'Thuram'],
    battles: 'Bisseck-Stones (DC), Diouf-Luis Henrique (est. dx), Sucic/Mkhitaryan-Zieliński (mediano sx)',
  },
  {
    team: 'napoli',
    formation: '4-3-3',
    goalkeeper: 'Meret',
    defenders: ['Di Lorenzo', 'Rrahmani', 'Beukema', 'Spinazzola'],
    midfielders: ['Lobotka', 'McTominay', 'Anguissa'],
    forwards: ['Politano', 'Højlund', 'Neres'],
    battles: 'Anguissa-De Bruyne (mezzala), Politano/Neres/Vergara (esterni)',
  },
  {
    team: 'juventus',
    formation: '4-2-3-1',
    goalkeeper: 'Di Gregorio',
    defenders: ['Kalulu', 'Bremer', 'Kelly', 'Cambiaso'],
    midfielders: ['Locatelli', 'Thuram Kh.'],
    attackingMid: ['Conceição', 'McKennie', 'Yildiz'],
    forwards: ['Kolo Muani'],
    battles: 'Douglas Luiz-Thuram Kh., Alajbegovic-Conceição, J. David-Kolo Muani',
  },
  {
    team: 'roma',
    formation: '3-4-2-1',
    goalkeeper: 'Svilar',
    defenders: ['Mancini', "N'Dicka", 'Koulierakis'],
    midfielders: ['Molina', 'Cristante', 'Koné', 'Wesley'],
    attackingMid: ['Soulé', 'Dybala'],
    forwards: ['Malen'],
    battles: 'Rensch-Molina, Pellegrini-Soulé/Dybala, Castro-Malen',
  },
  {
    team: 'milan',
    formation: '3-4-2-1',
    goalkeeper: 'Maignan',
    defenders: ['Gila', 'Gabbia', 'Pavlovic'],
    midfielders: ['Saelemaekers', 'Modrić', 'Rabiot', 'Bartesaghi'],
    attackingMid: ['Pulisic', 'Leão'],
    forwards: ['Gonçalo Ramos'],
    battles: 'Ricci-Modrić, Nkunku-Pulisic/Leão',
  },
  {
    team: 'atalanta',
    formation: '4-3-3',
    goalkeeper: 'Carnesecchi',
    defenders: ['Zappacosta', 'Scalvini', 'Hien', 'Bernasconi'],
    midfielders: ['Samardžić', 'Gaetano', 'Ederson'],
    forwards: ['De Ketelaere', 'Scamacca', 'Zalewski'],
    battles: 'Zappacosta-Bellanova, Gaetano-De Roon, Scamacca-Krstović',
  },
  {
    team: 'como',
    formation: '4-2-3-1',
    goalkeeper: 'Butez',
    defenders: ['Couto', 'Chalobah', 'Ramón', 'Kaiki'],
    midfielders: ['Da Cunha', 'Perrone'],
    attackingMid: ['Diao', 'Nico Paz', 'Baturina'],
    forwards: ['Douvikas'],
    battles: 'Couto-Smolčić, Milla-Perrone',
  },
  {
    team: 'fiorentina',
    formation: '4-3-3',
    goalkeeper: 'De Gea',
    defenders: ['Dodô', 'Drăgușin', 'Viti', 'Valdepeñas'],
    midfielders: ['Ndour', 'Fagioli', 'Oulai'],
    forwards: ['Mastantuono', 'Kean', 'Atta'],
    battles: 'Kean-Piccoli, Valdepeñas-Jiménez-Parisi',
  },
  {
    team: 'bologna',
    formation: '4-3-3',
    goalkeeper: 'Skorupski',
    defenders: ['Zortea', 'Heggem', 'Lucumí', 'Miranda'],
    midfielders: ['Ferguson', 'Pobega', 'Odgaard'],
    forwards: ['Orsolini', 'Dovbyk', 'Rowe'],
    battles: 'Lucumí-Vitik, Pobega-Moro, Odgaard-Bernardeschi',
  },
  {
    team: 'lazio',
    formation: '4-3-3',
    goalkeeper: 'Mandas',
    defenders: ['Marušić', 'Doekhi', 'Romagnoli', 'Pedraza'],
    midfielders: ['Taylor', 'Rovella', 'Dele-Bashiru'],
    forwards: ['Isaksen', 'Ratkov', 'Zaccagni'],
    battles: 'Rovella-Cataldi, Ratkov-Dia (attenzione: alcune fonti citano ancora Castellanos, risultato ceduto al West Ham a gennaio 2026 — verificare)',
  },
  {
    team: 'torino',
    formation: '3-4-2-1',
    goalkeeper: 'Perri',
    defenders: ['Comuzzo', 'Ismajli', 'Coco'],
    midfielders: ['Dembélé', 'Casadei', 'Gineitis', 'Cacciamani'],
    attackingMid: ['Vlašić', 'Oristanio'],
    forwards: ['Simeone'],
    battles: 'Coco-Comuzzo, Simeone-Zapata',
  },
  {
    team: 'udinese',
    formation: '3-4-2-1',
    goalkeeper: 'Okoye',
    defenders: ['Kristensen', 'Kabasele', 'Solet'],
    midfielders: ['Vojvoda', 'Karlström', 'Miller', 'Kamara'],
    attackingMid: ['Zaniolo', 'Ekkelenkamp'],
    forwards: ['Keinan Davis'],
    battles: "Ekkelenkamp/Unai Gómez/Chakvetadze (trequarti)",
  },
  {
    team: 'sassuolo',
    formation: '4-2-3-1',
    goalkeeper: 'Muric',
    defenders: ['Walukiewicz', 'Idzes', 'Cande', 'Doig'],
    midfielders: ['Matić', 'Thorstvedt'],
    attackingMid: ['Berardi', 'Laurienté'],
    forwards: ['Pinamonti'],
    battles: 'Walukiewicz/Missori, Thorstvedt/Adžić, Bowie jolly su Berardi/Pinamonti/Laurienté',
  },
  {
    team: 'genoa',
    formation: '3-4-2-1',
    goalkeeper: 'Bijlow',
    defenders: ['Marcandalli', 'Ostigard', 'Vasquez'],
    midfielders: ['Norton-Cuffy', 'Frendrup', 'Sow', 'Martin'],
    attackingMid: ['Vitinha', 'Baldanzi'],
    forwards: ['Colombo'],
    battles: 'Vasquez-Puczka, Sow/Ellertsson/Amorim, Baldanzi/Traoré-Vitinha/Messias',
  },
  {
    team: 'parma',
    formation: '3-5-2',
    goalkeeper: 'Suzuki',
    defenders: ['Delprato', 'Circati', 'Valenti'],
    midfielders: ['Britschgi', 'Sørensen', 'Keita', 'Bernabè'],
    forwards: ['Pellegrino', 'Almqvist'],
    battles: 'Delprato-Troilo, Almqvist/Ondrejka/El Bilal Touré',
  },
  {
    team: 'cagliari',
    formation: '3-5-2',
    goalkeeper: 'Caprile',
    defenders: ['Zé Pedro', 'Mina', 'Rodríguez Ju.'],
    midfielders: ['Zappa', 'Adopo', 'Winks', 'Fazzini', 'Obert'],
    forwards: ['Maldini', 'Kevin Carlos'],
    battles: 'Adopo-Deiola, Kevin Carlos-Borrelli-Mendy-Esposito (alcune fonti: 4-2-3-1/4-3-2-1)',
  },
  {
    team: 'lecce',
    formation: '4-2-3-1',
    goalkeeper: 'Falcone',
    defenders: ['D. Veiga', 'Tiago Gabriel', 'Gaspar', 'Gallo'],
    midfielders: ['Ngom', 'Coulibaly'],
    attackingMid: ['Pierotti', 'Gandelman', "N'dri"],
    forwards: ['Geubbels'],
    battles: 'Gaspar/Siebert, Coulibaly/Berisha, Geubbels/Stulić',
  },
  {
    team: 'monza',
    formation: '3-4-2-1',
    goalkeeper: 'Thiam',
    defenders: ['Kouadio', 'Delli Carri', 'Carboni'],
    midfielders: ['Birindelli', 'Akinsanmiro', 'Pessina', 'Mangas'],
    attackingMid: ['Colpani', 'Mota'],
    forwards: ['Cutrone'],
    battles: 'Lucchesi/Delli Carri, Mota/Robinson/Ciurria, Cutrone/Petagna',
  },
  {
    team: 'frosinone',
    formation: '4-3-3',
    goalkeeper: 'Palmisani',
    defenders: ['Oyono', 'Monterisi', 'Calvani', 'Bracaglia'],
    midfielders: ['Schmid', 'Calò', 'Kvernadze'],
    forwards: ['Raimondo'],
    battles: 'Palmisani/Desplanches, Calvani/Akpoguma/Cittadini, Schmid/Ghedjemis',
  },
  {
    team: 'venezia',
    formation: '3-5-2',
    goalkeeper: 'Stankovic F.',
    defenders: ['Bella-Kotchap', 'Schingtienne', 'Moreno'],
    midfielders: ['Correia T.', 'Basic', 'Busio', 'Sohm', 'Haps'],
    forwards: ['Adams A.', 'Yeboah J.'],
    battles: 'Moreno/Šverko, Correia/Hainaut, Yeboah/Rrahmani',
  },
];

export function getLineup(teamId: string): Lineup | undefined {
  return lineups.find((l) => l.team === teamId);
}
