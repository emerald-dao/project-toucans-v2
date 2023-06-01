import type { PageLoad } from './$types';
import { getAllToucansProjects } from '$lib/utilities/api/supabase/getAllToucansProjects';
import { json } from '@sveltejs/kit';
import { fetchAllFundEventsInTimeframe } from '$lib/utilities/api/supabase/fetchAllFundEventsInTimeframe';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
import type { DonateEvent } from '$lib/types/dao-project/dao-event/events/donate.interface';
import type { PurchaseEvent } from '$lib/types/dao-project/dao-event/events/purchase.interface';
import { fetchProjects } from '$lib/utilities/api/supabase/fetchProjects';
import { getTrendingData } from '$flow/actions';
import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
import type { ECurrencies } from '$lib/types/common/enums';

export const ssr = false;

interface TrendingProject {
  logo: string;
  name: string;
  hour: number;
  day: number;
  week: number;
  circulatingSupply: number;
  paymentCurrency: ECurrencies;
  currentPrice: string | null;
}

export const load: PageLoad = async ({ params }) => {
  const allProjects = await getAllToucansProjects();
  var sevenDaysAgo = new Date(new Date().setDate((new Date()).getDate() - 7));
  const sortedEvents: (DonateEvent | PurchaseEvent)[] = (await fetchAllFundEventsInTimeframe(sevenDaysAgo));
  console.log(sortedEvents);
  var ONE_HOUR = 60 * 60 * 1000; /* ms */
  var TWENTY_FOUR_HOURS = 24 * ONE_HOUR; /* ms */
  var ONE_WEEK = 7 * TWENTY_FOUR_HOURS; /* ms */
  const projects: { [projectId: string]: TrendingProject } = {}
  for (const event of sortedEvents) {
    if (!projects[event.project_id]) {
      projects[event.project_id] = {
        logo: '',
        name: '',
        hour: 0,
        day: 0,
        week: 0,
        circulatingSupply: 0
      }
    }
    if (lessThanTimeAgo(new Date(event.timestamp), ONE_HOUR)) {
      projects[event.project_id].hour = (projects[event.project_id].hour) + Number(event.data.amount)
      projects[event.project_id].day = (projects[event.project_id].day) + Number(event.data.amount)
      projects[event.project_id].week = (projects[event.project_id].week) + Number(event.data.amount)
    } else if (lessThanTimeAgo(new Date(event.timestamp), TWENTY_FOUR_HOURS)) {
      projects[event.project_id].day = (projects[event.project_id].day) + Number(event.data.amount)
      projects[event.project_id].week = (projects[event.project_id].week) + Number(event.data.amount)
    } else if (lessThanTimeAgo(new Date(event.timestamp), ONE_WEEK)) {
      projects[event.project_id].week = (projects[event.project_id].week) + Number(event.data.amount)
    }
  }

  const addressList = {}
  const trendingProjectIds = Object.entries(projects).sort((a, b) => a[1].week < b[1].week ? 1 : a[1].week > b[1].week ? -1 : 0).slice(0, 6).map(x => x[0]);
  const trendingProjectData: DaoDatabaseData[] = await fetchProjects(trendingProjectIds);
  for (const projectData of trendingProjectData) {
    projects[projectData.project_id].logo = projectData.logo;
    projects[projectData.project_id].name = projectData.name;
    addressList[projectData.project_id] = projectData.contract_address;
  }
  const trendingProjectAddresses = trendingProjectIds.map(x => addressList[x]);
  console.log(trendingProjectIds, trendingProjectAddresses)
  const trendingProjectBlockchainData = await getTrendingData(trendingProjectIds, trendingProjectAddresses)

  for (const blockchainData in trendingProjectBlockchainData) {
    projects[blockchainData].circulatingSupply = trendingProjectBlockchainData[blockchainData].totalSupply;
    projects[blockchainData].currentPrice = trendingProjectBlockchainData[blockchainData].currentPrice;
    projects[blockchainData].paymentCurrency = trendingProjectBlockchainData[blockchainData].paymentCurrency;
  }
  console.log(projects)
  return {
    allProjects,
    trendingProjects: projects
  };
};

function lessThanTimeAgo(date: Date, time: number) {
  const timeAgo = Date.now() - time;

  return date > timeAgo;
}