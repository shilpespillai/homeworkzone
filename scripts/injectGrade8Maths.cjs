const fs = require('fs');

let curriculumContent = fs.readFileSync('src/data/curriculum.js', 'utf8');
const parsedData = fs.readFileSync('parsedDataGrade8Maths.json', 'utf8');

// The file ends with:
//   }
// };

// We want to replace the last }; with:
//   },
//   "Grade 8": {
//     "Maths": [ parsed data ]
//   }
// };

const lastBraceIndex = curriculumContent.lastIndexOf('};');

if (lastBraceIndex > -1) {
  const newContent = curriculumContent.substring(0, lastBraceIndex) + 
                     '  },\n  "Grade 8": {\n    "Maths": ' + parsedData + '\n  }\n' +
                     curriculumContent.substring(lastBraceIndex);
                     
  fs.writeFileSync('src/data/curriculum.js', newContent);
  console.log("Grade 8 Maths injected successfully!");
} else {
  console.log("Could not find insertion points.");
}
