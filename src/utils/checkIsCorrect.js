export const checkIsCorrect = (q, studentAns) => {
  if (!q) return false;
  if (studentAns === undefined || studentAns === null || studentAns === '') return false;

  const rawAnswer = q.answer !== undefined ? q.answer : (q.correctAnswer !== undefined ? q.correctAnswer : '');

  // 1. Text input questions
  if (q.questionType === 'text') {
    const normStudent = String(studentAns).trim().toLowerCase();
    const normCorrect = String(rawAnswer).trim().toLowerCase();

    // Direct match
    if (normStudent === normCorrect) return true;

    // Strip outer quotes
    const stripQuotes = str => str.replace(/^["']|["']$/g, '').trim();
    if (stripQuotes(normStudent) === stripQuotes(normCorrect)) return true;

    // Check slash or 'or' alternatives
    const alternatives = normCorrect.split(/\/|\bor\b/).map(s => s.trim()).filter(Boolean);
    if (alternatives.length > 1 && alternatives.includes(normStudent)) return true;

    return false;
  }

  // 2. Interactive matching questions
  if (q.questionType === 'interactive' && q.interactiveType === 'matching') {
    const parsePairs = (val) => {
      let str = '';
      if (Array.isArray(val)) {
        str = val.join(', ');
      } else {
        str = String(val || '');
      }
      const items = str.split(',').map(s => s.trim()).filter(Boolean);
      const pairSet = new Set();
      items.forEach(item => {
        const parts = item.split('||').map(p => p.trim());
        if (parts.length === 2) {
          pairSet.add(`${parts[0]}||${parts[1]}`);
        }
      });
      return pairSet;
    };

    const studentSet = parsePairs(studentAns);
    let correctSet = parsePairs(rawAnswer);

    if (correctSet.size === 0 && Array.isArray(q.interactiveData)) {
      correctSet = parsePairs(q.interactiveData);
    }

    if (studentSet.size === 0 || correctSet.size === 0) return false;
    if (studentSet.size !== correctSet.size) return false;

    for (const pair of studentSet) {
      if (!correctSet.has(pair)) return false;
    }
    return true;
  }

  // 3. Interactive sorting questions
  if (q.questionType === 'interactive' && q.interactiveType === 'sorting') {
    const parseList = (val) => {
      if (Array.isArray(val)) return val.map(s => String(s).trim().toLowerCase());
      return String(val || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    };

    const studentList = parseList(studentAns);
    let correctList = parseList(rawAnswer);

    if (correctList.length === 0 && Array.isArray(q.interactiveData)) {
      correctList = parseList(q.interactiveData);
    }

    if (studentList.length === 0 || correctList.length === 0) return false;
    if (studentList.length !== correctList.length) return false;
    return studentList.every((val, i) => val === correctList[i]);
  }

  // 4. Default / Multiple Choice
  const normStudent = String(studentAns).trim();
  const normCorrect = String(rawAnswer).trim();
  return normStudent === normCorrect;
};
