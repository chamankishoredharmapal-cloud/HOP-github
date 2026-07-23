# Webhook verification tests (2.6.4) + duplicate event test (2.5.4)
# Usage:
#   $env:SUPABASE_URL = "https://<project>.supabase.co"
#   $env:RAZORPAY_WEBHOOK_SECRET = "<your-secret>"
#   .\scripts\test-webhook.ps1

$SUPABASE_URL = $env:SUPABASE_URL
if (-not $SUPABASE_URL) {
    $SUPABASE_URL = "https://kbvjmcnaaogkbnerjcoc.supabase.co"
}
$WEBHOOK_URL = "$SUPABASE_URL/functions/v1/razorpay-webhook"
$SECRET = $env:RAZORPAY_WEBHOOK_SECRET

$PAYLOAD = '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test_ps","order_id":"order_test_ps","status":"captured","amount":50000,"currency":"INR"}}},"created_at":1700000000}'

Write-Host "=== 2.6.4: Webhook signature tests ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Missing signature header
Write-Host "--- Test 1: Missing signature header ---" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $WEBHOOK_URL -Method Post -Body $PAYLOAD -ContentType "application/json" -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "Body: $($reader.ReadToEnd())"
    $reader.Close()
}
Write-Host ""

# Test 2: Invalid signature
Write-Host "--- Test 2: Invalid signature ---" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $WEBHOOK_URL -Method Post -Body $PAYLOAD -ContentType "application/json" -Headers @{"x-razorpay-signature"="this_is_invalid"} -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "Body: $($reader.ReadToEnd())"
    $reader.Close()
}
Write-Host ""

# Tests 3-4: Valid signature and duplicate event (require secret)
if ($SECRET) {
    $hmacsha256 = New-Object System.Security.Cryptography.HMACSHA256
    $hmacsha256.key = [System.Text.Encoding]::UTF8.GetBytes($SECRET)
    $signatureBytes = $hmacsha256.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($PAYLOAD))
    $signature = -join ($signatureBytes | ForEach-Object { $_.ToString("x2") })

    Write-Host "--- Test 3: Valid signature ---" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $WEBHOOK_URL -Method Post -Body $PAYLOAD -ContentType "application/json" -Headers @{"x-razorpay-signature"=$signature} -ErrorAction Stop
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Body: $($response.Content)"
    } catch {
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Body: $($reader.ReadToEnd())"
        $reader.Close()
    }
    Write-Host ""

    Write-Host "--- Test 4: Duplicate event (idempotency) ---" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $WEBHOOK_URL -Method Post -Body $PAYLOAD -ContentType "application/json" -Headers @{"x-razorpay-signature"=$signature} -ErrorAction Stop
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Body: $($response.Content)"
    } catch {
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Body: $($reader.ReadToEnd())"
        $reader.Close()
    }
    Write-Host ""
    Write-Host "Test 4 expected: status 200, body contains already_processed: true" -ForegroundColor Green
} else {
    Write-Host "Tests 3-4 skipped: set RAZORPAY_WEBHOOK_SECRET to test valid signatures" -ForegroundColor Magenta
}
