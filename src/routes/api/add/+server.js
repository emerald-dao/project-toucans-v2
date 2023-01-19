import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';

const supabase = createClient(PublicEnv.PUBLIC_SUPABASE_URL, PrivateEnv.SUPABASE_SERVICE_KEY);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const data = await request.json();
  console.log("IN THE SERVER!");
  console.log(data);
  const tokenName = data.daoDetails.tokenName;
  const name = data.daoDetails.name;

  const { error } = await supabase
    .from('projects')
    .insert({ name, token_symbol: tokenName, contract_name: data.daoDetails.contractName, contract_address: data.daoDetails.owner })

  return json(error);
}