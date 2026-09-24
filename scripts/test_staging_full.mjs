import { loadStagingEnv } from './lib/loadStagingEnv.mjs';

const env = await loadStagingEnv();

const supabaseUrl = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

async function test() {
  // Test 1: REST API query (published products)
  const pRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,selling_price,status&limit=5`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const pData = await pRes.json();
  console.log(`REST Products: Status ${pRes.status} (count: ${pData.length})`);

  // Test 2: REST API query (collections)
  const cRes = await fetch(`${supabaseUrl}/rest/v1/collections?select=id,name,slug`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const cData = await cRes.json();
  console.log(`REST Collections: Status ${cRes.status} (count: ${cData.length})`);

  // Test 3: Edge Function razorpay-webhook missing signature (fail-closed)
  const wRes = await fetch(`${supabaseUrl}/functions/v1/razorpay-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test: true })
  });
  const wBody = await wRes.text();
  console.log(`Edge Function razorpay-webhook (missing sig): Status ${wRes.status} (body: ${wBody.trim()})`);

  // Test 4: Edge Function razorpay-webhook invalid signature (fail-closed)
  const wRes2 = await fetch(`${supabaseUrl}/functions/v1/razorpay-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': 'invalid_signature_hex_12345'
    },
    body: JSON.stringify({ test: true })
  });
  const wBody2 = await wRes2.text();
  console.log(`Edge Function razorpay-webhook (invalid sig): Status ${wRes2.status} (body: ${wBody2.trim()})`);

  // Test 5: Edge Function create-razorpay-order without body
  const cOrderRes = await fetch(`${supabaseUrl}/functions/v1/create-razorpay-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`
    },
    body: JSON.stringify({})
  });
  const cOrderBody = await cOrderRes.text();
  console.log(`Edge Function create-razorpay-order (empty body): Status ${cOrderRes.status} (body: ${cOrderBody.trim()})`);

  // Test 6: Frontend reachability
  const frontendRes = await fetch(env.FRONTEND_URL);
  console.log(`Frontend (${env.FRONTEND_URL}): Status ${frontendRes.status}`);
}

test().catch(console.error);