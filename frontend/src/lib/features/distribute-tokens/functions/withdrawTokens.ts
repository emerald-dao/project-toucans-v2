import { proposeBatchWithdrawExecution, proposeWithdrawExecution } from '$flow/actions';
import type { ECurrencies } from '$lib/types/common/enums';
import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';

export const withdrawTokens = async (
	daoData: DAOProject,
	distStaging: Distribution[],
	currency: ECurrencies | string
) => {
	if (distStaging.length == 1) {
		return await proposeWithdrawExecution(
			currency,
			distStaging[0].address,
			distStaging[0].amount.toString(),
			daoData.generalInfo.owner,
			daoData.generalInfo.project_id
		);
	}

	return await proposeBatchWithdrawExecution(
		currency,
		distStaging,
		daoData.generalInfo.owner,
		daoData.generalInfo.project_id
	);
};
