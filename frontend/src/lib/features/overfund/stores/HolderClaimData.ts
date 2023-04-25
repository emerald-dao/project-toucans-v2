import { writable } from 'svelte/store';
import { ECurrencies } from '$lib/types/common/enums';
import type { HolderClaimData } from '../types/holder-claim-data.interface';

export const holderClaimData = writable<HolderClaimData>({
	projectId: '',
	projectOwner: '',
	currency: ECurrencies.FLOW,
	amount: 0
});
