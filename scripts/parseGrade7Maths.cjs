const fs = require('fs');

const rawText = `YEAR 7 MATHS - Number theory
1	Prime or composite
2	Prime factorisation
3	Multiplicative inverses
4	Divisibility rules
5	Highest common factor
6	Lowest common multiple
7	HCF and LCM: word problems
8	Classify numbers
B.	Integers
1	Understanding integers
2	Integers on number lines
3	Graph integers on horizontal and vertical number lines
4	Compare integers
5	Order integers
C.	Operations with integers
1	Integer addition rules
2	Add integers using counters
3	Add integers using number lines
4	Add integers
5	Integer subtraction rules
6	Subtract integers using counters
7	Subtract integers using number lines
8	Subtract integers
9	Integer addition and subtraction rules
10	Add and subtract integers using counters
11	Add and subtract integers
12	Complete addition and subtraction number sentences with integers
13	Add and subtract integers: word problems
14	Integer multiplication rules
15	Multiply integers
16	Integer division rules
17	Divide integers
18	Evaluate numerical expressions involving integers
D.	Decimals
1	Decimal numbers review
2	Compare and order decimals
3	Decimal number lines
4	Round decimals
E.	Operations with decimals
1	Add and subtract decimals
2	Add and subtract decimals: word problems
3	Estimate sums and differences of decimals
4	Multiply decimals and whole numbers
5	Multiply decimals and whole numbers: word problems
6	Multiply decimals using grids
7	Multiply decimals
8	Estimate products of decimals
9	Divide decimals by whole numbers
10	Divide decimals by whole numbers: word problems
11	Divide decimals
12	Estimate quotients of decimals
13	Multiply and divide decimals: word problems
14	Add, subtract, multiply and divide decimals: word problems
15	Multi-step inequalities with decimals
16	Maps with decimal distances
17	Evaluate numerical expressions involving decimals
F.	Fractions and mixed numbers
1	Understanding fractions: word problems
2	Graph equivalent fractions on number lines
3	Equivalent fractions
4	Write fractions in lowest terms
5	Fractions: word problems with graphs and tables
6	Lowest common denominator
7	Compare and order fractions
8	Compare fractions: word problems
9	Convert between mixed numbers and improper fractions
10	Compare mixed numbers and improper fractions
11	Round mixed numbers
G.	Add and subtract fractions
1	Add and subtract fractions with like denominators
2	Add and subtract fractions with like denominators: word problems
3	Add fractions with unlike denominators using models
4	Add fractions with unlike denominators
5	Subtract fractions with unlike denominators using models
6	Subtract fractions with unlike denominators
7	Add and subtract fractions with unlike denominators: word problems
8	Add and subtract mixed numbers
9	Add and subtract mixed numbers: word problems
10	Inequalities with addition and subtraction of fractions and mixed numbers
11	Estimate sums and differences of mixed numbers
H.	Multiply and divide fractions
1	Multiply unit fractions by whole numbers using number lines
2	Multiply unit fractions by whole numbers using models
3	Multiples of fractions
4	Multiply fractions by whole numbers using arrays
5	Multiply fractions by whole numbers using number lines
6	Multiplying fractions by whole numbers: choose the model
7	Multiply fractions and whole numbers
8	Multiply fractions and whole numbers: word problems
9	Multiply two unit fractions using models
10	Multiply two fractions using models
11	Multiply fractions
12	Multiply fractions: word problems
13	Multiply three or more fractions and whole numbers
14	Divide unit fractions by whole numbers using models
15	Divide whole numbers by unit fractions using models
16	Divide whole numbers and unit fractions using area models
17	Reciprocals
18	Divide whole numbers and unit fractions
19	Divide fractions by whole numbers
20	Divide whole numbers by fractions
21	Divide fractions
22	Divide fractions: word problems
23	Estimate products and quotients of fractions and mixed numbers
24	Add, subtract, multiply and divide fractions and mixed numbers: word problems
25	Evaluate numerical expressions involving fractions
I.	Rational numbers
1	Fractions on number lines
2	Convert between decimals and fractions or mixed numbers
3	Compare rational numbers
4	Put rational numbers in order
5	Add and subtract rational numbers
6	Apply addition and subtraction rules
7	Multiply and divide rational numbers
8	Apply multiplication and division rules
J.	Exponents and square roots
1	Understanding exponents
2	Evaluate powers
3	Solve equations with variable exponents
4	Powers of ten
5	Powers with decimal and fractional bases
6	Evaluate numerical expressions involving exponents
7	Square roots of perfect squares
8	Estimate square roots
K.	Ratios, rates and proportions
1	Write a ratio
2	Write a ratio: word problems
3	Identify equivalent ratios
4	Write an equivalent ratio
5	Equivalent ratios: word problems
6	Unit rates
7	Compare ratios: word problems
8	Compare rates: word problems
9	Ratios and rates: word problems
10	Do the ratios form a proportion?
11	Do the ratios form a proportion: word problems
12	Solve proportions
13	Solve proportions: word problems
14	Estimate population size using proportions
L.	Percents
1	What percentage is illustrated?
2	Convert fractions to percents using grid models
3	Convert between percents, fractions and decimals
4	Convert between percents, fractions and decimals: word problems
5	Compare percents to fractions and decimals
6	Estimate percents of numbers
7	Solve percent problems using grid models
8	Solve percent problems using strip models
9	Percents of numbers and money amounts
10	Percents of numbers: word problems
11	Find what percent one number is of another
12	Find what percent one number is of another: word problems
13	Solve percent equations
14	Solve percent equations: word problems
M.	Consumer maths
1	Which is the better coupon?
2	Add, subtract, multiply and divide money amounts: word problems
3	Price lists
4	Unit prices
5	Unit prices: find the total price
6	Percent of a number: GST, discount and more
7	Find the percent: discount and mark-up
8	Sale prices: find the original price
9	Multi-step problems with percents
N.	Problem solving and estimation
1	Estimate to solve word problems
2	Multi-step word problems
3	Guess-and-check word problems
4	Use Venn diagrams to solve problems
5	Find the number of each type of coin
6	Elapsed time word problems
O.	Units of measurement
1	Estimate metric measurements
2	Compare and convert metric units
3	Metric mixed units
4	Convert between square metres and hectares
5	Convert square and cubic units of length
6	Convert between cubic metres and litres
7	Precision
P.	Coordinate plane
1	Coordinate plane review
2	Graph points from a table
3	Quadrants and axes
4	Follow directions on a coordinate plane
Q.	Number sequences
1	Identify arithmetic and geometric sequences
2	Arithmetic sequences
3	Geometric sequences
4	Number sequences: mixed review
5	Number sequences: word problems
6	Evaluate variable expressions for number sequences
7	Write variable expressions for arithmetic sequences
R.	Expressions and properties
1	Write variable expressions: one operation
2	Write variable expressions: two or three operations
3	Write variable expressions: word problems
4	Evaluate linear expressions
5	Evaluate multi-variable expressions
6	Evaluate nonlinear expressions
7	Identify terms and coefficients
8	Sort factors of expressions
9	Properties of addition and multiplication
10	Add using properties
11	Multiply using properties
12	Multiply using the distributive property
13	Solve equations using properties
14	Write equivalent expressions using properties
15	Add and subtract like terms
16	Add, subtract and multiply linear expressions
17	Factors of linear expressions
18	Identify equivalent linear expressions using algebra tiles
19	Identify equivalent linear expressions
S.	One-variable equations
1	Which x satisfies an equation?
2	Write an equation from words
3	Model and solve equations using algebra tiles
4	Write and solve equations that represent diagrams
5	Solve one-step equations
6	Solve two-step equations
7	Solve equations: complete the solution
8	Solve equations: word problems
T.	Two-variable equations
1	Does (x, y) satisfy the equation?
2	Solve word problems involving two-variable equations
3	Complete a table for a two-variable relationship
4	Write a two-variable equation
5	Identify the graph of an equation
6	Interpret a graph: word problems
7	Identify graphs: word problems
8	Rate of change
•	New! Constant rate of change: tables
9	Constant rate of change: graphs
U.	Two-dimensional figures
1	Identify and classify polygons
2	Lines, intervals and rays
3	Parallel, perpendicular and intersecting lines
4	Name, measure and classify angles
5	Acute, obtuse and right triangles
6	Scalene, isosceles and equilateral triangles
7	Classify triangles
8	Parallel sides in quadrilaterals
9	Identify parallelograms
10	Identify trapeziums
11	Identify rectangles
12	Identify rhombuses
13	Classify quadrilaterals I
14	Classify quadrilaterals II
15	Graph triangles and quadrilaterals
16	Find missing angles in triangles and quadrilaterals
17	Sums of angles in polygons
18	Identify complementary, supplementary, vertical, adjacent and congruent angles
19	Find measures of complementary, supplementary, vertical and adjacent angles
20	Transversal of parallel lines
21	Find lengths and measures of bisected intervals and angles
22	Parts of a circle
23	Construct parallel lines
24	Construct the midpoint or perpendicular bisector of an interval
25	Construct a perpendicular line
V.	Symmetry and transformations
1	Symmetry
2	Identify reflections, rotations and translations
3	Translations: graph the image
4	Translations: find the coordinates
5	Reflections: graph the image
6	Reflections: find the coordinates
7	Rotations: graph the image
8	Rotations: find the coordinates
9	Sequences of transformations: graph the image
W.	Three-dimensional figures
1	Bases of three-dimensional figures
2	Nets of three-dimensional figures
3	Front, side and top view
X.	Geometric measurement
1	Perimeter
2	Multiply to find the area of a rectangle made of unit squares
3	Area of rectangles and squares
4	Understanding area of a parallelogram
5	Area of parallelograms
6	Understanding area of a triangle
7	Area of triangles
8	Area between two shapes
9	Area and perimeter: word problems
10	Surface area of cubes and rectangular prisms
11	Surface area of triangular prisms
12	Surface area of pyramids
13	Volume of cubes and rectangular prisms
14	Volume of cubes and rectangular prisms: word problems
15	Volume of triangular prisms
Y.	Data and graphs
1	Interpret tables
2	Interpret dot plots
3	Create dot plots
4	Interpret stem-and-leaf plots
5	Create stem-and-leaf plots
6	Interpret bar graphs
7	Create bar graphs
8	Create frequency tables
•	New! Interpret categorical data
•	New! Create relative frequency tables
9	Interpret circle graphs
10	Circle graphs and central angles
11	Interpret line graphs
12	Create line graphs
13	Choose the best type of graph
Z.	Statistics
1	Calculate mean, median, mode and range
2	Interpret charts to find mean, median, mode and range
3	Mean, median, mode and range: find the missing number
4	Changes in mean, median, mode and range
5	Identify an outlier
6	Identify an outlier and describe the effect of removing it
7	Measures of centre and spread
8	Identify representative, random and biased samples
AA.	Probability
1	More, less and equally likely
2	Sample space of simple events
3	Probability of simple events
4	Probability of opposite, mutually exclusive and overlapping events
5	Experimental probability
6	Make predictions
7	Identify independent and dependent events`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  if (line.startsWith("YEAR 7 MATHS")) {
    const match = line.match(/YEAR 7 MATHS\s+-\s+(.+)/);
    if (match) {
        currentCategory = "A. " + match[1].trim();
    } else {
        currentCategory = "A. " + line.replace("YEAR 7 MATHS -", "").trim();
    }
    continue;
  }
  
  const categoryMatch = line.match(/^([A-Z]{1,2})\.\s+(.+)$/);
  if (categoryMatch) {
    currentCategory = line; // e.g., "B. Integers"
    continue;
  }
  
  // Is a skill line?
  let skillTitle = line;
  const numMatch = line.match(/^(\d+|•\s*New!)\s+(.+)$/);
  if (numMatch) {
    skillTitle = numMatch[2].trim();
  }
  
  result.push({
    id: `7_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataGrade7Maths.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " Grade 7 Maths skills.");
