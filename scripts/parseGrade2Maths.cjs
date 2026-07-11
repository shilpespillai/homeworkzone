const fs = require('fs');

const rawText = `GRADE 2 MATHS - 	Counting
1	Hundred chart
2	Number lines - up to 100
3	Number lines - up to 1000
4	Count forward - up to 1000
B.	Comparing and ordering
1	Compare numbers up to 100
2	Put numbers up to 100 in order
3	Compare numbers up to 1000 using number lines
4	Compare numbers up to 1000
5	Compare and order numbers up to 1000 using number lines
6	Put numbers up to 1000 in order
7	Compare numbers up to 10 000
8	Put numbers up to 10 000 in order
9	Greatest and least - word problems - up to 100
10	Greatest and least - word problems - up to 1000
11	Greatest and least - word problems - up to 10 000
C.	Skip-counting and number patterns
1	Skip-count by twos
2	Skip-count by fives
3	Skip-count by tens
4	Skip-count by twos, fives and tens
5	Skip-counting stories
6	Skip-counting sequences
7	Count forward and backward by twos, fives and tens
8	Skip-counting puzzles
9	Count forward and backward by twos, fives, tens and hundreds
D.	Names of numbers
1	Spell word names for numbers up to 20
2	Writing numbers up to 100 in words - convert words to digits
3	Writing numbers up to 100 in words - convert digits to words
4	Writing numbers up to 1000 in words - convert words to digits
5	Writing numbers up to 1000 in words - convert digits to words
6	Writing numbers up to 1000 in words
7	Roman numerals I, V, X, L
E.	Even and odd
1	Even or odd number of shapes
2	Identify even and odd numbers
3	Even or odd numbers on number lines
4	Select even and odd numbers
5	Which even or odd number comes before or after?
F.	Addition strategies - one digit
1	Add doubles using models
2	Add doubles
3	Add doubles - complete the sentence
4	Add near doubles
5	Addition sentences using number lines - sums to 20
6	Add by counting on - sums to 20
7	Make ten to add
8	Add zero
G.	Addition - one digit
1	Add one-digit numbers - sums to 10
2	Turn words into an addition sentence - sums to 10
3	Add one-digit numbers - sums to 20
4	Sort addition facts - sums to 20
5	Addition input/output tables - sums to 20
6	Addition word problems - sums to 20
7	Addition sentences for word problems - sums to 20
8	Complete the addition sentence - sums to 20
9	Balance addition equations - sums to 20
10	Which addition sentence is true? - sums to 20
11	Add three or more one-digit numbers
12	Add three or more one-digit numbers - word problems
H.	Subtraction strategies - one digit
1	Subtract doubles
2	Subtraction sentences using number lines - up to 20
3	Subtract by counting back - up to 20
4	Use ten to subtract
5	Subtract by counting on - up to 20
•	New! Count on and use ten to subtract - up to 20
6	Subtract zero or all
I.	Subtraction - one digit
1	Subtract one-digit numbers - up to 10
2	Subtract a one-digit number from a two-digit number up to 20
3	Subtraction input/output tables - up to 20
4	Subtraction word problems - up to 20
5	Subtraction sentences for word problems - up to 20
6	Complete the subtraction sentence - up to 20
7	Balance subtraction equations - up to 20
8	Which subtraction sentence is true? - up to 20
J.	Mixed operations - one digit
1	Addition and subtraction sentences using number lines - up to 20
2	Addition and subtraction - up to 20
3	Ways to make a number using addition and subtraction - up to 20
4	Complete the addition or subtraction sentence - up to 20
5	Balance addition and subtraction equations - up to 20
6	Which addition or subtraction sentence is true? - up to 20
7	Write the addition or subtraction rule for an input/output table - up to 20
•	New! Comparison word problems - up to 20
•	New! Use models to solve addition and subtraction word problems - up to 20
8	Addition and subtraction word problems - up to 20
•	New! Match word problems to addition and subtraction sentences - up to 20
•	New! Two-step addition and subtraction word problems - up to 20
K.	Place value
1	Place value models - tens and ones
2	Place value models - up to hundreds
3	Identify a digit up to the hundreds place
4	Value of a digit - tens and ones
5	Value of a digit - up to hundreds
6	Convert to/from a number - tens and ones
7	Regroup tens and ones - ways to make a number
8	Regroup tens and ones
9	Convert to/from a number - up to hundreds
10	Convert between place values - ones and hundreds
11	Convert between place values - ones, tens and hundreds
12	Convert from expanded form - up to hundreds
13	Convert between ordinary decimal and expanded form
14	Regroup hundreds, tens and ones - ways to make a number
15	Guess the number
L.	Addition strategies - two digits
1	Partition a one-digit number to add
2	Use models to add a multiple of 10 and a one-digit number
3	Use models to add a multiple of 10 and a two-digit number
4	Use a hundred chart to add a multiple of 10 and a two-digit number
5	Use a hundred chart to add a two-digit number and a one-digit number
6	Use models to add a two-digit and a one-digit number - without regrouping
7	Use models to add a two-digit and a one-digit number - with regrouping
8	Use number lines to add two-digit numbers
9	Partition a two-digit number to add - sums to 100
10	Use compensation to add on a number line - up to two digits
11	Use compensation to add - up to two digits
12	Use models to add two-digit numbers - without regrouping
13	Use models to add two-digit numbers - with regrouping
14	Use place value to add two-digit numbers - without regrouping
15	Use place value to add two-digit numbers - with regrouping
M.	Addition - two digits
1	Add a multiple of 10 and a one-digit number
2	Add multiples of 10
3	Add a multiple of 10 and a two-digit number
4	Add a two-digit and a one-digit number - without regrouping
5	Add a two-digit and a one-digit number - with regrouping
6	Add two-digit numbers without regrouping - sums to 100
7	Add two-digit numbers with regrouping - sums to 100
8	Add two-digit numbers - sums to 100
9	Addition word problems - up to two digits
10	Ways to make a number using addition - up to two digits
11	Complete the addition sentence - up to two digits
12	Write the addition sentence - up to two digits
13	Balance addition equations - up to two digits
14	Add two-digit numbers - sums to 200
15	Addition input/output tables - up to two digits
16	Add three or more numbers up to two digits each
17	Addition word problems - three numbers up to two digits each
18	Add four numbers up to two digits each
19	Addition word problems - four numbers up to two digits each
N.	Subtraction strategies - two digits
1	Partition a one-digit number to subtract
2	Use models to subtract a one-digit number from a two-digit number - without regrouping
3	Use models to subtract a one-digit number from a two-digit number - with regrouping
4	Use number lines to subtract two-digit numbers
5	Partition a two-digit number to subtract
6	Use compensation to subtract on a number line - up to two digits
7	Use compensation to subtract - up to two digits
8	Count on to subtract two-digit numbers
9	Use models to subtract two-digit numbers - without regrouping
10	Use models to subtract two-digit numbers - with regrouping
11	Use place value to subtract two-digit numbers - without regrouping
12	Use place value to subtract two-digit numbers - with regrouping
O.	Subtraction - two digits
1	Subtract a multiple of 10 from a two-digit number
2	Subtract a one-digit number from a two-digit number - without regrouping
3	Subtract a one-digit number from a two-digit number - with regrouping
4	Subtract a one-digit number from a two-digit number
5	Subtract two-digit numbers - without regrouping
6	Subtract two-digit numbers - with regrouping
7	Subtract two-digit numbers
8	Subtraction input/output tables - up to two digits
9	Ways to make a number using subtraction
10	Subtraction word problems - up to two digits
11	Complete the subtraction sentence - up to two digits
12	Write the subtraction sentence - up to two digits
13	Balance subtraction equations - up to two digits
P.	Mixed operations - two digits
1	Add and subtract numbers - up to 100
2	Which sign (+ or -) makes the number sentence true? - up to 100
3	Ways to make a number using addition and subtraction - up to 100
4	Relate addition and subtraction sentences - up to two digits
5	Complete the addition or subtraction sentence - up to 100
6	Balance addition and subtraction equations - up to 100
7	Which addition or subtraction equation is true? - up to 100
8	Write the addition or subtraction rule for an input/output table - up to 100
9	Write addition and subtraction sentences
10	Solve inequalities using addition and subtraction shortcuts
11	Inequalities with addition and subtraction - up to 100
•	New! Use models to solve addition and subtraction word problems - up to 100
12	Addition and subtraction word problems - up to 100
•	New! Match addition and subtraction word problems to equations - up to 100
13	Two-step addition and subtraction word problems - up to 100
Q.	Properties
1	Add in any order
2	Related addition facts
3	Related subtraction facts
4	Fact families
5	Addition and subtraction terms
R.	Repeated addition
1	Count equal groups
2	Identify repeated addition for equal groups - sums to 25
3	Write addition sentences for equal groups - sums to 25
4	Identify repeated addition for arrays - sums to 25
5	Write addition sentences for arrays - sums to 25
6	Solve word problems using repeated addition - sums to 25
•	New! Write stories involving repeated addition - sums to 25
S.	Multiplication
1	Identify multiplication sentences for equal groups
2	Write multiplication sentences for equal groups
3	Relate addition and multiplication for equal groups
•	New! Use equal groups to solve multiplication word problems
4	Identify multiplication expressions for arrays
5	Write multiplication sentences for arrays
6	Make arrays to model multiplication
7	Relate addition and multiplication
8	Multiply by 2
T.	Division
1	Divide by counting equal groups
2	Write division sentences for groups
3	Relate multiplication and division for groups
•	New! Use equal groups to solve division word problems
4	Write division sentences for arrays
5	Make arrays to model division
6	Relate multiplication and division for arrays
7	Relate multiplication and division
8	Divide by 2
U.	Money
1	Coin values
2	Count money - up to $1
3	Count money - up to $5
4	Equivalent amounts of money - up to $1
5	Equivalent amounts of money - up to $5
6	Exchanging coins
7	Comparing groups of coins
8	Least number of coins
9	Add and subtract money - up to $1
10	Do you have enough money? - up to $1
11	Do you have enough money? - up to $5
12	How much more to make a dollar?
13	Which picture shows more? - up to $1
14	Which picture shows more? - up to $5
V.	Time
1	Match digital clocks and times
2	Match analogue clocks and times
3	Match analogue and digital clocks
4	Read clocks and write times
5	Time words: o'clock, half, quarter
6	A.M. or P.M.
7	Compare clocks
8	Relate time units
W.	Calendars
1	Days of the week
2	Months of the year
3	Seasons
4	Read a calendar
5	Number of days in each month
X.	Data and graphs
1	Which tally chart is correct?
2	Interpret tally charts
3	Create picture graphs
4	Interpret picture graphs
5	Which table is correct?
6	Interpret data in tables
7	Which bar graph is correct?
8	Create bar graphs
9	Interpret bar graphs
Y.	Probability
1	More, less and equally likely
2	Certain, probable, unlikely and impossible
Z.	Measurement
1	Long and short
2	Tall and short
3	Light and heavy
4	Holds more or less
5	Compare size, weight and capacity
6	Measure using objects
7	Measure using a centimetre ruler
•	New! Estimate lengths with centimetres and metres
8	Which metric unit of length is appropriate?
9	Metric units of length - word problems
AA.	Patterns
1	Repeating patterns
2	Growing patterns
3	Find the next shape in a pattern
4	Complete a repeating pattern
5	Make a repeating pattern
6	Find the next row in a growing pattern
BB.	Two-dimensional shapes
1	Count sides and vertices
2	Compare sides and vertices
3	Equal sides
4	Parallel sides
5	Curved parts
•	New! Attributes of polygons
•	New! Attributes of quadrilaterals
6	Name the two-dimensional shape
7	Select two-dimensional shapes
8	Draw polygons
9	Compose two-dimensional shapes
10	Sort shapes into a Venn diagram
11	Count shapes in a Venn diagram
CC.	Three-dimensional shapes
1	Select three-dimensional shapes
2	Name the three-dimensional shape
3	Count vertices, edges and faces
4	Compare vertices, edges and faces
5	Identify faces of three-dimensional shapes
6	Identify shapes traced from solids
7	Three-dimensional shapes in the real world I
8	Three-dimensional shapes in the real world II
DD.	Location and transformation
1	Location in a grid
2	Flip, turn and slide
3	Fractions of a turn
EE.	Area
1	Tile a rectangle with squares
2	Area
3	Select figures with a given area
4	Create figures with a given area
5	Create rectangles with a given area
FF.	Fractions
1	Equal parts
2	Identify halves
3	Identify quarters
4	Identify eighths
5	Identify halves, quarters and eighths
6	Make halves
7	Make quarters
8	Make eighths
9	Make halves, quarters and eighths
10	Make halves and quarters in different ways`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  // Is category line? (Starts with A., B., C., etc or "GRADE 2 MATHS - ")
  // Special case for the first line:
  if (line.startsWith("GRADE 2 MATHS -")) {
    currentCategory = "A. " + line.replace("GRADE 2 MATHS -", "").trim();
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
    id: `2_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataGrade2Maths.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " Grade 2 Maths skills.");
