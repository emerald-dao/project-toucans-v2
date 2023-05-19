import { supabase } from '$lib/supabaseClient';

export const getAllToucansProjects = async () => {
	const { data } = await supabase
		.from('projects')
		.select();

	return data;
};
