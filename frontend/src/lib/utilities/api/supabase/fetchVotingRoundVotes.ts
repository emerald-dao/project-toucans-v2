import { supabase } from '$lib/supabaseClient';
import type { Database } from '../../../../../supabase/database.types';

export async function fetchVotingRoundVotes(votingRoundId: number) {
	const { data, error } = await supabase
		.from('voting_options')
		.select(
			`*,
      votes (
        *
      )`
		)
		.eq('voting_round_id', votingRoundId);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export type VotingOption = Database['public']['Tables']['voting_options']['Row'];
export type Vote = Database['public']['Tables']['votes']['Row'];

export interface VotingRoundVotes extends VotingOption {
	votes: Vote[];
}
