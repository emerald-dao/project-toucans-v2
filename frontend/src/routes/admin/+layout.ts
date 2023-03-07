import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { DaoDatabaseData, DAOProject } from '$lib/types/dao-project/dao-project.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export const ssr = false;

export const load: LayoutLoad = async () => {
	const userObj = get(user);

	if (userObj.loggedIn) {
		const { data } = await supabase.from('projects').select().eq('owner', userObj.addr);

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
						project.contract_name,
						project.contract_address,
						project.owner,
						project.project_id.toString()
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
