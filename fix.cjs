const fs = require('fs');
let content = fs.readFileSync('src/components/AdventureMazeView.jsx', 'utf8');

const tracksToFix = ['candyland', 'dinosaur', 'pirate', 'forest', 'haunted', 'magic', 'desert', 'jungle', 'island', 'space'];

for (const track of tracksToFix) {
  const regex = new RegExp(track + ':\\s*\\[([\\s\\S]*?)\\]', 'g');
  content = content.replace(regex, (match, p1) => {
    const newInner = p1.replace(/\{\s*x:\s*(\d+),\s*y:\s*(\d+)\s*\}/g, (m, xStr, yStr) => {
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);
      const newX = Math.round((x / 1024) * 1000);
      const newY = Math.round((y / 576) * 650);
      return `{ x: ${newX}, y: ${newY} }`;
    });
    return track + ': [' + newInner + ']';
  });
}

fs.writeFileSync('src/components/AdventureMazeView.jsx', content);
console.log('Done!');
