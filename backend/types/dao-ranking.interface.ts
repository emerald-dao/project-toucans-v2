export interface DaoRankingData {
  project_id: string;
  price: number | null;
  liquidity_amount: number | null;
  week_funding: number;
  total_supply: number;
  payment_currency: string;
  num_holders: number;
  num_proposals: number;
  num_participants: number;
  nft_count: number;
  treasury_value: number;
  max_supply: number | null;
  volume_24h: number | null;
  tvl: number | null;
}
