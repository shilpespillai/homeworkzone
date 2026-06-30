import admin from 'firebase-admin';
import { createHash } from 'crypto';

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

// ─── AES-GCM Decryption (mirrors client-side crypto.js) ───────────────────
async function decryptApiKey(encryptedString, teacherCode) {
  if (!encryptedString || !teacherCode) return '';
  if (!encryptedString.includes(':')) return encryptedString; // legacy plain key

  try {
    const { createDecipheriv } = await import('crypto');
    const [ivHex, cipherHex] = encryptedString.split(':');
    if (!ivHex || !cipherHex) return '';

    const cleanCode = (teacherCode || '').trim().toUpperCase().padEnd(32, '0').slice(0, 32);
    const key = Buffer.from(cleanCode, 'utf8');
    const iv = Buffer.from(ivHex, 'hex');
    const cipherText = Buffer.from(cipherHex, 'hex');

    // AES-GCM: last 16 bytes of cipherText are the auth tag
    const authTag = cipherText.slice(-16);
    const encryptedData = cipherText.slice(0, -16);

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.error('[Scheduler] Decryption error:', err.message);
    return '';
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchWithRetryNode(url, options, maxRetries = 3, initialDelay = 1000) {
  let delay = initialDelay;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        return res;
      }
      
      // Retry on 503 Service Unavailable or 429 Too Many Requests
      if (res.status === 503 || res.status === 429) {
        console.warn(`[Node Scheduler] AI Request failed with status ${res.status}. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      
      return res;
    } catch (err) {
      if (attempt === maxRetries - 1) {
        throw err;
      }
      console.warn(`[Node Scheduler] AI Request failed. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`, err.message);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error(`AI Request failed after ${maxRetries} attempts`);
}

async function callGemini(apiKey, prompt) {
  const res = await fetchWithRetryNode(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  return JSON.parse(first !== -1 && last !== -1 ? text.substring(first, last + 1) : text);
}

async function callOpenAI(apiKey, prompt) {
  const res = await fetchWithRetryNode('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const data = await res.json();
  const text = data.choices[0].message.content;
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  return JSON.parse(first !== -1 && last !== -1 ? text.substring(first, last + 1) : text);
}

async function callAnthropic(apiKey, prompt) {
  const res = await fetchWithRetryNode('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
      temperature: 0.7
    })
  });
  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
  const data = await res.json();
  const text = data.content[0].text;
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  return JSON.parse(first !== -1 && last !== -1 ? text.substring(first, last + 1) : text);
}

// ─── Check if a schedule is overdue and should run ────────────────────────
function shouldScheduleRun(sched, now) {
  const lastRunDate = sched.lastRun?.toDate ? sched.lastRun.toDate() : null;
  const lastRunTime = lastRunDate ? lastRunDate.getTime() : 0;

  const tz = sched.timezone || 'UTC';

  // 1. Convert current UTC 'now' into a Date object representing the teacher's local time components
  const tzString = now.toLocaleString('en-US', { timeZone: tz });
  const tzNow = new Date(tzString);

  // 2. Compute the target scheduled time using these local components
  const [targetHour, targetMin] = (sched.releaseTime || '08:00').split(':').map(Number);
  const latestScheduled = new Date(tzNow);
  latestScheduled.setHours(targetHour, targetMin, 0, 0);

  if (tzNow < latestScheduled) {
    latestScheduled.setDate(latestScheduled.getDate() - 1);
  }

  if (sched.recurrence === 'weekly') {
    const targetDay = parseInt(sched.recurrenceDay, 10);
    const currentDay = latestScheduled.getDay();
    let dayDiff = currentDay - targetDay;
    if (dayDiff < 0) dayDiff += 7;
    latestScheduled.setDate(latestScheduled.getDate() - dayDiff);
  }

  // 3. Compute the exact UTC timestamp for this local target time
  // By formatting latestScheduled (treated as UTC) into the target timezone, we can extract the offset.
  const guessTzStr = new Date(latestScheduled.getTime()).toLocaleString('en-US', { timeZone: tz });
  const guessTzDate = new Date(guessTzStr);
  const offset = guessTzDate.getTime() - latestScheduled.getTime();
  
  const targetUtcTime = latestScheduled.getTime() - offset;

  // Run if we haven't run since the target, AND the current real time has actually passed the target
  return lastRunTime < targetUtcTime && now.getTime() >= targetUtcTime;
}

// ─── Generate and save one schedule ───────────────────────────────────────
async function executeSchedule(sched, teacherData, teacherCode) {
  const schedRef = db.collection('recurring_schedules').doc(sched.id);

  // Mark as running immediately to prevent concurrent duplicate runs
  const originalLastRun = sched.lastRun || null;
  await schedRef.update({ lastRun: admin.firestore.FieldValue.serverTimestamp() });

  try {
    // Resolve model/provider
    const activeModel = process.env.SYSTEM_ACTIVE_AI || teacherData.activeAi || 'gemini';

    // Resolve API Key from Cloud Environment Variables first
    let apiKey = '';
    if (activeModel.toLowerCase() === 'gemini') {
      apiKey = process.env.GEMINI_API_KEY;
    } else if (activeModel.toLowerCase() === 'openai' || activeModel.toLowerCase().includes('gpt')) {
      apiKey = process.env.OPENAI_API_KEY;
    } else if (activeModel.toLowerCase() === 'anthropic' || activeModel.toLowerCase().includes('claude')) {
      apiKey = process.env.ANTHROPIC_API_KEY;
    }

    // Fallback: if cloud key is not set, decrypt teacher's key
    if (!apiKey) {
      console.log(`[Scheduler] Cloud key for ${activeModel} not found. Attempting to fall back to teacher's configured key...`);
      const encryptedKey = teacherData.encryptedAiKeys?.[activeModel] || '';
      apiKey = await decryptApiKey(encryptedKey, teacherCode);
    }

    if (!apiKey) {
      console.warn(`[Scheduler] No API key resolved for model ${activeModel} (teacher: ${teacherData.teacherCode}) — reverting`);
      await schedRef.update({ lastRun: originalLastRun });
      return false;
    }

    // Build prompt
    const qCount = sched.questionCount || 5;
    const curriculumName = sched.curriculumName || 'ACARA';
    
    const visualRules = `
CRITICAL VISUAL RULES:
1. For Data Interpretation / Graph / Chart questions:
   - Instead of an image, include a "chartData" array in the question object.
   - Example: "chartData": [{"name": "A", "value": 10}, {"name": "B", "value": 20}]
   - Do NOT output "svgCode" if you provide "chartData".
2. For Geometry (Area, Perimeter, Volume, Shapes):
   - Include a "geometryData" object in the question object.
   - "geometryData" must have: "type" (one of "rectangle", "triangle", "circle", "cylinder", "cube") and "labels" (object mapping dimensions like "width", "height", "radius" to strings like "5cm").
   - Example: "geometryData": {"type": "rectangle", "labels": {"width": "10m", "height": "5m"}}
   - Do NOT output "svgCode" if you provide "geometryData".
3. For Science (or topics needing cute artistic illustrations):
   - Include a short "imagePrompt" string describing the scene.`;

    let prompt = `You are an expert curriculum designer.
Create a ${qCount}-question multiple-choice quiz for students on the following:
Subject: ${sched.subject}
Topic/Concept: ${sched.topic}
Grade Level: ${sched.grade}
Difficulty: ${sched.difficulty}
Curriculum Alignment: Strictly match the ${curriculumName} standards for ${sched.grade} at a ${sched.difficulty} difficulty.

Ensure the questions test the students' knowledge on the specific topic at the selected grade and difficulty.

${visualRules}

Return ONLY a JSON object with a single key "questions" containing an array of exactly ${qCount} objects. Each object must have: "id" (number), "text" (string), "options" (array of exactly 4 strings), "answer" (string matching one option exactly), "subtopic" (string), and optionally "chartData", "geometryData", or "imagePrompt". Do not include any markdown formatting.`;

    // Apply custom teacher prompt if available
    const normSubject = sched.subject?.toLowerCase();
    const promptKey = teacherData.subjectPrompts
      ? Object.keys(teacherData.subjectPrompts).find(k => k.toLowerCase() === normSubject)
      : null;
    if (promptKey && teacherData.subjectPrompts[promptKey]) {
      let custom = teacherData.subjectPrompts[promptKey];
      const replacements = {
        topic: sched.topic, grade: sched.grade, difficulty: sched.difficulty,
        curriculum: curriculumName, subject: sched.subject,
        questionCount: qCount, question_count: qCount, points: sched.points || '10'
      };
      Object.entries(replacements).forEach(([k, v]) => {
        custom = custom.replace(new RegExp(`\\[${k}\\]`, 'gi'), String(v || ''));
        custom = custom.replace(new RegExp(`\\{${k}\\}`, 'gi'), String(v || ''));
      });
      prompt = custom + `\n\n${visualRules}\n\nReturn ONLY a JSON object with a single key "questions" containing an array of exactly ${qCount} objects. Each object must have: "id" (number), "text" (string), "options" (array of exactly 4 strings), "answer" (string matching one option exactly), "subtopic" (string), and optionally "chartData", "geometryData", or "imagePrompt". Do not include any markdown formatting.`;
    }

    // Call AI
    let result;
    if (activeModel.includes('gpt') || activeModel === 'openai') {
      result = await callOpenAI(apiKey, prompt);
    } else if (activeModel.includes('anthropic') || activeModel.includes('claude')) {
      result = await callAnthropic(apiKey, prompt);
    } else {
      result = await callGemini(apiKey, prompt);
    }

    const questions = result.questions || result;
    if (!Array.isArray(questions) || questions.length === 0) {
      await schedRef.update({ lastRun: originalLastRun });
      return false;
    }

    // Write homework docs
    const now = new Date();
    const todayStr = getLocalDateString(now);
    const futureDue = new Date(now);
    futureDue.setDate(futureDue.getDate() + (sched.dueDateOffset || 7));
    const dueDateStr = getLocalDateString(futureDue);

    const homeworksRef = db.collection('homeworks');
    const batch = db.batch();

    for (const classId of sched.selectedClasses) {
      const statusVal = sched.publishType === 'draft'
        ? 'draft'
        : sched.publishType === 'publish_scheduled' ? 'scheduled' : 'published';

      const newDoc = homeworksRef.doc();
      batch.set(newDoc, {
        title: `${sched.topic} (${sched.grade})`,
        subject: sched.subject,
        instructions: `Complete this automated ${sched.subject} homework on ${sched.topic}. Built for ${sched.grade} (${sched.difficulty}) matching the ${curriculumName} standard. 🤖`,
        assignedClassId: classId,
        dueDate: dueDateStr,
        time: sched.dueTime || '17:00',
        points: sched.points || '10',
        questions,
        teacherId: sched.teacherId,
        teacherName: sched.teacherName || teacherData.displayName || 'Classroom Teacher',
        status: statusVal,
        assignType: sched.assignType || 'all',
        assignedStudentId: sched.assignType === 'student' ? (sched.assignedStudentId || '') : '',
        assignedStudentIds: sched.assignType === 'students' ? (sched.assignedStudentIds || []) : [],
        scheduledRelease: statusVal === 'scheduled'
          ? { date: todayStr, time: sched.releaseTime || '08:00' }
          : null,
        metadata: {
          curriculum: sched.curriculum,
          curriculumName,
          grade: sched.grade,
          difficulty: sched.difficulty,
          topic: sched.topic,
          scheduledVia: 'Server-Cron',
          scheduleProfileId: sched.id,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    console.log(`[Scheduler] ✅ Generated homework for schedule ${sched.id} (${sched.topic} — ${sched.grade})`);
    return true;
  } catch (err) {
    console.error(`[Scheduler] ❌ Failed schedule ${sched.id}:`, err.message);
    // Revert lastRun so it retries on the next cron tick
    await schedRef.update({ lastRun: originalLastRun });
    return false;
  }
}

// ─── Main Handler ──────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Only allow GET (Vercel cron uses GET)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the request came from Vercel cron (or an authorized caller)
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date();
  console.log(`[Scheduler] 🕐 Cron triggered at ${now.toISOString()}`);

  try {
    // Fetch all active recurring schedules
    const snap = await db.collection('recurring_schedules')
      .where('isActive', '==', true)
      .get();

    if (snap.empty) {
      return res.status(200).json({ message: 'No active schedules', generated: 0 });
    }

    const schedules = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    let generated = 0;
    let skipped = 0;

    // Group by teacher to batch teacher doc fetches
    const teacherIds = [...new Set(schedules.map(s => s.teacherId).filter(Boolean))];
    const teacherDocs = {};
    await Promise.all(
      teacherIds.map(async uid => {
        const tDoc = await db.collection('teachers').doc(uid).get();
        if (tDoc.exists) teacherDocs[uid] = tDoc.data();
      })
    );

    for (const sched of schedules) {
      if (!shouldScheduleRun(sched, now)) {
        skipped++;
        continue;
      }

      const teacherData = teacherDocs[sched.teacherId];
      if (!teacherData) {
        console.warn(`[Scheduler] No teacher doc for ${sched.teacherId}`);
        skipped++;
        continue;
      }

      const teacherCode = teacherData.teacherCode || '';
      const success = await executeSchedule(sched, teacherData, teacherCode);
      if (success) generated++;
    }

    const summary = { generated, skipped, total: schedules.length };
    console.log('[Scheduler] Done:', summary);
    return res.status(200).json(summary);
  } catch (err) {
    console.error('[Scheduler] Fatal error:', err);
    return res.status(500).json({ error: err.message });
  }
}
