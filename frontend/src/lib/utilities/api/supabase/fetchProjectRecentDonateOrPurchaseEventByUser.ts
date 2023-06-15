import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';

export const fetchAllProjectRecentDonateOrPurchaseEventsByUser = async (userAddress: string) => {
  const { data } = await supabase.from('events')
    .select()
    .or('type.eq.Donate,type.eq.Purchase')
    .eq('data->>by', userAddress);

  return data || [];
};
