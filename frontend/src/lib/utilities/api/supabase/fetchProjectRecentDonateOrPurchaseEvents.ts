import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';

export const fetchProjectRecentDonateOrPurchaseEvents = async (projectId: string) => {
  const { data: eventsData } = await supabase.from('events')
    .select(`
      data
    `)
    .eq('project_id', projectId)
    .or('type.eq.Donate,type.eq.Purchase');

  const { data: projectData } = await supabase
    .from('projects')
    .select('description, name, logo, token_symbol')
    .eq('project_id', projectId)
    .eq('network', network);

  return { events: eventsData?.slice(0, 10) || [], projectData: projectData?.at(0) || {} }
};
