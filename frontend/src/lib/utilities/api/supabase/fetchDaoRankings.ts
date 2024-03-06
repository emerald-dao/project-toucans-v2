import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';

export async function fetchDaoRankings() {
	const { data } = await supabase
		.from('rankings')
		.select(`
			*,
			projects!inner (
				contract_address,
				logo,
				banner_image,
				token_symbol,
				name,
				owner,
				description
			)
		`)
		.eq('projects.network', network)
		.order('treasury_value', { ascending: false });

	if (!data || !data.length) {
		return [];
	}
	return data;
}
