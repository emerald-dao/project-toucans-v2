import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';
import { network } from '$flow/config';
import { fetchDaoFundingStats } from '$lib/utilities/api/supabase/fetchDaoFundingStats';
import { fetchDaoFunders } from '$lib/utilities/api/supabase/fetchDaoFunders';

export const ssr = false;

export const load: LayoutLoad = async ({ depends }) => {
	depends('app:admin');

	if (get(user).loggedIn) {
		const { data } = await supabase.from('projects').select().eq('owner', get(user).addr).eq('network', network);

		if (!data || !data.length) {
			return {
				projects: []
			};
		}

		return {
			projects: await Promise.all(
				(data as DaoDatabaseData[]).map(async (project: DaoDatabaseData) => {
					const events = await fetchProjectEvents(project.project_id);
					const onChainData = await getProjectInfo(
						project.contract_address,
						project.owner,
						project.project_id
					);
					const funding = await fetchDaoFundingStats(project.project_id);
					const funders = (await fetchDaoFunders(project.project_id)).reduce(
						(obj, item) => Object.assign(obj, { [item.address]: item.amount }),
						{}
					);

					return {
						generalInfo: project,
						onChainData,
						events: events.reverse(),
						hasToken: project.contract_address !== null,
						funding: { ...funding, funders }
					};
				})
			)
		};
	} else {
		return { projects: [] };
	}
};
