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

  // 4. Interactive fraction coloring questions
  if (q.questionType === 'interactive' && q.interactiveType === 'fractionColoring') {
    let coloredMap = {};
    try {
      if (typeof studentAns === 'string' && studentAns.startsWith('{')) {
        coloredMap = JSON.parse(studentAns);
      } else if (typeof studentAns === 'object' && studentAns !== null) {
        coloredMap = studentAns;
      }
    } catch (e) {
      return false;
    }

    const fracStr = q.targetFraction || rawAnswer || '1/3';
    const [numStr] = String(fracStr).split('/');
    const targetNumerator = parseInt(numStr, 10) || 1;

    const totalShapes = 6; // Standard 6 shapes grid
    let correctCount = 0;

    for (let i = 0; i < totalShapes; i++) {
      const shapeId = `shape-${i}`;
      const shapeSections = coloredMap[shapeId] || {};
      const countColored = Object.keys(shapeSections).length;
      if (countColored === targetNumerator) {
        correctCount++;
      }
    }

    return correctCount === totalShapes;
  }

  // 5. Clock Setting
  if (q.questionType === 'interactive' && q.interactiveType === 'clockSetting') {
    const parseHM = (str) => {
      const parts = String(str || '').split(':');
      const h = parseInt(parts[0], 10) % 12 || 12;
      const m = parseInt(parts[1], 10) || 0;
      return `${h}:${m}`;
    };
    const sTime = parseHM(studentAns);
    const cTime = parseHM(q.targetTime || rawAnswer);
    return sTime === cTime;
  }

  // 6. Place Value Blocks
  if (q.questionType === 'interactive' && q.interactiveType === 'placeValueBlocks') {
    const sVal = parseInt(studentAns, 10);
    const cVal = parseInt(q.targetNumber || rawAnswer, 10);
    return sVal === cVal;
  }

  // 7. Number Line Plotter
  if (q.questionType === 'interactive' && q.interactiveType === 'numberLinePlot') {
    const sVal = parseFloat(studentAns);
    const cVal = parseFloat(q.targetValue || rawAnswer);
    return Math.abs(sVal - cVal) < 0.05;
  }

  // 8. Angle Builder
  if (q.questionType === 'interactive' && q.interactiveType === 'angleMeasuring') {
    const sDeg = parseInt(studentAns, 10);
    const cDeg = parseInt(q.targetAngle || rawAnswer, 10);
    return Math.abs(sDeg - cDeg) <= 2;
  }

  // 9. Grid Area Painter
  if (q.questionType === 'interactive' && q.interactiveType === 'gridAreaPainter') {
    let pMap = {};
    try {
      if (typeof studentAns === 'string' && studentAns.startsWith('{')) {
        pMap = JSON.parse(studentAns);
      } else if (typeof studentAns === 'object' && studentAns !== null) {
        pMap = studentAns;
      }
    } catch (e) {}
    const sArea = Object.keys(pMap).length;
    const cArea = parseInt(q.targetArea || rawAnswer, 10);
    return sArea === cArea;
  }

  // 10. Balance Scale
  if (q.questionType === 'interactive' && q.interactiveType === 'balanceScale') {
    const sX = parseInt(studentAns, 10);
    const cX = parseInt(q.targetX || rawAnswer, 10);
    return sX === cX;
  }

  // 11. Fraction Wall
  if (q.questionType === 'interactive' && q.interactiveType === 'fractionWall') {
    let selectedBlocks = {};
    try {
      if (typeof studentAns === 'string' && studentAns.startsWith('{')) {
        selectedBlocks = JSON.parse(studentAns);
      }
    } catch (e) {}
    let sum = 0;
    Object.keys(selectedBlocks).forEach((key) => {
      const den = parseInt(key.split('-')[0], 10);
      if (den > 0) sum += 1 / den;
    });
    const [nStr, dStr] = String(q.targetFraction || rawAnswer || '1/2').split('/');
    const targetVal = (parseInt(nStr, 10) || 1) / (parseInt(dStr, 10) || 2);
    return Math.abs(sum - targetVal) < 0.01;
  }

  // 12. Coordinate Plotter
  if (q.questionType === 'interactive' && q.interactiveType === 'coordinatePlotter') {
    const normStudent = String(studentAns).replace(/\s+/g, '');
    const normTarget = String(q.targetPoint || rawAnswer).replace(/\s+/g, '');
    return normStudent === normTarget;
  }

  // 13. Money Counter
  if (q.questionType === 'interactive' && q.interactiveType === 'moneyCounter') {
    const sAmt = parseFloat(String(studentAns).replace('$', ''));
    const cAmt = parseFloat(String(q.targetAmount || rawAnswer).replace('$', ''));
    return Math.abs(sAmt - cAmt) < 0.01;
  }

  // 14. Geometry Net
  if (q.questionType === 'interactive' && q.interactiveType === 'geometryNet') {
    let counts = {};
    try {
      if (typeof studentAns === 'string' && studentAns.startsWith('{')) {
        counts = JSON.parse(studentAns);
      }
    } catch (e) {}
    const SHAPES = {
      'Cube': { faces: 6, edges: 12, vertices: 8 },
      'Square Pyramid': { faces: 5, edges: 8, vertices: 5 },
      'Triangular Prism': { faces: 5, edges: 9, vertices: 6 },
      'Cylinder': { faces: 3, edges: 2, vertices: 0 },
    };
    const targetShape = q.targetShape || rawAnswer || 'Cube';
    const spec = SHAPES[targetShape] || SHAPES['Cube'];
    return counts.faces === spec.faces && counts.edges === spec.edges && counts.vertices === spec.vertices;
  }

  // 15. Probability Spinner
  if (q.questionType === 'interactive' && q.interactiveType === 'probabilitySpinner') {
    let colors = {};
    try {
      if (typeof studentAns === 'string' && studentAns.startsWith('{')) {
        colors = JSON.parse(studentAns);
      }
    } catch (e) {}
    const redCount = Object.values(colors).filter((c) => c === '#EF4444').length;
    const [nStr, dStr] = String(q.targetProbability || rawAnswer || '1/4').split('/');
    const reqRed = Math.round(((parseInt(nStr, 10) || 1) / (parseInt(dStr, 10) || 4)) * 8);
    return redCount === reqRed;
  }

  // 16. Function Grapher
  if (q.questionType === 'interactive' && q.interactiveType === 'functionGrapher') {
    const sStr = String(studentAns || '');
    const mMatch = sStr.match(/m=(-?\d+(\.\d+)?)/);
    const cMatch = sStr.match(/c=(-?\d+(\.\d+)?)/);
    if (!mMatch || !cMatch) return false;
    const sM = parseFloat(mMatch[1]);
    const sC = parseFloat(cMatch[1]);
    const tM = parseFloat(q.targetSlope !== undefined ? q.targetSlope : 2);
    const tC = parseFloat(q.targetIntercept !== undefined ? q.targetIntercept : 1);
    return Math.abs(sM - tM) < 0.1 && Math.abs(sC - tC) < 0.1;
  }

  // 17. Chart Builder
  if (q.questionType === 'interactive' && q.interactiveType === 'chartBuilder') {
    let bData = {};
    try {
      if (typeof studentAns === 'string' && studentAns.startsWith('{')) {
        bData = JSON.parse(studentAns);
      }
    } catch (e) {}
    const tData = q.targetData || {};
    const keys = Object.keys(tData);
    if (keys.length === 0) return false;
    return keys.every((k) => parseInt(bData[k], 10) === parseInt(tData[k], 10));
  }

  // 18. Ratio Mixer
  if (q.questionType === 'interactive' && q.interactiveType === 'ratioMixer') {
    const [sA, sB] = String(studentAns || '').split(':').map((s) => parseInt(s.trim(), 10));
    const [tA, tB] = String(q.targetRatio || rawAnswer || '2:3').split(':').map((s) => parseInt(s.trim(), 10));
    if (!sA || !sB || !tA || !tB) return false;
    return sA * tB === sB * tA;
  }

  // 19. Factor Tree
  if (q.questionType === 'interactive' && q.interactiveType === 'factorTree') {
    const sPrimes = String(studentAns || '').split(',').map((s) => parseInt(s.trim(), 10)).filter(Boolean);
    const prod = sPrimes.reduce((acc, v) => acc * v, 1);
    const target = parseInt(q.targetNumber || rawAnswer || 24, 10);
    return sPrimes.length > 0 && prod === target;
  }

  // 20. Pythagoras Explorer
  if (q.questionType === 'interactive' && q.interactiveType === 'pythagorasExplorer') {
    const sStr = String(studentAns || '');
    const cMatch = sStr.match(/c=(-?\d+(\.\d+)?)/);
    if (!cMatch) return false;
    const sC = parseFloat(cMatch[1]);
    const tC = parseFloat(q.targetHypotenuse || rawAnswer || 5);
    return Math.abs(sC - tC) < 0.1;
  }

  // 21. Transformation Geometry
  if (q.questionType === 'interactive' && q.interactiveType === 'transformationGeometry') {
    const sStr = String(studentAns || '');
    const dxMatch = sStr.match(/dx=(-?\d+)/);
    const dyMatch = sStr.match(/dy=(-?\d+)/);
    if (!dxMatch || !dyMatch) return false;
    const sDx = parseInt(dxMatch[1], 10);
    const sDy = parseInt(dyMatch[1], 10);
    const tDx = parseInt(q.targetShiftX !== undefined ? q.targetShiftX : 2, 10);
    const tDy = parseInt(q.targetShiftY !== undefined ? q.targetShiftY : 3, 10);
    return sDx === tDx && sDy === tDy;
  }

  // 22. Quadratic Parabola
  if (q.questionType === 'interactive' && q.interactiveType === 'quadraticParabola') {
    const sStr = String(studentAns || '');
    const hMatch = sStr.match(/h=(-?\d+(\.\d+)?)/);
    const kMatch = sStr.match(/k=(-?\d+(\.\d+)?)/);
    if (!hMatch || !kMatch) return false;
    const sH = parseFloat(hMatch[1]);
    const sK = parseFloat(kMatch[1]);
    const tH = parseFloat(q.targetH !== undefined ? q.targetH : 2);
    const tK = parseFloat(q.targetK !== undefined ? q.targetK : -3);
    return Math.abs(sH - tH) < 0.1 && Math.abs(sK - tK) < 0.1;
  }

  // 23. Percentage Grid
  if (q.questionType === 'interactive' && q.interactiveType === 'percentageGrid') {
    let tiles = {};
    try {
      if (typeof studentAns === 'string' && studentAns.startsWith('{')) {
        tiles = JSON.parse(studentAns);
      }
    } catch (e) {}
    const sPct = Object.keys(tiles).length;
    const tPct = parseInt(String(q.targetPercentage || rawAnswer || '45').replace('%', ''), 10);
    return sPct === tPct;
  }

  // 24. Stem Leaf Plot
  if (q.questionType === 'interactive' && q.interactiveType === 'stemLeafPlot') {
    let pMap = {};
    try {
      if (typeof studentAns === 'string' && studentAns.startsWith('{')) {
        pMap = JSON.parse(studentAns);
      }
    } catch (e) {}
    const dataList = q.data || [12, 15, 18, 22, 25, 31, 34];
    return dataList.every((val) => pMap[val] === Math.floor(val / 10));
  }

  // 25. Trig Ratios
  if (q.questionType === 'interactive' && q.interactiveType === 'trigRatios') {
    const sRatio = String(studentAns || '').trim().toLowerCase();
    const tRatio = String(q.targetRatio || rawAnswer || 'sin').trim().toLowerCase();
    return sRatio === tRatio;
  }

  // 26. Exponential Curve
  if (q.questionType === 'interactive' && q.interactiveType === 'exponentialCurve') {
    const sStr = String(studentAns || '');
    const bMatch = sStr.match(/b=(-?\d+(\.\d+)?)/);
    if (!bMatch) return false;
    const sB = parseFloat(bMatch[1]);
    const tB = parseFloat(q.targetBase !== undefined ? q.targetBase : 2);
    return Math.abs(sB - tB) < 0.1;
  }

  // 27. Default / Multiple Choice
  const normStudent = String(studentAns).trim();
  const normCorrect = String(rawAnswer).trim();
  if (normStudent.toLowerCase() === normCorrect.toLowerCase()) return true;

  // Check if studentAns is option letter ('A', 'B', 'C', 'D') and matches rawAnswer in options
  if (Array.isArray(q.options) && q.options.length > 0) {
    const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    if (normStudent in letterMap) {
      const idx = letterMap[normStudent];
      const optText = String(q.options[idx] || '').trim();
      if (optText && optText.toLowerCase() === normCorrect.toLowerCase()) return true;
    }
    // Check if rawAnswer is option letter ('A', 'B', 'C', 'D') and studentAns is full option text
    if (normCorrect in letterMap) {
      const idx = letterMap[normCorrect];
      const optText = String(q.options[idx] || '').trim();
      if (optText && optText.toLowerCase() === normStudent.toLowerCase()) return true;
    }
    // Check if studentAns is option index ('0', '1', '2', '3')
    const numIdx = parseInt(normStudent, 10);
    if (!isNaN(numIdx) && numIdx >= 0 && numIdx < q.options.length) {
      const optText = String(q.options[numIdx] || '').trim();
      if (optText && optText.toLowerCase() === normCorrect.toLowerCase()) return true;
    }
  }

  return normStudent.toLowerCase() === normCorrect.toLowerCase();
};
