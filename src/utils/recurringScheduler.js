import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { fetchWithRetry, generateContent } from './aiClient';
import { generateExplanations } from './generateExplanations';

// Local helper to format date
const getLocalDateString = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to fetch past questions to avoid duplicates
const fetchPastQuestions = async (classIds) => {
  if (!classIds || classIds.length === 0) return [];
  try {
    const pastQuestionsList = [];
    for (const classId of classIds) {
      const q = query(
        collection(db, 'homeworks'), 
        where('assignedClassId', '==', classId)
      );
      const snap = await getDocs(q);
      const hws = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort client-side by creation date descending
      hws.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      // Get questions from last 3 homeworks
      const recentHws = hws.slice(0, 3);
      recentHws.forEach(hw => {
        if (Array.isArray(hw.questions)) {
          hw.questions.forEach(q => {
            if (q.text && !pastQuestionsList.includes(q.text)) {
              pastQuestionsList.push(q.text);
            }
          });
        }
      });
    }
    return pastQuestionsList;
  } catch (err) {
    console.error("Error fetching past questions:", err);
    return [];
  }
};

// Helper to compile prompts
const compilePrompt = (customPrompt, params) => {
  if (!customPrompt) return '';
  let compiled = customPrompt;
  const replacements = {
    topic: params.topic,
    grade: params.grade,
    difficulty: params.difficulty,
    curriculum: params.curriculumName || params.curriculum,
    subject: params.subject,
    questionCount: params.questionCount,
    question_count: params.questionCount,
    points: params.points
  };

  Object.entries(replacements).forEach(([key, val]) => {
    const stringVal = String(val || '');
    const regexSquare = new RegExp(`\\[${key}\\]`, 'gi');
    const regexCurly = new RegExp(`\\{${key}\\}`, 'gi');
    compiled = compiled.replace(regexSquare, stringVal).replace(regexCurly, stringVal);
  });
  return compiled;
};

