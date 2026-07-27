import fs from 'fs';

let text = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');

const replacements = [
  [/ðŸ“Š/g, '📊'],
  [/ðŸš€/g, '🚀'],
  [/ðŸ •/g, '🍕'],
  [/ðŸŽˆ/g, '🎈'],
  [/ðŸ§ /g, '🧠'],
  [/ðŸŽ‰/g, '🎉'],
  [/ðŸŽ‚/g, '🎂'],
  [/ðŸ“…/g, '📅'],
  [/ðŸŒŸ/g, '🌟'],
  [/ðŸ †/g, '🏆'],
  [/ðŸ“š/g, '📚'],
  [/ðŸ’ª/g, '💪'],
  [/ðŸŽ¯/g, '🎯'],
  [/ðŸ’¡/g, '💡'],
  [/ðŸ“¤/g, '📤'],
  [/ðŸª„/g, '🪄'],
  [/ðŸ’¬/g, '💬'],
  [/ðŸŽ¨/g, '🎨'],
  [/ðŸ—‘ï¸ /g, '🗑️'],
  [/ðŸ—‘/g, '🗑️'],
  [/ðŸ Ž/g, '🗑️'],
  [/ðŸŽ–ï¸ /g, '🎖️'],
  [/ðŸ”„/g, '🔄'],
  [/ðŸ“ /g, '📝'],
  [/ðŸ’¾/g, '💾'],
  [/ðŸ§¹/g, '🧹'],
  [/ðŸ’³/g, '💳'],
  [/ðŸ‘‘/g, '👑'],
  [/ðŸ§®/g, '🧮'],
  [/ðŸ¦‰/g, '🦉'],
  [/ðŸŽ’/g, '🎒'],
  [/âœ✨/g, '✨'],
  [/âœ/g, '✨'],
  [/âš ï¸ /g, '⚠️'],
  [/âš /g, '⚠️'],
  [/âš/g, '⚠️'],
  [/â–²/g, '▲'],
  [/â–¼/g, '▼'],
  [/â”€/g, '─'],
  [/â€¢/g, '•'],
  [/âœ”ï¸ /g, '✔️'],
  [/âœ”/g, '✔️'],
  [/â Œ/g, '❌'],
  [/âœ•/g, '✕'],
  [/ðŸ–¨ï¸ /g, '🖨️'],
  [/ðŸ”’/g, '🔒'],
  [/Â£/g, '£'],
  [/â‚¬/g, '€'],
  [/â‚¹/g, '₹'],
  [/â€“/g, '–'],
  [/â€”/g, '—'],
];

for (const [pattern, replacement] of replacements) {
  text = text.replace(pattern, replacement);
}

fs.writeFileSync('src/pages/TeacherDashboard.jsx', text, 'utf8');
console.log('Successfully cleaned all garbled emojis and characters!');
