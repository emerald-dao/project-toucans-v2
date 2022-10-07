import type { TokenTypes } from '$lib/types/token-types.enum';
import type { Currencies } from '$lib/types/currencies.enum';

export interface DaoData {
	daoDetails: {
		name: string;
		tokenName: string;
		description: string;
		website: string;
		logo: File | undefined;
	};
	tokenomics: {
		tokenType: TokenTypes;
		totalSupply: number | undefined;
		burnTokens: boolean;
		mintTokens: boolean;
		walletAddresses: string[] | [];
		intialRound: {
			targetAmount: number | undefined;
			token: Currencies;
			issuanceRate: number | undefined;
			reserveRate: number | undefined;
		};
	};
}
