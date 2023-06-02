// @ts-nocheck
import { fetchAllFundEventsInTimeframe } from "./supabase/fetchAllFundEventsInTimeframe";
import express from "express";
import { DaoRankingData } from "./types/dao-ranking.interface";
import { getTrendingData } from "./flow/actions";
import { supabase } from "./supabaseClient";

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => console.log(`Listening on port ${port}`));

function lessThanTimeAgo(date: Date, time: number) {
  const timeAgo = Date.now() - time;

  return date > timeAgo;
}

async function gatherTrendingProjects() {
  // 1. Get all fund events in last 30 days

  const NUMBER_OF_PROJECTS_TO_SHOW = 3;
  const ONE_HOUR = 60 * 60 * 1000; /* ms */
  const ONE_DAY = 24 * ONE_HOUR; /* ms */
  const ONE_WEEK = 7 * ONE_DAY; /* ms */
  const WEEK_AGO = new Date(new Date().setDate((new Date()).getDate() - 7));
  const events = (await fetchAllFundEventsInTimeframe(WEEK_AGO));

  // 2a. Go through all of them and decide which ones had the highest number of fund events
  // 2b. While looping through, keep track of their hourly, daily, and weekly amounts
  // 2c. Also store their other data
  const projects: { [projectId: string]: DaoRankingData } = {}
  const addressList = {}
  for (const event of events) {
    if (!projects[event.project_id]) {
      projects[event.project_id] = {
        project_id: event.project_id,
        number: 0,
        price: 0,
        hour: 0,
        day: 0,
        week: 0,
        circulating_supply: 0,
        payment_currency: '',
        // chart data
        numbers: []
      }
      addressList[event.project_id] = event.projects.contract_address;
    }
    if (lessThanTimeAgo(new Date(event.timestamp), ONE_HOUR)) {
      projects[event.project_id].hour = (projects[event.project_id].hour) + Number(event.data.amount)
      projects[event.project_id].day = (projects[event.project_id].day) + Number(event.data.amount)
    } else if (lessThanTimeAgo(new Date(event.timestamp), ONE_DAY)) {
      projects[event.project_id].day = (projects[event.project_id].day) + Number(event.data.amount)
    }
    const addedTotal = (projects[event.project_id].week) + Number(event.data.amount)
    projects[event.project_id].numbers.push(addedTotal)
    projects[event.project_id].week = addedTotal
  }

  // 3. Select the top NUMBER_OF_PROJECTS_TO_SHOW from step 2a and sort
  const sort = Object.entries(projects).sort(([, a], [, b]) => b.week - a.week).slice(0, NUMBER_OF_PROJECTS_TO_SHOW);
  for (var i = 0; i < sort.length; i++) {
    sort[i][1].number = i;
  }

  const sortable = Object.fromEntries(sort);

  // 4. Fetch blockchain info about top NUMBER_OF_PROJECTS_TO_SHOW and store them
  const projectIds = Object.keys(sortable);
  const projectAddresses = [];
  for (const projectId of projectIds) {
    projectAddresses.push(addressList[projectId]);
  }
  const projectBlockchainData = await getTrendingData(projectIds, projectAddresses)
  for (const projectId in projectBlockchainData) {
    sortable[projectId].circulating_supply = projectBlockchainData[projectId].totalSupply;
    sortable[projectId].price = projectBlockchainData[projectId].currentPrice;
    sortable[projectId].payment_currency = projectBlockchainData[projectId].paymentCurrency;
  }

  // 5. return
  const { error } = await supabase.from('rankings').insert(Object.values(sortable));
  console.log('Error inserting rankings', error);
}

// gatherTrendingProjects();

// const eventIdentifierPrefix = `A.${process.env.TOUCANS_CONTRACT_ADDRESS.slice(2)}.Toucans.`;

// fcl.events(`${eventIdentifierPrefix}NewFundingCycle`).subscribe((event) => {
//   const { projectId, ...rest } = event;
//   appendAction(projectId, rest, 'NewFundingCycle');
// });

// fcl.events(`${eventIdentifierPrefix}Purchase`).subscribe((event) => {
//   const { projectId, ...rest } = event;
//   appendAction(projectId, rest, 'Purchase');
// });

// fcl.events(`${eventIdentifierPrefix}Mint`).subscribe((event) => {
//   const { projectId, ...rest } = event;
//   appendAction(projectId, rest, 'Mint');
// });

// fcl.events(`${eventIdentifierPrefix}BatchMint`).subscribe((event) => {
//   const { projectId, amounts, ...rest } = event;
//   appendAction(projectId, rest, 'BatchMint');
// });

// fcl.events(`${eventIdentifierPrefix}Donate`).subscribe((event) => {
//   const { projectId, ...rest } = event;
//   appendAction(projectId, rest, 'Donate');
// });

// fcl.events(`${eventIdentifierPrefix}Withdraw`).subscribe((event) => {
//   const { projectId, ...rest } = event;
//   appendAction(projectId, rest, 'Withdraw');
// });

// fcl.events(`${eventIdentifierPrefix}BatchWithdraw`).subscribe((event) => {
//   const { projectId, amounts, ...rest } = event;
//   appendAction(projectId, rest, 'BatchWithdraw');
// });

// fcl.events(`${eventIdentifierPrefix}UpdateThreshold`).subscribe((event) => {
//   const { projectId, ...rest } = event;

//   appendAction(projectId, rest, 'UpdateThreshold');
// });

// fcl.events(`${eventIdentifierPrefix}AddSigner`).subscribe(async (event) => {
//   const { projectId, signer } = event;

//   appendAction(projectId, { signer }, 'AddSigner')
// });

// fcl.events(`${eventIdentifierPrefix}RemoveSigner`).subscribe((event) => {
//   const { projectId, signer } = event;

//   appendAction(projectId, { signer }, 'RemoveSigner')
// });

// async function appendAction(projectId, data, type) {
//   console.log(type + ' Action: ', data);
//   const result = await supabase.from('events').insert({
//     project_id: projectId,
//     type,
//     data
//   });
//   if (result.error) {
//     console.log('Result Error:', result);
//   }
// }