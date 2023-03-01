export interface FundingCycle {
	details: FundingCycleDetails;
	projectTokensPurchased: number;
	paymentTokensSent: number;
	funders: {
		[address: string]: number;
	};
}

export interface FundingCycleDetails {
	cycleNum: number;
	fundingTarget?: number;
	issuanceRate: number;
	reserveRate: number;
	timeframe: {
		startTime: Date;
		endTime: Date;
	};
	payouts: Payout[];
	extra: unknown;
}

export interface Payout {
	address: string;
	percent: number;
}
