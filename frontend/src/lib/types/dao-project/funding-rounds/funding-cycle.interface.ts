export interface FundingCycle {
	details: FundingCycleDetails;
	projectTokensPurchased: string;
	paymentTokensSent: string;
	funders: {
		[address: string]: string;
	};
}

export interface FundingCycleDetails {
	cycleNum: string;
	fundingTarget?: string;
	issuanceRate: string;
	reserveRate: string;
	timeframe: {
		startTime: Date;
		endTime: Date;
	};
	payouts: Payout[];
	extra: unknown;
}

export interface Payout {
	address: string;
	percent: string;
}
