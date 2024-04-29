import { supabase } from '$lib/supabaseClient';

export const fetchAllProjectRecentDonateOrPurchaseEventsByUser = async (userAddress: string) => {
	const { data } = await supabase
		.from('events')
		.select()
		.or('type.eq.Donate,type.eq.Purchase')
		.eq('data->>by', userAddress)
		.order('timestamp', { ascending: false });

	return data || [];
};
