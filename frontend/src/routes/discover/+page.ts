import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';
import { fetchAllToucansProjects } from '$lib/utilities/api/supabase/fetchAllToucansProjects';
import type { PageLoad } from './$types';
import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';

export const ssr = false;

export const load: PageLoad = async () => {
	const allProjects = await fetchAllToucansProjects();
	const rankings = await fetchDaoRankings();

	function calculateScore(project: DaoRankingData) {
		return (project.treasury_value || 0) + 15 * project.total_funding + 10 * project.nft_count;
	}

	function calculateTokenScore(token: DaoRankingData) {
		return token.price! * token.total_supply!;
	}

	const daoRankings = rankings.sort((a, b) => calculateScore(b) - calculateScore(a));
	const tokenRankings = rankings
		.filter((x) => x.price && x.liquidity_amount && x.liquidity_amount >= 50)
		.sort((a, b) => calculateTokenScore(b) - calculateTokenScore(a));

	return {
		allProjects,
		daoRankings,
		tokenRankings
	};
};
