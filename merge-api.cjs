const fs = require('fs');

// 1. Update billing-session.js
let billingContent = fs.readFileSync('api/billing-session.js', 'utf-8');

const verifyLogic = 
    // Booster Verification Logic
    if (action === 'verify-booster') {
      const { sessionId } = req.body;
      if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ success: false, message: 'Payment not completed or failed.' });
      }

      const credits = parseInt(session.metadata?.credits || '0', 10);
      if (!credits || session.metadata?.type !== 'booster') {
         return res.status(400).json({ success: false, message: 'Invalid session type.' });
      }

      const sessionRef = db.collection('processed_sessions').doc(sessionId);
      
      await db.runTransaction(async (t) => {
        const doc = await t.get(sessionRef);
        if (doc.exists) {
          return; // Already processed
        }
        
        t.set(sessionRef, { processedAt: new Date().toISOString(), teacherId, credits });
        
        const teacherRef = db.collection('teachers').doc(teacherId);
        t.set(teacherRef, { 
          topUpCredits: admin.firestore.FieldValue.increment(credits) 
        }, { merge: true });
      });

      return res.status(200).json({ success: true, credits });
    }
;

// Insert it right after the portal check
billingContent = billingContent.replace(
    /if \(action === 'portal' && customerId\) \{[\s\S]*?return res.status\(200\).json\(\{ url: portalSession.url \}\);\n    \}/,
    match => match + '\n' + verifyLogic
);

fs.writeFileSync('api/billing-session.js', billingContent);

// 2. Remove verify-booster.js
fs.unlinkSync('api/verify-booster.js');

// 3. Update TeacherDashboard.jsx
let dashboardContent = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
dashboardContent = dashboardContent.replace(
    /await fetch\('\/api\/verify-booster'/g,
    \wait fetch('/api/billing-session'\
);
dashboardContent = dashboardContent.replace(
    /body: JSON.stringify\(\{ sessionId, teacherId: user.uid \}\)/g,
    \ody: JSON.stringify({ action: 'verify-booster', sessionId, teacherId: user.uid, email: user.email || 'no-email@test.com' })\
);
fs.writeFileSync('src/pages/TeacherDashboard.jsx', dashboardContent);

console.log('Merged API functions and updated dashboard.');
