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
	};
	tokenomics: {
		paymentCurrency: ECurrencies;
		totalSupply: number | undefined;
		editDelay: string | undefined;
		mintTokens: boolean;
		walletAddresses: string[];
	};
	multisig: {
		owner: string;
		addresses: string[];
		threshold: number;
	};
}
