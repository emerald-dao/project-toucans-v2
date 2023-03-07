import type { DaoGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface';
import type { CurrentUserObject } from '@onflow/fcl';

export const postProject = async (
	user: CurrentUserObject,
	data: DaoGeneratorData,
	projectId: string,
	logoUrl: string
) => {
	const res = await fetch('/api/add', {
		method: 'POST',
		body: JSON.stringify({
			user,
			...data,
			logo: logoUrl,
			projectId
		}),
		headers: {
			'content-type': 'application/json'
		}
	});

	const response = await res.json();

	return response;
};
