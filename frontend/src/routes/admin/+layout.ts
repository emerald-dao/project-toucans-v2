import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export const ssr = false;

export const load: LayoutLoad = async () => {
	const userObj = get(user);
	console.log('user obj', userObj);
	if (userObj.loggedIn) {
		const { data } = await supabase.from('projects').select().eq('owner', userObj.addr);

		if (!data || !data.length) {
			return {
				projects: []
			};
		}

		const projectsInfo = await Promise.all(
			data.map(async (project: DAOProject) => {
				const { data: actionData } = await supabase
					.from('events')
					.select()
					.eq('project_id', project.generalInfo.project_id);
				const eventsData = actionData as DaoEvent[];

				return {
					...project,
					...(await getProjectInfo(
						project.generalInfo.contract_name,
						project.generalInfo.contract_address,
						project.generalInfo.owner,
						project.generalInfo.project_id.toString()
					)),
					actions: eventsData?.reverse() || [],
					purchaseHistory: eventsData?.filter((event: DaoEvent) => event.type === 'Purchase') || []
				};
			})
		);

		return {
			projects: projectsInfo
		};
	}
};
