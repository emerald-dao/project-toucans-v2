import { writable, type Writable } from 'svelte/store';
import type { RoundData } from '$lib/types/new-round.interface';
import { Currencies } from '$lib/types/currencies.enum';

export const roundData: Writable<RoundData> = writable({
    infiniteDuration: false,
    infiniteFundingGoal: false,
    startDate: '',
    endDate: '',
    projectId: '',
    fundingGoal: undefined,
    currency: Currencies.FLOW,
    distributionList: [],
    issuanceRate: undefined,
    reserveRate: undefined
});