import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getFinancialTokenBalance, getProjectInfo } from '$flow/actions';
import '$flow/config.js';
import type { Action } from '$lib/types/actions/actions.type';
import { get } from 'svelte/store';
import { user } from '$stores/flow/FlowStore';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	// get project info
	const { data: projectData } = await supabase
		.from('projects')
		.select()
		.eq('contract_name', params.contractName);

	if (!projectData || !projectData.length) {
		throw new Error('No dao found');
	}

	const [info] = projectData;

	const projectInfo = await getProjectInfo(
		info.contract_name,
		info.contract_address,
		info.owner,
		info.project_id
	);

	const userBalance = await getFinancialTokenBalance(
		info.contract_name,
		info.contract_address,
		get(user).addr
	)

	// get actions
	const { data: actionData } = await supabase
		.from('events')
		.select()
		.eq('project_id', info.project_id);
	const [eventsData] = actionData || [];

	return {
		...info,
		...projectInfo,
		userBalance,
		actions: !eventsData ? [] : eventsData.actions.reverse(),
		purchaseHistory: !eventsData ? [] : eventsData.actions.filter((action: Action) => action.type === 'Purchase')
	};
};
