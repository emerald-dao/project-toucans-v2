import { fetchAllVotingRounds } from '$lib/utilities/api/supabase/fetchAllVotingRounds.js';

export async function load({ params, depends }) {
	depends('app:voting-rounds');

	return {
		votingRounds: await fetchAllVotingRounds(params.projectId)
	};
}
