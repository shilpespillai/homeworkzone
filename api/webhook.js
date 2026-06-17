import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable body parsing — Stripe requires raw body for signature verification
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('[Webhook] Verified! Event Type:', event.type);
  } catch (err) {
    console.error('[Webhook Signature Error]:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { studentName, email, teacherName, classroomName } = session.metadata || {};
    const amountPaid = session.amount_total / 100; // Convert cents back to dollars

    console.log(`[Webhook] Payment success! Student: ${studentName}, Amount: $${amountPaid}`);

    // NOTE: Firestore recording happens client-side via success_url redirect
    // The client reads the session_id from the URL and can confirm payment status
    // For server-side Firestore writes, you would add Firebase Admin SDK here
    // and write to: teachers/{teacherUid}/classrooms/{classId}/students/{studentName}/payments
    
    console.log(`[Webhook] Student ${studentName} paid $${amountPaid} for ${classroomName} under teacher ${teacherName}`);
  }

  return res.status(200).json({ received: true });
}
