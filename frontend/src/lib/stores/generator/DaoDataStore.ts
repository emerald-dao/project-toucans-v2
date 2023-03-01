import type {
	CommunityDaoGeneratorData,
	FinancialDaoGeneratorData
} from '$lib/types/dao-generator/dao-generator-data.interface';
import { writable, type Writable } from 'svelte/store';
import { TokenTypes } from '$lib/types/common/token-types.enum';
import { ECurrencies } from '$lib/types/common/enums';

export const emptyDaoGeneratorData = {
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
		tokenType: TokenTypes.FINANCIAL,
		paymentCurrency: ECurrencies.FLOW,
		totalSupply: undefined,
		editDelay: '0.0',
		mintTokens: false,
		walletAddresses: [],
		initialRound: {
			currency: ECurrencies.FLOW,
			issuanceRate: undefined,
			reserveRate: undefined,
			startDate: '',
			endDate: '',
			infiniteDuration: false,
			infiniteFundingGoal: false,
			fundingGoal: undefined
		}
	}
};

export const daoGeneratorData: Writable<CommunityDaoGeneratorData | FinancialDaoGeneratorData> =
	writable(emptyDaoGeneratorData) as Writable<
		CommunityDaoGeneratorData | FinancialDaoGeneratorData
	>;
