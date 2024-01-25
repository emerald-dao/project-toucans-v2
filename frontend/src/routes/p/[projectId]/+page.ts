import type { PageLoad } from './$types';
import { getTokenBalance, getProjectInfo, hasProjectVaultSetup } from '$flow/actions';
import '$flow/config.ts';
import { get } from 'svelte/store';
import { user } from '$stores/flow/FlowStore';
import { fetchProjectDatabaseData } from '$lib/utilities/api/supabase/fetchProject';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';
import { fetchDaoVotes } from '$lib/utilities/api/supabase/fetchDaoVotes';
import { fetchDaoFundingInfo } from '$lib/utilities/api/supabase/fetchDaoFundingInfo';

// export const ssr = true;

export const load: PageLoad = async ({ params, depends }) => {
	depends('app:discover');

	const generalInfo = await fetchProjectDatabaseData(params.projectId);
	const userAddress = get(user).addr;
	const hasToken = generalInfo.contract_address !== null;

	return {
		generalInfo,
		onChainData: getProjectInfo(
			generalInfo.contract_address,
			generalInfo.owner,
			params.projectId
		),
		events: fetchProjectEvents(params.projectId),
		votes: fetchDaoVotes(params.projectId),
		hasToken,
		funding: fetchDaoFundingInfo(params.projectId),
		userBalance: userAddress && hasToken
			? getTokenBalance(params.projectId, generalInfo.owner, userAddress)
			: null,
		vaultSetup: userAddress && hasToken
			? hasProjectVaultSetup(
				generalInfo.contract_address as string,
				params.projectId,
				userAddress
			)
			: true,
	}
};
