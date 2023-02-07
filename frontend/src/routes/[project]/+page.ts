import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions.js';
import '$flow/config.js';

export const load: PageLoad = async ({ params }) => {
	// get project info
	const { data: projectData } = await supabase
		.from('projects')
		.select()
		.eq('contract_name', params.project);

	if (!projectData || !projectData.length) {
		throw new Error('No dao found');
	}

	const [info] = projectData;

	const projectInfo = await getProjectInfo(
		info.contract_name,
		info.contract_address,
		info.owner,
		info.type,
		info.project_id
	);

	console.log('projectInfo', projectInfo);

	// get actions
	const { data: actionData } = await supabase
		.from('events')
		.select()
		.eq('project_id', info.project_id);
	const [eventsData] = actionData;

	console.log('eventsData', eventsData.actions.reverse());
	console.log(info);
	console.log(projectInfo);

	return {
		...info,
		...projectInfo,
		actions: eventsData.actions.reverse(),
		purchaseHistory: eventsData.actions.filter((action) => action.type === 'Purchase')
	};
};
