import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId, resume, email } = req.body;

    if (!subscriptionId && !email) {
      return res.status(400).json({ error: 'Subscription ID or Email is required' });
    }

    let subId = subscriptionId;

    if (!subId && email) {
      // Fallback: lookup subscription by email
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        const subscriptions = await stripe.subscriptions.list({
          customer: customers.data[0].id,
          status: 'active',
          limit: 1
        });
        if (subscriptions.data.length > 0) {
          subId = subscriptions.data[0].id;
        } else {
           const trialing = await stripe.subscriptions.list({
              customer: customers.data[0].id,
              status: 'trialing',
              limit: 1
           });
           if (trialing.data.length > 0) subId = trialing.data[0].id;
        }
      }
    }

    if (!subId) {
      return res.status(404).json({ error: 'No active Stripe subscription found for this account. If you are on a simulated plan or manual override, cancellation does not apply.' });
    }

    let subscription;
    if (resume) {
      // Resume the subscription
      subscription = await stripe.subscriptions.update(
        subId,
        { cancel_at_period_end: false }
      );
    } else {
      // Cancel at period end
      subscription = await stripe.subscriptions.update(
        subId,
        { cancel_at_period_end: true }
      );
    }

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error('Subscription Action Error:', error);
    res.status(500).json({ error: 'Failed to process subscription action' });
  }
}
