const fcl = require('@onflow/fcl');
const express = require('express');
const { supabase } = require('./supabaseClient');
require('./flow/config.js');

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => console.log(`Listening on port ${port}`));

const eventIdentifierPrefix = `A.${process.env.TOUCANS_CONTRACT_ADDRESS.slice(2)}.Toucans.`;
const actionIdentifierPrefix = `A.${process.env.TOUCANS_CONTRACT_ADDRESS.slice(2)}.ToucansTreasuryActions.`;

fcl.events(`${eventIdentifierPrefix}ProjectCreated`).subscribe((event) => {
  const { projectId, ...rest } = event;
  appendAction(projectId, rest, 'ProjectCreated');
});

fcl.events(`${eventIdentifierPrefix}NewFundingCycle`).subscribe((event) => {
  const { projectId, ...rest } = event;
  appendAction(projectId, rest, 'NewFundingCycle');
});

fcl.events(`${eventIdentifierPrefix}Purchase`).subscribe((event) => {
  const { projectId, ...rest } = event;
  appendAction(projectId, rest, 'Purchase');
});

fcl.events(`${eventIdentifierPrefix}Distribute`).subscribe((event) => {
  const { projectId, ...rest } = event;
  appendAction(projectId, rest, 'Distribute');
});

fcl.events(`${eventIdentifierPrefix}Donate`).subscribe((event) => {
  const { projectId, ...rest } = event;
  appendAction(projectId, rest, 'Donate');
});

fcl.events(`${eventIdentifierPrefix}Withdraw`).subscribe((event) => {
  const { projectId, ...rest } = event;
  appendAction(projectId, rest, 'Withdraw');
});

fcl.events(`${actionIdentifierPrefix}UpdatedThreshold`).subscribe((event) => {
  const { projectId, ...rest } = event;

  appendAction(projectId, rest, 'UpdatedThreshold');
});

fcl.events(`${actionIdentifierPrefix}AddedSigner`).subscribe(async (event) => {
  const { projectId, signer } = event;

  // const result = await supabase.rpc('append_signer', {
  //   _user_address: signer,
  //   _project_id: projectId
  // });
  // if (result.error) {
  //   console.log('Result Error:', result);
  // }

  appendAction(projectId, { signer }, 'AddedSigner')
});

fcl.events(`${actionIdentifierPrefix}RemovedSigner`).subscribe((event) => {
  const { projectId, signer } = event;

  appendAction(projectId, { signer }, 'RemovedSigner')
});

async function appendAction(projectId, eventData, type) {
  console.log(type + ' Action: ', eventData);
  const result = await supabase.rpc('append_action', {
    _project_id: projectId,
    _action: {
      ...eventData,
      type,
      timestamp: Date.now() / 1000, // seconds
    }
  });
  if (result.error) {
    console.log('Result Error:', result);
  }
}