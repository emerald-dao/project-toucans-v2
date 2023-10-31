import { getProjectLockedTokens } from '$flow/actions';
import type { Vault } from '../_types/user-data.interface';
import { fetchProjectDatabaseData } from '$lib/utilities/api/supabase/fetchProject';

export const getLockedTokens = async (vault: Vault) => {

    const owner = await fetchProjectDatabaseData(vault.daoData.contractName);
    return await getProjectLockedTokens(owner.owner, vault.daoData.contractName);
};