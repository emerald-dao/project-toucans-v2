export interface LeadingDao {
	logoUrl: string;
	name: string;
	totalInvested: number;
	currency: 'FUSD' | 'FLOW';
	numberOfPayments: number;
	variationPercentage: number;
}
