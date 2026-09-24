import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  const content = await fs.readFile(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
      env[key] = value;
    }
  }
  return env;
}

async function run() {
  const env = await loadEnv();
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  console.log(`Testing Staging Connectivity: ${supabaseUrl}`);

  // Test 1: REST API query (published products)
  const pRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,selling_price,status&limit=5`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log(`REST Products: Status ${pRes.status} (count: ${(await pRes.json()).length})`);

  // Test 2: REST API query (collections)
  const cRes = await fetch(`${supabaseUrl}/rest/v1/collections?select=id,name,slug`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log(`REST Collections: Status ${cRes.status} (count: ${(await cRes.json()).length})`);

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

  // Test 5: Edge Function verify-payment missing fields
  const vRes = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const vBody = await vRes.text();
  console.log(`Edge Function verify-payment (missing fields): Status ${vRes.status} (body: ${vBody.trim()})`);

  // Test 6: Edge Function verify-payment invalid signature
  const vRes2 = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: 'order_test_123',
      razorpay_payment_id: 'pay_test_123',
      razorpay_signature: 'fake_signature'
    })
  });
  const vBody2 = await vRes2.text();
  console.log(`Edge Function verify-payment (invalid sig): Status ${vRes2.status} (body: ${vBody2.trim()})`);
}

run().catch(console.error);
