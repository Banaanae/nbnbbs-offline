export interface LogicGemOffer {
  id: number;
  amount: number;
  csvID: number[];
  skinID: number;
}

export interface ChronosFileEntry {
  scName: string;
  scFile: string;
}

export interface ChampionShipInfo {
  maxWins: number;
  chronosTextEntry: string;
  logicGemOffer: LogicGemOffer;
  chronosFileEntry: ChronosFileEntry;
}

export interface Event {
  slot: number;
  tokens: number;
  mapID: number;
  claimedTokens: number[];
  championShipInfo?: ChampionShipInfo;
}
