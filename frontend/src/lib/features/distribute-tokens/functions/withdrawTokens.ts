import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';

export const withdrawTokens = async (daoData: DAOProject, distStaging: Distribution[]) => {
	console.log(daoData, distStaging);

	alert('Dummy withdrawal function.');
};
