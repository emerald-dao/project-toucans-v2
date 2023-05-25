import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';

export const getAllToucansProjects = async () => {
	const { data } = await supabase
		.from('projects')
		.select()
		.eq('network', network);

	return data;
};
