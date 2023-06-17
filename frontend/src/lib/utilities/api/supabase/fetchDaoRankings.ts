import { network } from "$flow/config";
import { supabase } from "$lib/supabaseClient";

export async function fetchDaoRankings() {
  const { data } = await supabase.from('rankings')
    .select(`
      *,
      projects!inner (
        contract_address,
        logo,
        token_symbol,
        name,
        owner
      )
    `)
    .eq('projects.network', network);

  if (!data || !data.length) {
    return []
  }
  return data;
};
