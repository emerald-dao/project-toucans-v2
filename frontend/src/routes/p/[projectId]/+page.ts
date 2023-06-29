import type { PageLoad } from './$types';
import { getTokenBalance, getProjectInfo, hasProjectVaultSetup } from '$flow/actions';
import '$flow/config.ts';
import { get } from 'svelte/store';
import { user } from '$stores/flow/FlowStore';
import { fetchProjectDatabaseData } from '$lib/utilities/api/supabase/fetchProject';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';
import { fetchDaoVotes } from '$lib/utilities/api/supabase/fetchDaoVotes';
import { fetchDaoRecentFunding } from '$lib/utilities/api/supabase/fetchDaoRecentFunding';

export const ssr = false;

export const load: PageLoad = async ({ params, depends }) => {
	depends('app:discover');

	const generalInfo = await fetchProjectDatabaseData(params.projectId);
	const userAddress = get(user).addr;
	const hasToken = generalInfo.contract_address !== null;

	if (hasToken) {
		return {
			generalInfo,
			onChainData: getProjectInfo(
				generalInfo.contract_address,
				generalInfo.owner,
				generalInfo.project_id
			),
			events: (await fetchProjectEvents(generalInfo.project_id)).reverse(),
			votes: await fetchDaoVotes(generalInfo.project_id),
			userBalance: userAddress
				? await getTokenBalance(generalInfo.project_id, generalInfo.owner, userAddress)
				: null,
			vaultSetup: userAddress
				? await hasProjectVaultSetup(
						generalInfo.contract_address,
						generalInfo.project_id,
						userAddress
				  )
				: true,
			hasToken,
			recentFunding: fetchDaoRecentFunding(generalInfo.project_id)
		};
	} else {
		return {
			generalInfo,
			onChainData: getProjectInfo(
				generalInfo.contract_address,
				generalInfo.owner,
				generalInfo.project_id
			),
			events: (await fetchProjectEvents(generalInfo.project_id)).reverse(),
			votes: await fetchDaoVotes(generalInfo.project_id),
			hasToken,
			recentFunding: fetchDaoRecentFunding(generalInfo.project_id)
		};
	}
};
