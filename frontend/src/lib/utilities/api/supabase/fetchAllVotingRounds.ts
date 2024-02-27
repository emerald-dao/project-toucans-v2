import { supabase } from '$lib/supabaseClient';

export async function fetchAllVotingRounds(projectId: string) {
	const { data } = await supabase
		.from('voting_rounds')
		.select(
			`*,
			voting_options (
        *
      )`
		)
		.eq('project_id', projectId)
		.order('created_at', { ascending: false });

	if (!data || !data.length) {
		return [];
	}

	return data;
}

export type VotingRound = ArrayElement<Awaited<ReturnType<typeof fetchAllVotingRounds>>>;
export type VotingOption = ArrayElement<VotingRound['voting_options']>;

type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
