/**
 * homeworkShared.js
 *
 * Shared utility functions used by both HomeworkGenerator.jsx and HomeworkScheduler.jsx.
 * Extracted to a neutral file to break the circular import dependency between those two pages.
 */

export const cleanOptionText = (text) => {
  if (typeof text !== 'string') return text;
  const match = text.match(/^\([A-D]\)\s*(.+)$/i) ||
                text.match(/^\(?[A-D]\s*[\)\.\-]\s+(.+)$/i) ||
                text.match(/^[A-D]\s+(.+)$/i);
  if (match) return match[1].trim();
  return text.trim();
};

export const getCurriculumSubjectKey = (subject) => {
  if (!subject) return '';
  const s = subject.toLowerCase().replace(/_/g, ' ');
  if (s === 'computer science') return 'Computer Science';
  if (s === 'financial literacy') return 'Financial Literacy';
  if (s === 'environmental science') return 'Environmental Science';
  if (s === 'critical thinking') return 'Critical Thinking';
  if (s === 'logical reasoning') return 'Logical Reasoning';
  if (s === 'maths' || s === 'math') return 'Maths';
  if (s === 'english') return 'English';
  if (s === 'science') return 'Science';
  if (s === 'olympiad') return 'Olympiad';
  return subject.split(/_|\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export const sanitizeQuestionData = (q) => {
  if (!q) return q;
  let text = q.text || '';
  text = text.replace(/\s*\((?:Read this|Translation|In English|Meaning):?\s*[^)]+\)/gi, '').trim();
  text = text
    .replace(/\s*\(?(?:The\s+)?(?:correct\s+)?answer\s*(?:is|:|=)\s*(?:[A-D]|\d+|[^\s\)]+)\)?/gi, '')
    .replace(/\s*\(?Correct\s+(?:choice|option|answer)\s*:\s*(?:[A-D]|\d+|[^\s\)]+)\)?/gi, '')
    .replace(/\s*Therefore,?\s+the\s+(?:correct\s+)?answer\s+is\s+.*$/gi, '')
    .trim();
  if (!text || text.trim() === '') {
    text = q.subtopic ? `Question about ${q.subtopic}` : 'Select the correct answer from the choices below:';
  }
  let options = q.options;
  let answer = q.answer;
  if (Array.isArray(options)) {
    const cleanedOptions = options.map(opt => {
      if (typeof opt !== 'string') return opt;
      if (/[\u0900-\u097F]/.test(opt) || /[^\x00-\x7F]/.test(opt)) {
        return cleanOptionText(opt.replace(/\s*\([A-Za-z\s,-]+\)$/, '').trim());
      }
      return cleanOptionText(opt);
    });
    if (answer && typeof answer === 'string') {
      const matchIdx = options.findIndex(o => o === answer);
      if (matchIdx !== -1) {
        answer = cleanedOptions[matchIdx];
      } else {
        answer = cleanOptionText(answer);
      }
    }
    options = cleanedOptions;
  }
  return { ...q, text, options, answer };
};

export const cleanCategoryName = (cat) => {
  if (!cat) return '';
  return cat.replace(/^[A-Z0-9]+(?:\.[0-9]+)*[\.\t\s]+\s*/i, '').trim();
};

export const getSmartTopicTitle = (skills) => {
  if (!skills || skills.length === 0) return '';
  const categoryMap = new Map();
  skills.forEach(s => {
    const rawCat = s.category || s.topicCategory || '';
    const cleanCat = cleanCategoryName(rawCat);
    if (cleanCat && !categoryMap.has(cleanCat)) {
      categoryMap.set(cleanCat, rawCat);
    }
  });
  const categories = Array.from(categoryMap.keys());
  if (categories.length === 0) {
    if (skills.length === 1) return skills[0].title;
    return `${skills[0].title} & ${skills.length - 1} more`;
  }
  if (categories.length === 1) return categories[0];
  if (categories.length === 2) {
    const combined = `${categories[0]} & ${categories[1]}`;
    if (combined.length <= 55) return combined;
    return `${categories[0]} & 1 more topic`;
  }
  const combinedTwo = `${categories[0]}, ${categories[1]}`;
  if (combinedTwo.length <= 45) return `${combinedTwo} & ${categories.length - 2} more`;
  return `${categories[0]} & ${categories.length - 1} more topics`;
};
