export interface DaoRankingData {
  project_id: string;
  price: number | null;
  week_funding: number;
  total_funding: number;
  circulating_supply: number;
  payment_currency: string;
  num_holders: number;
  num_proposals: number;
  treasury_value: number;
  max_supply: number | null;
  // chart data
  numbers: number[];
}