import { getProjectBalances } from '$flow/actions';
import type { Profile } from '$lib/types/common/profile.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
import { fetchAllToucansProjectsWithToken } from '$lib/utilities/api/supabase/fetchAllToucansProjectsWithToken';
import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';
import { fetchAllProjectRecentDonateOrPurchaseEventsByUser } from '$lib/utilities/api/supabase/fetchProjectRecentDonateOrPurchaseEventByUser';
import { fetchFlowPrice } from '$lib/utilities/fetchFlowPrice';
import type { UserData, Vault } from './_types/user-data.interface';

export const load = async ({ params, fetch, depends }): Promise<UserData> => {
	depends('app:userprofile');

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
	const rankedProjects = await fetchDaoRankings();
	const projects = await fetchAllToucansProjectsWithToken();

	const y = projects.map((x) => {
		return { key: x.project_id, value: x.owner };
	});

	const balances = await getProjectBalances(address, y);
	console.log('balances', balances);

	const vaults: Vault[] = [];

	for (const project of projects) {
		if (balances[project.project_id]) {
			vaults.push({
				daoData: {
					name: project.name,
					logoUrl: project.logo,
					tokenSymbol: project.token_symbol as string,
					projectId: project.project_id,
					owner: project.owner,
					contractAddress: project.contract_address
				},
				balance: balances[project.project_id],
				tokenValue: rankedProjects.find((x) => x.project_id == project.project_id)?.price || 0
			});
		}
	}

	vaults.push(
		{
			daoData: {
				name: 'Flow Token',
				logoUrl: '/flow-logo.png',
				tokenSymbol: 'FLOW'
			},
			balance: balances['Flow'],
			tokenValue: await fetchFlowPrice()
		},
		{
			daoData: {
				name: 'Fiat Token',
				logoUrl: '/usdc-logo.png',
				tokenSymbol: 'USDC'
			},
			balance: balances['USDC'],
			tokenValue: 1
		},
		{
			daoData: {
				name: 'Staked Flow Token',
				logoUrl: '/stflow-logo.png',
				tokenSymbol: 'stFlow'
			},
			balance: balances['stFlow'],
			tokenValue: 0
		}
	);

	// sort daos by highest value
	vaults.sort((a, b) => {
		return b.balance * b.tokenValue - a.balance * a.tokenValue;
	});

	return vaults;
};
