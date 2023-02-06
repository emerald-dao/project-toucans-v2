require('dotenv').config();
const client = require('@supabase/supabase-js');

const supabase = client.createClient(process.env.PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

module.exports = {
    supabase
}
