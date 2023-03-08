import { supabase } from '$lib/supabaseClient';

export const fetchProjectDatabaseData = async (contractName: string) => {
	const { data: projectData } = await supabase
		.from('projects')
		.select()
		.eq('project_id', contractName);

	if (!projectData || !projectData.length) {
		throw new Error('No dao found');
	}

	const [info] = projectData;

	return info;
};
