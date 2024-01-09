import type { ECurrencies } from '$lib/types/common/enums';

export type DaoGeneratorData = DaoAndTokenGeneratorData | DaoOnlyGeneratorData;

export interface DaoAndTokenGeneratorData {
	daoDetails: {
		daoType: 'daoAndToken';
		name: string;
		tokenName: string;
		description: string;
		longDescription?: string;
		website: string;
		twitter: string;
		discord: string;
		contractName: string;
		logo: File[] | undefined;
		bannerImage: File[] | undefined;
		allowedNFTCollections: string[];
	};
	tokenomics: {
		paymentCurrency: ECurrencies;
		initialSupply: number;
		hasMaxSupply: boolean;
		maxSupply?: number;
		mintTokens: boolean;
		editDelay: string;
		walletAddresses: string[];
	};
}

export interface DaoOnlyGeneratorData {
	daoDetails: {
		daoType: 'daoOnly';
		name: string;
		description: string;
		longDescription?: string;
		website: string;
		twitter: string;
		discord: string;
		logo: File[] | undefined;
		bannerImage: File[] | undefined;
		allowedNFTCollections: string[];
	};
	tokenomics: {
		paymentCurrency: ECurrencies;
	};
}
