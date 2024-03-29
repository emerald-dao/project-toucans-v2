import { fail } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import uploadToIPFS from '$lib/utilities/uploadToIpfs';

const supabase = createClient(PublicEnv.PUBLIC_SUPABASE_URL, PrivateEnv.SUPABASE_SERVICE_KEY);

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const website = formData.get('website');
		const twitter = formData.get('twitter');
		const discord = formData.get('discord');
		const name = formData.get('name');
		const description = formData.get('description');
		const long_description = formData.get('longDescription');

		const logo = formData.get('logo') as File;
		const bannerImage = formData.get('banner') as File;

		let logoIpfsUrl;
		let bannerLogoIpfsUrl;

		if (logo.type === 'image/png' || logo.type === 'image/jpeg' || logo.type === 'image/jpg') {
			logoIpfsUrl = await uploadToIPFS(logo);
		}

		if (
			bannerImage.type === 'image/png' ||
			bannerImage.type === 'image/jpeg' ||
			bannerImage.type === 'image/jpg'
		) {
			bannerLogoIpfsUrl = await uploadToIPFS(bannerImage);
		}

		const { error } = await supabase
			.from('projects')
			.update({
				website,
				twitter,
				discord,
				name,
				description,
				long_description,
				logo: logoIpfsUrl,
				banner_image: bannerLogoIpfsUrl
			})
			.eq('project_id', formData.get('project_id'));

		if (error) {
			throw fail(400, {
				message: "Couldn't update project"
			});
		}

		return { success: true, website, twitter, discord, name, description, long_description };
	}
};
