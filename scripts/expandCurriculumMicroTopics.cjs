const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/curriculum.js');

let content = fs.readFileSync(curriculumPath, 'utf8');

// Parse curriculum object by executing module in safe sandbox
const vm = require('vm');
const sandbox = { exports: {} };
vm.createContext(sandbox);
vm.runInContext(content.replace('export const curriculum =', 'exports.curriculum ='), sandbox);

const curriculum = sandbox.exports.curriculum;

const microTopics = {
  'Logical Reasoning': [
    { title: 'Knights & Knaves — 2-Person Truth/Liar Deduction', category: 'Logic & Reasoning' },
    { title: 'Knights & Knaves — 3-Person Truth/Liar Deduction', category: 'Logic & Reasoning' },
    { title: 'Linear Seating Arrangement — 5-6 Person Constraint Solving', category: 'Logic & Reasoning' },
    { title: 'Circular Seating Arrangement — Facing Inward vs. Outward', category: 'Logic & Reasoning' },
    { title: 'Matrix Grid Matching — Multi-Variable Logic Elimination', category: 'Logic & Reasoning' },
    { title: 'Conditional Logic — Identifying Contrapositive Validity', category: 'Logic & Reasoning' },
    { title: 'Conditional Logic — Identifying Converse & Inverse Fallacies', category: 'Logic & Reasoning' },
    { title: 'Data & Venn Logic — 3-Set Venn Diagram Overlap Calculation', category: 'Logic & Reasoning' },
    { title: 'Data & Venn Logic — Decision Tree Network Condition Tracking', category: 'Logic & Reasoning' },
    { title: 'Verbal Analogies — Synonyms & Antonyms Relational Pairs', category: 'Logic & Reasoning' },
    { title: 'Verbal Analogies — Part-to-Whole and Cause-to-Effect Pairs', category: 'Logic & Reasoning' },
    { title: 'Letter Cipher Cracking — Single & Double Shift Alphabetical Rules', category: 'Logic & Reasoning' },
    { title: 'Letter Cipher Cracking — Reversed Alphabet & Symbol Substitution', category: 'Logic & Reasoning' },
    { title: 'Deductive Syllogisms — Categorical Syllogisms (All A are B, No B are C)', category: 'Logic & Reasoning' },
    { title: 'Spatial Reasoning — 2D Pattern Matrix Completion', category: 'Logic & Reasoning' },
    { title: 'Spatial Reasoning — 3D Cube Net Folding and Orientation', category: 'Logic & Reasoning' },
    { title: 'Spatial Reasoning — Paper Folding and Punch-Hole Symmetry', category: 'Logic & Reasoning' },
    { title: 'Spatial Reasoning — Mirror Reflection and Rotational Invariance', category: 'Logic & Reasoning' }
  ],
  'Critical Thinking': [
    { title: 'Identifying Flaws — Correlation vs. Causation Error', category: 'Critical Thinking' },
    { title: 'Identifying Flaws — Straw Man & Ad Hominem Distortions', category: 'Critical Thinking' },
    { title: 'Identifying Flaws — Over-Generalization & Slippery Slope', category: 'Critical Thinking' },
    { title: 'Evaluating Arguments — Finding Statements That MOST Strengthen a Claim', category: 'Critical Thinking' },
    { title: 'Evaluating Arguments — Finding Statements That MOST Weaken a Claim', category: 'Critical Thinking' },
    { title: 'Evaluating Arguments — Identifying Unstated Implicit Assumptions', category: 'Critical Thinking' },
    { title: 'Evaluating Arguments — Perspective & Point of View Analysis', category: 'Critical Thinking' },
    { title: 'Socratic Inquiry — Distinguishing Fact from Opinion', category: 'Critical Thinking' },
    { title: 'Socratic Inquiry — Questioning Premise Validity and Bias', category: 'Critical Thinking' },
    { title: 'Formal Fallacies — Affirming the Consequent & Denying the Antecedent', category: 'Critical Thinking' },
    { title: 'Informal Fallacies — Appeal to Authority & False Dilemma', category: 'Critical Thinking' }
  ],
  'Computer Science': [
    { title: 'Pseudocode Tracing — FOR Loop Nested Counter Tracking', category: 'Computer Science' },
    { title: 'Pseudocode Tracing — WHILE Loop Condition Evaluation & Infinite Loop Traps', category: 'Computer Science' },
    { title: 'Pseudocode Tracing — IF-ELSE Nested Decision Tree State Tables', category: 'Computer Science' },
    { title: 'Data Representation — Binary to Decimal & Decimal to Binary Conversions', category: 'Computer Science' },
    { title: 'Data Representation — Hexadecimal Color Code Breakdown (#RRGGBB)', category: 'Computer Science' },
    { title: 'Data Representation — Lossy vs. Lossless Image Compression Trade-offs', category: 'Computer Science' },
    { title: 'Networks & Internet — IP Address Subnet Routing & Packet Header Roles', category: 'Computer Science' },
    { title: 'Networks & Internet — DNS Lookup Process and HTTP/HTTPS Encryption', category: 'Computer Science' },
    { title: 'Databases & SQL — Basic SQL Queries (SELECT, WHERE, ORDER BY)', category: 'Computer Science' },
    { title: 'Databases & SQL — Relational Table Primary Key & Foreign Key Links', category: 'Computer Science' },
    { title: 'Web Development — HTML Structural Tags (div, p, header, section)', category: 'Computer Science' },
    { title: 'Web Development — CSS Selector Rules (class, id, hover state)', category: 'Computer Science' },
    { title: 'Cybersecurity — Phishing Detection and Password Hashing Principles', category: 'Computer Science' }
  ],
  'Financial Literacy': [
    { title: 'Money Basics — Coin & Bill Identification & Value Counting', category: 'Financial Literacy' },
    { title: 'Budgeting — Needs vs. Wants Categorization & Priority Spending', category: 'Financial Literacy' },
    { title: 'Budgeting — Income, Fixed Expenses, and Variable Savings Tracking', category: 'Financial Literacy' },
    { title: 'Banking & Interest — Simple Interest Formula I = PRT Calculations', category: 'Financial Literacy' },
    { title: 'Banking & Interest — Compound Interest Growth & Rule of 72', category: 'Financial Literacy' },
    { title: 'Economics — Inflation Purchasing Power Impact', category: 'Financial Literacy' },
    { title: 'Investments — Stocks, Dividends, and Market Risk Diversification', category: 'Financial Literacy' },
    { title: 'Investments — Bonds, Yields, and Fixed-Income Assets', category: 'Financial Literacy' },
    { title: 'Corporate Finance — Profit, Loss, Revenue, and Gross Margin Calculations', category: 'Financial Literacy' },
    { title: 'Taxes — Sales Tax, Income Tax Brackets, and Net Pay Computation', category: 'Financial Literacy' }
  ],
  'Environmental Science': [
    { title: 'Ecosystems — Food Chains, Food Webs, and Trophic Energy Pyramids', category: 'Environmental Science' },
    { title: 'Ecosystems — Biome Classification (Rainforest, Tundra, Desert, Savannah)', category: 'Environmental Science' },
    { title: 'Biogeochemical Cycles — Water Cycle Steps (Evaporation, Transpiration, Condensation)', category: 'Environmental Science' },
    { title: 'Biogeochemical Cycles — Carbon Cycle & Global Warming Atmosphere Impacts', category: 'Environmental Science' },
    { title: 'Biogeochemical Cycles — Nitrogen Cycle & Soil Nutrient Replenishment', category: 'Environmental Science' },
    { title: 'Conservation — Renewable Energy (Solar, Wind, Hydro, Geothermal)', category: 'Environmental Science' },
    { title: 'Conservation — Waste Reduction: 3 Rs (Reduce, Reuse, Recycle)', category: 'Environmental Science' },
    { title: 'Conservation — Marine Pollution, Microplastics, and Ocean Acidification', category: 'Environmental Science' },
    { title: 'Global Goals — UN Sustainable Development Goals (SDGs) Analysis', category: 'Environmental Science' }
  ],
  'Olympiad': [
    { title: 'Combinatorics — Grid Path Counting via Pascal Triangle Logic', category: 'Olympiad' },
    { title: 'Combinatorics — Permutations vs. Combinations in Real Scenarios', category: 'Olympiad' },
    { title: 'Combinatorics — Pigeonhole Principle Minimum Item Selection', category: 'Olympiad' },
    { title: 'Number Theory — Modular Arithmetic Remainders & Cycle Length', category: 'Olympiad' },
    { title: 'Number Theory — Alphametics & Cryptarithm Addition Letter Solving', category: 'Olympiad' },
    { title: 'Number Theory — Prime Factorization & Number of Divisors Formula', category: 'Olympiad' },
    { title: 'Non-Routine Geometry — Shaded Region Areas of Overlapping Circles & Squares', category: 'Olympiad' },
    { title: 'Non-Routine Geometry — Angle Chasing in Polygons & Cyclic Quadrilaterals', category: 'Olympiad' },
    { title: 'Olympiad Rates — Catch-Up Distance-Time-Speed Calculations', category: 'Olympiad' },
    { title: 'Olympiad Rates — Simultaneous Filling and Draining Tank Rates', category: 'Olympiad' }
  ]
};

let addedCount = 0;

Object.keys(curriculum).forEach(grade => {
  const gradeObj = curriculum[grade];
  if (!gradeObj) return;

  Object.keys(microTopics).forEach(subject => {
    if (!gradeObj[subject]) {
      gradeObj[subject] = [];
    }

    const currentTitles = new Set(gradeObj[subject].map(item => item.title));
    const gradeCode = grade.toLowerCase().replace(/[^a-z0-9]/g, '');

    microTopics[subject].forEach((top, idx) => {
      if (!currentTitles.has(top.title)) {
        gradeObj[subject].push({
          id: `${gradeCode}_${subject.toLowerCase().replace(/[^a-z]/g, '')}_micro_${idx + 1}`,
          title: top.title,
          category: top.category
        });
        addedCount++;
      }
    });
  });
});

console.log(`Added ${addedCount} detailed micro-topics across grades!`);

const output = `export const curriculum = ${JSON.stringify(curriculum, null, 2)};\n`;
fs.writeFileSync(curriculumPath, output, 'utf8');
console.log('curriculum.js updated successfully!');
