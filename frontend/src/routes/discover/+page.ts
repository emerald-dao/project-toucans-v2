import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';
import { getAllToucansProjects } from '$lib/utilities/api/supabase/getAllToucansProjects';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async () => {
	const allProjects = await getAllToucansProjects();
	const rankings = await fetchDaoRankings();

	const daoRankings = rankings.sort((a, b) => b.treasury_value - a.treasury_value);
	const tokenRankings = rankings.filter((x) => x.price).sort((a, b) => b.price - a.price);

	return {
		allProjects,
		daoRankings,
		tokenRankings
	};
};
