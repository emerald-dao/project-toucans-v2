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
		const formData = await request.formData();

		const user = formData.get('user') as string | null;
		const avatarImage = formData.get('user-avatar') as File | null;
		const userName = formData.get('user-name') as string | null;

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

		if (avatarImage) {
			const { error: imgError } = await supabase.storage
				.from('avatars')
				.upload(`static/${userObject.addr}.png`, avatarImage, {
					cacheControl: '3600',
					upsert: true
				});

			if (imgError) {
				console.log('Error uploading image', imgError);
				return fail(500, { error: 'Error uploading image' });
			}
		}

		const { error: dataError } = await supabase.from('profiles').upsert({
			wallet_address: userObject.addr,
			avatar_url: `static/${userObject.addr}.png`,
			user_name: userName,
			use_find: false
		});

		if (dataError) {
			console.log('Error upserting profile', dataError);
			return fail(500, { error: 'Error uploading profile' });
		}

		return { success: true };
	}
};