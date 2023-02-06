const fcl = require("@onflow/fcl");
const express = require('express');
const { supabase } = require('./supabaseClient');
require("./flow/config.js");

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => console.log(`Listening on port ${port}`));

const eventIdentifierPrefix = `A.${process.env.TOUCANS_CONTRACT_ADDRESS.slice(2)}.Toucans.`

fcl.events(`${eventIdentifierPrefix}Purchase`).subscribe((event) => {
    const { tokenType, projectId, ...rest } = event;
    appendAction(projectId, rest, 'Purchase')
})

fcl.events(`${eventIdentifierPrefix}NewFundingCycle`).subscribe((event) => {
    const { tokenType, projectId, ...rest } = event;
    appendAction(projectId, rest, 'NewFundingCycle')
})

fcl.events(`${eventIdentifierPrefix}Distribute`).subscribe((event) => {
    const { tokenType, projectId, ...rest } = event;
    appendAction(projectId, rest, 'Distribute')
})

fcl.events(`${eventIdentifierPrefix}Donate`).subscribe((event) => {
    const { tokenType, projectId, ...rest } = event;
    appendAction(projectId, rest, 'Donate')
})

fcl.events(`${eventIdentifierPrefix}Withdraw`).subscribe((event) => {
    const { tokenType, projectId, ...rest } = event;
    appendAction(projectId, rest, 'Withdraw')
})

async function appendAction(projectId, eventData, type) {
    console.log(type + ' Action: ', eventData)
    const result = await supabase.rpc('append_action', {
        _project_id: projectId,
        _action: {
            ...eventData,
            type,
            timestamp: Date.now() / 1000 // seconds
        }
    });
    console.log(result);
}