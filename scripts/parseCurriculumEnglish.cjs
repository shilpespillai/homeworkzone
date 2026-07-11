const fs = require('fs');

const rawText = `A.	Letter identification
1	Find the letter in the alphabet: uppercase
2	Find the letter in the alphabet: lowercase
3	Choose the letter that you hear: uppercase
4	Choose the letter that you hear: lowercase
5	Frequently confused letters: find the letter
6	Frequently confused letters: find all the letters
B.	Lowercase and uppercase letters
1	Choose the lowercase letter that matches: c, k, o, p, s, u, v, w, x, z
2	Choose the lowercase letter that matches: f, i, j, l, m, t, y
3	Choose the lowercase letter that matches: a, b, d, e, g, h, n, q, r
4	Choose the lowercase letter that matches: review
5	Find all the lowercase letters
6	Choose the uppercase letter that matches: C, K, O, P, S, U, V, W, X, Z
7	Choose the uppercase letter that matches: F, I, J, L, M, T, Y
8	Choose the uppercase letter that matches: A, B, D, E, G, H, N, Q, R
9	Choose the uppercase letter that matches: review
10	Find all the uppercase letters
11	Put the letters in ABC order
C.	Word recognition
1	Choose the two words that are the same
2	Choose the sentence that is spaced correctly
3	Find a word in a sentence
D.	Consonants and vowels
1	Sort consonants and vowels
2	Find the vowel in the word
E.	Syllables
1	How many syllables does the word have?
2	Which word has more syllables?
3	Sort by the number of syllables
F.	Rhyming
1	Which word has the same ending?
2	Which two words have the same ending?
3	Choose the picture that rhymes with the word
4	Which word does not rhyme?
5	Complete the rhyme
G.	Blending and segmenting
1	Blend onset and rime together to make a word
2	Blend each sound in a word together
3	Identify the first, second and last sound in a word
4	Put the sounds in order
H.	Beginning and ending sounds
1	Which two words start with the same sound?
2	Which word ends with the same sound?
3	Which two words end with the same sound?
I.	Letter-sound associations
1	Find the words that begin with a given sound
2	Choose the letter that matches the consonant sound: b, d, j, k, p, t, v, z
3	Choose the letter that matches the consonant sound: f, l, m, n, r, s
4	Choose the letter that matches the consonant sound: c, g, h, w
5	Choose the letter that matches the consonant sound: review
6	Which letter does the word start with?
7	Which letter does the word end with?
J.	Consonant blends and digraphs
1	Which consonant blend does the word start with?
2	Complete the word with the right initial consonant blend
3	Does the word start with a consonant blend?
4	Which consonant blend does the word end with?
5	Complete the word with the right final consonant blend
6	Does the word end with a consonant blend?
7	Choose the word that matches the picture: -ss, -ll, -ff, -zz, -ck
8	Choose the correct digraph
K.	Short a
1	Find the short a word
2	Choose the short a word that matches the picture
3	Complete the short a word
4	Choose the short a sentence that matches the picture
L.	Short e
1	Find the short e word
2	Choose the picture that matches the short e word
3	Complete the short e word
4	Choose the short e sentence that matches the picture
M.	Short i
1	Find the short i word
2	Choose the short i word that matches the picture
3	Complete the short i words
4	Choose the short i sentence that matches the picture
N.	Short o
1	Find the short o word
2	Choose the short o word that matches the picture
3	Complete the short o word
4	Choose the short o sentence that matches the picture
O.	Short u
1	Find the short u word
2	Choose the picture that matches the short u word
3	Complete the short u word
4	Choose the short u sentence that matches the picture
P.	Short vowels
1	Identify the short vowel sound in a word
2	Complete the word with the right short vowel
3	Spell the short vowel word
4	Complete the sentence with the correct short vowel word
5	Read questions with short vowel words
Q.	Long vowels
1	Find the word with the same vowel sound
2	Which two words have the same vowel sound?
3	Find the long a word
4	Find the long e word
5	Find the long i word
6	Find the long o word
7	Find the long u word
8	Sort short and long vowel words
R.	Sight words
1	Choose the two sight words that are the same
2	Read sight words set 1: ate, he, of, that, was
3	Read sight words set 2: are, green, on, please, they
4	Read sight words set 3: be, have, or, pretty, this
5	Read sight words: review sets 1, 2, 3
6	Read sight words set 4: all, but, ride, saw, what
7	Read sight words set 5: about, like, she, under, we
8	Read sight words set 6: black, into, made, ran, white
9	Read sight words: review sets 4, 5, 6
10	Read sight words set 7: am, did, get, now, well
11	Read sight words set 8: fast, good, him, take, will
12	Read sight words set 9: came, going, say, too, with
13	Read sight words set 10: brown, does, eat, must, went
14	Read sight words: review sets 7, 8, 9, 10
15	Read sight words: review sets 1–10
16	Complete the sentence with the correct sight word
17	Spell the sight word
Reading strategies
S.	Text features
1	Identify book parts and features
T.	Reality vs fiction
1	Which could happen in real life?
U.	Main idea
1	What is the picture about?
V.	Inference and analysis
1	Which feeling matches the picture?
2	What will happen next?
W.	Riddles
1	What am I?
Vocabulary
X.	Colour and number words
1	Use number words: one to ten
2	Use colour words
Y.	Adjectives and verbs
1	Compare pictures using adjectives
2	Find the picture that matches the action verb
Z.	Location words
1	Inside and outside, above and below, next to and beside
2	Choose the best location word to match the picture
AA.	Question words
1	Who, what, when, where or why?
BB.	Synonyms and antonyms
1	Match antonyms to pictures
2	Match synonyms
CC.	Categories
1	Sort objects into categories
2	Which one is not like the others?
DD.	Multiple-meaning words
1	Multiple-meaning words with pictures
Grammar and mechanics
EE.	Sentences
1	Is it a telling sentence or an asking sentence?
2	Identify and use end marks
3	Find the complete sentence
4	Unscramble the words to make a complete sentence
FF.	Capitalisation
1	Capitalise the first letter of a sentence
2	Capitalise the pronoun 'I'
GG.	Nouns
1	Is the noun a person, animal, place or thing?
2	Choose the singular or plural noun that matches the picture
HH.	Verbs
1	Find the action verb with images
2	Find the action verb
3	Complete the sentence with an action verb to match the picture`;

const lines = rawText.split('\n');
const result = [];
let currentCategory = "";
let skillCounter = 1;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
  // Exclude section titles like "Reading strategies", "Vocabulary", "Grammar and mechanics"
  if (line === "Reading strategies" || line === "Vocabulary" || line === "Grammar and mechanics") {
    continue;
  }
  
  // Is category line? (Starts with A., B., C., etc)
  const categoryMatch = line.match(/^([A-Z]{1,2})\.\s+(.+)$/);
  if (categoryMatch) {
    currentCategory = line; // e.g., "A. Letter identification"
    continue;
  }
  
  // Is a skill line?
  let skillTitle = line;
  const numMatch = line.match(/^(\d+|•\s*New!)\s+(.+)$/);
  if (numMatch) {
    skillTitle = numMatch[2].trim();
  }
  
  result.push({
    id: `f_e_${skillCounter}`,
    title: skillTitle,
    category: currentCategory
  });
  skillCounter++;
}

fs.writeFileSync('parsedDataEnglish.json', JSON.stringify(result, null, 2));
console.log("Parsed " + result.length + " English skills.");
