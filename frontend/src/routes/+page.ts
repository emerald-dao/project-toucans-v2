import type { PageLoad } from './$types';
import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';
import { fetchAllToucansProjects } from '$lib/utilities/api/supabase/fetchAllToucansProjects';

export const load: PageLoad = async ({ params }) => {
  return {
    allProjects: await fetchAllToucansProjects(),
    projects: await fetchDaoRankings()
  };
};
