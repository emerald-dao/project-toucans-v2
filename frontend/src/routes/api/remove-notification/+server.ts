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

	const { projectId, projectOwner } = data;

	// TODO
	// const { error } = await supabase.rpc('remove_notification', {
	// 	_user_address: data.user.addr,
	// 	_project_owner: projectOwner,
	// 	_project_id: projectId
	// });
	console.log('Error removing new notification', error);

	return json({ error });
}
