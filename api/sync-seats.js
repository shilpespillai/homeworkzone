import Stripe from 'stripe';
import admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { teacherId } = req.body;
    if (!teacherId) {
      return res.status(400).json({ error: 'Missing teacherId' });
    }

    // 1. Fetch teacher doc
    const teacherDoc = await db.collection('teachers').doc(teacherId).get();
    if (!teacherDoc.exists) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const teacherData = teacherDoc.data();
    const billing = teacherData.billing || {};
    const subscriptionId = billing.stripeSubscriptionId;
    const planId = billing.planId;

    if (!subscriptionId || (planId !== 'option-a' && planId !== 'option-c')) {
      return res.status(200).json({ status: 'ignored', reason: 'Not on seat-based active billing plan' });
    }

    // 2. Count all active students in all classrooms
    const classroomsSnap = await db.collection('teachers').doc(teacherId).collection('classrooms').get();
    let totalStudents = 0;
    
    for (const classDoc of classroomsSnap.docs) {
      const studentsSnap = await db.collection('teachers').doc(teacherId).collection('classrooms').doc(classDoc.id).collection('students').get();
      totalStudents += studentsSnap.size;
    }

    // Stripe quantity cannot be 0, set to minimum 1
    const newQuantity = Math.max(1, totalStudents);

    // 3. Update Stripe subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionItemId = subscription.items.data[0]?.id;

    if (subscriptionItemId) {
      console.log(`[Seat Sync] Updating Stripe Sub Item ${subscriptionItemId} to quantity: ${newQuantity}`);
      await stripe.subscriptionItems.update(subscriptionItemId, {
        quantity: newQuantity,
      });

      // 4. Sync quantity in Firestore
      const updatedBilling = {
        ...billing,
        quantity: newQuantity,
        updatedAt: new Date().toISOString(),
      };

      await db.collection('teachers').doc(teacherId).set({
        billing: updatedBilling
      }, { merge: true });

      return res.status(200).json({ status: 'success', syncedQuantity: newQuantity });
    } else {
      return res.status(400).json({ error: 'No subscription item found' });
    }
  } catch (err) {
    console.error('[Seat Sync Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
