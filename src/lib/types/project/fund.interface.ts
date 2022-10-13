import type { Currencies } from '$lib/types/currencies.enum';

export interface FundData {
	daoName: string;
	daoAddress: number | undefined;
	currency: Currencies;
	amount: number | undefined;
	message: string;
}
