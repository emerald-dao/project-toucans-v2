import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageLoad = async () => {
	const data = await supabase.from('projects').select('name, token_symbol, contract_name');

	return {
		data
	};
};
