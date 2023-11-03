import { getProjectLockedTokensForUser } from '$flow/actions';
import type { Vault } from '../_types/user-data.interface';
import { fetchProjectDatabaseData } from '$lib/utilities/api/supabase/fetchProject';

export const getLockedTokens = async (vault: Vault, userAddress: string) => {
	const projectData = await fetchProjectDatabaseData(vault.daoData.projectId);
	return await getProjectLockedTokensForUser(projectData.owner, vault.daoData.projectId, userAddress);
};
