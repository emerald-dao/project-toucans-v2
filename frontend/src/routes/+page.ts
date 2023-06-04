import type { PageLoad } from './$types';
import { fetchProjectRecentDonateOrPurchaseEvents } from '$lib/utilities/api/supabase/fetchProjectRecentDonateOrPurchaseEvents';
import type { LeadingProjectData } from '$lib/types/dao-project/leading-project.interface';
import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';

export const load: PageLoad = async ({ params }) => {
  const projectIds = ['SloppyStakes', 'BallerzFC'];
  let projects: LeadingProjectData[] = [];

  for (const projectId of projectIds) {
    const { events, projectData }: { events: any[], projectData: DaoDatabaseData } = await fetchProjectRecentDonateOrPurchaseEvents(projectId);
    let totalAmount = 0;
    for (const { data } of events) {
      totalAmount += Number(data.amount);
    }
    projects.push({
      purchases: events.length,
      description: projectData.description,
      logo: projectData.logo,
      name: projectData.name,
      currency: projectData.token_symbol,
      projectId,
      totalAmount
    })
  }
  return {
    projects
  };
};
