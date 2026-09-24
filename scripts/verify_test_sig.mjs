import crypto from 'crypto';

const secret = 'f58033717afdddf177a4665f925019dc0193ac0eccf46f380e3ae8e178e62360';

const sampleEvent = {
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_test_dup_check",
        order_id: "order_test_dup_check",
        status: "captured",
        amount: 50000,
        currency: "INR",
      },
    },
  },
  created_at: 1700000000,
};

const rawBody = JSON.stringify(sampleEvent);
console.log('Raw body:', rawBody);
console.log('Body length:', rawBody.length);

const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
console.log('Signature:', signature);
console.log('Signature length:', signature.length);