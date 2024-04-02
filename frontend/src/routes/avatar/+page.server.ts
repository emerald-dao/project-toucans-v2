import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import type { CurrentUserObject } from '@onflow/fcl';
import { verifyAccountOwnership } from '$flow/utils.js';
import { fail } from '@sveltejs/kit';
import type { Database } from '../../../supabase/database.types.js';
import { v4 as uuidv4 } from 'uuid';

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
		const avatarFileName = formData.get('avatar-file-name') as string | null;

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

		if (avatarImage && avatarImage.size > 1 * 1024 * 1024) {
			console.log('Image too big');
			return fail(400, { error: 'Image too big' });
		}

		const uuid = uuidv4();

		if (avatarImage && avatarImage.size > 0 && avatarImage.type.includes('image')) {
			const { error: imgError } = await supabase.storage
				.from('avatars')
				.upload(`avatars/${userObject.addr}/${uuid}.png`, avatarImage);

			if (imgError) {
				console.log('Error uploading image', imgError);
				return fail(500, { error: 'Error uploading image' });
			}

			if (avatarFileName) {
				const fileNameIndex = avatarFileName.lastIndexOf('/');
				const fileName = avatarFileName.substring(fileNameIndex + 1);

				const { error: delError } = await supabase.storage
					.from('avatars')
					.remove([`avatars/${userObject.addr}/${fileName}`]);

				if (delError) {
					console.log('Error uploading image', imgError);
					return fail(500, { error: 'Error uploading image' });
				}
			}
		}

		const { error: dataError } = await supabase.from('profiles').upsert({
			wallet_address: userObject.addr,
			avatar_url: `avatars/${userObject.addr}/${uuid}.png`,
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
