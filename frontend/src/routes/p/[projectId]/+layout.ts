import { getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { fetchProjectDatabaseData } from '$lib/utilities/api/supabase/fetchProject';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';
import { fetchDaoVotes } from '$lib/utilities/api/supabase/fetchDaoVotes';
import { fetchDaoFundingInfo } from '$lib/utilities/api/supabase/fetchDaoFundingInfo';

export const ssr = false;

export const load = async ({ params, depends }) => {
	depends('app:discover');

	const generalInfo = await fetchProjectDatabaseData(params.projectId);
	const hasToken = generalInfo.contract_address !== null;

	return {
		generalInfo,
		onChainData: getProjectInfo(generalInfo.contract_address, generalInfo.owner, params.projectId),
		events: fetchProjectEvents(params.projectId),
		votes: fetchDaoVotes(params.projectId),
		hasToken,
		funding: fetchDaoFundingInfo(params.projectId)
	};
};
