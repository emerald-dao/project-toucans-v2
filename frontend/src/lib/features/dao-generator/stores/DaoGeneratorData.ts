import type { DaoGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface';
import { writable, type Writable } from 'svelte/store';
import { ECurrencies } from '$lib/types/common/enums';

export const emptyDaoGeneratorData: DaoGeneratorData = {
	daoDetails: {
		name: '',
		tokenName: '',
		description: '',
		website: '',
		twitter: '',
		discord: 'https://discord.gg/',
		contractName: '',
		logo: undefined
	},
	tokenomics: {
		paymentCurrency: ECurrencies.FLOW,
		totalSupply: undefined,
		editDelay: '0.0',
		mintTokens: false,
		walletAddresses: []
	},
	multisig: {
		owner: '',
		addresses: [],
		threshold: 1
	}
};

export const daoGeneratorData: Writable<DaoGeneratorData> = writable(emptyDaoGeneratorData);
