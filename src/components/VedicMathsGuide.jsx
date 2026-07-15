import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Lock, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_SUTRAS = [
  { n: 1, name: "Ekadhikena Purvena", meaning: "By one more than the previous one", id: "sq5", minLevel: "primary" },
  { n: 2, name: "Nikhilam Navatashcaramam Dashatah", meaning: "All from 9, last from 10", id: "nikhilam", minLevel: "primary" },
  { n: 3, name: "Urdhva-Tiryagbhyam", meaning: "Vertically and crosswise", id: "criss", minLevel: "primary" },
  { n: 4, name: "Paraavartya Yojayet", meaning: "Transpose and adjust", id: "missing", minLevel: "primary" },
  { n: 5, name: "Shunyam Saamyasamuccaye", meaning: "When the sum is the same, it is zero", concept: true },
  { n: 6, name: "Anurupye Shunyamanyat", meaning: "If one is in ratio, the other is zero", concept: true },
  { n: 7, name: "Sankalana-vyavakalanabhyam", meaning: "By addition and by subtraction", id: "simultaneous", minLevel: "middle" },
  { n: 8, name: "Puranapuranabyham", meaning: "By completion or non-completion", concept: true },
  { n: 9, name: "Chalana-Kalanabyham", meaning: "Differences and similarities", concept: true },
  { n: 10, name: "Yaavadunam", meaning: "By the deficiency", id: "nearbase", minLevel: "primary" },
  { n: 11, name: "Vyashtisamanstih", meaning: "Part and whole", concept: true },
  { n: 12, name: "Shesanyankena Charamena", meaning: "The remainders by the last digit", id: "digitsum", minLevel: "primary" },
  { n: 13, name: "Sopaantyadvayamantyam", meaning: "The ultimate and twice the penultimate", concept: true },
  { n: 14, name: "Ekanyunena Purvena", meaning: "By one less than the previous one", id: "mult9", minLevel: "primary" },
  { n: 15, name: "Gunitasamuchyah", meaning: "The product of the sum equals the sum of the product", concept: true },
  { n: 16, name: "Gunakasamuchyah", meaning: "The factors of the sum equal the sum of the factors", concept: true },
];

const SUB_SUTRAS = [
  { n: 1, name: "Anurupyena", meaning: "proportionally" },
  { n: 2, name: "Sisyate Sesasamjnah", meaning: "the remainder remains constant" },
  { n: 3, name: "Adyamadyenantyamantyena", meaning: "first by first, last by last" },
  { n: 4, name: "Kevalaih Saptakam Gunyat", meaning: "for 7, use this specific rule" },
  { n: 5, name: "Vestanam", meaning: "by osculation" },
  { n: 6, name: "Yaavadunam Taavadunikritya Varganca Yojayet", meaning: "reduce by the deficiency, then add the square" },
  { n: 7, name: "Antyayordasakepi", meaning: "last digits summing to 10" },
  { n: 8, name: "Antyayoreva", meaning: "only the last terms" },
  { n: 9, name: "Lopanasthapanabhyam", meaning: "by removal and retention" },
  { n: 10, name: "Vilokanam", meaning: "by mere observation/inspection" },
  { n: 11, name: "Gunitasamuchyah Samuchyagunitah", meaning: "the product of the sum is the sum of the product" },
  { n: 12, name: "Dwandwa Yoga", meaning: "duplex combination process" },
  { n: 13, name: "Adyam Antyam Madhyam", meaning: "first, last and middle" },
];

