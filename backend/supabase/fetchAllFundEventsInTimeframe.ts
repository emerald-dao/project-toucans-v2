import { supabase } from "../supabaseClient";

export async function fetchAllFundEventsInTimeframe(beginning: Date) {
  const { data } = await supabase.from('events')
    .select(`
      project_id,
      data,
      timestamp,
      projects (
        contract_address,
        name,
        logo,
        token_symbol
      )
    `)
    .gt('timestamp', beginning.toISOString())
    .or('type.eq.Donate,type.eq.Purchase')
    .order('timestamp', { ascending: true });

  if (!data || !data.length) {
    return []
  }
  return data;
};
