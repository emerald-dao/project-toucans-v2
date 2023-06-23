import type { DaoOnlyGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface';
import { writable, type Writable } from 'svelte/store';
import { ECurrencies } from '$lib/types/common/enums';

export const emptyDaoGeneratorData: DaoOnlyGeneratorData = {
	daoDetails: {
		daoType: 'daoOnly',
		name: '',
		description: '',
		contractName: '',
		longDescription: undefined,
		website: '',
		twitter: '',
		discord: '',
		logo: undefined,
		bannerImage: undefined
	},
	tokenomics: {
		paymentCurrency: ECurrencies.FLOW
	}
};

export const daoGeneratorData: Writable<DaoOnlyGeneratorData> = writable(emptyDaoGeneratorData);
