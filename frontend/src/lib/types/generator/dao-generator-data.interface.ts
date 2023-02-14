import type { TokenTypes } from '$lib/types/token-types.enum';
import type { Currencies, Currency } from '$lib/types/currencies.enum';

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
		tokenType: TokenTypes;
		totalSupply: number | undefined;
		editDelay: string | undefined;
	};
}

export interface FinancialDaoGeneratorData extends DaoGeneratorData {
	tokenomics: {
		tokenType: TokenTypes.FINANCIAL;
		paymentCurrency: Currency,
		totalSupply: number | undefined;
		editDelay: string | undefined;
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

export interface CommunityDaoGeneratorData extends DaoGeneratorData {
	tokenomics: {
		tokenType: TokenTypes.COMMUNITY;
		totalSupply: number | undefined;
		editDelay: string | undefined;
	};
}
