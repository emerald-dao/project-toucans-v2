import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions.js';
import '$flow/config.js';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { FinancialDao, CommunityDao } from '$lib/types/dao-project.interface';
import type { Action } from '$lib/types/actions/actions.type';

export const load: LayoutLoad = async () => {
	const userObj = get(user);
	console.log("user obj", userObj)
	if (userObj.loggedIn) {
		const { data } = await supabase.from('projects').select().eq('owner', userObj.addr);

		if (!data || !data.length) {
			return {
				projects: []
			};
		}

		const projectsInfo = await Promise.all(
			data.map(async (project: FinancialDao | CommunityDao) => {
				const { data: actionData } = await supabase
					.from('events')
					.select()
					.eq('project_id', project.project_id);
				const [eventsData] = actionData;

				return {
					...project,
					...(await getProjectInfo(
						project.contract_name,
						project.contract_address,
						project.owner,
						project.type,
						project.project_id
					)),
					actions: eventsData?.actions.reverse(),
					purchaseHistory: eventsData?.actions.filter(
						(action: Action) => action.type === 'Purchase'
					)
				};
			})
		);

		console.log(projectsInfo);

		return {
			projects: projectsInfo
		};
	}
};
