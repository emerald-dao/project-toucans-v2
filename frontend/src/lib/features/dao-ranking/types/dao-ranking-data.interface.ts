export interface DaoRankingData {
	number: number;
	name: string;
	price: number;
	hour: number;
	day: number;
	week: number;
	circulatingSupply: number;
	chart: ChartData;

	// Extra data needed!
	tokenSymbol: string;
	logo: string;
	maxSupply: number;
}

interface ChartData {
	title: string;
	numbers: number[];
	labels: string[];
}
