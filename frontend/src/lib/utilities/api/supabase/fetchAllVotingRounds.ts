import { supabase } from '$lib/supabaseClient';
import type { Database } from '../../../../../supabase/database.types';

export async function fetchAllVotingRounds(projectId: string) {
	const { data } = await supabase
		.from('voting_rounds')
		.select('*')
		.eq('project_id', projectId)
		.order('start_date', { ascending: false });

	if (!data || !data.length) {
		return [];
	}
	return data;
}

export type VotingRound = Database['public']['Tables']['voting_rounds']['Row'];
