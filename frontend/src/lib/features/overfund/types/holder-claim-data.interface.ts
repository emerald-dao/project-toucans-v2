import type { ECurrencies } from '$lib/types/common/enums';

export interface HolderClaimData {
	projectId: string;
	projectOwner: string;
	currency: ECurrencies;
	amount: number;
}
