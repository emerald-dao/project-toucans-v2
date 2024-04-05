import { supabase } from '$lib/supabaseClient.js';
import { get } from 'svelte/store';
import { user } from '$stores/flow/FlowStore';
import { network } from '$flow/config';

export const load = async ({ depends }) => {
	depends('app:admin');

	if (get(user).loggedIn) {
		const { data } = await supabase
			.from('projects')
			.select()
			.eq('owner', get(user).addr)
			.eq('network', network);

		return {
			daos: data || []
		};
	}

	return {
		daos: []
	};
};
