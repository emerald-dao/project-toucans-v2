import type { FundData } from '$lib/types/project/fund.interface';
import { writable, type Writable } from 'svelte/store';
import { Currencies } from '$lib/types/currencies.enum';

export const fundData: Writable<FundData> = writable({
	daoName: '',
	daoAddress: '',
	tokenName: 'EMLD',
	funderAddress: '',
	contractName: '',
	currency: Currencies.FLOW,
	amount: null,
	specialMessage: '',
	issuanceRate: null,
	funded: false
});
