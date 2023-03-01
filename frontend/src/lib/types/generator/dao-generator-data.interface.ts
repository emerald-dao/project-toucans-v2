import type { TokenTypes } from '$lib/types/token-types.enum';
import type { RoundData } from '../new-round.interface';

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
		totalSupply: number | undefined;
		editDelay: string | undefined;
		mintTokens: boolean;
		initialRound: RoundData;
	};
}

export interface CommunityDaoGeneratorData extends DaoGeneratorData {
	tokenomics: {
		tokenType: TokenTypes.COMMUNITY;
		totalSupply: number | undefined;
		editDelay: string | undefined;
	};
}
