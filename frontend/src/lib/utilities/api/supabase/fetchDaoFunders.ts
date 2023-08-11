import { supabase } from '$lib/supabaseClient';

export async function fetchDaoFunders(projectId: string) {
	const { data } = await supabase.from('user_funding').select('address, amount').eq('project_id', projectId);

	if (!data || !data.length) {
		return [];
	}
	return data;
}
