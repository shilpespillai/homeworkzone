const fs = require('fs');

const rawText = `A.	Numbers to 100
1	Counting review - up to 10
2	Count to fill a ten frame
3	Counting review - up to 20
4	Count on ten frames - up to 40
•	New! Write the number you hear - up to 100
5	Count objects to 100
6	Count forward - up to 100
7	Count backward - up to 100
8	Number lines - up to 100
9	Counting on the hundred chart
10	Hundred chart
11	Even or odd number of shapes
12	Identify even and odd numbers
13	Even or odd numbers on number lines
14	Which even or odd number comes before or after?
15	Ordinal numbers
16	Roman numerals I, V, X
B.	Numbers to 120
•	New! Write the number you hear - up to 120
1	Count objects to 120
2	Count forward - up to 120
3	Count backward - up to 120
4	Number lines - up to 120
5	Count on a number chart - up to 120
6	Sequences up to 120 - count up and down by 1
7	Writing numbers in words - convert words to digits
8	Writing numbers in words - convert digits to words
C.	Skip-counting and equal groups
1	Learn to skip-count by twos
2	Skip-count by twos
3	Learn to skip-count by fives
4	Skip-count by fives
5	Learn to skip-count by tens
6	Skip-count by tens
7	Learn to skip-count by twos, fives and tens
8	Skip-count by twos, fives and tens
9	Count by twos, fives and tens
10	Skip-counting patterns - with tables
11	Sequences - count up and down by 1, 2, 5 and 10
12	Count equal groups
13	Identify repeated addition for equal groups - sums to 25
14	Write addition sentences for equal groups - sums to 25
15	Identify repeated addition for arrays - sums to 25
16	Write addition sentences for arrays - sums to 25
17	Solve word problems using repeated addition - sums to 25
•	New! Write stories involving repeated addition - sums to 25
18	Divide by counting equal groups
D.	Comparing up to 10
1	Comparing: more or fewer?
2	Comparing: how many more?
3	Comparing: how many fewer?
4	Comparing: how many more or fewer?
5	Compare numbers up to 10 using words
6	Compare numbers up to 10 using symbols
7	Compare numbers up to 10 - word problems
E.	Understand addition
1	Add with cubes - sums up to 10
2	Add with pictures - sums up to 10
3	Addition sentences up to 10 - which model matches?
4	Addition sentences up to 10 - what does the model show?
5	Write addition sentences for pictures - sums up to 10
6	Addition sentences using number lines - sums up to 10
7	Turn words into an addition sentence - sums up to 10
F.	Addition strategies up to 10
1	Add in any order
2	Add by counting on - sums up to 10
3	Complete the addition sentence to make ten - with models
4	Complete the addition sentence - make ten
G.	Addition up to 10
1	Addition facts - sums up to 10
•	New! Partition numbers in different ways - sums up to 10
2	Make a number using addition - sums up to 10
3	Ways to make a number - addition sentences up to 10
4	Complete the addition sentence - sums up to 10
H.	Addition word problems up to 10
1	Addition word problems with pictures - sums up to 10
2	Addition sentences for word problems with pictures - sums up to 10
3	Build cube models to solve addition word problems - sums up to 10
4	Addition word problems - sums up to 10
5	Addition sentences for word problems - sums up to 10
I.	Understand subtraction
1	Subtract with cubes - up to 10
2	Subtract with pictures - up to 10
3	Subtraction sentences up to 10 - which model matches?
4	Subtraction sentences up to 10 - what does the model show?
•	New! Subtraction sentences up to 10 - what does the cube model show?
5	Write subtraction sentences for pictures - up to 10
6	Subtraction sentences using number lines - up to 10
7	Turn words into a subtraction sentence - up to 10
8	Subtract zero and all
J.	Subtraction strategies up to 10
1	Subtract by counting back - up to 10
2	Subtract by counting on - up to 10
3	Relate addition and subtraction sentences - up to 10
4	Use addition to subtract - up to 10
K.	Subtraction up to 10
1	Subtraction facts - up to 10
2	Make a number using subtraction - up to 10
3	Ways to make a number - subtraction sentences up to 10
4	Ways to subtract from a number - subtraction sentences
5	Complete the subtraction sentence - up to 10
L.	Subtraction word problems up to 10
1	Subtraction word problems with pictures - up to 10
2	Subtraction sentences for word problems with pictures - up to 10
3	Use cube models to solve subtraction word problems - numbers up to 10
4	Subtraction word problems - up to 10
5	Subtraction sentences for word problems - up to 10
M.	Addition and subtraction up to 10
1	Fact families - up to 10
2	Addition and subtraction facts - up to 10
3	Sort addition and subtraction facts - up to 10
4	Addition and subtraction sentences to 10 - which is true?
5	Which sign makes the number sentence true? - up to 10
N.	Addition and subtraction word problems up to 10
1	Addition and subtraction word problems with pictures - up to 10
2	Use cube models to solve addition and subtraction word problems - up to 10
3	Addition and subtraction sentences for word problems - up to 10
•	New! Word problems with change unknown - up to 10
•	New! Word problems with start unknown - up to 10
4	Word problems with one addend unknown - up to 10
•	New! Word problems involving addition and subtraction - up to 10
•	New! Match word problems to addition and subtraction sentences - up to 10
O.	Addition strategies up to 20
1	Related addition facts
2	Addition sentences using number lines - sums up to 20
3	Add by counting on - sums up to 20
4	Add doubles - with models
5	Add doubles
6	Add doubles - complete the sentence
7	Add using doubles plus one
8	Add using doubles minus one
9	Add three numbers - use doubles
10	Use ten frames to add
11	Make ten to add
12	Add three numbers - make ten
P.	Addition up to 20
1	Adding 1
2	Adding 2
3	Adding 3
4	Adding 4
5	Adding 5
6	Adding 6
7	Adding 7
8	Adding 8
9	Adding 9
10	Adding 10
11	Adding 0
12	Addition facts - sums up to 20
13	Sort addition facts - sums up to 20
14	Make a number using addition - sums up to 20
15	Addition sentences up to 20: true or false?
16	Complete the addition sentence - sums up to 20
17	Add three numbers
Q.	Addition word problems up to 20
1	Addition word problems - sums up to 20
2	Addition sentences for word problems - sums up to 20
3	Add three numbers - word problems
R.	Subtraction strategies up to 20
1	Related subtraction facts
2	Relate addition and subtraction sentences - up to 20
3	Subtraction sentences using number lines - up to 20
4	Subtract by counting back - up to 20
5	Use ten frames to subtract
6	Use ten to subtract
7	Use addition to subtract - up to 20
8	Subtract by counting on - up to 20
•	New! Count on and use ten to subtract - up to 20
9	Subtract doubles
S.	Subtraction up to 20
1	Subtracting 1
2	Subtracting 2
3	Subtracting 3
4	Subtracting 4
5	Subtracting 5
6	Subtracting 6
7	Subtracting 7
8	Subtracting 8
9	Subtracting 9
10	Subtracting 10
11	Subtracting 0
12	Subtraction facts - up to 20
13	Sort subtraction facts - up to 20
14	Make a number using subtraction - up to 20
15	Subtraction sentences up to 20: true or false?
16	Complete the subtraction sentence - up to 20
T.	Subtraction word problems up to 20
1	Subtraction word problems - up to 20
2	Subtraction sentences for word problems - up to 20
U.	Addition and subtraction up to 20
1	Fact families - up to 20
2	Addition and subtraction facts - up to 20
3	Addition and subtraction - ways to make a number up to 20
4	Addition and subtraction sentences to 20 - which is true?
5	Which sign makes the number sentence true? - up to 20
V.	Addition and subtraction word problems up to 20
1	Word problems with sum or difference unknown - up to 20
•	New! Word problems with change unknown - up to 20
•	New! Word problems with start unknown - up to 20
•	New! Word problems with one addend unknown - up to 20
•	New! Word problems involving addition and subtraction - up to 20
2	Addition and subtraction sentences for word problems - up to 20
•	New! Match word problems to addition and subtraction sentences - up to 20
W.	Place value
1	Make teen numbers with models: words
2	Partition teen numbers with models: words
3	Make teen numbers with models: addition sentences
4	Partition teen numbers with models: addition sentences
5	Make and partition teen numbers with models: addition sentences
6	Build and partition teen numbers
7	Place value models up to 20
8	Build and partition multiples of ten
9	Build two-digit numbers
10	Build and partition two-digit numbers - with models
11	Place value models for two-digit numbers
12	Build and partition two-digit numbers - without models
13	Ways to make a number - tens and ones
14	Place value models - up to hundreds
X.	Comparing up to 120
1	Use place value to compare numbers up to 100
2	Compare numbers up to 100 using words
3	Compare numbers up to 100 using symbols - with models
4	Compare numbers up to 100 using number lines
5	Compare numbers up to 100 using symbols
6	Compare numbers up to 100 - word problems
7	Put numbers up to 100 in order using number lines
8	Put numbers up to 100 in order
9	Use place value to compare numbers up to 120
10	Compare numbers up to 120 using words
11	Compare numbers up to 120 using symbols
12	Put numbers up to 120 in order
Y.	Measurement
1	Long and short
2	Tall and short
3	Order objects: length and height
4	Indirect comparison
5	Wide and narrow
6	Light and heavy
7	Holds more or less
8	Compare size, weight and capacity
9	Measure length with objects
10	Build cube models to measure length
11	Build cube models to measure height
12	Read a thermometer
13	Measure using a centimetre ruler
14	Which metric unit of length is appropriate?
15	Metric units of length - word problems
Z.	Time
1	Match digital clocks and times
2	Match analogue clocks and times with words: to the hour
3	Match analogue clocks and times with words: to the half hour
4	Match analogue clocks and times
5	Match analogue and digital clocks
6	Read clocks and write times
7	A.M. or P.M.
8	Times of everyday events
9	Compare clocks
AA.	Days, months and seasons
1	Days of the week
2	Months of the year
3	Seasons of the year
4	Read a calendar
BB.	Money
1	Coin values
2	Count money - 5c and 10c coins
3	Count money - all coins
4	Compare money amounts
CC.	Data and graphs
1	Which picture graph is correct?
2	Make picture graphs with pictures
3	Interpret picture graphs
4	Make picture graphs with symbols
5	Tally marks - up to 10
6	Which tally chart is correct?
7	Interpret tally charts
8	Which table is correct?
9	Interpret data in tables
10	Show data in different ways
11	Interpret bar graphs: find the number in one category
12	Interpret bar graphs
13	Which bar graph is correct?
DD.	Patterns
1	Introduction to patterns
2	Find the next shape in a pattern
3	Complete a pattern
4	Make a pattern
5	Growing patterns
6	Find the next shape in a growing pattern
7	Find the next row in a growing pattern
EE.	Two-dimensional shapes
1	Name the two-dimensional shape
2	Select two-dimensional shapes
3	Two-dimensional shapes in the real world
4	Count sides and vertices
5	Compare sides and vertices
6	Sort two-dimensional shapes
7	Square corners
8	Equal sides
9	Open and closed shapes
10	Attributes of two-dimensional shapes
11	Compare shapes using attributes
12	Name the two-dimensional shape and explain your answer
13	Compose two-dimensional shapes
14	Compose two-dimensional shapes: which shapes can you make?
FF.	Three-dimensional shapes
1	Two-dimensional and three-dimensional shapes
2	Cubes and rectangular prisms
3	Name the three-dimensional shape
4	Select three-dimensional shapes
5	Count vertices, edges and faces
6	Compare vertices, edges and faces
7	Identify shapes traced from solids
8	Identify faces of three-dimensional shapes
9	Attributes of three-dimensional shapes
10	Name the three-dimensional shape and explain your answer
11	Sort three-dimensional shapes
12	Compose three-dimensional shapes
13	Compose bigger three-dimensional shapes
14	Three-dimensional shapes in the real world I
15	Three-dimensional shapes in the real world II
GG.	Positions
1	Above and below
2	Beside and next to
3	Left, middle and right
4	Top, middle and bottom
5	Location in a grid
HH.	Venn diagrams
1	Sort shapes into a Venn diagram
2	Count shapes in a Venn diagram
II.	Fractions
1	Equal parts
2	Identify halves
3	Identify quarters
4	Identify halves and quarters
5	Make halves
6	Make quarters
7	Make halves and quarters
8	Make halves and quarters in different ways
JJ.	Probability
1	More, less and equally likely
2	Certain, probable, unlikely and impossible`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  // Is category line? (Starts with A., B., C., etc)
  const categoryMatch = line.match(/^([A-Z]{1,2})\.\s+(.+)$/);
  if (categoryMatch) {
    currentCategory = line; // e.g., "A. Numbers to 100"
    continue;
  }
  
  // Is a skill line?
  let skillTitle = line;
  const numMatch = line.match(/^(\d+|•\s*New!)\s+(.+)$/);
  if (numMatch) {
    skillTitle = numMatch[2].trim();
  }
  
  result.push({
    id: `1_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataGrade1Maths.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " Grade 1 Maths skills.");
