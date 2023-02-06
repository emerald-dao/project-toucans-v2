import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import { verifyAccountOwnership } from '$flow/utils.js';
import type { RequestHandler } from './$types';

const supabase = createClient(PublicEnv.PUBLIC_SUPABASE_URL, PrivateEnv.SUPABASE_SERVICE_KEY);

export async function POST({ request }: { request: RequestHandler }) {
	const data = await request.json();

	// Make sure a valid user was passed in
	const verifyAccount = await verifyAccountOwnership(data.user);
	if (!verifyAccount) {
		return json({});
	}

	const tokenName = data.daoDetails.tokenName;
	const name = data.daoDetails.name;

	const { error } = await supabase.from('projects').insert({
		name,
		token_symbol: tokenName,
		contract_name: data.daoDetails.contractName,
		contract_address: data.user.addr,
		description: data.daoDetails.description,
		website: data.daoDetails.website,
		twitter: data.daoDetails.twitter,
		discord: data.daoDetails.discord,
		logo: data.logo,
		owner: data.user.addr,
		type: data.tokenomics.tokenType,
		project_id: data.projectId
	});

	return json(error);
}
