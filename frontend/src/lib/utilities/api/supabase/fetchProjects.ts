import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';
import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';

export async function fetchProjects(projectIds: string[]): Promise<DaoDatabaseData[]> {
	console.log(projectIds)
	const { data } = await supabase
		.from('projects')
		.select()
		.in('project_id', projectIds)
		.eq('network', network);

	if (!data || !data.length) {
		throw new Error('No dao found');
	}

	return data;
};
