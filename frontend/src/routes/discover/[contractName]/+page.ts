import type { PageLoad } from './$types';
import { getTokenBalance, getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { get } from 'svelte/store';
import { user } from '$stores/flow/FlowStore';
import { fetchProjectDatabaseData } from '$lib/utilities/api/supabase/fetchProject';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	const generalInfo = await fetchProjectDatabaseData(params.contractName);
	const userAddress = get(user).addr;

	return {
		generalInfo,
		onChainData: getProjectInfo(
			generalInfo.contract_address,
			generalInfo.owner,
			generalInfo.project_id
		),
		events: (await fetchProjectEvents(generalInfo.project_id)).reverse(),
		userBalance: userAddress
			? await getTokenBalance(generalInfo.project_id, generalInfo.contract_address, userAddress)
			: null
	};
};
