
import 'dotenv/config'
import { fetchAllFundEventsInTimeframe } from "./supabase/fetchAllFundEventsInTimeframe";
import express from "express";
import { DaoRankingData } from "./types/dao-ranking.interface";
import { calcTokenPrice, getTrendingDatav2 } from "./flow/actions";
import { supabase } from "./supabaseClient";
import { fetchFlowPrice } from "./functions/fetchFlowPrice";
import { fetchAllProjects } from "./supabase/fetchAllProjects";
import { network } from "./flow/config";
import { roundToUSDPrice } from './flow/utils';
import { fetchAllProposals } from './supabase/fetchAllProposals';
import { fetchTokenInfo } from './functions/fetchTokenInfo';
import cron from "node-cron";

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
  const fundEvents = (await fetchAllFundEventsInTimeframe(WEEK_AGO));
  const proposalEvents = (await fetchAllProposals());
  const allProjects = await fetchAllProjects();
  // project_id => { contract_address, owner, token_symbol }
  const addressList = {}
  const projects: { [projectId: string]: DaoRankingData } = {}
  for (const { project_id, contract_address, token_symbol, owner } of allProjects) {
    const { tokenInfo } = await fetchTokenInfo(project_id, contract_address);
    projects[project_id] = {
      project_id,
      week_funding: 0,
      total_funding: 0,
      total_supply: null,
      payment_currency: '',
      num_holders: 0,
      max_supply: null,
      num_proposals: 0,
      num_participants: 0,
      // price stuff
      price: null,
      treasury_value: null,
      volume_24h: tokenInfo && tokenInfo[2] || null,
      tvl: tokenInfo && tokenInfo[1] || null,
      // chart data
      numbers: []
    }
    if (contract_address && token_symbol) {
      addressList[project_id] = { owner, contract_address, token_symbol };
    } else {
      addressList[project_id] = { owner }
    }
  }

  const projectIds = Object.keys(projects);
  const projectAddresses = [];
  const projectOwners = [];
  for (const projectId of projectIds) {
    projectAddresses.push(addressList[projectId].contract_address);
    projectOwners.push(addressList[projectId].owner)
  }
  let projectBlockchainData = {};
  const CHUNK_SIZE = 5;
  for (var i = 0; i < projectIds.length; i += CHUNK_SIZE) {
    const x = await getTrendingDatav2(projectIds.slice(i, i + CHUNK_SIZE), projectAddresses.slice(i, i + CHUNK_SIZE), projectOwners.slice(i, i + CHUNK_SIZE));
    projectBlockchainData = { ...projectBlockchainData, ...x }
  }
  if (!projectBlockchainData) {
    console.log('Invalid blockchain data.')
    return null;
  }

  for (const event of fundEvents) {
    if (event.data.tokenSymbol === projectBlockchainData[event.project_id].paymentCurrency) {
      const addedTotal = (projects[event.project_id].week_funding) + Number(event.data.amount)
      projects[event.project_id].numbers.push(addedTotal);
      projects[event.project_id].week_funding = addedTotal;
    }
  }

  for (const event of proposalEvents) {
    projects[event.project_id].num_proposals++;
  }

  // fetch flow price
  const flowPrice = await fetchFlowPrice();
  if (!flowPrice) {
    console.log('Invalid flow price.')
    return null;
  }
  for (const projectId in projectBlockchainData) {
    const { paymentCurrency, maxSupply, holders, funders, numProposals, totalSupply, pairInfo, treasuryBalances, totalFunding } = projectBlockchainData[projectId];
    projects[projectId].total_supply = totalSupply;
    projects[projectId].max_supply = maxSupply;
    projects[projectId].total_funding = totalFunding;
    projects[projectId].payment_currency = paymentCurrency;
    projects[projectId].num_holders = holders.length;
    projects[projectId].num_participants = holders.concat(funders.filter((item) => holders.indexOf(item) < 0)).length;
    projects[projectId].num_proposals += Number(numProposals);
    // if there is a price
    if (pairInfo) {
      projects[projectId].price = roundToUSDPrice(calcTokenPrice[paymentCurrency](pairInfo));
    }

    if (paymentCurrency === 'FLOW') {
      projects[projectId].total_funding = roundToUSDPrice(projects[projectId].total_funding * flowPrice);
      projects[projectId].week_funding = roundToUSDPrice(projects[projectId].week_funding * flowPrice);
      if (projects[projectId].price) {
        projects[projectId].price = roundToUSDPrice(projects[projectId].price * flowPrice);
      }
    }

    // figure out treasury balance
    let mainBalances = Number(treasuryBalances["USDC"]) + Number((treasuryBalances["FLOW"]) * flowPrice);
    if (projects[projectId].price) {
      mainBalances += Number(treasuryBalances[tokenSymbolList[projectId]]) * projects[projectId].price;
    }
    projects[projectId].treasury_value = Math.round(mainBalances * 100) / 100;
  }

  // 4. return
  const { error } = await supabase.from('rankings').upsert(Object.values(projects), { ignoreDuplicates: false, onConflict: 'project_id' });
  console.log('Error inserting rankings', error);
}

gatherTrendingProjects();
// cron.schedule('*/30 * * * *', () => {
//   gatherTrendingProjects();
//   console.log('executing ranking task');
// });

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