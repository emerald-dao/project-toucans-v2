import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';
import type { DonateEvent } from '$lib/types/dao-project/dao-event/events/donate.interface';
import type { PurchaseEvent } from '$lib/types/dao-project/dao-event/events/purchase.interface';

export async function fetchAllFundEventsInTimeframe(beginning: Date) {
  const { data } = await supabase.from('events')
    .select()
    .gt('timestamp', beginning.toISOString())
    .or('type.eq.Donate,type.eq.Purchase');

  console.log(data)
  if (!data || !data.length) {
    return []
  }
  return data;
};
