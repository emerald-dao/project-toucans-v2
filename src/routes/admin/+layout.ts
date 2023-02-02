import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions.js';
import '$flow/config.js';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { FinancialDao, CommunityDao } from '$lib/types/dao-project.interface';

export const load: LayoutLoad = async () => {
	if (get(user)) {
		const { data } = await supabase.from('projects').select().eq('owner', get(user)?.addr);

		if (!data || !data.length) {
			throw new Error(`User doesn't have any DAO`);
		}

		const projectsInfo = await Promise.all(
			data.map(async (project: FinancialDao | CommunityDao) => {
				return {
					...project,
					...(await getProjectInfo(
						project.contract_name,
						project.contract_address,
						project.owner,
						project.type
					))
				};
			})
		);

		console.log(projectsInfo);

		return {
			...projectsInfo
		};
	}
};
