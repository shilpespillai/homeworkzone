const fs = require('fs');

const rawText = `GRADE 5 MATHS   A.	Place value and number sense
1	Place values
2	Writing numbers in words: convert words to digits
3	Writing numbers in words: convert digits to words
4	Convert between place values
5	Compare numbers up to millions
6	Put numbers in order
7	Roman numerals
8	Rounding
B.	Addition and subtraction
1	Estimate sums and differences of whole numbers
2	Estimate sums and differences: word problems
3	Add and subtract whole numbers
4	Add and subtract whole numbers: word problems
5	Complete addition and subtraction number sentences
6	Fill in the missing digits
7	Choose numbers with a particular sum or difference
8	Properties of addition
9	Inequalities with addition and subtraction
C.	Multiplication
1	Multiplication facts to 10
2	Multiplication facts to 10: word problems
3	Multiplication facts up to 10: find the missing factor
4	Multiplication number sentences up to 10: true or false?
5	Properties of multiplication
6	Multiply using properties
7	Distributive property: find the missing number
D.	Multiply by one-digit numbers
1	Multiplication patterns over increasing place values
2	Multiply numbers ending in zeros
3	Multiply numbers ending in zeros: word problems
4	Estimate products
5	Estimate products: word problems
6	Multiply one-digit numbers by three-digit or four-digit numbers: choose the area model
7	Multiply one-digit numbers by three-digit or four-digit numbers using area models
8	Multiply using the distributive property
9	Multiply one-digit numbers by three-digit or four-digit numbers using expanded form
10	Multiply one-digit numbers by multi-digit numbers using partial products
11	Multiply by one-digit numbers
12	Multiply by one-digit numbers: word problems
E.	Multiply by two-digit numbers
1	Multiply two-digit numbers by two-digit numbers: choose the area model
2	Multiply two-digit numbers by two-digit numbers using area models
3	Multiply two-digit numbers by two-digit numbers using partial products
4	Box multiplication
5	Lattice multiplication
6	Multiply two-digit numbers by two-digit numbers: complete the missing steps
7	Multiply two-digit numbers by two-digit numbers
8	Multiply two-digit numbers by larger numbers: complete the missing steps
9	Multiply two-digit numbers by larger numbers
10	Multiply by two-digit numbers: word problems
11	Use one multiplication fact to complete another
12	Multiply three or more numbers up to two digits each
13	Multiply three or more numbers: word problems
14	Choose numbers with a particular product
15	Inequalities with multiplication
F.	Division
1	Division facts to 10
2	Division facts to 10: word problems
3	Division facts up to 10: find the missing number
4	Division number sentences up to 10: true or false?
G.	Divide by one-digit numbers
1	Division patterns over increasing place values
2	Divide numbers ending in zeros
3	Divide numbers ending in zeros: word problems
4	Estimate quotients
5	Estimate quotients: word problems
6	Divide two-digit numbers by one-digit numbers using arrays
7	Divide three-digit numbers by one-digit numbers using area models
8	Divide using the distributive property
9	Divide using partial quotients
10	Divide by one-digit numbers
11	Divide by one-digit numbers: word problems
12	Divide by one-digit numbers: interpret remainders
13	Relate multiplication and division
14	Choose numbers with a particular quotient
H.	Factors, multiples and divisibility
1	Identify factors
2	Prime and composite numbers
3	Prime factorisation
4	Divisibility rules
5	Divisibility rules: word problems
6	Highest common factor
7	Identify multiples
8	Lowest common multiple
I.	Mixed operations: whole numbers
1	Add, subtract, multiply and divide whole numbers
2	Add, subtract, multiply and divide whole numbers: word problems
3	Write numerical expressions: one operation
4	Write numerical expressions for word problems
5	Evaluate numerical expressions using the order of operations
J.	Problem solving
1	Multi-step word problems
2	Multi-step word problems involving remainders
3	Multi-step word problems: identify reasonable answers
4	Word problems with extra or missing information
K.	Fractions
1	Fractions review
2	Fractions of a whole: word problems
3	Fractions of a group: word problems
4	Fractions on number lines
5	Equivalent fractions
6	Write fractions in lowest terms
7	Lowest common denominator
8	Relate division and fractions
9	Understand fractions as division: word problems
10	Patterns of equivalent fractions
11	Fractions of a number
12	Fractions of a number: word problems
L.	Mixed numbers
1	Identify mixed numbers
2	Convert between improper fractions and mixed numbers
3	Round mixed numbers
M.	Compare fractions
1	Compare unit fractions using models
2	Compare unit fractions using number lines
3	Compare unit fractions
4	Compare fractions with like denominators using models
5	Compare fractions with like denominators using number lines
6	Compare fractions with like denominators
7	Compare fractions with unlike denominators using models
8	Compare fractions with unlike denominators using number lines
9	Compare fractions with unlike denominators
10	Put fractions in order
11	Compare mixed numbers
N.	Understand fraction addition and subtraction
1	Estimate sums and differences of fractions using benchmarks
2	Decompose fractions into unit fractions using models
3	Decompose fractions into unit fractions
4	Decompose fractions
5	Decompose fractions multiple ways
6	Add fractions with like denominators using area models
7	Add fractions with like denominators using strip models
8	Add fractions with like denominators using number lines
9	Subtract fractions with like denominators using area models
10	Subtract fractions with like denominators using strip models
11	Subtract fractions with like denominators using number lines
12	Add and subtract fractions with like denominators using number lines
O.	Add and subtract fractions with like denominators
1	Add fractions with like denominators
2	Subtract fractions with like denominators
3	Add and subtract fractions with like denominators
4	Add and subtract fractions with like denominators: word problems
5	Add three or more fractions with like denominators
6	Add and subtract mixed numbers with like denominators - without regrouping
7	Add mixed numbers with like denominators
8	Subtract mixed numbers with like denominators
9	Add and subtract mixed numbers with like denominators
10	Add and subtract mixed numbers with like denominators: word problems
P.	Add and subtract fractions with unlike denominators
1	Add fractions: denominators of 10 and 100
2	Add up to four fractions with denominators of 10 and 100
3	Add fractions with unlike denominators using models
4	Add fractions with unlike denominators
5	Subtract fractions with unlike denominators using models
6	Subtract fractions with unlike denominators
7	Add and subtract fractions with unlike denominators
8	Add and subtract fractions with unlike denominators: word problems
9	Add and subtract mixed numbers with unlike denominators
10	Add and subtract mixed numbers with unlike denominators: word problems
11	Add three or more fractions with unlike denominators
12	Add three or more fractions: word problems
13	Complete addition and subtraction number sentences with fractions
14	Inequalities with addition and subtraction of fractions
15	Compare sums and differences of mixed numbers
16	Estimate sums and differences of mixed numbers
Q.	Decimal place value
1	What decimal number is illustrated?
2	Understanding decimals expressed in words
3	Place values in decimal numbers
4	Relationship between decimal place values
5	Convert decimals between ordinary decimal and expanded form
6	Convert decimals between ordinary decimal and expanded form using fractions
7	Round decimals
8	Decimal number lines
R.	Compare decimals
1	Equivalent decimals
2	Compare decimals using models
3	Compare decimals to a model
4	Compare decimals on number lines
5	Compare decimal numbers
•	New! Put decimal numbers in order using number lines
6	Put decimal numbers in order
7	Compare, order and round decimals: word problems
S.	Convert between decimals and fractions
1	Model decimals and fractions
2	Convert fractions and mixed numbers to decimals
3	Convert decimals to fractions and mixed numbers
T.	Compare decimals and fractions
1	Compare decimals and fractions on number lines
2	Compare decimals and fractions
3	Put a mix of decimals, fractions and mixed numbers in order
U.	Add and subtract decimals
1	Add decimal numbers
2	Subtract decimal numbers
3	Add and subtract decimal numbers
4	Add and subtract decimals: word problems
5	Choose decimals with a particular sum or difference
6	Complete addition and subtraction number sentences with decimals
7	Estimate sums and differences of decimals using rounding
V.	Multiply and divide decimals
1	Estimate products of whole numbers and decimals
2	Multiply a decimal by a power of ten
3	Multiply by 0.1 or 0.01
4	Multiply by a power of ten with decimals: find the missing number
5	Divide by powers of ten
6	Decimal division patterns over increasing place values
7	Divide a whole number or decimal by a power of ten: find the missing number
8	Divide by 0.1 or 0.01
W.	Money
1	Add and subtract money amounts
2	Add and subtract money: word problems
3	Multiply money amounts: word problems
4	Divide money amounts: word problems
5	Price lists
X.	Time
1	Convert time units
2	Elapsed time
3	Find start and end times: word problems
•	New! Find the start time, the end time or the elapsed time: word problems
4	Convert between 12-hour and 24-hour time
5	Time zones - 12-hour time
6	Time zones - 24-hour time
7	Schedules and timelines - 12-hour time
8	Schedules - 24-hour time
9	Time patterns
Y.	Measurement
1	Which metric unit is appropriate?
2	Compare metric units of length
3	Compare metric units of mass
4	Compare metric units of volume
5	Choose the more reasonable temperature
Z.	Coordinate plane
1	Objects on a coordinate plane
2	Graph points on a coordinate plane
3	Coordinate planes as maps
4	Follow directions on a coordinate plane
AA.	Data and graphs
1	Create picture graphs
2	Interpret picture graphs
3	Read a table
4	Interpret dot plots
5	Create dot plots
6	Interpret line graphs
7	Create line graphs
8	Create bar graphs
9	Interpret bar graphs
10	Interpret frequency tables
11	Choose the best type of graph
BB.	Probability and statistics
1	Understanding probability
2	Find the probability
3	Make predictions
4	Identify independent and dependent events
5	Combinations
6	Find the mode
7	Interpret charts and graphs to find the mode
CC.	Perimeter
1	Perimeter of rectangles
2	Perimeter of polygons
3	Perimeter with fractional side lengths
4	Perimeter of figures on grids
DD.	Area
1	Area of squares and rectangles
2	Area of figures on grids
3	Area and perimeter: word problems
4	Use area and perimeter to determine cost
EE.	Volume
1	Volume of rectangular prisms made of unit cubes
2	Volume of irregular figures made of unit cubes
FF.	Angles
1	Angles greater than, less than or equal to a right angle
2	Angles of 90, 180, 270 and 360 degrees
3	Acute, right, obtuse and straight angles
4	Measure angles on a circle
5	Measure angles with a protractor
6	Draw angles with a protractor
7	Estimate angle measurements
GG.	Triangles
1	Acute, obtuse and right-angled triangles
2	Scalene, isosceles and equilateral triangles
3	Classify triangles
HH.	Quadrilaterals
1	Parallel sides in quadrilaterals
2	Identify parallelograms
3	Identify trapeziums
4	Identify rectangles
5	Identify rhombuses
6	Classify quadrilaterals
7	Identify the relationships between quadrilaterals
II.	Polygons
1	Is it a polygon?
2	Number of sides in polygons
3	Regular and irregular polygons
4	Sort polygons into Venn diagrams
5	Properties of polygons
JJ.	Symmetry and transformations
1	Lines of symmetry
2	Rotational symmetry
3	Reflection, rotation and translation
KK.	Three-dimensional figures
1	Identify three-dimensional figures
2	Count vertices, edges and faces
3	Identify faces of three-dimensional figures
4	Nets of three-dimensional figures
5	Three-dimensional figures viewed from different perspectives
LL.	Financial literacy
1	Budget a weekly allowance: word problems
2	Reading financial records
3	Keeping financial records
4	Balance a budget
5	Adjust a budget
MM.	Percents
1	What percentage is illustrated?
2	Convert fractions to percents using grid models
3	Convert between percents and fractions
4	Convert between percents, fractions and decimals
5	Convert between percents, fractions and decimals: word problems
6	Compare percents to each other and to fractions
7	Compare percents and fractions: word problems
8	Estimate percents of numbers
9	Percents of numbers and money amounts
NN.	Number sequences
1	Use a rule to complete a number sequence
2	Arithmetic sequences with whole numbers
3	Arithmetic sequences with decimals
4	Increasing number sequences
5	Geometric number sequences
6	Number sequences: mixed review
7	Number sequences: word problems`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  if (line.startsWith("GRADE 5 MATHS")) {
    // Looks like: "GRADE 5 MATHS   A.	Place value and number sense"
    const match = line.match(/GRADE 5 MATHS\s+(A\.\s+.+)/);
    if (match) {
        currentCategory = match[1].trim();
    } else {
        currentCategory = line.replace("GRADE 5 MATHS", "").trim();
    }
    continue;
  }
  
  const categoryMatch = line.match(/^([A-Z]{1,2})\.\s+(.+)$/);
  if (categoryMatch) {
    currentCategory = line; // e.g., "B. Comparing and ordering"
    continue;
  }
  
  // Is a skill line?
  let skillTitle = line;
  const numMatch = line.match(/^(\d+|•\s*New!)\s+(.+)$/);
  if (numMatch) {
    skillTitle = numMatch[2].trim();
  }
  
  result.push({
    id: `5_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataGrade5Maths.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " Grade 5 Maths skills.");
