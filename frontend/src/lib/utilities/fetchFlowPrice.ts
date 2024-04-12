import { env } from '$env/dynamic/public';
import { supabase } from '$lib/supabaseClient';

export async function fetchFlowPrice() {
	const { data } = await supabase.from('price_api').select('price').eq('id', 1);
	return data[0].price;
}
