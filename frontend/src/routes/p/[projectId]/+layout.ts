import { getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { fetchProjectDatabaseData } from '$lib/utilities/api/supabase/fetchProject';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';
import { fetchDaoFundingInfo } from '$lib/utilities/api/supabase/fetchDaoFundingInfo';
import { fetchAllVotingRounds } from '$lib/utilities/api/supabase/fetchAllVotingRounds.js';
import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';

export const ssr = false;

export const load = async ({ params, depends }): Promise<DAOProject> => {
	depends('app:discover');

	const generalInfo = await fetchProjectDatabaseData(params.projectId);
	const hasToken = generalInfo.contract_address !== null;

	return {
		generalInfo,
		onChainData: await getProjectInfo(
			generalInfo.contract_address,
			generalInfo.owner,
			params.projectId
		),
		events: await fetchProjectEvents(params.projectId),
		hasToken,
		funding: await fetchDaoFundingInfo(params.projectId),
		votingRounds: await fetchAllVotingRounds(params.projectId)
	};
};
