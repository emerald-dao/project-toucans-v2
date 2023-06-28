import { botSupabase } from '$lib/supabaseClient';

export const fetchDaoVotes = async (projectId: string) => {
	const { data } = await botSupabase
		.from('proposals')
		.select(
			`
    for_total,
    against_total,
    title,
    description,
    created_at,
    pending,
    type,
    toucans_action_id
  `
		)
		.eq('contract_name', 'SloppyStakes')
		.order('created_at', { ascending: false });

	return data || [];
};
