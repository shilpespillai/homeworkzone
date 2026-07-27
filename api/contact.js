import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID || 'homeworkzone-8eb6d',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    }
  } catch (err) {
    console.error('Firebase Admin init error in contact handler:', err);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, query, subject } = req.body || {};

    if (!name || !email || !query) {
      return res.status(400).json({ error: 'Missing name, email, or query' });
    }

    const recipientEmail = 'aihealthtec@gmail.com';
    const timestamp = new Date().toISOString();

    // Store in Firestore 'contacts' collection
    if (getApps().length) {
      const db = getFirestore();
      await db.collection('contacts').add({
        name: String(name).trim(),
        email: String(email).trim(),
        query: String(query).trim(),
        subject: subject || 'General Query',
        recipientEmail: recipientEmail,
        status: 'unread',
        createdAt: timestamp,
        autoReplySent: true
      });
    }

    const autoReplyText = "Hello member, We have got your email and will reply back as soon as possible. Thanks, HomeworkZone Team";

    return res.status(200).json({
      success: true,
      message: `Your query has been sent to ${recipientEmail}.`,
      autoReply: autoReplyText
    });
  } catch (err) {
    console.error('[Contact API Error]', err);
    return res.status(500).json({ error: err.message || 'Failed to submit contact request' });
  }
}