const CONCEPTUAL_DETAILS = [
  {
    n: 5, name: "Shunyam Saamyasamuccaye", meaning: "When the sum is the same, it is zero",
    text: "If the same expression appears as the sum on both sides of an equation, that expression equals zero — collapsing what looks like a messy equation into a one-line solve.",
    worked: [
      { text: "5x + 3 = 3x + 3", bold: true },
      { text: "The constant term (3) is identical on both sides" },
      { text: "Cancel it → 5x = 3x → 2x = 0" },
      { text: "x = 0", result: true }
    ]
  },
  {
    n: 6, name: "Anurupye Shunyamanyat", meaning: "If one is in ratio, the other is zero",
    text: "Used on simultaneous equations where the coefficients of one variable are in the same ratio as the constants — that variable can be set to zero immediately, leaving a one-variable equation.",
    worked: [
      { text: "2x + 3y = 6,  4x + 6y = 12", bold: true },
      { text: "Coefficients of x (2,4) and constants (6,12) share the same ratio 1:2" },
      { text: "The equations coincide — infinite solutions along one line", result: true }
    ]
  },
  {
    n: 8, name: "Puranapuranabyham", meaning: "By completion or non-completion",
    text: "This is the 'completing the square' idea — turning a quadratic into a perfect square by adding and subtracting the same balancing term.",
    worked: [
      { text: "x² + 6x = 0", bold: true },
      { text: "Add 9 to both sides to complete the square: x²+6x+9 = 9" },
      { text: "(x+3)² = 9 → x+3 = ±3" },
      { text: "x = 0 or x = −6", result: true }
    ]
  },
  {
    n: 9, name: "Chalana-Kalanabyham", meaning: "Differences and similarities",
    text: "The sutra behind quick differentiation — spotting the pattern that turns xⁿ into n·xⁿ⁻¹ by comparing successive powers.",
    worked: [
      { text: "Differentiate x³", bold: true },
      { text: "Pattern: power comes down as a multiplier, exponent drops by one" },
      { text: "d/dx (x³) = 3x²", result: true }
    ]
  },
  {
    n: 11, name: "Vyashtisamanstih", meaning: "Part and whole",
    text: "Used when factoring: relate the middle and last terms of a quadratic (the 'part') back to two numbers whose sum and product recreate the whole expression.",
    worked: [
      { text: "Factor x² + 5x + 6", bold: true },
      { text: "Find two numbers that add to 5 and multiply to 6 → 2 and 3" },
      { text: "x² + 5x + 6 = (x+2)(x+3)", result: true }
    ]
  },
  {
    n: 13, name: "Sopaantyadvayamantyam", meaning: "The ultimate and twice the penultimate",
    text: "A rule for solving a specific family of quadratic equations with symmetric coefficients, by relating the last and second-to-last terms directly.",
    worked: [
      { text: "x² − 5x + 6 = 0", bold: true },
      { text: "Roots relate directly to the last two coefficients (−5 and 6)" },
      { text: "x = 2 or x = 3", result: true }
    ]
  },
  {
    n: 15, name: "Gunitasamuchyah", meaning: "The product of the sum equals the sum of the product",
    text: "A quick check after factoring a polynomial: the product of the coefficient-sums of each factor should equal the coefficient-sum of the full expanded expression.",
    worked: [
      { text: "Check (x+2)(x+3) = x²+5x+6", bold: true },
      { text: "Coefficient sums of factors: (1+2)=3, (1+3)=4 → 3×4=12" },
      { text: "Coefficient sum of expansion: 1+5+6=12" },
      { text: "Match — factoring confirmed ✓", result: true }
    ]
  },
  {
    n: 16, name: "Gunakasamuchyah", meaning: "The factors of the sum equal the sum of the factors",
    text: "A companion check to sutra 15, using x = 0 to confirm the constant term of a factored expression matches the product of each factor's constant.",
    worked: [
      { text: "Check (x+2)(x+3) = x²+5x+6", bold: true },
      { text: "Set x = 0: factors give 2×3 = 6" },
      { text: "Expansion's constant term: 6" },
      { text: "Match — factoring confirmed ✓", result: true }
    ]
  },
];

const LEVEL_LABELS = {
  primary: 'Primary (8–11) — small numbers, one step at a time.',
  middle: 'Middle school (11–14) — bigger numbers, same patterns.',
  advanced: 'Advanced (14+) — large numbers and multi-step problems.'
};

