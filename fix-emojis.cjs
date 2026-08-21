const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

file = file.replace(/<li className="flex items-center gap-2">[^<]+Pay only for active students<\/li>/g, '<li className="flex items-center gap-2">✨ Pay only for active students</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+Scales automatically as you add\/remove<\/li>/g, '<li className="flex items-center gap-2">📈 Scales automatically as you add/remove</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+No long term annual commitment<\/li>/g, '<li className="flex items-center gap-2">🔓 No long term annual commitment</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+Perfect for tutor\/mid-semester setups<\/li>/g, '<li className="flex items-center gap-2">🎯 Perfect for tutor/mid-semester setups</li>');

// Option B fixes
file = file.replace(/<li className="flex items-center gap-2">[^<]+Predictable fixed monthly cost<\/li>/g, '<li className="flex items-center gap-2">🔮 Predictable fixed monthly cost</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+Best for established classrooms<\/li>/g, '<li className="flex items-center gap-2">🏫 Best for established classrooms</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+Lower per-student average cost<\/li>/g, '<li className="flex items-center gap-2">💰 Lower per-student average cost</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+Tiered pricing blocks \(20, 30, 150\)<\/li>/g, '<li className="flex items-center gap-2">📦 Tiered pricing blocks (20, 30, 150)</li>');

// Option C fixes
file = file.replace(/<li className="flex items-center gap-2">[^<]+Billed annually for max savings<\/li>/g, '<li className="flex items-center gap-2">📅 Billed annually for max savings</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+Volume discounts based on tier<\/li>/g, '<li className="flex items-center gap-2">📉 Volume discounts based on tier</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+Best for school-wide deployment<\/li>/g, '<li className="flex items-center gap-2">🏛️ Best for school-wide deployment</li>');
file = file.replace(/<li className="flex items-center gap-2">[^<]+Premium dedicated support<\/li>/g, '<li className="flex items-center gap-2">⭐ Premium dedicated support</li>');

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file, 'utf-8');
console.log('Fixed emojis successfully');
