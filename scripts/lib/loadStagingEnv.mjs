import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const STAGING_PROJECT_REF = 'dovnhgbisiturzbjgvei';
const PRODUCTION_PROJECT_REF = 'kbvjmcnaaogkbnerjcoc';
const STAGING_SUPABASE_URL = 'https://dovnhgbisiturzbjgvei.supabase.co';
const STAGING_FRONTEND_URL = 'https://548dac25.hop-staging.pages.dev';

const REQUIRED_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_RAZORPAY_KEY_ID',
  'SUPABASE_PROJECT_REF',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'FRONTEND_URL',
  'RAZORPAY_WEBHOOK_URL',
  'VERIFY_PAYMENT_URL',
  'CREATE_ORDER_URL',
  'TEST_CUSTOMER_EMAIL',
  'TEST_CUSTOMER_PASSWORD',
];

const SERVER_ONLY_VARS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'TEST_CUSTOMER_PASSWORD',
];

const PLACEHOLDER_PATTERNS = [
  /placeholder/i,
  /replace_with/i,
  /your_secret/i,
  /your_key/i,
  /your_/i,
  /changeme/i,
  /example/i,
  /todo/i,
  /^$/,
];

function isPlaceholder(value) {
  if (!value || value.trim() === '') return true;
  return PLACEHOLDER_PATTERNS.some(pattern => pattern.test(value));
}

function parseEnvFile(content) {
  const env = {};
  for (const line of content.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
      env[key] = value;
    }
  }
  return env;
}

export async function loadStagingEnv() {
  const envPath = path.resolve(REPO_ROOT, '.env.staging.local');
  let content;
  try {
    content = await fs.readFile(envPath, 'utf-8');
  } catch (e) {
    throw new Error('.env.staging.local not found. Copy .env.staging.example and fill in values.');
  }

  const env = parseEnvFile(content);

  for (const key of REQUIRED_VARS) {
    if (!env[key] || env[key].trim() === '') {
      throw new Error(`Missing required staging variable: ${key}`);
    }
    if (isPlaceholder(env[key])) {
      throw new Error(`Placeholder detected for ${key}: value appears to be a template placeholder. Replace with actual staging value.`);
    }
  }

  validateStagingIdentifiers(env);

  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('VITE_') || !SERVER_ONLY_VARS.includes(key)) {
      process.env[key] = value;
    }
  }

  return env;
}

function validateStagingIdentifiers(env) {
  if (env.VITE_SUPABASE_URL !== STAGING_SUPABASE_URL) {
    throw new Error(`VITE_SUPABASE_URL must be staging URL (${STAGING_SUPABASE_URL}), got: ${env.VITE_SUPABASE_URL}`);
  }

  if (!env.VITE_RAZORPAY_KEY_ID.startsWith('rzp_test_')) {
    throw new Error(`VITE_RAZORPAY_KEY_ID must be Test Mode (rzp_test_*), got: ${env.VITE_RAZORPAY_KEY_ID}`);
  }

  if (env.RAZORPAY_KEY_ID !== env.VITE_RAZORPAY_KEY_ID) {
    throw new Error('RAZORPAY_KEY_ID must match VITE_RAZORPAY_KEY_ID');
  }

  if (env.SUPABASE_PROJECT_REF !== STAGING_PROJECT_REF) {
    throw new Error(`SUPABASE_PROJECT_REF must be ${STAGING_PROJECT_REF}, got: ${env.SUPABASE_PROJECT_REF}`);
  }

  if (env.SUPABASE_PROJECT_REF === PRODUCTION_PROJECT_REF) {
    throw new Error('Production project reference detected in staging environment');
  }

  if (env.FRONTEND_URL !== STAGING_FRONTEND_URL) {
    throw new Error(`FRONTEND_URL must be staging Cloudflare URL (${STAGING_FRONTEND_URL}), got: ${env.FRONTEND_URL}`);
  }

  const expectedWebhookUrl = `${STAGING_SUPABASE_URL}/functions/v1/razorpay-webhook`;
  if (env.RAZORPAY_WEBHOOK_URL !== expectedWebhookUrl) {
    throw new Error(`RAZORPAY_WEBHOOK_URL must be ${expectedWebhookUrl}, got: ${env.RAZORPAY_WEBHOOK_URL}`);
  }

  const expectedVerifyUrl = `${STAGING_SUPABASE_URL}/functions/v1/verify-payment`;
  if (env.VERIFY_PAYMENT_URL !== expectedVerifyUrl) {
    throw new Error(`VERIFY_PAYMENT_URL must be ${expectedVerifyUrl}, got: ${env.VERIFY_PAYMENT_URL}`);
  }

  const expectedCreateUrl = `${STAGING_SUPABASE_URL}/functions/v1/create-razorpay-order`;
  if (env.CREATE_ORDER_URL !== expectedCreateUrl) {
    throw new Error(`CREATE_ORDER_URL must be ${expectedCreateUrl}, got: ${env.CREATE_ORDER_URL}`);
  }

  if (env.RAZORPAY_WEBHOOK_SECRET.startsWith('http://') || env.RAZORPAY_WEBHOOK_SECRET.startsWith('https://')) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET must be a signing secret, not a URL');
  }

  if (env.VITE_SUPABASE_URL.includes(PRODUCTION_PROJECT_REF)) {
    throw new Error('Production Supabase URL detected in staging environment');
  }

  if (env.FRONTEND_URL.includes(PRODUCTION_PROJECT_REF)) {
    throw new Error('Production project reference detected in FRONTEND_URL');
  }
}

