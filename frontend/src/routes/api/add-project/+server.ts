import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import { verifyAccountOwnership } from '$flow/utils.js';

const supabase = createClient(PublicEnv.PUBLIC_SUPABASE_URL, PrivateEnv.SUPABASE_SERVICE_KEY);

export async function POST({ request }) {
	const data = await request.json();

	// Make sure a valid user was passed in
	const verifyAccount = await verifyAccountOwnership(data.user);
	if (!verifyAccount) {
		return json({});
	}

	const tokenName = data.daoDetails.tokenName;
	const name = data.daoDetails.name;

	const { error: ProjectError } = await supabase.from('projects').insert({
		project_id: data.daoDetails.contractName,
		name,
		token_symbol: tokenName,
		contract_address: data.user.addr,
		description: data.daoDetails.description,
		website: data.daoDetails.website,
		twitter: data.daoDetails.twitter,
		discord: data.daoDetails.discord,
		logo: data.logo,
		owner: data.user.addr,
		type: data.tokenomics.tokenType
	});
	console.log('Error adding new project', ProjectError);

	const { error: EventError } = await supabase.from('events').insert({
		project_id: data.daoDetails.contractName,
		type: 'ProjectCreated',
		data: {
			by: data.user.addr,
			tokenTypeIdentifier: `A.${data.user.addr.slice(2)}.${data.daoDetails.contractName}.Vault`
		}
	});
	console.log('Error adding new ProjectCreated event', EventError);

	return json({ ProjectError });
}
