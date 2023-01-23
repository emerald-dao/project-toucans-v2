import type { DaoData } from '$lib/types/generator/dao.interface.interface';
import { writable, type Writable } from 'svelte/store';
import { TokenTypes } from '$lib/types/token-types.enum';
import { Currencies } from '$lib/types/currencies.enum';

export const daoData: Writable<DaoData> = writable({
	daoDetails: {
		name: '',
		tokenName: '',
		description: '',
		website: '',
		twitter: '',
		discord: '',
		contractName: '',
		logo: undefined
	},
	tokenomics: {
		tokenType: TokenTypes.FINANCIAL,
		totalSupply: undefined,
		targetAmount: undefined,
		mintTokens: false,
		walletAddresses: [],
		initialRound: {
			token: Currencies.FLOW,
			issuanceRate: undefined,
			reserveRate: undefined
		}
	}
});
