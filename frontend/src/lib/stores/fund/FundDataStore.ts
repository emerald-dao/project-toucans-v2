import type { FundData } from '$lib/types/project/fund.interface';
import { writable } from 'svelte/store';
import { ECurrencies } from '$lib/types/common/enums';

export const fundData = writable<FundData>({
	daoName: '',
	daoAddress: '',
	projectId: '',
	tokenName: 'EMLD',
	funderAddress: '',
	contractName: '',
	currency: ECurrencies.FLOW,
	amount: undefined,
	specialMessage: '',
	issuanceRate: undefined,
	funded: false
});
