import type {
	CommunityDaoGeneratorData,
	FinancialDaoGeneratorData
} from '$lib/types/generator/dao-generator-data.interface';
import { writable, type Writable } from 'svelte/store';
import { TokenTypes } from '$lib/types/token-types.enum';
import { Currencies } from '$lib/types/currencies.enum';

export const daoData: Writable<CommunityDaoGeneratorData | FinancialDaoGeneratorData> = writable({
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
		totalSupply: undefined,
		targetAmount: undefined,
		editDelay: '259200.00',
		mintTokens: false,
		walletAddresses: [],
		initialRound: {
			token: Currencies.FLOW,
			issuanceRate: undefined,
			reserveRate: undefined
		}
	}
});
