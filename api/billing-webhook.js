import Stripe from 'stripe';
import admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Firebase Admin Init ───────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Map stripe lookup key back to planId
function getPlanIdFromLookupKey(lookupKey) {
  const map = {
    'hz_option_a_monthly': 'option-a',
    'hz_option_b_starter_monthly': 'option-b-starter',
    'hz_option_b_growth_monthly': 'option-b-growth',
    'hz_option_b_school_monthly': 'option-b-school',
    'hz_option_c_yearly': 'option-c',
  };
  return map[lookupKey] || 'free';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('[Billing Webhook] Verified! Event Type:', event.type);
  } catch (err) {
    console.error('[Billing Webhook Signature Error]:', err.message);
    return res.status(400).json({ error: `Signature verification failed: ${err.message}` });
  }

  try {
    // ─── Event Handling ──────────────────────────────────────────────────────
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { teacherId, planId } = session.metadata || {};
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      if (teacherId && subscriptionId) {
        console.log(`[Billing Webhook] Checkout completed for teacher: ${teacherId}, Sub: ${subscriptionId}`);

        // Fetch the full subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const item = subscription.items.data[0];
        const lookupKey = item?.price?.lookup_key || '';
        const resolvedPlanId = planId || getPlanIdFromLookupKey(lookupKey);
        const quantity = item?.quantity || 1;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        const billingData = {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          planId: resolvedPlanId,
          status: subscription.status,
          quantity,
          currentPeriodEnd,
          updatedAt: new Date().toISOString(),
        };

        // Write directly to teacher's billing document
        await db.collection('teachers').doc(teacherId).set({
          billing: billingData
        }, { merge: true });

        console.log(`[Billing Webhook] Firestore updated for teacher: ${teacherId} with plan: ${resolvedPlanId}`);
      }
    }

    else if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const subscriptionId = subscription.id;

      // Find the teacher by stripeCustomerId in Firestore
      const teachersRef = db.collection('teachers');
      const snapshot = await teachersRef.where('billing.stripeCustomerId', '==', customerId).limit(1).get();

      if (!snapshot.empty) {
        const teacherDoc = snapshot.docs[0];
        const teacherId = teacherDoc.id;

        const item = subscription.items.data[0];
        const lookupKey = item?.price?.lookup_key || '';
        const planId = getPlanIdFromLookupKey(lookupKey);
        const quantity = item?.quantity || 1;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        let billingData;
        if (event.type === 'customer.subscription.deleted' || subscription.status === 'canceled') {
          billingData = {
            stripeCustomerId: customerId,
            stripeSubscriptionId: '',
            planId: 'free',
            status: 'canceled',
            quantity: 0,
            currentPeriodEnd: '',
            updatedAt: new Date().toISOString(),
          };
        } else {
          billingData = {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            planId,
            status: subscription.status,
            quantity,
            currentPeriodEnd,
            updatedAt: new Date().toISOString(),
          };
        }

        await db.collection('teachers').doc(teacherId).set({
          billing: billingData
        }, { merge: true });

        console.log(`[Billing Webhook] Firestore updated subscription for teacher: ${teacherId} (event: ${event.type})`);
      } else {
        console.warn(`[Billing Webhook] No teacher found with stripeCustomerId: ${customerId}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Billing Webhook Process Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
