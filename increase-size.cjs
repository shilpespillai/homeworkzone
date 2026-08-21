const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf-8');

file = file.replace(
    'className="w-full max-w-5xl mx-auto block transition-transform hover:scale-[1.01] duration-300 focus:outline-none"',
    'className="w-[95%] md:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto block transition-transform hover:scale-[1.01] duration-300 focus:outline-none"'
);

fs.writeFileSync('src/App.jsx', file, 'utf-8');
console.log('Successfully increased the image size to 80%');
