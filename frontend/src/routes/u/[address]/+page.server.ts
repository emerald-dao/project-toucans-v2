import { getProjectBalances } from '$flow/actions';
import type { Profile } from '$lib/types/common/profile.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';
import { fetchAllProjectRecentDonateOrPurchaseEventsByUser } from '$lib/utilities/api/supabase/fetchProjectRecentDonateOrPurchaseEventByUser';
import type { UserData, Vault } from './_types/user-data.interface';

export const load = async ({ params, fetch }): Promise<UserData> => {
	const profile = await fetch(`/api/get-profile/${params.address}`).then(
		async (data) => (await data.json()) as Profile
	);

	return {
		profile,
		vaults: await getUserVaults(profile.address),
		transactions: (await fetchAllProjectRecentDonateOrPurchaseEventsByUser(
			profile.address
		)) as DaoEvent[]
	};
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
	vaults.push({daoData:{name: "Testing DAO",
						logoUrl: "https://nftstorage.link/ipfs/bafkreiersm3huyrmo3iv5twp64r7avhlvvd4m3ybdndhjohpnxzmhrphnq",
						tokenSymbol:"TEST",
						contractName:"TestingDAO"},
				balance:100.00000000,
				tokenValue:1.000
	})
	// sort daos by highest value
	vaults.sort((a, b) => {
		return b.balance * b.tokenValue - a.balance * a.tokenValue;
	});

	return vaults;
};
