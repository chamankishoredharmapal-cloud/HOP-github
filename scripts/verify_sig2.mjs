import crypto from 'crypto';

// The secret is a hex string, decode it to bytes for HMAC
const secretHex = 'f58033717afdddf177a4665f925019dc0193ac0eccf46f380e3ae8e178e62360';
const secretBytes = Buffer.from(secretHex, 'hex');
console.log('Secret bytes length:', secretBytes.length);

const body = '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test123","order_id":"order_test123","status":"captured","amount":20000,"currency":"INR"}}}}';
console.log('Body length:', body.length);

// Use secret as raw bytes (hex decoded)
const sig1 = crypto.createHmac('sha256', secretBytes).update(body).digest('hex');
console.log('Signature (hex-decoded secret):', sig1);

// Use secret as UTF-8 string (what we did before)
const sig2 = crypto.createHmac('sha256', secretHex).update(body).digest('hex');
console.log('Signature (UTF-8 secret):', sig2);