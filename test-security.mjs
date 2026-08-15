import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kbvjmcnaaogkbnerjcoc.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_cSiBaTaktDyF3fyWrpj7LA_d3ToDWC5';

async function run() {
  console.log("=== RUNNING PHASE 2 ATTACK MATRIX ===");
  
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const customerA = { email: `a_${Date.now()}@gmail.com`, password: 'Password123!', id: null, session: null };
  const customerB = { email: `b_${Date.now()}@gmail.com`, password: 'Password123!', id: null, session: null };
  
  // Create Customer A
  const { data: dataA, error: errA } = await anonClient.auth.signUp({
    email: customerA.email, password: customerA.password, options: { data: { full_name: 'Customer A' } }
  });
  if (errA || !dataA.session) {
    console.error("Failed to create Customer A or email confirmation required:", errA?.message || "No session returned.");
    return;
  }
  customerA.session = dataA.session;
  customerA.id = dataA.user.id;
  const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: `Bearer ${customerA.session.access_token}` } } });
  
  // Create Customer B
  const { data: dataB, error: errB } = await anonClient.auth.signUp({
    email: customerB.email, password: customerB.password, options: { data: { full_name: 'Customer B' } }
  });
  customerB.session = dataB.session;
  customerB.id = dataB.user.id;
  const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: `Bearer ${customerB.session.access_token}` } } });

  console.log(`Setup complete: A (${customerA.id}), B (${customerB.id})`);
  
  // Ensure profiles/customers exist. Some RLS requires customers table entries.
  await clientA.from('customers').insert({ id: customerA.id, email: customerA.email, full_name: 'Customer A' });
  await clientB.from('customers').insert({ id: customerB.id, email: customerB.email, full_name: 'Customer B' });
  
  // CASE A: Customer A attempts to read Customer B profile (customers table)
  console.log("\n--- CASE A ---");
  const { data: caseA_read, error: caseA_err } = await clientA.from('customers').select('*').eq('id', customerB.id);
  console.log("Customer A fetching Customer B's row:", caseA_read, caseA_err?.message);
  
  // CASE B: Customer A attempts to read Customer B order
  console.log("\n--- CASE B ---");
  const { data: caseB_read, error: caseB_err } = await clientA.from('orders').select('*').eq('customer_id', customerB.id);
  console.log("Customer A fetching Customer B's orders:", caseB_read, caseB_err?.message);
  
  // CASE C: Customer A attempts to modify Customer B address
  console.log("\n--- CASE C ---");
  const { data: caseC_read, error: caseC_err } = await clientA.from('addresses').update({ line1: 'Hacked' }).eq('customer_id', customerB.id);
  console.log("Customer A updating Customer B's address:", caseC_read, caseC_err?.message);

  // CASE E: Anonymous caller invokes authenticated endpoint (e.g. read orders)
  console.log("\n--- CASE E ---");
  const { data: caseE_read, error: caseE_err } = await anonClient.from('orders').select('*');
  console.log("Anon fetching orders:", caseE_read, caseE_err?.message);
  
  // CASE F: Authenticated non-admin invokes admin endpoint (Edge Function release-inventory)
  console.log("\n--- CASE F/H ---");
  const { data: caseF_data, error: caseF_err } = await clientA.functions.invoke('release-inventory', {
    body: { order_id: crypto.randomUUID() }
  });
  console.log("Customer A invoking release-inventory:", caseF_data, caseF_err?.message);

  // CASE K: Expired JWT
  console.log("\n--- CASE K ---");
  const clientExpired = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.signature` } } });
  const { data: caseK_data, error: caseK_err } = await clientExpired.from('customers').select('*');
  console.log("Expired JWT fetching customers:", caseK_data, caseK_err?.message);
  
}

run().catch(console.error);
