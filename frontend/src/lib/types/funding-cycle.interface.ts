export interface Timeframe {
	startTime: string;
	endTime: string;
}

export interface Payout {
	address: string;
	percent: string;
}

export interface Extra {
	[extra: string]: string;
}

export interface Details {
	cycleNum: string;
	fundingTarget: string;
	issuanceRate: string;
	reserveRate: string;
	timeframe: Timeframe;
	payouts: Payout[];
	extra: Extra;
}

export interface Funders { }

export interface FundingCycle {
	details: Details;
	projectTokensPurchased: string;
	funders: Funders;
	paymentTokensSent: string;
	purchaseHistory: any[];
}
