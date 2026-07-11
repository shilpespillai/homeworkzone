const fs = require('fs');

const rawText = `A.	Numbers and counting up to 3
1	Identify numbers - up to 3
2	Choose the number that you hear - up to 3
3	Learn to count to 3
4	Count pictures - up to 3
5	Count shapes - up to 3
6	Count on ten frames - up to 3
7	Count out stickers - up to 3
8	Show numbers on ten frames - up to 3
9	Represent numbers with pictures - up to 3
10	Represent numbers with shapes - up to 3
11	Ordinal numbers - up to third
B.	Numbers and counting up to 5
1	Identify numbers - up to 5
2	Choose the number that you hear - up to 5
3	Learn to count to 5
4	Count pictures - up to 5
5	Count shapes in rows - up to 5
6	Count cubes - up to 5
7	Count dots - 0 to 5
8	Count on ten frames - up to 5
9	Count scattered shapes - up to 5
10	Count out stickers - up to 5
11	Show numbers with cubes - up to 5
12	Show numbers on ten frames - up to 5
13	Represent numbers with pictures - up to 5
14	Represent numbers with shapes - up to 5
15	What number comes next? - up to 5
16	Ordinal numbers - up to fifth
C.	One more and one less to 5
1	One more with pictures - up to 5
2	One more on frames - up to 5
3	One more - up to 5
4	One less with pictures - up to 5
5	One less on frames - up to 5
6	One less - up to 5
D.	Numbers and counting up to 10
1	Identify numbers - up to 10
2	Choose the number that you hear - up to 10
3	Names of numbers - up to 10
4	Learn to count to 10
5	Count pictures - up to 10
6	Count cubes - up to 10
7	Count dots - up to 10
8	Count shapes in rows - up to 10
9	Count on ten frames - up to 10
10	Count scattered shapes - up to 10
11	Count shapes in rings - up to 10
12	Count out stickers - up to 10
13	Show numbers with cubes - up to 10
14	Show numbers on ten frames - up to 10
15	Represent numbers - up to 10
16	Tally marks - up to 10
E.	One more and one less to 10
1	One more with pictures - up to 10
2	One more on frames - up to 10
3	One more - up to 10
4	One less with pictures - up to 10
5	One less on frames - up to 10
6	One less - up to 10
7	One more and one less with pictures - up to 10
8	One more and one less on frames - up to 10
9	One more and one less - up to 10
F.	Counting forward and back to 10
1	What number comes next? - up to 10
2	Count up to find the next number - up to 10
3	Count up and down to find the next number - up to 10
4	Count to fill a ten frame
5	Number lines - up to 10
6	Before, after and between - up to 10
7	Count forward - up to 10
8	Count forward and backward - up to 10
9	Complete a sequence - up to 10
10	Ordinal numbers - up to tenth
G.	Comparing up to 10
1	Fewer and more - compare by matching
2	Fewer, more and same
3	Are there enough?
4	Fewer and more - compare by counting
5	Fewer and more - compare in a mixed group
6	Compare two numbers - up to 10
7	Compare three numbers - up to 10
8	Put numbers up to 10 in order
H.	Understand addition up to 5
1	Put together numbers using cubes - sums up to 5
2	Addition sentences up to 5 - which model matches?
3	Addition sentences up to 5 - what does the model show?
I.	Addition up to 5
1	Add with cubes - sums up to 5
2	Add with pictures - sums up to 5
3	Add two numbers - sums up to 5
4	Complete the addition sentence - sums up to 5
J.	Partition numbers up to 5
1	Partition numbers using cubes - sums up to 5
2	Make a number different ways using cubes - sums up to 5
3	Partition numbers up to 5 - addition sentences
4	Make a number using addition - sums up to 5
K.	Addition word problems up to 5
1	Build cube models to solve addition word problems - sums up to 5
2	Addition word problems with pictures - sums up to 5
3	Addition sentences for word problems with pictures - sums up to 5
4	Addition word problems - sums up to 5
L.	Understand addition up to 10
1	Put together numbers using cubes - sums up to 10
2	Addition sentences up to 10 - which model matches?
3	Addition sentences up to 10 - what does the model show?
4	Turn words into an addition sentence - sums up to 10
M.	Addition up to 10
1	Add with cubes - sums up to 10
2	Add with pictures - sums up to 10
3	Add two numbers - sums up to 10
4	Complete the addition sentence to make 10 - with models
5	Complete the addition sentence - make 10
6	Complete the addition sentence - sums up to 10
7	Add in any order
N.	Partition numbers up to 10
1	Partition numbers using cubes - sums up to 10
2	Make a number different ways using cubes - sums up to 10
3	Partition 10 using cubes
4	Partition numbers up to 10 - addition sentences
5	Partition 10 - addition sentences
6	Make a number using addition - sums up to 10
O.	Addition word problems up to 10
1	Build cube models to solve addition word problems - sums up to 10
2	Addition word problems with pictures - sums up to 10
3	Addition sentences for word problems with pictures - sums up to 10
4	Addition word problems - sums up to 10
P.	Understand subtraction up to 5
1	Take away cubes - numbers up to 5
2	Subtraction sentences up to 5 - which model matches?
3	Subtraction sentences up to 5 - what does the model show?
•	New! Subtraction sentences up to 5 - what does the cube model show?
Q.	Subtraction up to 5
1	Subtract with cubes - numbers up to 5
2	Subtract with pictures - numbers up to 5
3	Subtract - numbers up to 5
4	Make a number using subtraction - numbers up to 5
5	Complete the subtraction sentence - numbers up to 5
R.	Subtraction word problems up to 5
1	Subtraction word problems with pictures - numbers up to 5
2	Subtraction sentences for word problems with pictures - numbers up to 5
3	Use cube models to solve subtraction word problems - numbers up to 5
4	Subtraction word problems - numbers up to 5
S.	Understand subtraction up to 10
1	Take away cubes - numbers up to 10
2	Subtraction sentences up to 10 - which model matches?
3	Subtraction sentences up to 10 - what does the model show?
•	New! Subtraction sentences up to 10 - what does the cube model show?
4	Turn words into a subtraction sentence - numbers up to 10
T.	Subtraction up to 10
1	Subtract with cubes - numbers up to 10
2	Subtract with pictures - numbers up to 10
3	Subtract - numbers up to 10
4	Make a number using subtraction - numbers up to 10
5	Complete the subtraction sentence - numbers up to 10
U.	Subtraction word problems up to 10
1	Subtraction word problems with pictures - numbers up to 10
2	Subtraction sentences for word problems with pictures - numbers up to 10
3	Use cube models to solve subtraction word problems - numbers up to 10
4	Subtraction word problems - numbers up to 10
V.	Mixed operations
1	Add or subtract - numbers up to 5
2	Add or subtract - numbers up to 10
•	New! Related facts with models - numbers up to 5
•	New! Related facts with models - numbers up to 10
3	Addition and subtraction - ways to make a number up to 10
W.	Mixed operation word problems
1	Addition and subtraction word problems with pictures
2	Use cube models to solve addition and subtraction word problems
3	Addition and subtraction word problems
X.	Numbers and counting up to 20
1	Identify numbers - up to 20
•	New! Write the number you hear - up to 20
2	Names of numbers - up to 20
3	Count pictures - up to 20
4	Count dots - 0 to 20
•	New! Count pictures in arrays and circles - up to 20
5	Count on ten frames - up to 20
6	Show numbers on ten frames - up to 20
7	Represent numbers - up to 20
8	Tally marks - up to 20
Y.	One more and one less to 20
1	One more - up to 20
2	One less - up to 20
3	One more and one less - up to 20
Z.	Counting forward and back to 20
1	Count up to find the next number - up to 20
2	Count up and down to find the next number - up to 20
3	Number lines - up to 20
4	Before, after and between - up to 20
5	Count forward - up to 20
6	Count forward and backward - up to 20
7	Complete a sequence - up to 20
AA.	Comparing up to 20
•	New! More than, less than or equal to - compare by counting up to 20
1	Compare numbers up to 20
2	Put numbers up to 20 in order
BB.	Teen numbers
1	Make teen numbers with models: words
2	Partition teen numbers with models: words
3	Understand tens and ones - up to 20
4	Make teen numbers with models: addition sentences
5	Partition teen numbers with models: addition sentences
CC.	Skip-counting
1	Learn to skip-count by twos
2	Skip-count by twos
3	Learn to skip-count by fives
4	Skip-count by fives
5	Learn to skip-count by tens
6	Skip-count by tens
7	Learn to skip-count by twos, fives and tens
8	Skip-count by twos, fives and tens
9	Count groups of ten
DD.	Numbers and counting to 100
1	Count on ten frames - up to 30
2	Number lines - up to 30
3	Understand tens and ones - up to 30
4	Count pictures - up to 100
5	Count on the hundred chart
EE.	Patterns
1	Colour patterns
2	Size patterns
3	Shape patterns
4	Find the next shape in a pattern
5	Complete a pattern
6	Growing patterns
7	Find the next shape in a growing pattern
8	Find the next row in a growing pattern
FF.	Positions
1	In front of and behind
2	Inside and outside
3	Above and below
4	Beside and next to
5	Left, middle and right
6	Top, middle and bottom
7	Location in a grid
GG.	Same and different
1	Different
2	Same
3	Same and different
HH.	Two-dimensional shapes
1	Circles
2	Triangles
3	Squares and rectangles
4	Hexagons
5	Name circles, triangles, squares and rectangles
6	Name circles, triangles, squares, rectangles and hexagons
7	Select circles, triangles, squares and rectangles
8	Select circles, triangles, squares, rectangles and hexagons
9	Sort circles, triangles, squares and rectangles
10	Sort circles, triangles, squares, rectangles and hexagons
11	Compose two-dimensional shapes
II.	Two-dimensional shape attributes
1	Curved parts
2	Square corners
3	Equal sides
4	Count sides and corners
5	Compare sides and corners
6	Compare shapes using attributes
JJ.	Three-dimensional shapes
1	Two-dimensional and three-dimensional shapes
2	Spheres
3	Cubes
4	Cones
5	Cylinders
6	Select three-dimensional shapes
7	Name the three-dimensional shape
8	Identify shapes traced from solids
KK.	Shapes in the real world
1	Two-dimensional shapes in the real world
2	Three-dimensional shapes in the real world I
3	Three-dimensional shapes in the real world II
4	Three-dimensional shapes - above and below
5	Three-dimensional shapes - beside and next to
LL.	Equal parts and equal groups
1	Equal parts
2	Equal groups
MM.	Sorting and classifying
1	Classify shapes by colour
2	Classify and sort by shape
3	Classify and sort
4	Classify, sort and count
•	New! Sort, count and compare
5	Count shapes in a Venn diagram
6	Sort shapes into a Venn diagram
NN.	Data and graphs
1	Which picture graph is correct?
•	New! Make picture graphs
2	Interpret picture graphs
OO.	Measurement
1	Long and short
2	Tall and short
3	Wide and narrow
4	Light and heavy
5	Holds more or less
•	New! Covers more or less
6	Compare size, weight and capacity
•	New! Should you measure size, weight or capacity?
7	Measure length with objects
8	Measure length with cubes
9	Build cube models to measure length
10	Measure height with cubes
11	Build cube models to measure height
PP.	Time
1	Match analogue clocks and times
2	Match digital clocks and times
3	Match analogue and digital clocks
4	Read clocks and write times
5	Times of everyday events
6	Days of the week
QQ.	Money
1	Coin values
2	Count money - 5c coins
3	Count money - 5c and 10c coins
4	Count money - 5c, 10c and 20c coins`;

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
    currentCategory = line; // e.g., "A. Numbers and counting up to 3"
    continue;
  }
  
  // Is a skill line?
  let skillTitle = line;
  const numMatch = line.match(/^(\d+|•\s*New!)\s+(.+)$/);
  if (numMatch) {
    skillTitle = numMatch[2].trim();
  }
  
  result.push({
    id: `f_m_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedData.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " skills.");
