import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';

export const fetchProjectDatabaseData = async (contractName: string) => {
	const { data: projectData } = await supabase
		.from('projects')
		.select()
		.eq('project_id', contractName)
		.eq('network', network);

	if (!projectData || !projectData.length) {
		throw new Error('No dao found');
	}

	const [info] = projectData;

	return info;
};

export type DaoDatabaseData = Awaited<ReturnType<typeof fetchProjectDatabaseData>>;
