require('dotenv').config();

const express = require('express');
// const { supabase } = require('./utils');

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));