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
	console.log(data.user)
	if (!verifyAccount) {
		return json({});
	}

	const { projectId, projectOwner } = data;

	const { error } = await supabase.from('notifications').insert({
		project_id: projectId,
		user_address: data.user.addr
	});
	console.log('Error adding new notification', error);

	return json({ error });
}