export function getStagingEnvSummary(env) {
  const classify = (key, value) => {
    if (!value || value.trim() === '') return 'MISSING';
    if (isPlaceholder(value)) return 'PRESENT_BUT_PLACEHOLDER';
    if (SERVER_ONLY_VARS.includes(key)) return 'PRESENT_AND_NON_PLACEHOLDER';
    if (key.includes('KEY') || key.includes('SECRET') || key.includes('PASSWORD')) return 'PRESENT_AND_NON_PLACEHOLDER';
    return value;
  };

  const summary = {};
  for (const key of [...REQUIRED_VARS, 'TEST_CUSTOMER_PASSWORD']) {
    summary[key] = classify(key, env[key]);
  }
  return summary;
}

export function assertNoProductionIdentifiers(env) {
  const productionIdentifiers = [
    PRODUCTION_PROJECT_REF,
    'rzp_live_',
  ];

  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string') {
      for (const prodId of productionIdentifiers) {
        if (value.includes(prodId)) {
          throw new Error(`Production identifier "${prodId}" found in ${key}`);
        }
      }
    }
  }
}

export function validateCriticalSecrets(env) {
  const results = [];

  const checks = [
    {
      key: 'RAZORPAY_WEBHOOK_SECRET',
      value: env.RAZORPAY_WEBHOOK_SECRET,
      required: true,
      validate: (v) => !v.startsWith('http://') && !v.startsWith('https://'),
      formatError: 'must be a signing secret (not a URL)',
    },
    {
      key: 'TEST_CUSTOMER_PASSWORD',
      value: env.TEST_CUSTOMER_PASSWORD,
      required: true,
      validate: (v) => v && v.trim() !== '' && !isPlaceholder(v),
      formatError: 'must be a non-empty, non-placeholder value',
    },
    {
      key: 'RAZORPAY_KEY_ID',
      value: env.RAZORPAY_KEY_ID,
      required: true,
      validate: (v) => v.startsWith('rzp_test_'),
      formatError: 'must be Test Mode (rzp_test_*)',
    },
    {
      key: 'RAZORPAY_KEY_SECRET',
      value: env.RAZORPAY_KEY_SECRET,
      required: true,
      validate: (v) => v && v.trim() !== '' && !isPlaceholder(v),
      formatError: 'must be a non-empty, non-placeholder value',
    },
    {
      key: 'SUPABASE_SERVICE_ROLE_KEY',
      value: env.SUPABASE_SERVICE_ROLE_KEY,
      required: true,
      validate: (v) => v && v.trim() !== '' && !isPlaceholder(v),
      formatError: 'must be a non-empty, non-placeholder value',
    },
    {
      key: 'FRONTEND_URL',
      value: env.FRONTEND_URL,
      required: true,
      validate: (v) => v === STAGING_FRONTEND_URL,
      formatError: `must be ${STAGING_FRONTEND_URL}`,
    },
    {
      key: 'CREATE_ORDER_URL',
      value: env.CREATE_ORDER_URL,
      required: true,
      validate: (v) => v === `${STAGING_SUPABASE_URL}/functions/v1/create-razorpay-order`,
      formatError: `must be ${STAGING_SUPABASE_URL}/functions/v1/create-razorpay-order`,
    },
    {
      key: 'VERIFY_PAYMENT_URL',
      value: env.VERIFY_PAYMENT_URL,
      required: true,
      validate: (v) => v === `${STAGING_SUPABASE_URL}/functions/v1/verify-payment`,
      formatError: `must be ${STAGING_SUPABASE_URL}/functions/v1/verify-payment`,
    },
    {
      key: 'RAZORPAY_WEBHOOK_URL',
      value: env.RAZORPAY_WEBHOOK_URL,
      required: true,
      validate: (v) => v === `${STAGING_SUPABASE_URL}/functions/v1/razorpay-webhook`,
      formatError: `must be ${STAGING_SUPABASE_URL}/functions/v1/razorpay-webhook`,
    },
  ];

  for (const check of checks) {
    const missing = !check.value || check.value.trim() === '';
    const placeholder = check.value && isPlaceholder(check.value);
    const formatValid = check.value && !missing && !placeholder && check.validate(check.value);

    let status, actionRequired = false;
    if (missing) {
      status = 'MISSING';
      actionRequired = true;
    } else if (placeholder) {
      status = 'PRESENT_BUT_PLACEHOLDER';
      actionRequired = true;
    } else if (!formatValid) {
      status = 'INVALID_FORMAT';
      actionRequired = true;
    } else {
      status = 'PRESENT_AND_NON_PLACEHOLDER';
    }

    results.push({
      key: check.key,
      status,
      actionRequired,
      formatError: actionRequired ? check.formatError : null,
    });
  }

  return results;
}