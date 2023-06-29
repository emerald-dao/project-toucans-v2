import { supabase } from '$lib/supabaseClient';

export async function fetchDaoRecentFunding(projectId: string) {
	const { data } = await supabase.from('rankings').select('numbers').eq('project_id', projectId);

	if (!data || !data.length) {
		return [];
	}
	return data[0].numbers;
}
