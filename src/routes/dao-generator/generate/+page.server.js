import { user } from "$stores/flow/FlowStore";
import { get } from "svelte/store";
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';

const supabase = createClient(PublicEnv.PUBLIC_SUPABASE_URL, PrivateEnv.SUPABASE_SERVICE_KEY);

export const actions = {
  default: async ({ request }) => {
    // Save user information to database
    const data = await request.formData();
    console.log(data);
    const tokenName = data.get('tokenName');
    const name = data.get('name');

    const { error } = await supabase
      .from('projects')
      .insert({ name, token_symbol: tokenName, contract_address: get(user).addr })
  }
};