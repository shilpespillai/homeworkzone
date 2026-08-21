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
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (process.env.CRON_SECRET && req.headers.authorization !== Bearer ) {
    console.warn('Unauthorized cron invocation attempted');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const teachersSnap = await db.collection('teachers').get();
    let syncedCount = 0;

    for (const doc of teachersSnap.docs) {
      const teacherId = doc.id;
      const teacherData = doc.data();
      const billing = teacherData.billing || {};
      const subscriptionId = billing.stripeSubscriptionId;
      const planId = billing.planId;
      const status = billing.status;

      if (!subscriptionId || !['active', 'trialing'].includes(status)) continue;
      if (planId !== 'option-a' && planId !== 'option-c') continue;

      const classroomsSnap = await db.collection('teachers').doc(teacherId).collection('classrooms').get();
      let totalStudents = 0;
      
      for (const classDoc of classroomsSnap.docs) {
        const studentsSnap = await db.collection('teachers').doc(teacherId).collection('classrooms').doc(classDoc.id).collection('students').get();
        totalStudents += studentsSnap.size;
      }

      const newQuantity = Math.max(1, totalStudents);
      const currentQuantity = billing.quantity || 1;

      if (newQuantity !== currentQuantity) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const subscriptionItemId = subscription.items.data[0]?.id;

        if (subscriptionItemId) {
          console.log([Nightly Seat Sync] Teacher : Updating Sub Item  from  to );
          
          await stripe.subscriptionItems.update(subscriptionItemId, {
            quantity: newQuantity,
          });

          const updatedBilling = {
            ...billing,
            quantity: newQuantity,
            updatedAt: new Date().toISOString(),
          };

          await db.collection('teachers').doc(teacherId).set({
            billing: updatedBilling
          }, { merge: true });

          syncedCount++;
        }
      }
    }

    return res.status(200).json({ status: 'success', totalTeachersSynced: syncedCount });
  } catch (err) {
    console.error('[Nightly Seat Sync Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
