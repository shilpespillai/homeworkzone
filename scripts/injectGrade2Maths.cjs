const fs = require('fs');

let curriculumContent = fs.readFileSync('src/data/curriculum.js', 'utf8');
const parsedData = fs.readFileSync('parsedDataGrade2Maths.json', 'utf8');

// We want to replace the "Maths" array under "Grade 2":
// "Grade 2": {
//   "Maths": [
//     ...
//   ],
//   "English": [

const grade2Index = curriculumContent.indexOf('"Grade 2": {');
const mathsStartIndex = curriculumContent.indexOf('"Maths": [', grade2Index);
const engStartIndex = curriculumContent.indexOf('"English": [', mathsStartIndex);

if (mathsStartIndex > -1 && engStartIndex > -1) {
  // Find the `],` just before `"English"`
  const replaceEndIndex = curriculumContent.lastIndexOf('],', engStartIndex) + 2;
  
  const newContent = curriculumContent.substring(0, mathsStartIndex) + 
                     '"Maths": ' + parsedData + ',\n    ' + 
                     curriculumContent.substring(replaceEndIndex);
                     
  fs.writeFileSync('src/data/curriculum.js', newContent);
  console.log("Grade 2 Maths replaced successfully!");
} else {
  console.log("Could not find insertion points.");
}
