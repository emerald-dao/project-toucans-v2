import type { ECurrencies } from '$lib/types/common/enums';

export interface DaoGeneratorData {
	daoDetails: {
		name: string;
		tokenName: string;
		description: string;
		website: string;
		twitter: string;
		discord: string;
		contractName: string;
		logo: File[] | undefined;
		logoIpfsUrl: string;
		bannerImage: File[] | undefined;
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
