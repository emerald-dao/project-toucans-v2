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

fcl.events(`${eventIdentifierPrefix}ProjectCreated`).subscribe((event) => {
  const { tokenType, projectId, contractName, ...rest } = event;
  appendAction(projectId, contractName, rest, 'ProjectCreated');
});

fcl.events(`${eventIdentifierPrefix}NewFundingCycle`).subscribe((event) => {
  const { tokenType, projectId, contractName, ...rest } = event;
  appendAction(projectId, contractName, rest, 'NewFundingCycle');
});

fcl.events(`${eventIdentifierPrefix}Purchase`).subscribe((event) => {
  const { tokenType, projectId, contractName, ...rest } = event;
  appendAction(projectId, contractName, rest, 'Purchase');
});

fcl.events(`${eventIdentifierPrefix}Distribute`).subscribe((event) => {
  const { tokenType, projectId, contractName, ...rest } = event;
  appendAction(projectId, contractName, rest, 'Distribute');
});

fcl.events(`${eventIdentifierPrefix}Donate`).subscribe((event) => {
  const { tokenType, projectId, contractName, ...rest } = event;
  appendAction(projectId, contractName, rest, 'Donate');
});

fcl.events(`${eventIdentifierPrefix}Withdraw`).subscribe((event) => {
  const { tokenType, projectId, contractName, ...rest } = event;
  appendAction(projectId, contractName, rest, 'Withdraw');
});

async function appendAction(projectId, contractName, eventData, type) {
  console.log(type + ' Action: ', eventData);
  const result = await supabase.rpc('append_action', {
    _project_id: projectId,
    _contract_name: contractName,
    _action: {
      ...eventData,
      type,
      timestamp: Date.now() / 1000, // seconds
    },
  });
  if (result.error) {
    console.log('Result Error:', result);
  }
}
