import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';
import { getAllToucansProjects } from '$lib/utilities/api/supabase/getAllToucansProjects';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  const allProjects = await getAllToucansProjects();
  const rankings = (await fetchDaoRankings()).map(ranking => {
    const { projects, ...rest } = ranking;
    return { ...rest, ...projects }
  });

  const daoRankings = rankings.sort((a, b) => b.total_funding - a.total_funding);
  const tokenRankings = rankings.filter(x => x.price).sort((a, b) => b.price - a.price);

  return {
    allProjects,
    daoRankings,
    tokenRankings
  };
};