export interface DaoRankingData {
	project_id: string;
	name: string;
	price: number | null;
	week: number;
	circulating_supply: number;
	payment_currency: string;
	num_holders: number;
	num_proposals: number;
	treasury_value: number;
	// chart data
	numbers: number[]
	title: string;
	labels: string[];

	// Extra data needed!
	token_symbol: string;
	logo: string;
	//maxSupply: number;
}