import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';

export const ssr = false;

export const load: LayoutLoad = async ({ depends }) => {
	depends('app:admin');

	if (get(user).loggedIn) {
		const { data } = await supabase.from('projects').select().eq('owner', get(user).addr);

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

					return {
						generalInfo: project,
						onChainData,
						events: events.reverse()
					};
				})
			)
		};
	} else {
		return { projects: [] };
	}
};
