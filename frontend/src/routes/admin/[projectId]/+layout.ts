import { getProjectInfo } from '$flow/actions';
import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';
import type { DAOProject, DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
import { fetchProjectEvents } from '$lib/utilities/api/supabase/fetchProjectEvents';
import { fetchDaoFundingInfo } from '$lib/utilities/api/supabase/fetchDaoFundingInfo';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ depends, params, parent }) => {
	depends('app:admin');
	depends('app:dao-data');

	if (get(user).loggedIn) {
		const { daos } = await parent();

		const daoId = params.projectId;
		const daoGeneralInfo = daos.find((dao) => dao.project_id === daoId) as DaoDatabaseData;
		const daoData = await fetchProjectData(daoGeneralInfo);

		if (daoData.onChainData.signers.includes(get(user).addr as string)) {
			return {
				activeDao: daoData
			};
		}
	}

	throw redirect(300, '/admin');
};

async function fetchProjectData(project: DaoDatabaseData): Promise<DAOProject> {
	return {
		generalInfo: project,
		onChainData: await getProjectInfo(project.contract_address, project.owner, project.project_id),
		events: await fetchProjectEvents(project.project_id),
		hasToken: project.contract_address !== null,
		funding: await fetchDaoFundingInfo(project.project_id)
	};
}
