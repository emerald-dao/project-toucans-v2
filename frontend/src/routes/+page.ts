import type { PageLoad } from './$types';
import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';

export const load: PageLoad = async () => {
	return {
		projectsRakings: await fetchDaoRankings()
	};
};
