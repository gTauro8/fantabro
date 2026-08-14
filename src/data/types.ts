export type Role = 'POR' | 'DIF' | 'CEN' | 'ATT';

export const ROLE_LABEL: Record<Role, string> = {
  POR: 'Portieri',
  DIF: 'Difensori',
  CEN: 'Centrocampisti',
  ATT: 'Attaccanti',
};

export type RiskLevel = 'Basso' | 'Medio' | 'Alto';

export type PlayerCategory =
  | 'Top'
  | 'Value Pick'
  | 'Scommessa'
  | 'Low-cost'
  | 'Rischioso'
  | 'Trappola';

export interface SetPieceInfo {
  penalties?: string;
  freeKicksCorners?: string;
}

export interface TeamFdr {
  fixtures: string;
  avgFdr: number;
  buyTargets: string;
  sellTargets: string;
}

export interface Team {
  id: string;
  name: string;
  coach: string;
  formation: string;
  offense: number;
  defense: number;
  bonusPotential: number;
  tacticalReliability: number;
  overall: number;
  identity: string;
  offensiveProduction: string;
  defensiveSolidity: string;
  setPieces: SetPieceInfo;
  fantasyImpact: string;
  fdr?: TeamFdr;
  /** Notizie fresche (mercato, infortuni, formazione) raccolte da fonti pubbliche. */
  news?: string[];
}

export interface PlayerProjection {
  expectedMinutes: string;
  setPieces: string;
  xG90: number;
  xA90: number;
  goalsRange: [number, number];
  assistsRange: [number, number];
  floorFP: number;
  ceilingFP: number;
}

export interface MarketData {
  price: number;
  fvm: number;
  listoneTeam: string;
  listoneName: string;
}

export interface AuctionPick {
  playerId: string;
  price: number;
}

export interface AuctionTeam {
  id: string;
  name: string;
  picks: AuctionPick[];
}

export interface Auction {
  id: string;
  name: string;
  budgetPerTeam: number;
  teams: AuctionTeam[];
  createdAt: number;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  role: Role;
  category: PlayerCategory;
  note: string;
  risk?: RiskLevel;
  projection?: PlayerProjection;
  /** Dato ufficiale dal listone Fantacalcio.it 2026/27, quando trovato con certezza. */
  market?: MarketData;
  /** false quando il nome non è stato trovato nel listone ufficiale 2026/27. */
  verified?: boolean;
  /** true quando la squadra è stata aggiornata rispetto al dato originale del documento. */
  teamCorrected?: boolean;
  /** true per trasferimenti reali confermati da fonti giornalistiche ma non ancora nel listone ufficiale scaricato. */
  pendingSync?: boolean;
}

export interface Breakout {
  id: string;
  team: string; // corrisponde a Team.name
  name: string;
  role: Role;
  reason: string;
  market?: MarketData;
}
