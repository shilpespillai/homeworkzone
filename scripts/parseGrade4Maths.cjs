const fs = require('fs');

const rawText = `GRADE 4 MATHS - Place value and number sense
1	Place value models
2	Place value names: up to ten thousands
3	Place value names: up to millions
4	Value of a digit: up to ten thousands
5	Value of a digit: up to millions
6	Convert between ordinary decimal and expanded form: up to ten thousands
7	Convert between ordinary decimal and expanded form: up to millions
8	Writing numbers up to ten thousands: convert words to digits
9	Writing numbers up to ten thousands: convert digits to words
10	Writing numbers up to millions: convert words to digits
11	Writing numbers up to millions: convert digits to words
12	Place value word problems: up to ten thousands
13	Place value word problems: up to millions
14	Convert between place values: up to ten thousands
15	Convert between place values: up to millions
16	Place value review
17	Rounding
18	Inequalities with number lines
B.	Comparing and ordering
1	Compare numbers: up to ten thousands
2	Compare numbers: up to millions
3	Put numbers in order: up to ten thousands
4	Put numbers in order: up to millions
5	Find the order
C.	Even and odd
1	Even or odd: counting objects
2	Identify even and odd numbers
3	Even or odd: arithmetic rules
D.	Addition
1	Addition patterns over increasing place values
2	Estimate sums
3	Estimate sums: word problems
4	Add numbers up to five digits
5	Add numbers up to five digits: word problems
6	Properties of addition
7	Add three or more numbers up to five digits each
8	Add three or more numbers up to five digits each: word problems
9	Addition: fill in the missing digits
10	Choose numbers with a particular sum
11	Input/output tables with addition
12	Complete the addition number sentence
13	Balance addition equations
E.	Subtraction
1	Subtraction patterns over increasing place values
2	Estimate differences
3	Estimate differences: word problems
4	Subtract numbers up to five digits
5	Subtract numbers up to five digits: word problems
6	Subtraction: fill in the missing digits
7	Choose numbers with a particular difference
8	Input/output tables with subtraction
9	Complete the subtraction number sentence
10	Balance subtraction equations
F.	Multiplication
1	Multiplication facts for 2, 3, 4, 5 and 10
2	Multiplication facts for 6, 7, 8 and 9
3	Multiplication facts to 10
•	New! Use strip models to solve multiplication word problems
4	Multiplication facts to 10: word problems
5	Multiplication facts to 10: find the missing factor
6	Multiplication word problems: find the missing factor up to 10
7	Properties of multiplication
8	Distributive property: find the missing factor
9	Compare numbers using multiplication
10	Choose numbers with a particular product
G.	Factors and multiples
1	Divisibility rules
2	Divisibility rules: word problems
3	Choose the multiples of a given number up to 10
4	Prime and composite numbers
H.	Multiply by one-digit numbers
1	Multiplication patterns over increasing place values
2	Multiply by a multiple of ten using place value
3	Multiply by a multiple of ten
4	Estimate products: multiply by one-digit numbers
5	Estimate products: word problems
6	Multiply one-digit numbers by teen numbers using grids
7	Multiply one-digit numbers by two-digit numbers: choose the area model
8	Multiply one-digit numbers by two-digit numbers using area models
9	Multiply one-digit numbers by two-digit numbers
10	Multiply one-digit numbers by two-digit numbers: word problems
11	Multiply one-digit numbers by three-digit or four-digit numbers: choose the area model
12	Multiply one-digit numbers by three-digit or four-digit numbers using area models
13	Multiply one-digit numbers by three-digit or four-digit numbers using expanded form
14	Multiply one-digit numbers by multi-digit numbers using partial products
15	Multiply one-digit numbers by three-digit or four-digit numbers
16	Multiply one-digit numbers by three-digit or four-digit numbers: word problems
17	Multiply one-digit numbers by larger numbers
18	Input/output tables with multiplication
19	Multiply three numbers
I.	Multiply by two-digit numbers
1	Multiply numbers ending in zeros
2	Estimate products: multiply by two-digit numbers
3	Multiply two-digit numbers by two-digit numbers: choose the area model
4	Multiply two-digit numbers by two-digit numbers using area models
5	Multiply two-digit numbers by two-digit numbers using partial products
6	Multiply two-digit numbers by two-digit numbers: complete the missing steps
7	Multiply two-digit numbers by two-digit numbers
8	Multiply two-digit numbers by two-digit numbers: word problems
9	Multiply numbers ending in zeros: word problems
10	Multiply three or more numbers: word problems
11	Inequalities with multiplication
12	Use one multiplication fact to complete another
J.	Division
1	Division facts for 2, 3, 4, 5 and 10
2	Division facts for 6, 7, 8 and 9
3	Division facts to 10
•	New! Division facts to 10: find the missing number
4	Division facts to 10: word problems
5	Properties of division
6	Choose numbers with a particular quotient
K.	Divide by one-digit numbers
1	Division patterns over increasing place values
2	Divide numbers ending in zeros by one-digit numbers
3	Divide two-digit numbers by one-digit numbers using arrays
4	Divide two-digit numbers by one-digit numbers using area models
5	Divide using repeated subtraction
6	Divide two-digit numbers by one-digit numbers
7	Divide two-digit numbers by one-digit numbers: complete the table
8	Divide three-digit numbers by one-digit numbers using area models
9	Divide using partial quotients
10	Divide three-digit and four-digit numbers by one-digit numbers
11	Divide three-digit and four-digit numbers by one-digit numbers: complete the table
12	Input/output tables with division
13	Inequalities with division
14	Estimate to compare quotients
L.	Division word problems
1	Divide numbers ending in zeros: word problems
2	Divide two-digit numbers by one-digit numbers: word problems
3	Divide three-digit and four-digit numbers by one-digit numbers: word problems
4	Estimate quotients: word problems
M.	Mixed operations
1	Mentally add and subtract numbers ending in zeros
2	Complete the addition or subtraction number sentence - up to 100
3	Balance addition and subtraction equations - up to 100
4	Find two numbers based on sum and difference
5	Multiplication and division facts to 10: true or false?
6	Multiply and divide
7	Find two numbers based on sum and product
8	Add, subtract, multiply and divide
9	Choose numbers with a particular sum, difference, product or quotient
10	Find two numbers based on sum, difference, product and quotient
11	Multiplication and division word problems
12	Addition, subtraction, multiplication and division word problems
13	Estimate sums, differences, products and quotients: word problems
14	Word problems with extra or missing information
15	Solve word problems using guess-and-check
16	Multi-step word problems
17	Multi-step word problems: identify reasonable answers
18	Input/output tables with addition, subtraction, multiplication and division
19	Understanding brackets
N.	Number patterns
1	Use a rule to complete a multiplication pattern
2	What is true about the multiplication pattern?
3	Number sequences
4	Complete an increasing number pattern
5	Complete a geometric number pattern
6	Number patterns: word problems
7	Number patterns: mixed review
8	Identify mistakes in number patterns
O.	Fractions and mixed numbers
1	Fractions of a whole: word problems
2	Fractions of a group: word problems
3	Fractions on number lines
4	Find equivalent fractions using area models: two models
5	Find equivalent fractions using area models: one model
6	Identify equivalent fractions using number lines
7	Find equivalent fractions using number lines
8	Graph equivalent fractions on number lines
9	Identify equivalent fractions
10	Equivalent fractions: find the missing numerator or denominator
11	Patterns of equivalent fractions
12	Fractions with denominators of 10 and 100
13	Write fractions in lowest terms
14	Graph fractions equivalent to 1 on number lines
15	Select fractions equivalent to whole numbers using models
16	Find fractions equivalent to whole numbers
17	Identify mixed numbers
P.	Relate fractions and decimals
1	Model decimals and fractions
2	What decimal number is illustrated?
3	Graph fractions as decimals on number lines
4	Graph decimals on number lines
5	Decimal number lines
6	Convert fractions and mixed numbers to decimals - denominators of 10 and 100
7	Convert fractions and mixed numbers to decimals
8	Convert decimals to fractions and mixed numbers
Q.	Decimals
1	Place values in decimal numbers
2	Understanding decimals expressed in words
3	One-tenth or one-hundredth more or less
4	Equivalent decimals
5	Round decimals
6	Compare decimals using models
7	Compare decimals on number lines
8	Compare decimal numbers
R.	Money
1	Compare money amounts
2	Round to the nearest five cents
3	Round to the nearest five cents: word problems
4	Round to the nearest dollar or more
5	Add and subtract money amounts: up to $1
6	Add and subtract money amounts
7	Add and subtract money amounts: word problems
8	Find the change, price or amount paid
9	Price lists with addition and subtraction
S.	Data and graphs
1	Objects on a coordinate plane
2	Coordinate planes as maps
3	Read a table
4	Interpret picture graphs
5	Create picture graphs
6	Interpret line graphs
7	Create line graphs
8	Interpret bar graphs
9	Create bar graphs
10	Interpret frequency tables
11	Interpret frequency tables with numerical data
12	Choose the best type of graph
T.	Time
1	A.M. or P.M.
2	Convert time units
3	Add and subtract mixed time units
4	Elapsed time
•	New! Find the end time: word problems
•	New! Find the start time: word problems
5	Find the elapsed time: word problems
•	New! Find the start time, the end time or the elapsed time: word problems
6	Find start and end times: multi-step word problems
7	Transportation schedules
8	Time zones
9	Fractions of time units
U.	Measurement
1	Read a thermometer
2	Reasonable temperature
3	Which metric unit is appropriate?
4	Measure using a centimetre ruler
5	Compare metric units of length
6	Compare metric units of mass
7	Compare metric units of volume
8	Map distances
V.	Area, perimeter and volume
1	Create figures with a given area
2	Find the area of figures made of unit squares
3	Select figures with a given area
4	Select two figures with the same area
5	Area of figures on grids
6	Tile a rectangle and find the area
7	Multiply to find the area of a rectangle made of unit squares
8	Find the area or missing side length of a rectangle
9	Perimeter of figures on grids
10	Perimeter of rectangles
11	Perimeter of polygons
12	Area and perimeter word problems
13	Volume of rectangular prisms made of unit cubes
14	Volume of irregular figures made of unit cubes
W.	Lines and angles
1	Lines, intervals and rays
2	Angles greater than, less than or equal to a right angle
3	Acute, right, obtuse and straight angles
4	Estimate angle measurements
X.	Two-dimensional figures
1	Which two-dimensional figure is being described?
2	Compose two-dimensional shapes
3	Is it a polygon?
4	Number of sides in polygons
Y.	Symmetry
1	Identify lines of symmetry
2	Draw lines of symmetry
3	Count lines of symmetry
4	Rotational symmetry
Z.	Three-dimensional figures
1	Identify three-dimensional figures
2	Count vertices, edges and faces
3	Identify faces of three-dimensional figures
4	Which three-dimensional figure is being described?
5	Nets of three-dimensional figures
AA.	Probability
1	More, less and equally likely
2	Certain, probable, unlikely and impossible
3	Identify independent and dependent events
4	Combinations`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  if (line.startsWith("GRADE 4 MATHS -")) {
    currentCategory = "A. " + line.replace("GRADE 4 MATHS -", "").trim();
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
    id: `4_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataGrade4Maths.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " Grade 4 Maths skills.");
