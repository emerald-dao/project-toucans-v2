import { fail } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';

const supabase = createClient(PublicEnv.PUBLIC_SUPABASE_URL, PrivateEnv.SUPABASE_SERVICE_KEY);

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const website = formData.get('website');
		const twitter = formData.get('twitter');
		const discord = formData.get('discord');
		const description = formData.get('description');
		const long_description = formData.get('longDescription');

		const { error } = await supabase
			.from('projects')
			.update({
				website,
				twitter,
				discord,
				description,
				long_description
			})
			.eq('project_id', formData.get('project_id'));

		if (error) {
			throw fail(400, {
				message: "Couldn't update project"
			});
		}

		return { success: true, website, twitter, discord, description, long_description };
	}
};
