import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import { verifyAccountOwnership } from '$flow/utils.js';

const supabase = createClient(PublicEnv.PUBLIC_SUPABASE_URL, PrivateEnv.SUPABASE_SERVICE_KEY);

export async function POST({ request }) {
	const data = await request.json();

	console.log({ data });

	// Make sure a valid user was passed in
	const verifyAccount = await verifyAccountOwnership(data.user);
	if (!verifyAccount) {
		console.log('current verify!');
		return new Response(JSON.stringify({ error: 'Error verifying user' }), { status: 401 });
	}

	const { error } = await supabase.from('users').insert({
		address: data.user.addr
	});

	console.log({ error });

	if (error) {
		return new Response(JSON.stringify({ error: 'Error inserting user' }), { status: 401 });
	} else {
		return new Response(JSON.stringify({ success: 'User added' }), { status: 201 });
	}
}
