import { supabase } from '$lib/supabaseClient';

export const fetchProjectRecentDonateOrPurchaseEvents = async (projectId: string) => {
  const { data: eventsData } = await supabase.from('events')
    .select(`
      data,
      project_id,
      projects (
        description,
        name,
        logo,
        token_symbol
      )
    `)
    .eq('project_id', projectId)
    .or('type.eq.Donate,type.eq.Purchase');

  return eventsData?.slice(0, 10) || [];
};
