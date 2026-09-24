#!/usr/bin/env node

import { loadStagingEnv, getStagingEnvSummary, assertNoProductionIdentifiers, validateCriticalSecrets } from './lib/loadStagingEnv.mjs';

async function run() {
  console.log('=== HOP Staging Environment Verification ===\n');

  let env;
  try {
    env = await loadStagingEnv();
    console.log('✓ .env.staging.local loaded and parsed\n');
  } catch (e) {
    console.error('✗ FAILED:', e.message);
    process.exit(1);
  }

  try {
    assertNoProductionIdentifiers(env);
    console.log('✓ No production identifiers detected\n');
  } catch (e) {
    console.error('✗ FAILED:', e.message);
    process.exit(1);
  }

  const summary = getStagingEnvSummary(env);

  console.log('--- Variable Status ---');
  for (const [key, status] of Object.entries(summary)) {
    let icon = '✓';
    if (status === 'MISSING' || status === 'PRESENT_BUT_PLACEHOLDER' || status === 'INVALID_FORMAT') {
      icon = '✗';
    }
    console.log(`  ${icon} ${key}: ${status}`);
  }
  console.log();

  console.log('--- Critical Secret Validation ---');
  const secretResults = validateCriticalSecrets(env);

  let allPassed = true;
  for (const result of secretResults) {
    let icon = '✓';
    if (result.actionRequired) icon = '✗';
    const detail = result.formatError ? ` (${result.formatError})` : '';
    console.log(`  ${icon} ${result.key}: ${result.status}${detail}`);
    if (result.actionRequired) allPassed = false;
  }

  console.log();

  // Overall checks
  const overallChecks = [
    {
      name: 'Supabase Project Ref',
      pass: env.SUPABASE_PROJECT_REF === 'dovnhgbisiturzbjgvei',
    },
    {
      name: 'Supabase URL',
      pass: env.VITE_SUPABASE_URL === 'https://dovnhgbisiturzbjgvei.supabase.co',
    },
    {
      name: 'Razorpay Key Mode',
      pass: env.VITE_RAZORPAY_KEY_ID.startsWith('rzp_test_'),
    },
    {
      name: 'Frontend URL',
      pass: env.FRONTEND_URL === 'https://548dac25.hop-staging.pages.dev',
    },
  ];

  for (const check of overallChecks) {
    const icon = check.pass ? '✓' : '✗';
    console.log(`  ${icon} ${check.name}`);
    if (!check.pass) allPassed = false;
  }

  console.log();
  if (allPassed) {
    console.log('=== ALL CHECKS PASSED ===');
    console.log('Staging environment is valid for testing.');
  } else {
    console.log('=== CHECKS FAILED — ACTION REQUIRED ===');
    console.log('Fix the issues marked with ✗ above before running staging tests.');
    console.log('');
    console.log('Required actions:');
    for (const result of secretResults) {
      if (result.actionRequired) {
        console.log(`  - ${result.key}: ${result.status} — ${result.formatError}`);
      }
    }
    process.exit(1);
  }
}

run().catch(e => {
  console.error('Verification error:', e.message);
  process.exit(1);
});