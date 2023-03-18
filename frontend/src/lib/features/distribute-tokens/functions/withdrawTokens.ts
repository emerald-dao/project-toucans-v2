import { proposePaymentWithdrawExecution } from '$flow/actions';
import type { ECurrencies } from '$lib/types/common/enums';
import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';

export const withdrawTokens = async (daoData: DAOProject, distStaging: Distribution[], currency: ECurrencies) => {
	console.log(daoData, distStaging, currency);

	await proposePaymentWithdrawExecution(daoData.generalInfo.owner, daoData.generalInfo.project_id, distStaging[0].account, distStaging[0].tokens, currency)
};
