import { network } from "../flow/config";
import { supabase } from "../supabaseClient";

// note: the `!inner` hint makes it so you filter on the parent rows if the network isnt correct
export async function fetchAllFundEvents() {
  const { data } = await supabase.from('events')
    .select(`
      project_id,
      data,
      timestamp,
      type,
      transaction_id,
      projects!inner (
        contract_address,
        name,
        logo,
        token_symbol,
        network
      )
    `)
    .eq('projects.network', network)
    .or('type.eq.Donate,type.eq.Purchase')
    .order('timestamp', { ascending: true });

  if (!data || !data.length) {
    return []
  }
  return data;
};