// Main generator execution
export const executeRecurringGeneration = async (sched, teacherUid, teacherCode) => {
  const schedRef = doc(db, 'recurring_schedules', sched.id);
  const originalLastRun = sched.lastRun || null;

  try {
    // 1. Immediately update lastRun in Firestore to prevent concurrent runs
    await updateDoc(schedRef, { lastRun: serverTimestamp() });

    let activeModel = 'gemini';
    let teacherPrompts = {
      maths: 'Make 5 questions about adding fractions with unlike denominators. This is for grade 4 students.',
      english: 'Make 5 questions about identifying nouns vs verbs in a sentence. This is for grade 4 students.',
      science: 'Make 5 questions about the solar system and planets. This is for grade 4 students.',
      olympiad: 'Generate 5 Olympiad-level maths questions. Focus on advanced problem-solving, combinatorics, number theory, and logic. These should be highly challenging.'
    };
    let resolvedTeacherName = 'Classroom Teacher';

    const teacherDoc = await getDoc(doc(db, 'teachers', teacherUid));
    if (teacherDoc.exists()) {
      const data = teacherDoc.data();
      if (data.displayName) resolvedTeacherName = data.displayName;
      if (data.activeAi) activeModel = data.activeAi;
      if (data.subjectPrompts) {
        teacherPrompts = { ...teacherPrompts, ...data.subjectPrompts };
      }
    }

    const normSubject = sched.subject.toLowerCase();
    const matchedKey = teacherPrompts ? Object.keys(teacherPrompts).find(k => k.toLowerCase() === normSubject) : null;
    const customPrompt = (matchedKey && teacherPrompts[matchedKey]) ? teacherPrompts[matchedKey] : '';

    const qualityRules = `
CRITICAL ACCURACY & QUALITY RULES:
1. For English Grammar / Word Classification (nouns, verbs, adjectives, adverbs, prepositions, etc.):
   - Identify the part of speech based strictly on its exact syntactic function inside the sentence context. E.g. in "The walk was long", "walk" is a noun. In "We walk daily", "walk" is a verb.
   - Ensure that the "answer" option is grammatically 100% correct, and the other 3 options are clearly incorrect or represent different parts of speech. No ambiguity.
2. For Mathematics:
   - Ensure all equations, word problems, and numeric values are mathematically correct. Double-check your own calculations so there is zero arithmetic error.
3. For Science:
   - Ensure all facts, definitions, and concepts are scientifically accurate and standard.
4. General:
   - The "answer" field MUST exactly match one of the 4 values inside the "options" array.
   - All options must be age-appropriate for elementary/middle school students.

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
3. For Logical Reasoning / Pattern Recognition:
   - If the question involves a series of shapes changing in a logical pattern, YOU ABSOLUTELY MUST include a visual using the "svgCode" property (or inline SVG in the options) to draw the actual sequence of shapes. NEVER use placeholder text like "[Insert figure...]".
4. For Science (or topics needing cute artistic illustrations):
   - Include a short "imagePrompt" string describing the scene.`;

    let prompt = "";
    if (customPrompt) {
      prompt = compilePrompt(customPrompt, {
        topic: sched.topic,
        grade: sched.grade,
        difficulty: sched.difficulty,
        curriculum: sched.curriculum,
        curriculumName: sched.curriculumName || 'ACARA',
        subject: sched.subject,
        questionCount: sched.questionCount || 5,
        points: sched.points || '10'
      });
      prompt += `\n\n${qualityRules}\n\nReturn ONLY a JSON object with a single key "questions" containing an array of exactly ${sched.questionCount || 5} objects. Each object must have: "id" (number), "text" (string, the question), "options" (array of exactly 4 strings), "answer" (string, matching one option exactly), "subtopic" (string, a specific subtopic or concept under the main topic, e.g. "Adding Fractions", "Identifying Nouns", "Photosynthesis", etc.), and optionally "chartData", "geometryData", or "imagePrompt". Do not include any markdown formatting.`;
    } else {
      prompt = `You are an expert curriculum designer. 
      Create a ${sched.questionCount || 5}-question multiple-choice quiz for students on the following:
      Subject: ${sched.subject}
      Topic/Concept: ${sched.topic}
      Grade Level: ${sched.grade}
      Difficulty: ${sched.difficulty}
      Curriculum Alignment: Strictly match the ${sched.curriculumName || 'ACARA'} standards for ${sched.grade} at a ${sched.difficulty} difficulty.
      
      Ensure the questions test the students' knowledge on the specific topic at the selected grade and difficulty.

      ${qualityRules}

      Return ONLY a JSON object with a single key "questions" containing an array of objects. Each object must have: "id" (number), "text" (string, the question), "options" (array of exactly 4 strings), "answer" (string, matching one option exactly), "subtopic" (string, a specific subtopic or concept under the main topic, e.g. "Adding Fractions", "Identifying Nouns", "Photosynthesis", etc.), and optionally "chartData", "geometryData", or "imagePrompt". Do not include any markdown formatting.`;
    }

    const pastQuestions = await fetchPastQuestions(sched.selectedClasses);
    if (pastQuestions.length > 0) {
      prompt += `\n\nCRITICAL: To prevent duplication and ensure academic variety, do NOT generate questions that are identical, highly similar, or test the exact same numbers/phrases as these past questions from recent assignments:\n` + 
        pastQuestions.slice(0, 15).map((q, idx) => `- "${q}"`).join('\n');
    }

    const textResponse = await generateContent({
      prompt,
      responseMimeType: 'application/json',
      provider: activeModel
    });

    const parsed = JSON.parse(textResponse);
    const questions = parsed.questions || parsed;

    if (!Array.isArray(questions) || questions.length === 0) {
      await updateDoc(schedRef, { lastRun: originalLastRun });
      return;
    }

    const title = `${sched.topic} (${sched.grade})`;
    const todayDateStr = new Date().toISOString().split('T')[0];
    const futureDue = new Date();
    futureDue.setDate(futureDue.getDate() + (sched.dueDateOffset || 7));
    const formattedDueDate = futureDue.toISOString().split('T')[0];

    // Pre-generate explanations once — shared by all students (zero runtime AI calls at submission)
    const questionExplanations = await generateExplanations(questions, sched.subject, activeModel);

    for (const classId of sched.selectedClasses) {
      const statusVal = sched.publishType === 'draft' 
        ? 'draft' 
        : (sched.publishType === 'publish_scheduled' ? 'scheduled' : 'published');

      const payload = {
        title,
        subject: sched.subject,
        instructions: `Complete this automated ${sched.subject} ${sched.type === 'test' ? 'test' : 'homework'} on ${sched.topic}. Built for ${sched.grade} (${sched.difficulty}) matching the ${sched.curriculumName || 'ACARA'} standard. 🤖`,
        assignedClassId: classId,
        dueDate: formattedDueDate,
        time: sched.dueTime || '17:00',
        points: sched.points || '10',
        questions: questions,
        questionExplanations,
        teacherId: teacherUid,
        teacherName: sched.teacherName || resolvedTeacherName,
        status: statusVal,
        type: sched.type || 'homework',
        assignType: sched.assignType || 'all',
        assignedStudentId: sched.assignType === 'student' ? (sched.assignedStudentId || '') : '',
        assignedStudentIds: sched.assignType === 'students' ? (sched.assignedStudentIds || []) : [],
        scheduledRelease: statusVal === 'scheduled' ? {
          date: todayDateStr,
          time: sched.releaseTime || '08:00'
        } : null,
        metadata: {
          curriculum: sched.curriculum,
          curriculumName: sched.curriculumName || 'ACARA',
          grade: sched.grade,
          difficulty: sched.difficulty,
          topic: sched.topic,
          scheduledVia: 'Auto-Scheduler',
          scheduleProfileId: sched.id
        },
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'homeworks'), payload);
    }
    return true;
  } catch (err) {
    console.error("Execute recurring generation error:", err);
    try {
      await updateDoc(schedRef, { lastRun: originalLastRun });
    } catch (revertErr) {
      console.error("Failed to revert lastRun after error:", revertErr);
    }
    throw err;
  }
};

