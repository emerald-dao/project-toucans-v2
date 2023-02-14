import type {
	CommunityDaoGeneratorData,
	FinancialDaoGeneratorData
} from '$lib/types/generator/dao-generator-data.interface';
import { writable, type Writable } from 'svelte/store';
import { TokenTypes } from '$lib/types/token-types.enum';
import { Currencies } from '$lib/types/currencies.enum';
import { currencies } from '$stores/flow/TokenStore';

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
		paymentCurrency: currencies[Currencies.FLOW],
		totalSupply: undefined,
		targetAmount: undefined,
		editDelay: '0.0',
		mintTokens: false,
		walletAddresses: [],
		initialRound: {
			token: Currencies.FLOW,
			issuanceRate: undefined,
			reserveRate: undefined
		}
	}
});
