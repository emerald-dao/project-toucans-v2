import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
  const data = await supabase.from('projects').select('name, contract_name');
  return {
    data
  };
}