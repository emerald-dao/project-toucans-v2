export interface DaoRankingData {
	number: number;
	name: string;
	price: number | null;
	hour: number;
	day: number;
	week: number;
	circulating_supply: number;
	payment_currency: string;
	// chart data
	numbers: number[]
	title: string;
	labels: string[];

	// Extra data needed!
	token_symbol: string;
	logo: string;
	//maxSupply: number;
}