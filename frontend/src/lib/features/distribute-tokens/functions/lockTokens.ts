import { lockTokensExecution } from '$flow/actions';
import type { ECurrencies } from '$lib/types/common/enums';
import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

export const lockTokens = async (
	daoData: DAOProject,
	recipient: string,
	currency: ECurrencies | string,
	unlockTime: number,
	amount: number
) => {
	return await lockTokensExecution(
		currency,
		daoData.generalInfo.project_id,
		daoData.generalInfo.owner,
		amount.toString(),
		recipient,
		unlockTime.toString()
	);
};
