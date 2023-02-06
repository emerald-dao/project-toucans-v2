import type { FundData } from '$lib/types/project/fund.interface';
import { writable } from 'svelte/store';
import { Currencies } from '$lib/types/currencies.enum';

export const fundData = writable<FundData>({
	daoName: '',
	daoAddress: '',
	tokenName: 'EMLD',
	funderAddress: '',
	contractName: '',
	currency: Currencies.FLOW,
	amount: undefined,
	specialMessage: '',
	issuanceRate: undefined,
	funded: false
});
