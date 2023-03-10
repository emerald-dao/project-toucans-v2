import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export const ssr = false;

export const load: LayoutLoad = async () => {
	if (get(user).loggedIn) {
		const { data } = await supabase.from('projects').select().eq('owner', get(user).addr);

		if (!data || !data.length) {
			return {
				projects: []
			};
		}

		const projectsInfo = await Promise.all(
			data.map(async (project: DaoDatabaseData) => {
				const { data: actionData } = await supabase
					.from('events')
					.select()
					.eq('project_id', project.project_id);
				const eventsData = actionData as DaoEvent[];

				return {
					generalInfo: project,
					onChainData: await getProjectInfo(
						project.contract_address,
						project.owner,
						project.project_id
					),
					events: eventsData?.reverse() || []
				};
			})
		);

		console.log(projectsInfo);

		return {
			projects: projectsInfo
		};
	}
};
