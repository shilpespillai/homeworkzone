import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId, resume } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    let subscription;
    if (resume) {
      // Resume the subscription
      subscription = await stripe.subscriptions.update(
        subscriptionId,
        { cancel_at_period_end: false }
      );
    } else {
      // Cancel at period end
      subscription = await stripe.subscriptions.update(
        subscriptionId,
        { cancel_at_period_end: true }
      );
    }

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error('Subscription Action Error:', error);
    res.status(500).json({ error: 'Failed to process subscription action' });
  }
}
