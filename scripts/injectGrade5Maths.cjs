const fs = require('fs');

let curriculumContent = fs.readFileSync('src/data/curriculum.js', 'utf8');
const parsedData = fs.readFileSync('parsedDataGrade5Maths.json', 'utf8');

// We want to replace the "Maths" array under "Grade 5":
// "Grade 5": {
//   "Maths": [
//     ...
//   ],
//   "English": [

const grade5Index = curriculumContent.indexOf('"Grade 5": {');
const mathsStartIndex = curriculumContent.indexOf('"Maths": [', grade5Index);
const engStartIndex = curriculumContent.indexOf('"English": [', mathsStartIndex);

if (mathsStartIndex > -1 && engStartIndex > -1) {
  // Find the `],` just before `"English"`
  const replaceEndIndex = curriculumContent.lastIndexOf('],', engStartIndex) + 2;
  
  const newContent = curriculumContent.substring(0, mathsStartIndex) + 
                     '"Maths": ' + parsedData + ',\n    ' + 
                     curriculumContent.substring(replaceEndIndex);
                     
  fs.writeFileSync('src/data/curriculum.js', newContent);
  console.log("Grade 5 Maths replaced successfully!");
} else {
  console.log("Could not find insertion points.");
}
