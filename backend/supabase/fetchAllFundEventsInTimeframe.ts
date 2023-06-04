import { network } from "../flow/config";
import { supabase } from "../supabaseClient";

// note: the `!inner` hint makes it so you filter on the parent rows if the network isnt correct
export async function fetchAllFundEventsInTimeframe(beginning: Date) {
  const { data } = await supabase.from('events')
    .select(`
      project_id,
      data,
      timestamp,
      projects!inner (
        contract_address,
        name,
        logo,
        token_symbol,
        network
      )
    `)
    .eq('projects.network', network)
    .gt('timestamp', beginning.toISOString())
    .or('type.eq.Donate,type.eq.Purchase')
    .order('timestamp', { ascending: true });

  if (!data || !data.length) {
    return []
  }
  return data;
};
