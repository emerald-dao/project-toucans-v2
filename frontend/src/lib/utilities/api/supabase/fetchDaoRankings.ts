import { supabase } from "$lib/supabaseClient";

export async function fetchDaoRankings() {
  const { data } = await supabase.from('rankings')
    .select(`
      *,
      projects (
        contract_address,
        logo,
        token_symbol,
        name
      )
    `)
    .order('id', { ascending: false })
    .limit(3);

  if (!data || !data.length) {
    return []
  }
  return data;
};
