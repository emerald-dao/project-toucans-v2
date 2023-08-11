import { network } from "../flow/config";
import { supabase } from "../supabaseClient";

export async function fetchAllRankings() {
  const { data } = await supabase.from('rankings')
    .select(`
      project_id,
      projects!inner (
        network
      )
    `)
    .eq('projects.network', network);

  if (!data || !data.length) {
    return []
  }
  return data;
};
