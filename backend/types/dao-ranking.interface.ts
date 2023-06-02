export interface DaoRankingData {
  number: number;
  price: number | null;
  hour: number;
  day: number;
  week: number;
  circulating_supply: number;
  payment_currency: string;
  // chart data
  numbers: number[];

  // Extra data needed!
  //maxSupply: number | null;
}