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

	const { projectId, user } = data;

	const { error } = await supabase
		.from('notifications')
		.delete()
		.eq('project_id', projectId)
		.eq('user_address', user.addr);

	if (error) {
		console.log('Error removing new notification', error);
	}

	return json({ error });
}
