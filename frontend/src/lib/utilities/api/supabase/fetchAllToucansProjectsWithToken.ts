import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';
import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';

export async function fetchAllToucansProjectsWithToken(): Promise<DaoDatabaseData[]> {
	const { data } = await supabase
		.from('projects')
		.select()
		.neq('contract_address', null)
		.eq('network', network);

	return data as DaoDatabaseData[];
};
