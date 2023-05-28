import type { PageLoad } from './$types';
import { fetchProjectRecentDonateOrPurchaseEvents } from '$lib/utilities/api/supabase/fetchProjectRecentDonateOrPurchaseEvents';
import type { LeadingProjectData } from '$lib/types/dao-project/leading-project.interface';
import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';

export const load: PageLoad = async ({ params }) => {
  const projectIds = ['EmeraldCity', 'BallerzFC'];
  let projects: LeadingProjectData[] = [];

  for (const projectId of projectIds) {
    const events = await fetchProjectRecentDonateOrPurchaseEvents(projectId);
    let totalAmount = 0;
    for (const { data } of events) {
      totalAmount += Number(data.amount);
    }
    const projectData: DaoDatabaseData = events[0].projects;
    const { description, logo, name, token_symbol } = projectData;
    projects.push({
      purchases: events.length,
      description,
      logo,
      name,
      currency: token_symbol,
      projectId,
      totalAmount
    })
  }
  return {
    projects
  };
};
