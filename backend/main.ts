
import 'dotenv/config'
import { fetchAllFundEventsInTimeframe } from "./supabase/fetchAllFundEventsInTimeframe";
import express from "express";
import { DaoRankingData } from "./types/dao-ranking.interface";
import { calcTokenPrice, getTrendingDatav2 } from "./flow/actions";
import { supabase } from "./supabaseClient";
import { fetchFlowPrice } from "./functions/fetchFlowPrice";
import { fetchAllProjects } from "./supabase/fetchAllProjects";
import { network } from "./flow/config";

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => console.log(`Listening on port ${port}`));

async function gatherTrendingProjects() {
  const ONE_HOUR = 60 * 60 * 1000; /* ms */
  const ONE_DAY = 24 * ONE_HOUR; /* ms */
  const ONE_WEEK = 7 * ONE_DAY; /* ms */
  const WEEK_AGO = new Date(new Date().setDate((new Date()).getDate() - 7));

  // shows activity on the platform
  const events = (await fetchAllFundEventsInTimeframe(WEEK_AGO));
  const allProjects = await fetchAllProjects();
  const addressList = {}
  const tokenSymbolList = {}
  const projects: { [projectId: string]: DaoRankingData } = {}
  for (const { project_id, contract_address, token_symbol } of allProjects) {
    projects[project_id] = {
      project_id,
      week: 0,
      circulating_supply: 0,
      payment_currency: '',
      num_holders: 0,
      num_proposals: 0,
      // price stuff
      price: null,
      treasury_value: null,
      // chart data
      numbers: []
    }
    addressList[project_id] = contract_address;
    tokenSymbolList[project_id] = token_symbol;
  }

  for (const event of events) {
    const addedTotal = (projects[event.project_id].week) + Number(event.data.amount)
    projects[event.project_id].numbers.push(addedTotal);
    projects[event.project_id].week = addedTotal;
  }

  console.log(projects)

  const projectIds = Object.keys(projects);
  const projectAddresses = [];
  for (const projectId of projectIds) {
    projectAddresses.push(addressList[projectId]);
  }
  let projectBlockchainData = {};
  const CHUNK_SIZE = 10;
  for (var i = 0; i < projectIds.length; i += CHUNK_SIZE) {
    const x = await getTrendingDatav2(projectIds.slice(i, i + CHUNK_SIZE), projectAddresses.slice(i, i + CHUNK_SIZE));
    projectBlockchainData = { ...projectBlockchainData, ...x }
  }
  if (!projectBlockchainData) {
    console.log('Invalid blockchain data.')
    return null;
  }
  // fetch flow price
  const flowPrice = await fetchFlowPrice();
  if (!flowPrice) {
    console.log('Invalid flow price.')
    return null;
  }
  for (const projectId in projectBlockchainData) {
    const paymentCurrency = projectBlockchainData[projectId].paymentCurrency;
    projects[projectId].circulating_supply = projectBlockchainData[projectId].totalSupply;
    projects[projectId].payment_currency = paymentCurrency;
    projects[projectId].num_holders = projectBlockchainData[projectId].numHolders;
    projects[projectId].num_proposals = projectBlockchainData[projectId].numProposals;
    // if there is a price
    if (projectBlockchainData[projectId].pairInfo) {
      // store the price in USD

      // gets price in payment currency
      let price = calcTokenPrice[paymentCurrency](projectBlockchainData[projectId].pairInfo);
      // converts price to USD
      if (paymentCurrency === 'FLOW') {
        price = price * flowPrice;
      }
      projects[projectId].price = Math.round(price * 100) / 100;
    }

    // figure out treasury balance
    let mainBalances = Number(projectBlockchainData[projectId].treasuryBalances["USDC"]) + Number((projectBlockchainData[projectId].treasuryBalances["FLOW"]) * flowPrice);
    if (projects[projectId].price) {
      mainBalances += Number(projectBlockchainData[projectId].treasuryBalances[tokenSymbolList[projectId]]) * projects[projectId].price;
    }
    projects[projectId].treasury_value = Math.round(mainBalances * 100) / 100;
  }
  console.log(projects)

  // 4. return
  const { error } = await supabase.from('rankings').upsert(Object.values(projects), { ignoreDuplicates: false, onConflict: 'project_id' });
  console.log('Error inserting rankings', error);
}

gatherTrendingProjects();

// getTrendingDatav2(['SloppyStakes', 'BallerzFC'], ['0x53f389d96fb4ce5e', '0x4ea047c3e73ca460']);

// fetchFlowPrice();

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