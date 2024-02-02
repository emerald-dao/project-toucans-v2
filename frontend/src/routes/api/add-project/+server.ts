import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import { verifyAccountOwnership } from '$flow/utils.js';
import { network } from '$flow/config';
import type { DaoGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface.js';
import type { CurrentUserObject } from '@onflow/fcl';
import type { Database } from '../../../../supabase/database.types.js';

const supabase = createClient<Database>(
	PublicEnv.PUBLIC_SUPABASE_URL,
	PrivateEnv.SUPABASE_SERVICE_KEY
);

export async function POST({ request }) {
	const data: {
		user: CurrentUserObject;
		daoData: DaoGeneratorData;
		logo: string;
		bannerImage: string;
		projectId: string;
	} = await request.json();

	// Make sure a valid user was passed in
	const verifyAccount = await verifyAccountOwnership(data.user);
	if (!verifyAccount) {
		return json({});
	}

	const name = data.daoData.daoDetails.name;
	const tokenName =
		data.daoData.daoDetails.daoType === 'daoAndToken' ? data.daoData.daoDetails.tokenName : null;
	const contractAddress = data.daoData.daoDetails.daoType === 'daoAndToken' ? data.user.addr : null;

	const { error: ProjectError } = await supabase.from('projects').insert({
		project_id: data.projectId,
		name,
		token_symbol: tokenName,
		contract_address: contractAddress,
		description: data.daoData.daoDetails.description,
		long_description: data.daoData.daoDetails.longDescription,
		website: data.daoData.daoDetails.website,
		twitter: data.daoData.daoDetails.twitter,
		discord: data.daoData.daoDetails.discord,
		logo: data.logo,
		owner: data.user.addr,
		banner_image: data.bannerImage,
		network
	});

	if (ProjectError) {
		console.log('Error adding new project', ProjectError);
		return json({ ProjectError });
	}

	const { error: EventError } = await supabase.from('events').insert({
		project_id: data.daoData.daoDetails.contractName,
		type: 'ProjectCreated',
		data: {
			by: data.user.addr,
			tokenTypeIdentifier: `A.${data.user.addr?.slice(2)}.${
				data.daoData.daoDetails.contractName
			}.Vault`
		}
	});

	if (EventError) {
		console.log('Error adding new event', EventError);
		return json({ EventError });
	}

	return json({ ProjectError });
}
