const fs = require('fs');

let curriculumContent = fs.readFileSync('src/data/curriculum.js', 'utf8');
const parsedData = fs.readFileSync('parsedDataEnglish.json', 'utf8');

// We want to replace the "English" array under "Foundation":
// "English": [
//   ...
// ],
// "Science": [

const foundationIndex = curriculumContent.indexOf('"Foundation": {');
const engStartIndex = curriculumContent.indexOf('"English": [', foundationIndex);
const sciStartIndex = curriculumContent.indexOf('"Science": [', engStartIndex);

if (engStartIndex > -1 && sciStartIndex > -1) {
  // Find the `],` just before `"Science"`
  const replaceEndIndex = curriculumContent.lastIndexOf('],', sciStartIndex) + 2;
  
  const newContent = curriculumContent.substring(0, engStartIndex) + 
                     '"English": ' + parsedData + ',\n    ' + 
                     curriculumContent.substring(replaceEndIndex);
                     
  fs.writeFileSync('src/data/curriculum.js', newContent);
  console.log("English replaced successfully!");
} else {
  console.log("Could not find insertion points.");
}
