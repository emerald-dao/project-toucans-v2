import type { TokenTypes } from '$lib/types/token-types.enum';
import type { Currencies } from '$lib/types/currencies.enum';

export interface DaoData {
	daoDetails: {
		name: string;
		tokenName: string;
		description: string;
		website: string;
		owner: string;
		contractName: string;
		logo: File[] | undefined;
	};
	tokenomics: {
		tokenType: TokenTypes;
		totalSupply: number | undefined;
		targetAmount: number | undefined;
		mintTokens: boolean;
		walletAddresses: string[] | [];
		initialRound: {
			token: Currencies;
			issuanceRate: number | undefined;
			reserveRate: number | undefined;
		};
	};
}
