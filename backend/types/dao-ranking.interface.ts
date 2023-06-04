export interface DaoRankingData {
  project_id: string;
  price: number | null;
  week: number;
  circulating_supply: number;
  payment_currency: string;
  num_holders: number;
  num_proposals: number;
  treasury_value: number;
  // chart data
  numbers: number[];

  // Extra data needed!
  //maxSupply: number | null;
}