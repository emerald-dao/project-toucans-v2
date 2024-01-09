import { writable } from 'svelte/store';
import { ECurrencies } from '$lib/types/common/enums';
import type { DonationData, FundData } from '../types/payment-data.interface';

export const paymentData = writable<FundData | DonationData>({
	type: undefined,
	daoName: '',
	daoAddress: '',
	projectId: '',
	tokenName: '',
	payerAddress: '',
	contractName: '',
	currency: ECurrencies.FLOW,
	amount: 0,
	specialMessage: '',
	daoTokenSymbol: ''
});
