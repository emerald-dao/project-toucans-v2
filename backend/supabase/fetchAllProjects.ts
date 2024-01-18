import { network } from "../flow/config";
import { supabase } from "../supabaseClient";

export async function fetchAllProjects() {
  const { data } = await supabase.from('projects').select('*, user_funding ( address )').eq('network', network);

  if (!data || !data.length) {
    return []
  }
  return data;
};
