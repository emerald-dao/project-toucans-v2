import { fetchAllVotingRounds } from '$lib/utilities/api/supabase/fetchAllVotingRounds.js';

export async function load({ params }) {
	return {
		votingRounds: await fetchAllVotingRounds(params.projectId)
	};
}
