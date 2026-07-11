const fs = require('fs');

let curriculumContent = fs.readFileSync('src/data/curriculum.js', 'utf8');
const parsedData = fs.readFileSync('parsedData.json', 'utf8');

// The original file starts with:
// export const curriculum = {
//   "Foundation": {
//     "Maths": [ ... ],
//     "English": ...

// We will use regex or string manipulation.
// Simple way: Find `"Maths": [` after `"Foundation": {` and replace up to the `],` before `"English": [`

const startIndex = curriculumContent.indexOf('"Maths": [');
const engIndex = curriculumContent.indexOf('"English": [');

if (startIndex > -1 && engIndex > -1) {
  // Find the `],` just before `"English"`
  const replaceEndIndex = curriculumContent.lastIndexOf('],', engIndex) + 2;
  
  const newContent = curriculumContent.substring(0, startIndex) + 
                     '"Maths": ' + parsedData + ',\n    ' + 
                     curriculumContent.substring(replaceEndIndex);
                     
  fs.writeFileSync('src/data/curriculum.js', newContent);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find insertion points.");
}
