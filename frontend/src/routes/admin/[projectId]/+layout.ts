import type { LayoutLoad } from '../$types';
import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions';
import '$flow/config.ts';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { DAOProject, DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';
import { network } from '$flow/config';
import { fetchDaoFundingInfo } from '$lib/utilities/api/supabase/fetchDaoFundingInfo';

export const ssr = false;

async function fetchProjectData(project: DaoDatabaseData): Promise<DAOProject> {
	return {
		generalInfo: project,
		onChainData: await getProjectInfo(
			project.contract_address,
			project.owner,
			project.project_id
		),
		events: await fetchProjectEvents(project.project_id),
		hasToken: project.contract_address !== null,
		funding: await fetchDaoFundingInfo(project.project_id)
	}
}

export const load: LayoutLoad = async ({ depends, params }) => {
	depends('app:admin');

	if (get(user).loggedIn) {
		const { data } = await supabase.from('projects').select().eq('project_id', params.projectId).eq('network', network)
		if (!data || !data.length) {
			return {
				activeDao: null,
				otherDaos: []
			};
		}
		const { data: ownedProjects } = await supabase.from('projects').select().eq('owner', get(user).addr).eq('network', network).neq('project_id', params.projectId);

		const daoDatabaseData: DaoDatabaseData = data[0];
		const daoData: DAOProject = await fetchProjectData(daoDatabaseData);
		if (daoData.onChainData.signers.includes(get(user).addr)) {
			return {
				activeDao: daoData,
				otherDaos: ownedProjects || [],
			};
		}
	}
	return { activeDao: null, otherDaos: [] };
};
