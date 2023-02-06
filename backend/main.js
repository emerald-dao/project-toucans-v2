require('dotenv').config();

const fcl = require("@onflow/fcl");
const express = require('express');
const { supabase } = require('./supabaseClient');
// const { supabase } = require('./utils');

const accessNode = 'http://127.0.0.1:8888';
const discoveryWallet = 'http://localhost:8701/fcl/authn';
fcl.config()
    .put('accessNode.api', accessNode)
    .put('discovery.wallet', discoveryWallet)

const app = express();
const port = process.env.PORT || 5000;
console.log(port)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Listening on port ${port}`));

fcl.events('A.f8d6e0586b0a20c7.Toucans.Purchase').subscribe((event) => {
    const { tokenType, projectId, ...rest } = event;
    appendAction(projectId, rest, 'Purchase')
})

async function appendAction(projectId, eventData, type) {
    console.log(type + ' Action: ', eventData)
    const result = await supabase.rpc('append_action', {
        _project_id: projectId,
        _action: {
            ...eventData,
            type
        }
    });
    console.log(result);
}