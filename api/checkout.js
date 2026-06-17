import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { 
      email, 
      studentName, 
      teacherName, 
      classroomName, 
      amount, 
      description,
      successUrl, 
      cancelUrl 
    } = req.body;

    if (!email || !amount || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get or create Stripe customer linked to this email
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0] || await stripe.customers.create({ 
      email,
      name: studentName || email,
      metadata: { studentName, teacherName, classroomName }
    });

    const productName = description || `HomeworkZone Tuition — ${classroomName || 'Student Payment'}`;
    const productDesc = teacherName 
      ? `Tuition payment for ${studentName || 'Student'} — Teacher: ${teacherName}`
      : `Tuition payment for ${studentName || 'Student'}`;

    // Create a one-time checkout session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: productDesc,
          },
          unit_amount: Math.round(amount * 100), // Convert dollars to cents
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { 
        studentName, 
        email, 
        teacherName, 
        classroomName 
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[Checkout Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
