import { user } from '$stores/flow/FlowStore';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const ssr = false;

export async function load({ depends, parent }) {
	depends('app:admin');
	if (get(user).loggedIn) {
		const { daos } = await parent();

		if (!daos || !daos.length) {
			return {};
		}

		throw redirect(302, `/admin/${daos[0].project_id}`);
	}
	return {};
}
