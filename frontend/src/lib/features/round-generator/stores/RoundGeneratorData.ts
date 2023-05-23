import { writable, type Writable } from 'svelte/store';
import type { RoundData } from '$lib/types/dao-project/funding-rounds/new-round.interface';
import { ECurrencies } from '$lib/types/common/enums';

export const roundGeneratorData: Writable<RoundData> = writable({
	infiniteDuration: false,
	infiniteFundingGoal: false,
	startDate: '',
	endDate: '',
	projectId: '',
	fundingGoal: undefined,
	currency: ECurrencies.FLOW,
	distributionList: [],
	issuanceRate: undefined,
	reserveRate: 0,
	allowOverflow: true,
	requiredNft: null
});
