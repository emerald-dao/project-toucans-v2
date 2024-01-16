import type { DaoAndTokenGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface';
import { writable, type Writable } from 'svelte/store';
import { ECurrencies } from '$lib/types/common/enums';

export const emptyDaoAndTokenGeneratorData: DaoAndTokenGeneratorData = {
	daoDetails: {
		daoType: 'daoAndToken',
		name: '',
		tokenName: '',
		description: '',
		longDescription: undefined,
		website: '',
		twitter: '',
		discord: '',
		contractName: '',
		logo: undefined,
		bannerImage: undefined,
		allowedNFTCollections: []
	},
	tokenomics: {
		paymentCurrency: ECurrencies.FLOW,
		initialSupply: 0,
		hasMaxSupply: false,
		maxSupply: undefined,
		editDelay: '0.00',
		mintTokens: true,
		walletAddresses: []
	}
};

export const daoAndTokenGeneratorData: Writable<DaoAndTokenGeneratorData> = writable(
	emptyDaoAndTokenGeneratorData
);
