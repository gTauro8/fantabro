export interface DepartmentBench {
  /** Sostituti in ordine di priorità: [0] = 1° cambio, [1] = 2° cambio. */
  goalkeepers?: string[];
  defenders?: string[];
  midfielders?: string[];
  forwards?: string[];
}

export interface Lineup {
  team: string; // corrisponde a Team.id
  formation: string;
  goalkeeper: string;
  defenders: string[];
  midfielders: string[];
  attackingMid?: string[];
  forwards: string[];
  battles: string;
  /** Panchina per reparto: 1°/2° cambio più rilevanti, se verificati. */
  bench?: DepartmentBench;
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
    bench: {
      goalkeepers: ['Provedel', 'Di Gennaro'],
      defenders: ['Bisseck', 'Carlos Augusto'],
      midfielders: ['Frattesi', 'Mkhitaryan'],
      forwards: ['Bonny', 'Pio Esposito'],
    },
  },
  {
    team: 'napoli',
    formation: '4-3-3',
    goalkeeper: 'Meret',
    defenders: ['Di Lorenzo', 'Rrahmani', 'Beukema', 'Spinazzola'],
    midfielders: ['Lobotka', 'McTominay', 'Anguissa'],
    forwards: ['Politano', 'Højlund', 'Neres'],
    battles: 'Anguissa-De Bruyne (mezzala), Politano/Neres/Vergara (esterni)',
    bench: {
      goalkeepers: ['Milinković-Savić', 'Contini'],
      defenders: ['Marianucci', 'Olivera'],
      midfielders: ['Gilmour', 'De Bruyne'],
      forwards: ['Lucca', 'Lang'],
    },
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
    bench: {
      goalkeepers: ['Perin', 'Pinsoglio'],
      defenders: ['Gatti', 'Çelik'],
      midfielders: ['Koopmeiners', 'Miretti'],
      forwards: ['David', 'Nico González'],
    },
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
    bench: {
      goalkeepers: ['Gollini', 'Vasquez'],
      defenders: ['Hermoso', 'Ziolkowski'],
      midfielders: ['El Aynaoui', 'Lorenzo Pellegrini'],
      forwards: ['Cherubini', 'R. Vaz'],
    },
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
    bench: {
      goalkeepers: ['Terracciano', 'Torriani'],
      defenders: ['Tomori', 'De Winter'],
      midfielders: ['Jashari', 'Ricci'],
      forwards: ['Nkunku', 'Chukwueze'],
    },
  },
  {
    team: 'atalanta',
    formation: '4-3-3',
    goalkeeper: 'Carnesecchi',
    defenders: ['Zappacosta', 'Scalvini', 'Hien', 'Bernasconi'],
    midfielders: ['Samardžić', 'Gaetano', 'Ederson'],
    forwards: ['De Ketelaere', 'Scamacca', 'Zalewski'],
    battles: 'Zappacosta-Bellanova, Gaetano-De Roon, Scamacca-Krstović',
    bench: {
      goalkeepers: ['Sportiello', 'Rossi'],
      defenders: ['Djimsiti', 'Kossounou'],
      midfielders: ['De Roon', 'Pašalić'],
      forwards: ['Krstović', 'Raspadori'],
    },
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
    bench: {
      goalkeepers: ['Reina', 'Vigorito'],
      defenders: ['Van der Brempt', 'Kempf'],
      midfielders: ['Addai', 'Fadera'],
      forwards: ['Morata', 'Azón'],
    },
  },
  {
    team: 'fiorentina',
    formation: '4-3-3',
    goalkeeper: 'De Gea',
    defenders: ['Dodô', 'Drăgușin', 'Viti', 'Valdepeñas'],
    midfielders: ['Ndour', 'Fagioli', 'Oulai'],
    forwards: ['Mastantuono', 'Kean', 'Atta'],
    battles: 'Kean-Piccoli, Valdepeñas-Jiménez-Parisi',
    bench: {
      goalkeepers: ['Christensen', 'Lezzerini'],
      defenders: ['Pongračić', 'Valentini'],
      midfielders: ['Mandragora', 'Sohm'],
      forwards: ['Gudmundsson', 'Piccoli'],
    },
  },
  {
    team: 'bologna',
    formation: '4-3-3',
    goalkeeper: 'Skorupski',
    defenders: ['Zortea', 'Heggem', 'Lucumí', 'Miranda'],
    midfielders: ['Ferguson', 'Pobega', 'Odgaard'],
    forwards: ['Orsolini', 'Dovbyk', 'Rowe'],
    battles: 'Lucumí-Vitik, Pobega-Moro, Odgaard-Bernardeschi',
    bench: {
      goalkeepers: ['Massimo Pessina', 'Caccavo'],
      defenders: ['Vitik', 'Casale'],
      midfielders: ['Moro', 'Dominguez'],
      forwards: ['Cambiaghi', 'Dallinga'],
    },
  },
  {
    team: 'lazio',
    formation: '4-3-3',
    goalkeeper: 'Mandas',
    defenders: ['Marušić', 'Doekhi', 'Romagnoli', 'Pedraza'],
    midfielders: ['Taylor', 'Rovella', 'Dele-Bashiru'],
    forwards: ['Isaksen', 'Ratkov', 'Zaccagni'],
    battles: 'Rovella-Cataldi, Ratkov-Dia (attenzione: alcune fonti citano ancora Castellanos, risultato ceduto al West Ham a gennaio 2026 — verificare)',
    bench: {
      goalkeepers: ['Motta'],
      defenders: ['Luca Pellegrini', 'Lazzari'],
      midfielders: ['Belahyane', 'Cataldi'],
      forwards: ['Cancellieri'],
    },
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
    bench: {
      goalkeepers: ['Paleari', 'Israel'],
      defenders: ['Masina', 'Cömert'],
      midfielders: ['Ilić', 'Anjorin'],
      forwards: ['Adams', 'Njie'],
    },
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
    bench: {
      goalkeepers: ['Padelli'],
      defenders: ['Bertola', 'Goglichidze'],
      midfielders: ['Piotrowski', 'Gómez'],
      forwards: ['Buksa', 'Bayo'],
    },
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
    bench: {
      goalkeepers: ['Turati'],
      defenders: ['Missori', 'Pieragnolo'],
      midfielders: ['Boloca', 'Ghion'],
      forwards: ['Beraldi'],
    },
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
    bench: {
      goalkeepers: ['Sommariva'],
      midfielders: ['Masini', 'Onana'],
      forwards: ['Messias', 'Ekuban'],
    },
  },
  {
    team: 'parma',
    formation: '3-5-2',
    goalkeeper: 'Suzuki',
    defenders: ['Delprato', 'Circati', 'Valenti'],
    midfielders: ['Britschgi', 'Sørensen', 'Keita', 'Bernabè'],
    forwards: ['Pellegrino', 'Almqvist'],
    battles: 'Delprato-Troilo, Almqvist/Ondrejka/El Bilal Touré',
    bench: {
      goalkeepers: ['Corvi', 'Daffara'],
      defenders: ['Carboni', "Ndiaye"],
      midfielders: ['Nicolussi Caviglia', 'Cremaschi'],
      forwards: ['Ondrejka', 'Benedyczak'],
    },
  },
  {
    team: 'cagliari',
    formation: '3-5-2',
    goalkeeper: 'Caprile',
    defenders: ['Zé Pedro', 'Mina', 'Rodríguez Ju.'],
    midfielders: ['Zappa', 'Adopo', 'Winks', 'Fazzini', 'Obert'],
    forwards: ['Maldini', 'Kevin Carlos'],
    battles: 'Adopo-Deiola, Kevin Carlos-Borrelli-Mendy-Esposito (alcune fonti: 4-2-3-1/4-3-2-1)',
    bench: {
      goalkeepers: ['Sherri', 'Radunović'],
      defenders: ['Idrissi', 'Pintus'],
      midfielders: ['Deiola', 'Prati'],
      forwards: ['Sebastiano Esposito', 'Borrelli'],
    },
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
    bench: {
      goalkeepers: ['Samooja', 'Früchtl'],
      defenders: ['Jean', 'Ndaba'],
      midfielders: ['Berisha', 'Maleh'],
      forwards: ['Stulić', 'Banda'],
    },
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
    bench: {
      goalkeepers: ['Pizzignacco'],
      defenders: ['Lucchesi', 'Antov'],
      forwards: ['Ciurria', 'Varela'],
    },
  },
  {
    team: 'frosinone',
    formation: '4-3-3',
    goalkeeper: 'Palmisani',
    defenders: ['Oyono', 'Monterisi', 'Calvani', 'Bracaglia'],
    midfielders: ['Schmid', 'Calò', 'Kvernadze'],
    forwards: ['Raimondo'],
    battles: 'Palmisani/Desplanches, Calvani/Akpoguma/Cittadini, Schmid/Ghedjemis',
    bench: {
      goalkeepers: ['Lolić'],
      defenders: ['Corrado', 'Gelli'],
      midfielders: ['Koutsoupias', 'Cichella'],
      forwards: ['Ghedjemis', 'Barcella'],
    },
  },
  {
    team: 'venezia',
    formation: '3-5-2',
    goalkeeper: 'Stankovic F.',
    defenders: ['Bella-Kotchap', 'Schingtienne', 'Moreno'],
    midfielders: ['Correia T.', 'Basic', 'Busio', 'Sohm', 'Haps'],
    forwards: ['Adams A.', 'Yeboah J.'],
    battles: 'Moreno/Šverko, Correia/Hainaut, Yeboah/Rrahmani',
    bench: {
      goalkeepers: ['Grandi', 'Plizzari'],
      defenders: ['Svoboda', 'Šverko'],
      midfielders: ['Helgason', 'Duncan'],
      forwards: ['Oristanio', 'Rrahmani'],
    },
  },
];

export function getLineup(teamId: string): Lineup | undefined {
  return lineups.find((l) => l.team === teamId);
}
