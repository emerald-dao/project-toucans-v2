import type {
	CommunityDaoGeneratorData,
	FinancialDaoGeneratorData
} from '$lib/types/generator/dao-generator-data.interface';
import { writable, type Writable } from 'svelte/store';
import { TokenTypes } from '$lib/types/token-types.enum';
import { Currencies } from '$lib/types/currencies.enum';

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
		paymentCurrency: Currencies.FLOW,
		totalSupply: undefined,
		targetAmount: undefined,
		editDelay: '0.0',
		mintTokens: false,
		walletAddresses: [],
		initialRound: {
			currency: Currencies.FLOW,
			issuanceRate: undefined,
			reserveRate: undefined,
			startDate: '',
			endDate: '',
			infiniteDuration: false,
			infiniteFundingGoal: false
		}
	}
};

export const daoGeneratorData: Writable<CommunityDaoGeneratorData | FinancialDaoGeneratorData> =
	writable(emptyDaoGeneratorData) as Writable<
		CommunityDaoGeneratorData | FinancialDaoGeneratorData
	>;
