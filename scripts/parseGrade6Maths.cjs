const fs = require('fs');

const rawText = `YEAR 6 MATHS - A.	Whole numbers
1	Place values in whole numbers
2	Word names for numbers
3	Roman numerals
B.	Multiplication
1	Multiply using area models I
2	Multiply using area models II
3	Multiply using the distributive property
4	Lattice multiplication
5	Multiply whole numbers
6	Multiply whole numbers: word problems
7	Multiply numbers ending in zeros
8	Multiply numbers ending in zeros: word problems
9	Multiply three or more numbers
10	Multiply three or more numbers: word problems
11	Estimate products
12	Properties of multiplication
13	Solve using properties of multiplication
C.	Division
1	Divisibility rules
2	Divide by two-digit numbers
3	Divide by two-digit numbers: word problems
4	Division patterns with zeros
5	Divide numbers ending in zeros: word problems
6	Estimate quotients using compatible numbers
7	Estimate quotients
D.	Exponents
1	Write multiplication expressions using exponents
2	Evaluate powers
3	Find the missing exponent or base
E.	Number theory
1	Prime or composite
2	Identify factors
3	Prime factorisation
4	Prime factorisation with exponents
5	Highest common factor
6	Lowest common multiple
7	HCF and LCM: word problems
8	Square numbers
F.	Decimals
1	What decimal number is illustrated?
2	Decimal place values
3	Word names for decimal numbers
4	Put decimal numbers in order
5	Inequalities with decimals
6	Round decimals
7	Round whole numbers and decimals: find the missing digit
8	Decimal number lines
G.	Addition and subtraction
1	Add and subtract whole numbers up to millions
2	Add and subtract whole numbers: word problems
3	Properties of addition
4	Estimate sums and differences of whole numbers
5	Estimate sums and differences: word problems
6	Add decimal numbers
7	Subtract decimal numbers
8	Add and subtract decimal numbers
9	Add and subtract decimals: word problems
10	Estimate sums and differences of decimals using rounding
11	Estimate sums and differences of decimals using benchmarks
12	Maps with decimal distances
H.	Multiply and divide decimals
1	Multiply a decimal by a power of ten
2	Multiply a decimal by a one-digit number using the distributive property
3	Multiply a decimal by a one-digit whole number
4	Multiply a decimal by a two-digit number using area models
5	Multiply a decimal by a multi-digit whole number
6	Multiply decimals and whole numbers: word problems
7	Multiply two decimals
8	Estimate products of decimal numbers
9	Inequalities with decimal multiplication
10	Divide decimals by powers of ten
11	Decimal division patterns over increasing place values
12	Divide a whole number or decimal by a power of ten: find the missing number
13	Divide decimals using area models: complete the equation
14	Divide decimals by whole numbers
15	Divide decimals by whole numbers: word problems
I.	Fractions and mixed numbers
1	Fractions and mixed numbers review
2	Understanding fractions: word problems
3	Find equivalent fractions using area models
4	Graph equivalent fractions on number lines
5	Equivalent fractions
6	Write fractions in lowest terms
7	Fractions: word problems
8	Lowest common denominator
9	Graph and compare fractions on number lines
10	Compare fractions with like and unlike denominators
11	Compare fractions: word problems
12	Convert between improper fractions and mixed numbers
13	Convert fractions or mixed numbers to decimals
14	Convert decimals to fractions or mixed numbers
15	Convert between decimals and fractions or mixed numbers
16	Put a mix of decimals, fractions and mixed numbers in order
J.	Add and subtract fractions
1	Add and subtract fractions with like denominators using number lines
2	Add and subtract fractions with like denominators
3	Add and subtract fractions with like denominators: word problems
4	Inequalities with addition and subtraction of like fractions
5	Add fractions with unlike denominators using models
6	Add fractions with unlike denominators
7	Subtract fractions with unlike denominators using models
8	Subtract fractions with unlike denominators
9	Add and subtract fractions with unlike denominators: word problems
10	Estimate sums and differences of fractions using benchmarks
11	Add and subtract mixed numbers with like denominators
12	Add and subtract mixed numbers with unlike denominators
13	Add and subtract mixed numbers with like or unlike denominators: word problems
14	Estimate sums and differences of mixed numbers
K.	Multiply fractions
1	Fractions of a number
2	Fractions of a number: word problems
3	Multiply unit fractions by whole numbers using number lines
4	Multiples of fractions
5	Multiply fractions by whole numbers using number lines
6	Multiply fractions by whole numbers I
7	Multiply fractions by whole numbers II
8	Estimate products of fractions and whole numbers
9	Multiply fractions by whole numbers: input/output tables
10	Multiply mixed numbers and whole numbers
L.	Integers
1	Understanding integers
2	Integers on number lines
3	Graph integers on horizontal and vertical number lines
4	Compare and order integers using number lines
5	Compare integers
6	Put integers in order
7	Add integers using number lines
8	Subtract integers using number lines
M.	Mixed operations
1	Add, subtract, multiply or divide two whole numbers
2	Add, subtract, multiply or divide two whole numbers: word problems
3	Evaluate numerical expressions
4	Evaluate numerical expressions with brackets
5	Identify mistakes involving the order of operations
6	Evaluate numerical expressions with brackets in different places
7	Add, subtract, multiply or divide two decimals
8	Add, subtract, multiply or divide two decimals: word problems
9	Evaluate numerical expressions involving decimals
10	Add, subtract or multiply two fractions
11	Add, subtract or multiply two fractions: word problems
N.	Problem solving and estimation
1	Estimate to solve word problems
2	Multi-step word problems
3	Word problems with extra or missing information
4	Guess-and-check word problems
5	Distance/direction to starting point
6	Use logical reasoning to find the order
O.	Ratios and rates
1	Write a ratio
2	Write a ratio: word problems
3	Identify equivalent ratios
4	Write an equivalent ratio
5	Unit rates and equivalent rates
P.	Percents
1	What percentage is illustrated?
2	Convert fractions to percents using grid models
3	Convert between percents, fractions and decimals
4	Convert between percents, fractions and decimals: word problems
5	Compare percents to each other and to fractions
6	Compare percents and fractions: word problems
7	Estimate percents of numbers
8	Percents of numbers and money amounts
9	Percents of numbers: word problems
10	Find what percent one number is of another
11	Find what percent one number is of another: word problems
Q.	Units of measurement
1	Estimate metric measurements
2	Convert and compare metric units of length
3	Convert and compare metric units of mass
4	Convert and compare metric units of volume
5	Convert and compare metric units
6	Convert metric units involving decimals
7	Conversion tables
8	Metric mixed units
9	Convert between cubic centimetres, millilitres and litres
10	Convert between square metres and hectares
11	Compare temperatures above and below zero
R.	Money
1	Find the number of each type of coin
2	Add and subtract money amounts
3	Add and subtract money amounts: word problems
4	Multiply money by whole numbers
5	Multiply money: word problems
6	Divide money amounts
7	Divide money amounts: word problems
S.	Consumer maths
1	Which is the better coupon?
2	Unit prices
3	Unit prices with fractions and decimals
4	Sale prices
T.	Time
1	Elapsed time
2	Elapsed time: word problems
3	Find start and end times
4	Time units
5	Convert between 12-hour and 24-hour time
6	Reading schedules
7	Transportation schedules - 24-hour time
U.	Coordinate plane
1	Objects on a coordinate plane - first quadrant only
2	Objects on a coordinate plane - all four quadrants
3	Graph points on a coordinate plane
4	Quadrants
5	Coordinate planes as maps
6	Follow directions on a coordinate plane
V.	Number sequences
1	Arithmetic sequences with whole numbers
2	Arithmetic sequences with decimals
3	Arithmetic sequences with fractions
4	Complete an increasing number sequence
5	Complete a geometric number sequence
6	Use a rule to complete a number sequence
7	Identify mistakes in number patterns
8	Number sequences: word problems
9	Number sequences: mixed review
10	Shape patterns
W.	Variable expressions
1	Write variable expressions
2	Write variable expressions: word problems
3	Evaluate variable expressions with whole numbers
4	Identify terms and coefficients
X.	One-variable equations
1	Does x satisfy an equation?
2	Which x satisfies an equation?
3	Write an equation from words
4	Model and solve equations using algebra tiles
5	Write and solve equations that represent diagrams
6	Solve one-step equations with whole numbers
7	Solve one-step equations: word problems
Y.	Two-dimensional figures
1	Identify and classify polygons
2	Measure and classify angles
3	Find a missing angle - adjacent angles
4	Estimate angle measurements
5	Name angles
6	Identify complementary, supplementary, vertical, adjacent and congruent angles
7	Find measures of complementary, supplementary, vertical and adjacent angles
8	Transversal of parallel lines
Z.	Symmetry and transformations
1	Symmetry
2	Reflection, rotation and translation
3	Translations: graph the image
4	Reflections: graph the image
5	Rotations: graph the image
6	Sequences of transformations: graph the image
AA.	Three-dimensional figures
1	Identify polyhedra
2	Which figure is being described?
3	Nets of three-dimensional figures
4	Front, side and top view
5	Cross sections of three-dimensional figures
BB.	Geometric measurement
1	Perimeter
2	Area of squares and rectangles
3	Area and perimeter of figures on grids
4	Area and perimeter: word problems
5	Rectangles: relationship between perimeter and area
6	Compare area and perimeter of two figures
CC.	Data and graphs
1	Interpret picture graphs
2	Create picture graphs
3	Interpret dot plots
4	Create dot plots
5	Interpret stem-and-leaf plots
6	Create stem-and-leaf plots
7	Create frequency tables
8	Interpret bar graphs
9	Create bar graphs
10	Interpret double bar graphs
11	Create double bar graphs
12	Circle graphs with fractions
13	Interpret line graphs
14	Create line graphs
15	Interpret double line graphs
16	Create double line graphs
17	Choose the best type of graph
DD.	Statistics
•	New! Identify statistical questions
1	Calculate the mean
2	Calculate the median
3	Calculate the mode
4	Calculate the range
5	Interpret charts to find the mean
6	Interpret charts to find the median
7	Interpret charts and graphs to find the mode
8	Interpret charts to find the range
9	Mean, median, mode and range: find the missing number
EE.	Probability
1	Combinations
2	Probability of one event
3	Make predictions
4	Experimental probability
5	Probability of opposite, mutually exclusive and overlapping events
6	Identify independent and dependent events`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  if (line.startsWith("YEAR 6 MATHS")) {
    const match = line.match(/YEAR 6 MATHS\s+-\s+(A\.\s+.+)/);
    if (match) {
        currentCategory = match[1].trim();
    } else {
        currentCategory = line.replace("YEAR 6 MATHS -", "").trim();
    }
    continue;
  }
  
  const categoryMatch = line.match(/^([A-Z]{1,2})\.\s+(.+)$/);
  if (categoryMatch) {
    currentCategory = line; // e.g., "B. Multiplication"
    continue;
  }
  
  // Is a skill line?
  let skillTitle = line;
  const numMatch = line.match(/^(\d+|•\s*New!)\s+(.+)$/);
  if (numMatch) {
    skillTitle = numMatch[2].trim();
  }
  
  result.push({
    id: `6_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataGrade6Maths.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " Grade 6 Maths skills.");
