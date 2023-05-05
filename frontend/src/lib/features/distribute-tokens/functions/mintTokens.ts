import { batchMintTokensExecution, mintTokensExecution } from '$flow/actions';
import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';

export const mintTokens = async (daoData: DAOProject, distStaging: Distribution[]) => {

	if (distStaging.length == 1) {
		return await mintTokensExecution(daoData.generalInfo.owner, daoData.generalInfo.project_id, distStaging[0].address, distStaging[0].amount.toString())
	}

	return await batchMintTokensExecution(daoData.generalInfo.owner, daoData.generalInfo.project_id, distStaging)
};
