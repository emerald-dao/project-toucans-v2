import { supabase } from '$lib/supabaseClient';

export async function fetchDaoFundingStats(projectId: string) {
	const { data } = await supabase.from('rankings').select('numbers, total_funding').eq('project_id', projectId);

	if (!data || !data.length) {
		return [];
	}
	return data[0];
}
