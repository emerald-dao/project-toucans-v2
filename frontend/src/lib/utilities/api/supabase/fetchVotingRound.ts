import { supabase } from '$lib/supabaseClient';

export async function fetchVotingRound(votingRoundId: string) {
	const { data } = await supabase
		.from('voting_rounds')
		.select('*')
		.eq('id', votingRoundId)
		.single();

	if (!data) {
		return null;
	}
	return data;
}
