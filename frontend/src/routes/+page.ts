import type { PageLoad } from './$types';
import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';

export const load: PageLoad = async ({ params }) => {
  return {
    projects: await fetchDaoRankings()
  };
};
