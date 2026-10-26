const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.split('\n').find(l => l.startsWith('VITE_SUPABASE_URL')).split('=')[1].trim().replace(/['"]/g, '');
const key = env.split('\n').find(l => l.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY')).split('=')[1].trim().replace(/['"]/g, '');
const { createClient } = require('@supabase/supabase-js');
const client = createClient(url, key);

async function main() {
  const { data } = await client.rpc('get_published_site_sections', { p_page: 'home' });
  console.log('Sections returned by get_published_site_sections:', Object.keys(data || {}));
}

main();
