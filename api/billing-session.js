import Stripe from 'stripe';
import admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Initialize Firebase Admin
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

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      teacherId,
      email,
      planId,
      studentCount,
      successUrl,
      cancelUrl,
      action, // 'checkout' or 'portal'
      customerId // existing customer ID if any
    } = req.body;

    if (!teacherId || !email) {
      return res.status(400).json({ error: 'Missing teacherId or email' });
    }

    // ─── Stripe Customer Portal Redirect ─────────────────────────────────────
    if (action === 'portal' && customerId) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: successUrl, // Redirect back to dashboard
      });
      return res.status(200).json({ url: portalSession.url });
    }

    // ─── Stripe Checkout Session ─────────────────────────────────────────────
    if (!planId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required parameters for checkout' });
    }

    // 1. Resolve or Create Stripe Customer
    let stripeCustomerId = customerId;
    if (!stripeCustomerId) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id;
      } else {
        const newCustomer = await stripe.customers.create({
          email,
          metadata: { teacherId },
        });
        stripeCustomerId = newCustomer.id;
      }
    }

    // Handle Booster one-time checkout
    const isBooster = planId === 'booster-mini' || planId === 'booster-mega';
    if (isBooster) {
      const credits = planId === 'booster-mini' ? 15 : 50;
      const amount = planId === 'booster-mini' ? 200 : 500;
      const name = planId === 'booster-mini' ? 'HomeworkZone Mini Booster (+15 Papers)' : 'HomeworkZone Mega Booster (+50 Papers)';

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name,
                description: 'One-time paper top-up credits',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&booster_success=true&credits=${credits}`,
        cancel_url: cancelUrl,
        metadata: {
          teacherId,
          planId,
          type: 'booster',
          credits,
        },
      });

      return res.status(200).json({ url: session.url, sessionId: session.id });
    }

    // 2. Resolve Price ID based on the planId
    
    // Fetch live pricing from Firestore
    let pricing = {
      optionA_perStudentPerMonth: 5.00,
      optionB_starter_price: 50,
      optionB_growth_price: 80,
      optionB_school_price: 99,
      optionC_tier1_rate: 24,
      optionC_tier2_rate: 20,
      optionC_tier3_rate: 16,
      optionC_tier4_rate: 14,
    };
    try {
      const snap = await db.collection('system').doc('pricing').get();
      if (snap.exists) {
        pricing = { ...pricing, ...snap.data() };
      }
    } catch (err) {
      console.warn('Failed to fetch pricing from DB, using fallback defaults', err);
    }

    let lookupKey = '';
    let productDetails = {};

        switch (planId) {
      case 'option-a':
        lookupKey = 'hz_option_a_monthly_v' + Math.round(pricing.optionA_perStudentPerMonth * 100);
        productDetails = {
          name: 'HomeworkZone Monthly License (Option A)',
          billing_scheme: 'per_unit',
          unit_amount: Math.round(pricing.optionA_perStudentPerMonth * 100),
          interval: 'month',
        };
        break;
      case 'option-b-starter':
        lookupKey = 'hz_option_b_starter_monthly_v' + Math.round(pricing.optionB_starter_price * 100);
        productDetails = {
          name: 'HomeworkZone Starter Plan (Option B)',
          billing_scheme: 'per_unit',
          unit_amount: Math.round(pricing.optionB_starter_price * 100),
          interval: 'month',
        };
        break;
      case 'option-b-growth':
        lookupKey = 'hz_option_b_growth_monthly_v' + Math.round(pricing.optionB_growth_price * 100);
        productDetails = {
          name: 'HomeworkZone Growth Plan (Option B)',
          billing_scheme: 'per_unit',
          unit_amount: Math.round(pricing.optionB_growth_price * 100),
          interval: 'month',
        };
        break;
      case 'option-b-school':
        lookupKey = 'hz_option_b_school_monthly_v' + Math.round(pricing.optionB_school_price * 100);
        productDetails = {
          name: 'HomeworkZone School Plan (Option B)',
          billing_scheme: 'per_unit',
          unit_amount: Math.round(pricing.optionB_school_price * 100),
          interval: 'month',
        };
        break;
      case 'option-c':
        lookupKey = 'hz_option_c_yearly_v' + Math.round(pricing.optionC_tier1_rate * 100);
        productDetails = {
          name: 'HomeworkZone Yearly Graduated License (Option C)',
          billing_scheme: 'tiered',
          interval: 'year',
          tiers_mode: 'graduated',
          tiers: [
              { up_to: 100, unit_amount: Math.round(pricing.optionC_tier1_rate * 100) },
              { up_to: 500, unit_amount: Math.round(pricing.optionC_tier2_rate * 100) },
              { up_to: 1000, unit_amount: Math.round(pricing.optionC_tier3_rate * 100) },
              { up_to: 'inf', unit_amount: Math.round(pricing.optionC_tier4_rate * 100) },
            ]
        };
        break;
      default:
        return res.status(400).json({ error: `Invalid planId: ${planId}` });
    }

    // Look up existing price
    const existingPrices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      active: true,
      limit: 1,
    });

    let priceId = '';
    if (existingPrices.data.length > 0) {
      priceId = existingPrices.data[0].id;
    } else {
      // Create product and price dynamically
      const product = await stripe.products.create({
        name: productDetails.name,
        metadata: { planId },
      });

      const priceParams = {
        product: product.id,
        currency: 'usd',
        recurring: {
          interval: productDetails.interval,
        },
        lookup_key: lookupKey,
        transfer_lookup_key: true,
      };

      if (productDetails.billing_scheme === 'tiered') {
        priceParams.billing_scheme = 'tiered';
        priceParams.tiers_mode = productDetails.tiers_mode;
        priceParams.tiers = productDetails.tiers;
      } else {
        priceParams.billing_scheme = 'per_unit';
        priceParams.unit_amount = productDetails.unit_amount;
      }

      const newPrice = await stripe.prices.create(priceParams);
      priceId = newPrice.id;
    }

    // 3. Set up line items and seat count
    // Default to at least 1 seat, or if dynamic Option A/C, set initial quantity to studentCount (minimum 1)
    let quantity = 1;
    const isDynamic = planId === 'option-a' || planId === 'option-c';
    if (isDynamic) {
      quantity = Math.max(1, parseInt(studentCount, 10) || 1);
    }

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: isDynamic ? quantity : 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        teacherId,
        planId,
        studentCount: studentCount || 0,
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[Billing Session Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
