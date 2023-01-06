import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
  const data = await supabase.from('projects').select().eq('name', params.project);
  console.log(data);
  return {
    data
  };
}