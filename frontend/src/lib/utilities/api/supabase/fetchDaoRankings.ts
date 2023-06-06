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
    `);

  if (!data || !data.length) {
    return []
  }
  return data;
};
