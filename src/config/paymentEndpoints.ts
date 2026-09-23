const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL is not configured");
}

const normalizedBase = SUPABASE_URL.replace(/\/+$/, "");

export const CREATE_ORDER_URL = `${normalizedBase}/functions/v1/create-razorpay-order`;

export const VERIFY_PAYMENT_URL = `${normalizedBase}/functions/v1/verify-payment`;

export const RAZORPAY_WEBHOOK_URL = `${normalizedBase}/functions/v1/razorpay-webhook`;

export const CANCEL_PAYMENT_URL = `${normalizedBase}/functions/v1/cancel-payment`;

export const GET_ORDER_CONFIRMATION_URL = `${normalizedBase}/functions/v1/get-order-confirmation`;

export interface PaymentEndpointInfo {
  functionName: string;
  url: string;
  environment: "development" | "production" | "staging" | "unknown";
  supabaseProjectUrl: string;
  supabaseProjectId: string | null;
  matchesExpectedProject: boolean;
}

function extractProjectId(url: string): string | null {
  const match = url.match(/^https:\/\/([^.]+)\.supabase\.co$/);
  return match ? match[1] : null;
}

function detectEnvironment(projectId: string | null): "development" | "production" | "staging" | "unknown" {
  if (!projectId) return "unknown";
  if (projectId === "kbvjmcnaaogkbnerjcoc") return "production";
  if (projectId === "dovnhgbisiturzbjgvei") return "staging";
  return "development";
}

const expectedProjectId = extractProjectId(SUPABASE_URL);
const currentEnvironment = detectEnvironment(expectedProjectId);

export function getPaymentEndpointDiagnostics(): PaymentEndpointInfo[] {
  return [
    {
      functionName: "create-razorpay-order",
      url: CREATE_ORDER_URL,
      environment: currentEnvironment,
      supabaseProjectUrl: SUPABASE_URL,
      supabaseProjectId: expectedProjectId,
      matchesExpectedProject: true,
    },
    {
      functionName: "verify-payment",
      url: VERIFY_PAYMENT_URL,
      environment: currentEnvironment,
      supabaseProjectUrl: SUPABASE_URL,
      supabaseProjectId: expectedProjectId,
      matchesExpectedProject: true,
    },
    {
      functionName: "razorpay-webhook",
      url: RAZORPAY_WEBHOOK_URL,
      environment: currentEnvironment,
      supabaseProjectUrl: SUPABASE_URL,
      supabaseProjectId: expectedProjectId,
      matchesExpectedProject: true,
    },
    {
      functionName: "cancel-payment",
      url: CANCEL_PAYMENT_URL,
      environment: currentEnvironment,
      supabaseProjectUrl: SUPABASE_URL,
      supabaseProjectId: expectedProjectId,
      matchesExpectedProject: true,
    },
    {
      functionName: "get-order-confirmation",
      url: GET_ORDER_CONFIRMATION_URL,
      environment: currentEnvironment,
      supabaseProjectUrl: SUPABASE_URL,
      supabaseProjectId: expectedProjectId,
      matchesExpectedProject: true,
    },
  ];
}

export function logPaymentEndpoints(): void {
  if (import.meta.env.DEV) {
    console.group("[Payment Endpoints] Configured URLs");
    getPaymentEndpointDiagnostics().forEach((ep) => {
      console.log(`${ep.functionName}: ${ep.url}`);
    });
    console.log(`Environment: ${currentEnvironment}`);
    console.log(`Supabase Project: ${expectedProjectId}`);
    console.groupEnd();
  }
}