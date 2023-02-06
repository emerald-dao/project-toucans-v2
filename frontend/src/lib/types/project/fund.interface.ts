import type { Currencies } from '$lib/types/currencies.enum';

export interface FundData {
	daoName: string;
	daoAddress: string;
	contractName: string;
	tokenName: string;
	funderAddress: string;
	currency: Currencies.FLOW | Currencies.FUSD;
	amount: number | undefined;
	specialMessage: string;
	issuanceRate: number | undefined;
	funded: boolean;
}
