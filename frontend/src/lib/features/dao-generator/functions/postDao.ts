import type { DaoGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface';
import type { CurrentUserObject } from '@onflow/fcl';

export const postProject = async (
	user: CurrentUserObject,
	data: DaoGeneratorData,
	projectId: string,
	logoUrl: string,
	bannerUrl: string
) => {
	const res = await fetch('/api/add-project', {
		method: 'POST',
		body: JSON.stringify({
			user,
			daoData: data,
			logo: logoUrl,
			bannerImage: bannerUrl,
			projectId
		}),
		headers: {
			'content-type': 'application/json'
		}
	});

	const response = await res.json();

	return response;
};
