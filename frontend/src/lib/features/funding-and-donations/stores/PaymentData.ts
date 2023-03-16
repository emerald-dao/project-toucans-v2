import { writable } from 'svelte/store';
import { ECurrencies } from '$lib/types/common/enums';
import type { PaymentData } from '../types/payment-data.interface';

export const paymentData = writable<PaymentData>({
	type: undefined,
	daoName: '',
	daoAddress: '',
	projectId: '',
	tokenName: '',
	payerAddress: '',
	contractName: '',
	currency: ECurrencies.FLOW,
	amount: undefined,
	specialMessage: ''
});
