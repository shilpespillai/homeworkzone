const fs = require('fs');

const rawText = `A.	Place value and number sense
1	Place value models: up to thousands
2	Place value names: up to thousands
3	Place value names: up to millions
4	Value of a digit: up to thousands
5	Value of a digit: up to millions
6	Convert to/from a number: up to thousands
7	Convert to/from a number: up to millions
8	Convert between place values: up to thousands
9	Convert between place values: up to millions
10	Convert between ordinary decimal and expanded form: up to thousands
11	Convert between ordinary decimal and expanded form: up to millions
12	Write numbers in words: up to thousands
13	Write numbers in words: up to millions
14	Roman numerals I, V, X, L, C, D, M
15	Place value word problems: up to thousands
16	Place value word problems: up to millions
17	Guess the number
B.	Comparing and ordering
1	Compare and order numbers using number lines
2	Compare numbers: up to thousands
3	Compare numbers: up to millions
4	Which number is largest/smallest?
5	Put numbers in order: up to thousands
6	Put numbers in order: up to millions
7	Make the largest or smallest number possible
8	Ordering puzzles
9	Compare with addition and subtraction
10	Compare with addition, subtraction, multiplication and division
C.	Even and odd
1	Even or odd number of shapes
2	Identify even and odd numbers
3	Which even or odd number comes before or after?
4	Even or odd: addition and subtraction patterns
D.	Rounding
1	Round to the nearest ten or hundred using a number line
2	Round to the nearest ten or hundred
3	Round to the nearest ten or hundred in a table
4	Round to the nearest five cents
5	Round to the nearest five cents: word problems
6	Round to the nearest dollar
7	Rounding puzzles
E.	Estimate sums and differences
1	Estimate sums by rounding
2	Estimate sums using compatible numbers
3	Estimate sums by rounding: word problems
4	Estimate differences by rounding
5	Estimate differences using compatible numbers
6	Estimate differences by rounding: word problems
7	Estimate sums and differences by rounding
8	Estimate sums and differences using compatible numbers
•	New! Estimate sums and differences: word problems
9	Estimate to compare sums and differences
F.	Addition and subtraction: one digit
1	Addition facts
2	Subtraction facts
3	Addition and subtraction facts
4	Addition and subtraction facts – ways to make a number
5	Addition and subtraction facts – balance equations
G.	Addition: up to two digits
1	Add a multiple of 10 to a two-digit number
2	Add a two-digit and a one-digit number - without regrouping
3	Add a two-digit and a one-digit number - with regrouping
4	Add two two-digit numbers - without regrouping
5	Add two two-digit numbers - with regrouping
6	Addition word problems - up to two digits
7	Complete the addition number sentence - up to two digits
8	Balance addition equations - up to two digits
9	Addition input/output tables - up to two digits
10	Add three or more numbers up to two digits each
11	Add three or more numbers up to two digits: word problems
H.	Addition strategies - three digits
1	Use number lines to add three-digit numbers
2	Partition a three-digit number to add
3	Use compensation to add - up to three digits
4	Use models to add three-digit numbers - without regrouping
5	Use models to add three-digit numbers - with regrouping
6	Use expanded form to add three-digit numbers - without regrouping
7	Use expanded form to add three-digit numbers - with regrouping
8	Use expanded form to add three-digit numbers
I.	Addition: up to three digits
1	Add 10 or 100 to a three-digit number
2	Add a multiple of 100 to a three-digit number
3	Add multiples of 10 or 100 to a three-digit number
4	Add two three-digit numbers - without regrouping
5	Add two three-digit numbers - with regrouping
6	Add two numbers up to three digits
7	Add two numbers up to three digits: word problems
8	Addition sentences for word problems - up to three digits
9	Complete the addition number sentence - up to three digits
10	Add numbers up to three digits - fill in the missing digits
11	Balance addition equations - up to three digits
12	Addition input/output tables - up to three digits
13	Add three or more numbers up to three digits each
14	Add three or more numbers up to three digits: word problems
J.	Subtraction: up to two digits
1	Subtract a multiple of 10 from a two-digit number
2	Subtract a one-digit number from a two-digit number - without regrouping
3	Subtract a one-digit number from a two-digit number - with regrouping
4	Subtract two two-digit numbers - without regrouping
5	Subtract two two-digit numbers - with regrouping
6	Subtract numbers up to two digits: word problems
7	Complete the subtraction number sentence - up to two digits
8	Balance subtraction equations - up to two digits
9	Subtraction input/output tables - up to two digits
K.	Subtraction strategies - three digits
1	Use number lines to subtract three-digit numbers
2	Partition a three-digit number to subtract
3	Use compensation to subtract - up to three digits
4	Use models to subtract from three-digit numbers - without regrouping
5	Use models to subtract from three-digit numbers - with regrouping
6	Use expanded form to subtract three-digit numbers - without regrouping
7	Use expanded form to subtract three-digit numbers - with regrouping
8	Use expanded form to subtract - up to three digits
L.	Subtraction: up to three digits
1	Subtract 10 or 100 from a three-digit number
2	Subtract a multiple of 100 from a three-digit number
3	Subtract a multiple of 10 or 100 from a three-digit number
4	Subtract from three-digit numbers - without regrouping
5	Subtract from three-digit numbers - with regrouping
6	Subtract numbers up to three digits
7	Subtract numbers up to three digits: word problems
8	Subtraction sentences for word problems - up to three digits
9	Complete the subtraction number sentence - up to three digits
10	Balance subtraction equations - up to three digits
11	Subtraction input/output tables - up to three digits
12	Subtract numbers up to three digits - fill in the missing digits
M.	Mixed operations: addition and subtraction
1	Relate addition and subtraction sentences
2	Use number lines to add and subtract three-digit numbers
3	Use compensation to add and subtract - up to three digits
4	Add and subtract - up to three digits
5	Complete the addition or subtraction sentence - up to three digits
6	Input/output tables - write the addition or subtraction rule - up to 100
7	Add and subtract data from tables
8	Addition and subtraction word problems
9	Two-step addition and subtraction word problems
10	Age puzzles
11	Find two numbers based on sum and difference
N.	Addition properties
1	Fact families
2	Properties of addition
3	Complete the equation using properties of addition
4	Add using properties
O.	Skip-counting and number patterns
1	Skip-count by twos, fives and tens
2	Skip-counting sequences with twos, fives and tens
3	Skip-counting puzzles
4	Use a rule to complete an addition or subtraction pattern
5	Number patterns
6	Number patterns: word problems
7	Complete an increasing number pattern
P.	Understand multiplication
1	Identify repeated addition for equal groups - sums to 25
2	Write addition sentences for equal groups - sums to 25
3	Count equal groups
4	Identify multiplication expressions for equal groups
5	Write multiplication sentences for equal groups
6	Relate addition and multiplication for equal groups
7	Multiply by 0 or 1 with equal groups
8	Identify multiplication expressions for arrays
9	Write multiplication sentences for arrays
10	Write two multiplication sentences for an array
11	Make arrays to model multiplication
12	Multiply using number lines
13	Write multiplication sentences for number lines
14	Relate addition and multiplication
15	Compare numbers using multiplication
16	Multiplication patterns over increasing place values
17	Multiply numbers ending in zeros
Q.	Multiplication skill builders
1	Multiply by 0
2	Multiply by 1
3	Multiply by 2
4	Multiply by 3
5	Multiply by 4
6	Multiply by 5
7	Multiply by 6
8	Multiply by 7
9	Multiply by 8
10	Multiply by 9
11	Multiply by 10
R.	Multiplication fluency
1	Multiplication facts for 2, 3, 4, 5 and 10
2	Multiplication facts for 2, 3, 4, 5, 10: true or false?
3	Multiplication facts for 2, 3, 4, 5, 10: sorting
4	Multiplication facts for 2, 3, 4, 5, 10: find the missing factor
5	Multiplication facts for 6, 7, 8 and 9
6	Multiplication facts for 6, 7, 8, 9: true or false?
7	Multiplication facts for 6, 7, 8, 9: sorting
8	Multiplication facts for 6, 7, 8, 9: find the missing factor
9	Multiplication facts up to 10
10	Multiplication facts up to 10: true or false?
11	Multiplication facts up to 10: sorting
12	Multiplication facts up to 10: find the missing factor
13	Multiplication facts up to 10: select the missing factors
14	Multiplication number sentences up to 10: true or false?
15	Squares up to 10 x 10
S.	Understand division
1	Divide by counting equal groups
2	Write division sentences for groups
3	Division sentences with 1 and 0
4	Relate multiplication and division for groups
5	Write division sentences for arrays
6	Make arrays to model division
7	Relate multiplication and division for arrays
8	Relate multiplication and division
9	Divide using number lines
T.	Division skill builders
1	Divide by 1
2	Divide by 2
3	Divide by 3
4	Divide by 4
5	Divide by 5
6	Divide by 6
7	Divide by 7
8	Divide by 8
9	Divide by 9
10	Divide by 10
U.	Division fluency
1	Division facts up to 5
2	Division facts for 2, 3, 4, 5 and 10
3	Division facts for 2, 3, 4, 5, 10: true or false?
4	Division facts for 2, 3, 4, 5, 10: sorting
5	Division facts for 6, 7, 8 and 9
6	Division facts for 6, 7, 8, 9: true or false?
7	Division facts for 6, 7, 8, 9: sorting
8	Division facts up to 10
9	Division facts up to 10: true or false?
10	Division facts up to 10: sorting
11	Complete the division number sentence: facts up to 10
12	Division facts up to 10: find the missing number
13	Division facts up to 10: select the missing numbers
14	Division number sentences up to 10: true or false?
V.	Mixed operations - multiplication and division
1	Multiplication and division facts up to 5: true or false?
2	Multiplication and division facts for 2, 3, 4, 5, 10: true or false?
3	Multiplication and division number sentences for 2, 3, 4, 5, 10: true or false?
4	Multiplication and division facts up to 10
5	Multiplication and division facts up to 10: true or false?
6	Multiplication and division facts up to 10: find the missing number
7	Multiplication and division facts up to 10: select the missing numbers
W.	Multiplication and division word problems
1	Use equal groups and arrays to solve multiplication word problems
2	Multiplication word problems with factors up to 5
•	New! Use strip models to solve multiplication word problems
3	Multiplication word problems with factors up to 10
4	Multiplication word problems with factors up to 5: find the missing number
5	Multiplication word problems with factors up to 10: find the missing number
•	New! Use equal groups and arrays to solve division word problems
•	New! Use strip models to solve division word problems with factors up to 10
6	Division word problems
7	Multiplication and division word problems
•	New! Multiplication and division: real-world patterns
8	Two-step multiplication and division word problems
X.	Mixed operations
1	Addition, subtraction, multiplication and division facts
2	Complete the addition, subtraction, multiplication or division sentence
3	Add, subtract, multiply and divide
4	Input/output tables - write the addition, subtraction or multiplication rule - up to 100
5	Addition, subtraction, multiplication and division terms
6	Addition, subtraction, multiplication and division word problems
7	Multi-step word problems
Y.	Understand fractions
1	Identify equal parts
2	Make halves, thirds and quarters
3	Make sixths and eighths
4	Make halves, thirds, quarters, sixths and eighths
5	Understand fractions: fraction bars
6	Understand fractions: area models
7	Show fractions: fraction bars
8	Show fractions: area models
•	New! Identify the unit fraction
9	Identify the fraction
10	Which shape illustrates the fraction?
•	New! Fractions of a group: unit fractions
11	Fractions of a group
12	Fraction review
13	Write fractions using numbers and words
Z.	Fractions on number lines
1	Fractions of number lines: unit fractions
2	Fractions of number lines: halves, quarters and eighths
3	Fractions of number lines
4	Identify unit fractions on number lines
5	Identify fractions on number lines
6	Graph unit fractions on number lines
7	Graph fractions less than 1 on number lines
8	Graph fractions on number lines
9	Graph smaller or larger fractions on a number line
AA.	Fraction word problems
1	Unit fractions: modelling word problems
2	Unit fractions: word problems
3	Fractions of a whole: modelling word problems
4	Fractions of a whole: word problems
5	Fractions of a group: word problems
BB.	Area
1	Find the area of figures made of unit squares
2	Select figures with a given area
3	Select two figures with the same area
4	Tile a rectangle and find the area
5	Multiply to find the area of a rectangle made of unit squares
6	Create rectangles with a given area
7	Find the area of rectangles and squares
8	Find the missing side length of a rectangle
CC.	Lines and angles
1	Lines, intervals and rays
2	Angles as fractions of a circle
3	Angles greater than, less than or equal to a right angle
DD.	Two-dimensional shapes
1	Is it a polygon?
2	Draw polygons
3	Identify two-dimensional shapes
4	Count and compare sides and vertices
5	Sort shapes into a Venn diagram
6	Count shapes in a Venn diagram
7	Flip, turn and slide
8	Symmetry
EE.	Three-dimensional shapes
1	Two-dimensional and three-dimensional shapes
2	Identify three-dimensional shapes
3	Count vertices, edges and faces
4	Identify faces of three-dimensional shapes
5	Nets of three-dimensional figures
•	New! Sort three-dimensional shapes
FF.	Time
1	Match clocks and times
2	Match analogue and digital clocks
3	Read clocks and write times
4	A.M. or P.M.
5	Identify times written in words
6	Elapsed time
7	Elapsed time: word problems
8	Relate time units - seconds, minutes, hours
9	Time patterns
GG.	Measurement
1	Read a thermometer
2	Reasonable temperature
3	Measure using a centimetre ruler
•	New! Estimate lengths with centimetres and metres
4	Which metric unit of length is appropriate?
5	Compare metric units of length
6	Metric units of length: word problems
7	Which metric unit of mass is appropriate?
8	Compare metric units of mass
9	Measure liquid volumes - metric units
10	Which metric unit of volume is appropriate?
11	Compare metric units of volume
12	Compare metric units
13	Choose the appropriate measuring tool
HH.	Data and graphs
1	Objects on a coordinate plane
2	Coordinate planes as maps
3	Interpret tally charts
4	Interpret data in tables
5	Interpret bar graphs
6	Create bar graphs
7	Interpret picture graphs
8	Create picture graphs
II.	Probability
1	More, less and equally likely
2	Certain, probable, unlikely and impossible
3	Combinations
JJ.	Money
1	Count coins and notes - up to $5 note
2	Equivalent amounts of money - up to $5
3	Exchanging coins
4	Least number of coins
5	Purchases - do you have enough money - up to $10
6	Which picture shows more?
7	Making change
8	Inequalities with money
9	Put money amounts in order`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
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
    id: `3_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataGrade3Maths.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " Grade 3 Maths skills.");
