import { getProjectBalances } from '$flow/actions';
import { getFindProfileFromAddressOrName } from '$flow/utils';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';
import { fetchAllProjectRecentDonateOrPurchaseEventsByUser } from '$lib/utilities/api/supabase/fetchProjectRecentDonateOrPurchaseEventByUser';
import getRandomUserNumber from './_features/userNames/getRandomUserNumber';
import RANDOM_USERS from './_features/userNames/randomUsers';
import type { UserData, Vault } from './_types/user-data.interface';

export const load = async ({ params }): Promise<UserData> => {
	return {
		...(await getUserProfile(params.address)),
		address: params.address,
		vaults: await getUserVaults(params.address),
		transactions: (await fetchAllProjectRecentDonateOrPurchaseEventsByUser(
			params.address
		)) as DaoEvent[]
	};
};

const getUserProfile = async (
	address: string
): Promise<{
	name: string;
	avatar: string;
}> => {
	const findProfile = await getFindProfileFromAddressOrName(address);

	if (findProfile) {
		return {
			name: findProfile.name,
			avatar: findProfile.avatar
		};
	} else {
		const userNumber = getRandomUserNumber(address, RANDOM_USERS.length);

		return {
			name: RANDOM_USERS[userNumber].name,
			avatar: RANDOM_USERS[userNumber].avatar
		};
	}
};

const getUserVaults = async (address: string): Promise<Vault[]> => {
	const projects = await fetchDaoRankings();

	const y = projects.map((x) => {
		return { key: x.project_id, value: x.projects.owner };
	});

	const balances = await getProjectBalances(address, y);

	const vaults: Vault[] = [];

	for (const project of projects) {
		if (balances[project.project_id]) {
			vaults.push({
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
	vaults.sort((a, b) => {
		return b.balance * b.tokenValue - a.balance * a.tokenValue;
	});

	return vaults;
};
