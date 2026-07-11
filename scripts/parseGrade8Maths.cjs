const fs = require('fs');

const rawText = `YEAR 8 A.	Number theory
1	Factors
2	Divisibility rules
3	Prime or composite
4	Prime factorisation
5	Highest common factor
6	Lowest common multiple
7	HCF and LCM: word problems
8	Classify numbers
9	Scientific notation
B.	Integers
1	Integers on number lines
2	Graph integers on horizontal and vertical number lines
3	Compare and order integers
C.	Operations with integers
1	Integer addition and subtraction rules
2	Add and subtract integers using counters
3	Add and subtract integers
4	Add and subtract three or more integers
5	Add and subtract integers: word problems
•	New! Understand multiplying by a negative integer using a number line
6	Integer multiplication rules
7	Multiply integers
8	Integer division rules
9	Equal quotients of integers
10	Divide integers
11	Integer multiplication and division rules
12	Multiply and divide integers
13	Complete multiplication and division equations with integers
14	Add, subtract, multiply and divide integers
15	Evaluate numerical expressions involving integers
D.	Rational numbers
1	Identify rational and irrational numbers
2	Write fractions in lowest terms
3	Lowest common denominator
4	Round decimals and mixed numbers
5	Convert between decimals and fractions or mixed numbers
6	Repeating decimals
7	Compare rational numbers
8	Put rational numbers in order
E.	Operations with rational numbers
1	Reciprocals and multiplicative inverses
2	Add and subtract rational numbers
3	Add and subtract rational numbers: word problems
4	Apply addition and subtraction rules
5	Multiply and divide rational numbers
6	Multiply and divide rational numbers: word problems
7	Apply multiplication and division rules
8	Apply addition, subtraction, multiplication and division rules
9	Evaluate numerical expressions involving rational numbers
F.	Exponents and roots
1	Understanding exponents
2	Evaluate powers
3	Solve equations with variable exponents
4	Powers with negative bases
5	Powers with decimal and fractional bases
6	Multiplication with exponents
7	Division with exponents
8	Multiplication and division with exponents
9	Power rule
10	Evaluate expressions using properties of exponents
11	Identify equivalent expressions involving exponents I
12	Identify equivalent expressions involving exponents II
13	Square roots of perfect squares
14	Estimate square roots
15	Relationship between squares and square roots
16	Solve equations involving squares and square roots
17	Cube roots of perfect cubes
18	Estimate cube roots
19	Solve equations involving cubes and cube roots
G.	Ratios, rates and proportions
1	Understanding ratios
2	Identify equivalent ratios
3	Write an equivalent ratio
4	Equivalent ratios: word problems
5	Unit rates
6	Compare ratios: word problems
7	Compare rates: word problems
8	Ratios and rates: word problems
9	Do the ratios form a proportion?
10	Do the ratios form a proportion: word problems
11	Solve proportions
12	Estimate population size using proportions
13	Scale drawings: word problems
H.	Proportional relationships
1	Find the constant of proportionality from a table
2	Write equations for proportional relationships from tables
3	Identify proportional relationships by graphing
4	Find the constant of proportionality from a graph
5	Write equations for proportional relationships from graphs
6	Identify proportional relationships
7	Graph proportional relationships
8	Interpret graphs of proportional relationships
9	Write and solve equations for proportional relationships
I.	Percents
1	Convert between percents, fractions and decimals
2	Compare percents to fractions and decimals
3	Solve percent problems using grid models
4	Solve percent problems using strip models
5	Find what percent one number is of another
6	Find what percent one number is of another: word problems
7	Estimate percents of numbers
8	Percents of numbers and money amounts
9	Percents of numbers: word problems
10	Compare percents of numbers
11	Solve percent equations
12	Percent of change
13	Percent of change: word problems
14	Percent of change: find the original amount word problems
•	New! Percent error: word problems
J.	Consumer maths
1	Price lists
2	Unit prices
3	Unit prices: find the total price
4	Percent of a number: GST, discount and more
5	Find the percent: discount and mark-up
6	Sale prices: find the original price
7	Multi-step problems with percents
K.	Units of measurement
1	Convert rates and measurements: metric units
2	Metric mixed units
3	Convert between square metres and hectares
4	Convert square and cubic units of length
5	Convert between cubic metres and litres
6	Precision
L.	Problem solving
1	Multi-step word problems
2	Guess-and-check word problems
3	Use Venn diagrams to solve problems
4	Elapsed time word problems
M.	Coordinate plane
1	Coordinate plane review
2	Quadrants and axes
3	Follow directions on a coordinate plane
4	Find the distance between two points
N.	Two-dimensional figures
1	Identify and classify polygons
2	Classify triangles
3	Identify trapeziums
4	Classify quadrilaterals I
5	Classify quadrilaterals II
6	Graph quadrilaterals
7	Find missing angles in quadrilaterals I
8	Find missing angles in quadrilaterals II
9	Properties of parallelograms
10	Properties of rhombuses
11	Properties of squares and rectangles
12	Properties of trapeziums
13	Properties of kites
14	Properties of quadrilaterals: mixed review
15	Interior angles of polygons
16	Identify complementary, supplementary, vertical, adjacent and congruent angles
17	Find measures of complementary, supplementary, vertical and adjacent angles
18	Transversal of parallel lines
19	Find lengths and measures of bisected intervals and angles
20	Parts of a circle
O.	Symmetry and transformations
1	Symmetry
2	Count lines of symmetry
3	Draw lines of symmetry
4	Identify reflections, rotations and translations
5	Translations: graph the image
6	Translations: find the coordinates
7	Translations: write the rule
8	Reflections: graph the image
9	Reflections: find the coordinates
10	Rotations: graph the image
11	Rotations: find the coordinates
12	Describe transformations
13	Sequences of congruence transformations: graph the image
14	Sequences of congruence transformations: choose the sequence
P.	Congruence and similarity
1	Identify congruent figures
2	Side lengths and angle measures of congruent figures
3	Congruence statements and corresponding parts
4	Determine if two figures are congruent: justify your answer
5	Congruent triangles: SSS, SAS and ASA
6	Congruent triangles: RHS
7	Identify similar figures
8	Angle-angle criterion for similar triangles
9	Similarity rules for triangles
Q.	Three-dimensional figures
1	Parts of three-dimensional figures
2	Nets of three-dimensional figures
3	Front, side and top view
4	Base plans
R.	Geometric measurement
1	Perimeter
2	Understanding area of a trapezium
3	Area of trapeziums
4	Area of rhombuses
5	Area: mixed review
6	Area between two shapes
7	Area and perimeter: word problems
8	Circumference of circles
9	Area of circles
10	Circles: calculate area, circumference, radius and diameter
11	Circles, semicircles and quarter circles
12	Circles: word problems
13	Area of compound figures with triangles
14	Area of compound figures with triangles, semicircles and quarter circles
15	Volume of prisms
16	Volume of cubes and rectangular prisms: word problems
17	Surface area of prisms
S.	Pythagoras' theorem
1	Pythagoras' theorem: find the length of the hypotenuse
2	Pythagoras' theorem: find the missing leg length
3	Pythagoras' theorem: find the missing leg or hypotenuse length
4	Pythagoras' theorem: find the perimeter
5	Pythagoras' theorem: word problems
6	Converse of Pythagoras' theorem: is it a right triangle?
T.	Number sequences
1	Identify arithmetic and geometric sequences
2	Arithmetic sequences
3	Geometric sequences
4	Number sequences: mixed review
5	Number sequences: word problems
6	Evaluate variable expressions for number sequences
7	Write variable expressions for arithmetic sequences
U.	Expressions and properties
1	Write variable expressions
2	Write variable expressions from diagrams
3	Write variable expressions: word problems
4	Evaluate one-variable expressions
5	Evaluate multi-variable expressions
6	Evaluate rational expressions
7	Identify terms and coefficients
8	Sort factors of expressions
9	Properties of addition and multiplication
10	Multiply using the distributive property
11	Simplify variable expressions using properties
12	Add and subtract like terms
13	Add, subtract and multiply linear expressions
14	Factors of linear expressions
15	Identify equivalent linear expressions using algebra tiles
16	Identify equivalent linear expressions
17	Identify equivalent linear expressions: word problems
V.	One-variable equations
1	Which x satisfies an equation?
2	Write an equation from words
3	Model and solve equations using algebra tiles
4	Write and solve equations that represent diagrams
5	Properties of equality
6	Solve one-step equations
7	Solve two-step equations
8	Solve multi-step equations
9	Solve equations involving like terms
10	Solve equations with variables on both sides
11	Solve equations: mixed review
12	Solve equations: complete the solution
13	Solve equations: word problems
W.	One-variable inequalities
1	Graph inequalities
2	Write inequalities from graphs
3	Write and graph inequalities: word problems
4	Identify solutions to inequalities
5	Solve one-step linear inequalities: addition and subtraction
6	Solve one-step linear inequalities: multiplication and division
7	Solve one-step linear inequalities
8	Graph solutions to one-step linear inequalities
9	Solve two-step linear inequalities
10	Graph solutions to two-step linear inequalities
X.	Linear relations
1	Does (x, y) satisfy the linear equation?
2	Identify independent and dependent variables
3	Rate of change
•	New! Constant rate of change: tables
4	Constant rate of change: graphs
5	Find a value using a linear equation
6	Complete a table for a linear equation
7	Complete a table and graph a linear equation
8	Equations of horizontal and vertical lines
9	Graph a horizontal or vertical line
10	Graph a line from an equation
11	Interpret the graph of a linear equation: word problems
12	Write a linear equation from a table
13	Write linear equations: word problems
14	Identify linear and nonlinear relationships: graphs
15	Identify linear and nonlinear relationships: tables
16	Graph a linear inequality in the coordinate plane
Y.	Data and graphs
1	Interpret tables
2	Interpret bar graphs
3	Create bar graphs
4	Interpret line graphs
5	Create line graphs
6	Interpret dot plots
7	Create dot plots
8	Interpret stem-and-leaf plots
9	Create stem-and-leaf plots
10	Create frequency tables
11	Interpret circle graphs
12	Circle graphs and central angles
13	Choose the best type of graph
Z.	Statistics
1	Calculate mean, median, mode and range
2	Interpret charts to find mean, median, mode and range
3	Mean, median, mode and range: find the missing number
4	Changes in mean, median, mode and range
5	Identify an outlier
6	Identify an outlier and describe the effect of removing it
•	New! Populations and samples
7	Identify representative, random and biased samples
•	New! Make an estimate from sample data
8	Make inferences from multiple samples
AA.	Probability
1	Probability of simple events
2	Probability of opposite, mutually exclusive and overlapping events
3	Find probabilities using two-way frequency tables
4	Experimental probability
5	Make predictions
6	Sample spaces for compound events
7	Compound events: find the number of outcomes
8	Identify independent and dependent events
9	Probability of independent and dependent events
10	Counting principle`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  if (line.startsWith("YEAR 8")) {
    const match = line.match(/YEAR 8\s+(.+)/);
    if (match) {
        currentCategory = match[1].trim(); // It should be "A. Number theory"
    } else {
        currentCategory = line.replace("YEAR 8", "").trim();
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
    id: `8_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataGrade8Maths.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " Grade 8 Maths skills.");
