import type { PageLoad } from './$types';
import { getAllToucansProjects } from '$lib/utilities/api/supabase/getAllToucansProjects';
import { json } from '@sveltejs/kit';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  const projects = await getAllToucansProjects();
  return {
    projects
  };
};
