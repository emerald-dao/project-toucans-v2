import { supabase } from "$lib/supabaseClient";
import { getProjectInfo } from '$flow/actions.js';
import "$flow/config.js"

export async function load({ params }) {
  const { data } = await supabase.from('projects').select().eq('name', params.project);
  const info = data[0];
  const projectInfo = await getProjectInfo(info.contract_name, info.contract_address, info.owner, info.type);

  return { ...info, ...projectInfo };
}