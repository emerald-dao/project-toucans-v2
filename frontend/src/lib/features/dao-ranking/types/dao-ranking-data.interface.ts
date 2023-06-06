export interface DaoRankingData {
	project_id: string;
	name: string;
	price: number | null;
	week_funding: number;
	total_funding: number;
	circulating_supply: number;
	payment_currency: string;
	num_holders: number;
	num_proposals: number;
	num_participants: number;
	treasury_value: number;
	token_symbol: string;
	logo: string;
	max_supply: number | null;
	volume_24h: number | null;
	tvl: number | null;
	// chart data
	numbers: number[]
	title: string;
	labels: string[];
}