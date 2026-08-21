const fs = require('fs');
let content = fs.readFileSync('api/billing-webhook.js', 'utf-8');
content = content.replace(
    'await db.collection(\\'teachers\\').doc(teacherId).update({',
    'await db.collection(\\'teachers\\').doc(teacherId).set({'
);
content = content.replace(
    'topUpCredits: admin.firestore.FieldValue.increment(boosterCredits)\\n          });',
    'topUpCredits: admin.firestore.FieldValue.increment(boosterCredits)\\n          }, { merge: true });'
);
fs.writeFileSync('api/billing-webhook.js', content, 'utf-8');
console.log('Fixed billing webhook');
