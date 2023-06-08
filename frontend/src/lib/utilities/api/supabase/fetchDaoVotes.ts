import { botSupabase } from '$lib/supabaseClient';

export const fetchDaoVotes = async (projectId: string) => {
  const { data } = await botSupabase.from('proposals')
    .select(`
    for_total,
    against_total,
    title,
    description,
    created_at,
    pending
  `)
    .eq('contract_name', projectId)
    .order('created_at', { ascending: false });

  return data || [];
};
