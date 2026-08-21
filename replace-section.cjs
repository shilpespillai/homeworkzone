const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf-8');

const startTag = '<section id="grade-coverage"';
const endTag = '</section>';

const startIndex = file.indexOf(startTag);
// Find the closing tag of this section. Since there's another section right after, let's be careful.
// The next section is "PARENT & TUTOR ADVANTAGE SECTION"
const nextSectionIndex = file.indexOf('<!-- PARENT & TUTOR ADVANTAGE SECTION -->');
// Wait, the comment is {/* PARENT & TUTOR ADVANTAGE SECTION */}
const commentIndex = file.indexOf('{/* PARENT & TUTOR ADVANTAGE SECTION */}');

if (startIndex !== -1 && commentIndex !== -1) {
    // The end tag we want is the one right before commentIndex
    const textBetween = file.slice(startIndex, commentIndex);
    const lastEndTagIndex = textBetween.lastIndexOf('</section>') + startIndex + '</section>'.length;
    
    const replacement = \<section id="grade-coverage" className="mt-10">
            <button onClick={() => openLogin('teacher')} className="w-full block transition-transform hover:scale-[1.01] duration-300 focus:outline-none">
              <img 
                src="/tailored-practice.png" 
                alt="Tailored Practice from Foundation to Grade 12" 
                className="w-full h-auto object-contain shadow-2xl rounded-[24px] md:rounded-[36px] border border-slate-100" 
              />
            </button>
          </section>\;
          
    file = file.slice(0, startIndex) + replacement + "\\n\\n          " + file.slice(commentIndex);
    fs.writeFileSync('src/App.jsx', file, 'utf-8');
    console.log('Successfully replaced tailored practice section with the image!');
} else {
    console.log('Could not find boundaries');
}
