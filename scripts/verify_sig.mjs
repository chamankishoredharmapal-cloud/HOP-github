import crypto from 'crypto';

const secret = 'f58033717afdddf177a4665f925019dc0193ac0eccf46f380e3ae8e178e62360';
const body = '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test123","order_id":"order_test123","status":"captured","amount":20000,"currency":"INR"}}}}';

console.log('Body length:', body.length);
console.log('Secret length:', secret.length);

const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');
console.log('Signature:', sig);
console.log('Sig length:', sig.length);