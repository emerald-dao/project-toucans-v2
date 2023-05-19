import type { ECurrencies } from '$lib/types/common/enums';

export interface HolderClaimData {
	projectId: string;
	projectOwner: string;
	currency: ECurrencies;
	amount: number; // amount of tokens youre sending in
	claimAmount: number; // amount of $FLOW or $USDC youre getting
}
