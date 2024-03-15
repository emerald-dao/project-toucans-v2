import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import type { CurrentUserObject } from '@onflow/fcl';
import { verifyAccountOwnership } from '$flow/utils.js';
import { fail } from '@sveltejs/kit';
import type { Database } from '../../../supabase/database.types.js';

const supabase = createClient<Database>(
	PublicEnv.PUBLIC_SUPABASE_URL,
	PrivateEnv.SUPABASE_SERVICE_KEY
);

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const user = data.get('user') as string | null;
		const avatarImage = data.get('avatar-image') as string | null;
		const userName = data.get('user-name') as string | null;

		if (user === null) {
			console.log('User not found');
			return fail(400, { error: 'User not found' });
		}

		const userObject = JSON.parse(user) as CurrentUserObject;

		if (userObject.addr === undefined) {
			console.log('User address not found');
			return fail(400, { error: 'User address not found' });
		}

		const verifyAccount = await verifyAccountOwnership(userObject);

		if (!verifyAccount) {
			console.log('User not verified');
			return fail(400, { error: 'User not verified' });
		}

		const { error } = await supabase.from('profiles').upsert({
			wallet_address: userObject.addr,
			avatar_image: avatarImage,
			user_name: userName
		});

		if (error) {
			console.log('Error upserting profile', error);
			return fail(500, { error: 'Error uploading profile' });
		}

		return { success: true };
	}
};
