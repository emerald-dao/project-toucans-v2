import type { ECurrencies } from '$lib/types/common/enums';

export interface DonationData extends PaymentData {
	type: 'donation';
	issuanceRate: undefined;
	reserveRate: undefined;
}

export interface FundData extends PaymentData {
	type: 'fund';
	issuanceRate: number;
	reserveRate: number;
}

export interface PaymentData {
	type: 'fund' | 'donation' | undefined;
	daoName: string;
	daoAddress: string;
	projectId: string;
	tokenName: string;
	payerAddress: string;
	contractName: string;
	currency: ECurrencies;
	amount: number | undefined;
	specialMessage: string;
}