export default function VedicMathsGuide() {
  const [level, setLevel] = useState('primary');
  const [scores, setScores] = useState({});
  const [answers, setAnswers] = useState({});
  const [prompts, setPrompts] = useState({});
  const [inputs, setInputs] = useState({});
  const [feedback, setFeedback] = useState({});

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // ─── Generate Question / Answer ──────────────────────────────────────────
  const generateQA = (id, currentLvl) => {
    switch (id) {
      case 'sq5': {
        const ranges = { primary: [1, 8], middle: [10, 19], advanced: [10, 49] };
        const [lo, hi] = ranges[currentLvl];
        const lead = randInt(lo, hi);
        const n = lead * 10 + 5;
        return { prompt: `${n}² = ?`, answer: n * n };
      }
      case 'nikhilam': {
        const cfg = { primary: { base: 100, lo: 11, hi: 89 }, middle: { base: 1000, lo: 101, hi: 899 }, advanced: { base: 10000, lo: 1001, hi: 8999 } };
        const { base, lo, hi } = cfg[currentLvl];
        const n = randInt(lo, hi);
        return { prompt: `${base} − ${n} = ?`, answer: base - n };
      }
      case 'criss': {
        const cfg = { primary: [[11, 39], [11, 29]], middle: [[11, 99], [11, 99]], advanced: [[100, 499], [100, 499]] };
        const [[a1, a2], [b1, b2]] = cfg[currentLvl];
        const a = randInt(a1, a2);
        const b = randInt(b1, b2);
        return { prompt: `${a} × ${b} = ?`, answer: a * b };
      }
      case 'missing': {
        if (currentLvl === 'primary') {
          const x = randInt(1, 20), add = randInt(1, 15);
          return { prompt: `x + ${add} = ${x + add}, x = ?`, answer: x };
        } else if (currentLvl === 'middle') {
          const x = randInt(2, 12), c = randInt(2, 6), add = randInt(1, 10);
          return { prompt: `${c}x + ${add} = ${c * x + add}, x = ?`, answer: x };
        } else {
          const x = randInt(2, 15), c = randInt(2, 8), sub = randInt(1, 20);
          return { prompt: `${c}x − ${sub} = ${c * x - sub}, x = ?`, answer: x };
        }
      }
      case 'simultaneous': {
        const cfg = { middle: [3, 10], advanced: [5, 25] };
        const [lo, hi] = cfg[currentLvl] || cfg.middle;
        const x = randInt(lo, hi), y = randInt(lo, hi);
        const S = x + y, D = x - y;
        return { prompt: `x + y = ${S}, x − y = ${D}, x = ?`, answer: x };
      }
      case 'nearbase': {
        const cfg = { primary: [7, 13], middle: [92, 112], advanced: [985, 1015] };
        const [lo, hi] = cfg[currentLvl];
        const n = randInt(lo, hi);
        return { prompt: `${n}² = ?`, answer: n * n };
      }
      case 'digitsum': {
        const cfg = { primary: [10, 99], middle: [100, 999], advanced: [1000, 99999] };
        const [lo, hi] = cfg[currentLvl];
        const n = randInt(lo, hi);
        const digitSum = String(n).split('').reduce((a, d) => a + Number(d), 0);
        return { prompt: `Digit sum of ${n} = ?`, answer: digitSum };
      }
      case 'mult9': {
        const cfg = { primary: { m: 9, lo: 2, hi: 25 }, middle: { m: 99, lo: 2, hi: 50 }, advanced: { m: 999, lo: 2, hi: 400 } };
        const { m, lo, hi } = cfg[currentLvl];
        const n = randInt(lo, hi);
        return { prompt: `${n} × ${m} = ?`, answer: n * m };
      }
      default:
        return { prompt: '', answer: 0 };
    }
  };

  // ─── Practice Sections Data ────────────────────────────────────────────────
  const practiceSections = [
    {
      id: 'sq5', mark: '01 · Ekadhikena Purvena', title: 'Squaring numbers ending in 5', minLevel: 'primary',
      desc: {
        primary: 'Take the leading digit, multiply it by "one more than itself," then stick 25 on the end.',
        middle: 'Same rule, bigger lead number — works for any number ending in 5, not just two digits.',
        advanced: 'Same pattern scales to any size — the lead can itself be a multi-digit number.'
      },
      worked: {
        primary: [
          { text: "45²", bold: true },
          { text: "Lead: 4 → one more = 5 → 4×5 = 20" },
          { text: "Append 25 → 2025" },
          { text: "45² = 2025", result: true }
        ],
        middle: [
          { text: "115²", bold: true },
          { text: "Lead: 11 → one more = 12 → 11×12 = 132" },
          { text: "Append 25 → 13225" },
          { text: "115² = 13225", result: true }
        ],
        advanced: [
          { text: "295²", bold: true },
          { text: "Lead: 29 → one more = 30 → 29×30 = 870" },
          { text: "Append 25 → 87025" },
          { text: "295² = 87025", result: true }
        ]
      }
    },
    {
      id: 'nikhilam', mark: '02 · Nikhilam Navatashcaramam Dashatah', title: 'Subtracting from a power of 10', minLevel: 'primary',
      desc: {
        primary: 'Subtract each digit from 9, except the last digit — subtract that one from 10.',
        middle: 'Same rule against a bigger base — every digit from 9, last digit from 10.',
        advanced: 'Scales to any base of 10s — handy for quick estimation with large numbers.'
      },
      worked: {
        primary: [
          { text: "100 − 47", bold: true },
          { text: "4 → 9−4 = 5" },
          { text: "7 → 10−7 = 3" },
          { text: "100 − 47 = 53", result: true }
        ],
        middle: [
          { text: "1000 − 467", bold: true },
          { text: "4→5, 6→3, 7→3" },
          { text: "1000 − 467 = 533", result: true }
        ],
        advanced: [
          { text: "10000 − 4678", bold: true },
          { text: "4→5, 6→3, 7→2, 8→2" },
          { text: "10000 − 4678 = 5322", result: true }
        ]
      }
    },
    {
      id: 'criss', mark: '03 · Urdhva-Tiryagbhyam', title: 'Criss-cross multiplication', minLevel: 'primary',
      desc: {
        primary: 'Multiply the last digits, criss-cross multiply and add for the middle, then multiply the first digits — carrying as you go.',
        middle: 'Same three-step pattern with full two-digit numbers.',
        advanced: 'Extends to three-digit numbers with an extra diagonal in the middle step.'
      },
      worked: {
        primary: [
          { text: "23 × 14", bold: true },
          { text: "Right: 3×4=12 → write 2, carry 1" },
          { text: "Middle: (2×4)+(3×1)=11, +1=12 → write 2, carry 1" },
          { text: "Left: 2×1=2, +1=3" },
          { text: "23 × 14 = 322", result: true }
        ],
        middle: [
          { text: "67 × 84", bold: true },
          { text: "Right: 7×4=28 → write 8, carry 2" },
          { text: "Middle: (6×4)+(7×8)=24+56=80, +2=82 → write 2, carry 8" },
          { text: "Left: 6×8=48, +8=56" },
          { text: "67 × 84 = 5628", result: true }
        ],
        advanced: [
          { text: "234 × 156 (three diagonals)", bold: true },
          { text: "Right: 4×6=24 → write 4, carry 2" },
          { text: "Mid-right: (3×6)+(4×5)=18+20=38, +2=40 → write 0, carry 4" },
          { text: "Centre: (2×6)+(3×5)+(4×1)=12+15+4=31, +4=35 → write 5, carry 3" },
          { text: "Mid-left: (2×5)+(3×1)=13, +3=16 → write 6, carry 1" },
          { text: "Left: 2×1=2, +1=3" },
          { text: "234 × 156 = 36504", result: true }
        ]
      }
    },
    {
      id: 'missing', mark: '04 · Paraavartya Yojayet', title: 'Finding the missing number', minLevel: 'primary',
      desc: {
        primary: 'When a number "moves" across the equals sign, it changes from plus to minus (or minus to plus).',
        middle: 'Now with a multiplier too — move the constant across first, then undo the multiplication.',
        advanced: 'Two-step equations with subtraction and larger coefficients — same transpose-and-adjust idea.'
      },
      worked: {
        primary: [
          { text: "x + 8 = 15", bold: true },
          { text: "Move 8 across — it flips sign" },
          { text: "x = 15 − 8" },
          { text: "x = 7", result: true }
        ],
        middle: [
          { text: "3x + 4 = 19", bold: true },
          { text: "Move 4 across → 3x = 19 − 4 = 15" },
          { text: "Undo the ×3 → x = 15 ÷ 3" },
          { text: "x = 5", result: true }
        ],
        advanced: [
          { text: "5x − 7 = 38", bold: true },
          { text: "Move −7 across → 5x = 38 + 7 = 45" },
          { text: "Undo the ×5 → x = 45 ÷ 5" },
          { text: "x = 9", result: true }
        ]
      }
    },
    {
      id: 'simultaneous', mark: '07 · Sankalana-vyavakalanabhyam', title: 'Solving two equations at once', minLevel: 'middle',
      desc: {
        primary: 'Unlocks at Middle school level.',
        middle: 'Add the two equations to cancel one letter, then solve for the other — much quicker than substitution.',
        advanced: 'Same add-and-cancel idea, with larger coefficients or a subtraction step to isolate the second variable.'
      },
      worked: {
        primary: [],
        middle: [
          { text: "x + y = 10,  x − y = 2", bold: true },
          { text: "Add the equations: 2x = 12 → x = 6" },
          { text: "Substitute back: 6 + y = 10 → y = 4" },
          { text: "x = 6, y = 4", result: true }
        ],
        advanced: [
          { text: "x + y = 15,  x − y = 5", bold: true },
          { text: "Add: 2x = 20 → x = 10" },
          { text: "Subtract instead: 2y = 10 → y = 5" },
          { text: "x = 10, y = 5", result: true }
        ]
      }
    },
    {
      id: 'nearbase', mark: '10 · Yaavadunam', title: 'Squaring numbers close to a base', minLevel: 'primary',
      desc: {
        primary: 'Find how far the number is from 10, adjust by that amount for the tens part, then add the square of the difference.',
        middle: 'Same idea against a base of 100 — bigger numbers, same two steps.',
        advanced: 'Works against 1000 too, and with numbers below the base (using a negative deviation).'
      },
      worked: {
        primary: [
          { text: "12² (2 more than 10)", bold: true },
          { text: "Adjust: 12+2=14 → tens part 140" },
          { text: "Add 2²=4" },
          { text: "12² = 144", result: true }
        ],
        middle: [
          { text: "108² (8 more than 100)", bold: true },
          { text: "Adjust: 108+8=116 → part 11600" },
          { text: "Add 8²=64" },
          { text: "108² = 11664", result: true }
        ],
        advanced: [
          { text: "994² (6 less than 1000)", bold: true },
          { text: "Adjust: 994−6=988 → part 988000" },
          { text: "Add (−6)²=36" },
          { text: "994² = 988036", result: true }
        ]
      }
    },
    {
      id: 'digitsum', mark: '12 · Shesanyankena Charamena', title: 'Digit-sum divisibility check', minLevel: 'primary',
      desc: {
        primary: 'Add up the digits of a number. If that sum is divisible by 9, so is the original number.',
        middle: 'Same trick works on three-digit numbers — add the digits, check against 9.',
        advanced: 'Handy for large numbers too — repeatedly sum digits until you get a single digit (the "digital root").'
      },
      worked: {
        primary: [
          { text: "Is 63 divisible by 9?", bold: true },
          { text: "6 + 3 = 9" },
          { text: "9 is divisible by 9" },
          { text: "Yes — digit sum = 9", result: true }
        ],
        middle: [
          { text: "Is 432 divisible by 9?", bold: true },
          { text: "4 + 3 + 2 = 9" },
          { text: "Yes — digit sum = 9", result: true }
        ],
        advanced: [
          { text: "Is 8235 divisible by 9?", bold: true },
          { text: "8 + 2 + 3 + 5 = 18 → 1 + 8 = 9" },
          { text: "Yes — digital root = 9", result: true }
        ]
      }
    },
    {
      id: 'mult9', mark: '14 · Ekanyunena Purvena', title: 'Multiplying by 9, 99, or 999', minLevel: 'primary',
      desc: {
        primary: 'Multiplying by 9 is the same as multiplying by 10 and subtracting the number once.',
        middle: 'Multiplying by 99 works the same way — multiply by 100, then subtract the number once.',
        advanced: 'Extends to 999, 9999 and beyond — multiply by the next power of 10, subtract the number once.'
      },
      worked: {
        primary: [
          { text: "7 × 9", bold: true },
          { text: "7 × 10 = 70" },
          { text: "70 − 7 = 63" },
          { text: "7 × 9 = 63", result: true }
        ],
        middle: [
          { text: "23 × 99", bold: true },
          { text: "23 × 100 = 2300" },
          { text: "2300 − 23 = 2277" },
          { text: "23 × 99 = 2277", result: true }
        ],
        advanced: [
          { text: "146 × 999", bold: true },
          { text: "146 × 1000 = 146000" },
          { text: "146000 − 146 = 145854" },
          { text: "146 × 999 = 145854", result: true }
        ]
      }
    }
  ];

  // ─── Initialize Prompts ──────────────────────────────────────────────────
  const setupQuestion = (id, currentLvl) => {
    const qa = generateQA(id, currentLvl);
    setPrompts(prev => ({ ...prev, [id]: qa.prompt }));
    setAnswers(prev => ({ ...prev, [id]: qa.answer }));
    setInputs(prev => ({ ...prev, [id]: '' }));
    setFeedback(prev => ({ ...prev, [id]: null }));
  };

  useEffect(() => {
    practiceSections.forEach(sec => {
      setupQuestion(sec.id, level);
    });
  }, [level]);

  // ─── Verification ────────────────────────────────────────────────────────
  const handleCheck = (id) => {
    const userVal = parseInt(inputs[id], 10);
    const correctVal = answers[id];
    const isCorrect = userVal === correctVal;

    // Track score
    const currentScore = scores[id] || { correct: 0, total: 0 };
    const nextScore = {
      correct: currentScore.correct + (isCorrect ? 1 : 0),
      total: currentScore.total + 1
    };
    setScores(prev => ({ ...prev, [id]: nextScore }));

    if (isCorrect) {
      setFeedback(prev => ({ ...prev, [id]: { type: 'ok', msg: '✓ correct' } }));
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
    } else {
      setFeedback(prev => ({ ...prev, [id]: { type: 'no', msg: `✗ answer: ${correctVal}` } }));
    }
  };

  return (
    <div className="bg-[#1E2A24] text-[#F3EEDF] p-6 md:p-10 rounded-[32px] font-sans relative overflow-hidden shadow-2xl">
      {/* Decorative gradients matching the original */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#D9A441]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#71AE99]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero section */}
      <div className="relative z-10 space-y-4 max-w-3xl">
        <span className="font-mono text-[10px] tracking-widest text-[#71AE99] uppercase">Complete Reference · All Age Groups</span>
        <h1 className="font-serif text-3xl md:text-5xl leading-tight font-black">All 16 Vedic Maths Sutras</h1>
        <p className="text-sm md:text-base text-[#C9C3B0] leading-relaxed">
          The complete list, plus the 13 sub-sutras. Practice problems scale with the level you pick below — the same sutra, just bigger numbers as you grow.
        </p>
      </div>

      {/* Level switcher */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
        <div className="flex gap-1 bg-[#26362F] border border-white/10 rounded-full p-1.5 w-fit">
          {['primary', 'middle', 'advanced'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`font-mono text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
                level === lvl 
                  ? 'bg-[#D9A441] text-[#1E2A24] font-black' 
                  : 'text-[#C9C3B0] hover:text-[#F3EEDF]'
              }`}
            >
              {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-[#C9C3B0]">{LEVEL_LABELS[level]}</p>
      </div>

      {/* Main Table Reference */}
      <div className="mt-10 bg-[#26362F]/50 border border-white/5 rounded-3xl overflow-hidden relative z-10">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg md:text-xl font-bold">The 16 Main Sutras</h2>
            <p className="text-xs text-[#C9C3B0] mt-1">Click a sutra to jump directly to its practice or explanation.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 font-mono text-[10px] tracking-wider text-[#C9C3B0] uppercase w-12">#</th>
                <th className="p-4 font-mono text-[10px] tracking-wider text-[#C9C3B0] uppercase">Sutra</th>
                <th className="p-4 font-mono text-[10px] tracking-wider text-[#C9C3B0] uppercase">Meaning</th>
                <th className="p-4 font-mono text-[10px] tracking-wider text-[#C9C3B0] uppercase text-right">Requirement</th>
              </tr>
            </thead>
            <tbody>
              {ALL_SUTRAS.map(s => {
                const isLocked = !s.concept && (level === 'primary' && s.minLevel !== 'primary');
                return (
                  <tr key={s.n} className="border-b border-white/5 hover:bg-[#26362F]/40 transition-all">
                    <td className="p-4 font-mono text-[#C9C3B0]">{s.n}</td>
                    <td className="p-4 font-bold">
                      <a href={s.concept ? `#c-${s.n}` : `#${s.id}`} className="text-white hover:text-[#D9A441] transition-colors decoration-dotted underline underline-offset-4">
                        {s.name}
                      </a>
                    </td>
                    <td className="p-4 text-[#C9C3B0]">{s.meaning}</td>
                    <td className="p-4 text-right">
                      {s.concept ? (
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/5 text-[#C9C3B0] border border-white/5">conceptual</span>
                      ) : (
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
                          isLocked 
                            ? 'bg-rose-950/20 text-[#C9634C] border-rose-500/20' 
                            : 'bg-emerald-950/20 text-[#71AE99] border-emerald-500/20'
                        }`}>
                          {s.minLevel}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-sutras list */}
      <div className="mt-10 bg-[#26362F]/50 border border-white/5 rounded-3xl p-6 md:p-8 relative z-10">
        <h2 className="font-serif text-lg md:text-xl font-bold">The 13 Sub-Sutras</h2>
        <p className="text-xs text-[#C9C3B0] mt-1 mb-6">Companion rules that fine-tune the main formulas when algebra and polynomials appear.</p>
        <div className="grid md:grid-cols-2 gap-4 text-xs md:text-sm text-[#C9C3B0]">
          {SUB_SUTRAS.map(ss => (
            <div key={ss.n} className="flex gap-2.5">
              <span className="font-mono text-[#C9634C]">{ss.n}.</span>
              <p><strong className="text-white font-medium">{ss.name}</strong> — {ss.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practice exercises header */}
      <div className="mt-16 text-center space-y-2 relative z-10">
        <span className="font-mono text-[10px] tracking-widest text-[#71AE99] uppercase">Interactive Exercises</span>
        <h2 className="font-serif text-2xl md:text-3xl font-black">Train Your Vedic Speed</h2>
      </div>

      {/* Practice Blocks */}
      <div className="mt-8 space-y-10 relative z-10">
        {practiceSections.map(sec => {
          const unlockedLevels = ['primary', 'middle', 'advanced'];
          const userLevelIndex = unlockedLevels.indexOf(level);
          const minLevelIndex = unlockedLevels.indexOf(sec.minLevel);
          const isLocked = userLevelIndex < minLevelIndex;

          const activeWorked = sec.worked[level] || [];

          return (
            <section key={sec.id} id={sec.id} className="bg-[#26362F]/30 border border-white/5 rounded-3xl p-6 md:p-8 scroll-mt-24 hover:border-white/10 transition-all">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-[#C9634C]">{sec.mark}</span>
                <h3 className="font-serif text-xl font-bold text-white">{sec.title}</h3>
              </div>
              <p className="text-xs md:text-sm text-[#C9C3B0] mt-2 max-w-2xl leading-relaxed">{sec.desc[level]}</p>

              {/* Worked steps */}
              {!isLocked && activeWorked.length > 0 && (
                <div className="mt-5 bg-[#26362F] border border-white/5 rounded-2xl p-4 md:p-5 font-mono text-xs md:text-sm space-y-2.5">
                  {activeWorked.map((step, idx) => (
                    <div key={idx} className={`flex flex-col sm:flex-row sm:items-center ${step.result ? 'text-[#71AE99] border-t border-white/5 pt-2 mt-2 font-bold' : 'text-[#C9C3B0]'}`}>
                      {step.bold ? <strong className="text-[#D9A441]">{step.text}</strong> : <span>{step.text}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Quiz workspace */}
              <div className="mt-5">
                {isLocked ? (
                  <div className="border border-dashed border-white/10 rounded-2xl p-5 text-center text-xs md:text-sm text-[#C9C3B0] flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-[#C9634C]" />
                    <span>Unlocks at {sec.minLevel} level — switch the level tabs above to try it.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-dashed border-white/10 rounded-2xl p-5 flex flex-wrap items-center gap-4 bg-[#1E2A24]/40">
                      <span className="font-mono text-xl md:text-2xl text-white font-bold">{prompts[sec.id]}</span>
                      <input
                        type="number"
                        value={inputs[sec.id] || ''}
                        onChange={(e) => setInputs(prev => ({ ...prev, [sec.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleCheck(sec.id)}
                        placeholder="Answer"
                        className="bg-[#1E2A24] border border-white/10 rounded-xl px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#D9A441] w-28 md:w-32"
                      />
                      <button onClick={() => handleCheck(sec.id)} className="bg-[#D9A441] hover:bg-[#cba03b] text-[#1E2A24] px-5 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer transition-all active:scale-98">
                        Check
                      </button>
                      <button onClick={() => setupQuestion(sec.id, level)} className="border border-white/10 hover:bg-white/5 text-[#C9C3B0] px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-98">
                        New
                      </button>
                      {feedback[sec.id] && (
                        <span className={`font-mono text-xs flex items-center gap-1.5 ${feedback[sec.id].type === 'ok' ? 'text-[#71AE99]' : 'text-[#C9634C]'}`}>
                          {feedback[sec.id].type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {feedback[sec.id].msg}
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] md:text-xs text-[#C9C3B0] pl-1">
                      Score: {scores[sec.id]?.correct || 0} / {scores[sec.id]?.total || 0}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Advanced Conceptual Sutras */}
      <div className="mt-16 bg-[#26362F]/40 border border-white/5 rounded-3xl p-6 md:p-10 relative z-10 space-y-6">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-[#71AE99] uppercase">Advanced & Secondary Algebra</span>
          <h2 className="font-serif text-xl md:text-2xl font-bold mt-1">Conceptual Sutras — Equations & Factoring</h2>
          <p className="text-xs text-[#C9C3B0] mt-1">These eight are algebra and polynomial tools rather than arithmetic shortcuts. No quiz here — just the idea and a worked example.</p>
        </div>
        <div className="space-y-6 divide-y divide-white/5">
          {CONCEPTUAL_DETAILS.map(c => (
            <div key={c.n} id={`c-${c.n}`} className="pt-6 first:pt-0 space-y-3">
              <h4 className="font-serif text-base md:text-lg font-bold text-white">{c.n}. {c.name}</h4>
              <div className="font-mono text-xs text-[#C9634C] italic">"{c.meaning}"</div>
              <p className="text-xs md:text-sm text-[#C9C3B0] leading-relaxed max-w-3xl">{c.text}</p>
              <div className="bg-[#26362F] border border-white/5 rounded-2xl p-4 md:p-5 font-mono text-xs md:text-sm space-y-2 max-w-2xl">
                {c.worked.map((w, idx) => (
                  <div key={idx} className={w.result ? 'text-[#71AE99] font-bold border-t border-white/5 pt-2 mt-2' : 'text-[#C9C3B0]'}>
                    {w.bold ? <strong className="text-[#D9A441]">{w.text}</strong> : <span>{w.text}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer message */}
      <div className="mt-12 text-center text-[11px] font-mono text-[#C9C3B0] relative z-10 border-t border-white/5 pt-6">
        Work through each one a few times — the pattern becomes automatic faster than the rule does.
      </div>
    </div>
  );
}
