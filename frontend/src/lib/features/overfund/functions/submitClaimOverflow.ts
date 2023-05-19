import { claimOverflowExecution } from '$flow/actions';
import type { HolderClaimData } from '../types/holder-claim-data.interface';

export const submitClaimOverflow = async (holderClaimData: HolderClaimData) => {
	const result = await claimOverflowExecution(
		holderClaimData.projectOwner,
		holderClaimData.projectId,
		holderClaimData.amount.toString(),
		holderClaimData.currency,
		holderClaimData.claimAmount.toString()
	)
	return result;
};