// Check active automations and execute catch-up
export const checkAndRunAutomations = async (teacherUid, teacherCode, activeAutomationsLock) => {
  if (!teacherUid) return false;
  try {
    const q = query(
      collection(db, 'recurring_schedules'), 
      where('teacherId', '==', teacherUid),
      where('isActive', '==', true)
    );
    const snap = await getDocs(q);
    const activeSchedules = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    
    const now = new Date();
    let generatedAny = false;
    const todayStr = getLocalDateString(now);

    for (const sched of activeSchedules) {
      let shouldRun = false;
      const lastRunDate = sched.lastRun?.toDate ? sched.lastRun.toDate() : null;
      const lastRunTime = lastRunDate ? lastRunDate.getTime() : 0;
      
      const [targetHour, targetMin] = (sched.releaseTime || '08:00').split(':').map(Number);
      
      // Calculate the latest scheduled run date/time
      const latestScheduled = new Date(now);
      latestScheduled.setHours(targetHour, targetMin, 0, 0);
      
      // If current time is before today's release time, the latest scheduled release was yesterday
      if (now < latestScheduled) {
        latestScheduled.setDate(latestScheduled.getDate() - 1);
      }
      
      // For weekly schedules, find the most recent target day
      if (sched.recurrence === 'weekly') {
        const targetDay = parseInt(sched.recurrenceDay, 10);
        const currentDay = latestScheduled.getDay();
        let dayDiff = currentDay - targetDay;
        if (dayDiff < 0) {
          dayDiff += 7;
        }
        latestScheduled.setDate(latestScheduled.getDate() - dayDiff);
      }

      if (lastRunTime < latestScheduled.getTime()) {
        shouldRun = true;
      }

      if (shouldRun) {
        const lockKey = `${sched.id}_${todayStr}`;
        if (activeAutomationsLock.has(lockKey)) {
          console.log(`[Scheduler] Shared automation ${sched.id} already locked for today.`);
          continue;
        }
        activeAutomationsLock.add(lockKey);
        try {
          await executeRecurringGeneration(sched, teacherUid, teacherCode);
          generatedAny = true;
        } catch (err) {
          console.error(`Failed to execute recurring generation for ${sched.id}:`, err);
          activeAutomationsLock.delete(lockKey);
        }
      }
    }
    return generatedAny;
  } catch (err) {
    console.error("Failed checking/running automations:", err);
    return false;
  }
};
