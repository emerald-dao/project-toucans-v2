import { transferProjectTokenExecution, transferTokenExecution } from '$flow/actions';
import { ECurrencies } from '$lib/types/common/enums';

export const transferTokens = async (
	recipient: string,
	amount: number,
	projectOwner: string,
	projectId: string,
	currencyToDistribute: ECurrencies | string
) => {
	if (
		currencyToDistribute == ECurrencies.FLOW ||
		currencyToDistribute == ECurrencies.USDC ||
		currencyToDistribute == ECurrencies.stFlow
	) {
		return await transferTokenExecution(amount.toString(), recipient, currencyToDistribute);
	}
	return await transferProjectTokenExecution(amount.toString(), recipient, projectId, projectOwner);
};
