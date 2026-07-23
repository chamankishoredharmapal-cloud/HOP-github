#!/usr/bin/env bash
# Webhook verification tests (2.6.4) + duplicate event test (2.5.4)
#
# Usage:
#   export SUPABASE_URL="https://<project>.supabase.co"
#   export RAZORPAY_WEBHOOK_SECRET="<your-secret>"
#   bash scripts/test-webhook.sh

set -euo pipefail

SUPABASE_URL="${SUPABASE_URL:-https://kbvjmcnaaogkbnerjcoc.supabase.co}"
WEBHOOK_URL="${SUPABASE_URL}/functions/v1/razorpay-webhook"
SECRET="${RAZORPAY_WEBHOOK_SECRET:-}"

PAYLOAD='{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test_script","order_id":"order_test_script","status":"captured","amount":50000,"currency":"INR"}}},"created_at":1700000000}'

echo "=== 2.6.4: Webhook signature tests ==="
echo ""

# Test 1: Missing signature header
echo "--- Test 1: Missing signature header ---"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
echo "Status: $HTTP_CODE"
echo "Body: $BODY"
echo ""

# Test 2: Invalid signature
echo "--- Test 2: Invalid signature ---"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: this_is_invalid" \
  -d "$PAYLOAD")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | sed '$d')
echo "Status: $HTTP_CODE"
echo "Body: $BODY"
echo ""

# Tests 3-4: Valid signature and duplicate event (require secret)
if [ -n "$SECRET" ]; then
  SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

  echo "--- Test 3: Valid signature ---"
  RESP=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -H "x-razorpay-signature: $SIGNATURE" \
    -d "$PAYLOAD")
  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  echo "Status: $HTTP_CODE"
  echo "Body: $BODY"
  echo ""

  echo "--- Test 4: Duplicate event (idempotency) ---"
  RESP=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -H "x-razorpay-signature: $SIGNATURE" \
    -d "$PAYLOAD")
  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  echo "Status: $HTTP_CODE"
  echo "Body: $BODY"
  echo ""

  echo "--- Test 4 expected: status 200, body contains already_processed: true ---"
else
  echo "--- Tests 3-4 skipped: set RAZORPAY_WEBHOOK_SECRET to test valid signatures ---"
fi
