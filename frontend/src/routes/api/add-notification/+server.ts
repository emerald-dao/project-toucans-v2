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
		return new Response(JSON.stringify({ error: 'Error verifying user' }), { status: 401 });
	}
	const { projectId, user } = data;

	const { error } = await supabase.from('notifications').insert({
		project_id: projectId,
		user_address: user.addr
	});

	if (error) {
		return new Response(JSON.stringify({ error: 'Error adding notification' }), { status: 401 });
	} else {
		return new Response(JSON.stringify({ success: 'Notification added' }), { status: 201 });
	}
}
