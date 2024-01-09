import { network } from '$flow/config';
import { supabase } from '$lib/supabaseClient';
import { user } from '$stores/flow/FlowStore';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const ssr = false;

export async function load({ depends }) {
    depends('app:admin');
    if (get(user).loggedIn) {
        const { data } = await supabase.from('projects').select().eq('owner', get(user).addr).eq('network', network);

        if (!data || !data.length) {
            return {}
        }
        throw redirect(302, `/admin/${data[0].project_id}`);
    }
    return {}
}