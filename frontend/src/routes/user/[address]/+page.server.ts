import { getProjectBalances } from '$flow/actions';
import { getFindProfileFromAddressOrName } from '$flow/utils';
import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';
import { fetchAllProjectRecentDonateOrPurchaseEventsByUser } from '$lib/utilities/api/supabase/fetchProjectRecentDonateOrPurchaseEventByUser';
import { USER_MOCK } from './_mockData/usermock';
import type { UserData } from './_types/user-data.interface';

export const load = async ({ params }): Promise<UserData> => {
	const findProfile = await getFindProfileFromAddressOrName(params.address);
	if (findProfile) {
		USER_MOCK.address = findProfile.address;
		USER_MOCK.name = findProfile.name;
		USER_MOCK.avatar = findProfile.avatar;
	} else {
		USER_MOCK.address = params.address;
	}

	const projects = await fetchDaoRankings();
	console.log(projects, 'projects');

	const y = projects.map((x) => {
		return { key: x.project_id, value: x.projects.owner };
	});
	const balances = await getProjectBalances(USER_MOCK.address, y);
	USER_MOCK.vaults = [];
	for (const project of projects) {
		if (balances[project.project_id]) {
			USER_MOCK.vaults.push({
				daoData: {
					name: project.projects.name,
					logoUrl: project.projects.logo,
					tokenSymbol: project.projects.token_symbol,
					contractName: project.project_id
				},
				balance: balances[project.project_id],
				tokenValue: project.price || 0
			});
		}
	}
	// sort daos by highest value
	USER_MOCK.vaults.sort((a, b) => {
		return b.balance * b.tokenValue - a.balance * a.tokenValue;
	});

	USER_MOCK.transactions = await fetchAllProjectRecentDonateOrPurchaseEventsByUser(
		USER_MOCK.address
	);
	return USER_MOCK;
};
