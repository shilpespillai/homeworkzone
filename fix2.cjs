const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

file = file.replace(
  "{ id: 'option-b-starter', name: 'Starter (11-20 students)', price: 50, seats: 20 },",
  "{ id: 'option-b-starter', name: 'Starter (11-20 students)', price: globalPricing.optionB_starter_price, seats: 20 },"
);
file = file.replace(
  "{ id: 'option-b-growth', name: 'Growth (21-30 students)', price: 80, seats: 30 },",
  "{ id: 'option-b-growth', name: 'Growth (21-30 students)', price: globalPricing.optionB_growth_price, seats: 30 },"
);
file = file.replace(
  "{ id: 'option-b-school', name: 'School (31-150 students)', price: 99, seats: 150 },",
  "{ id: 'option-b-school', name: 'School (31-150 students)', price: globalPricing.optionB_school_price, seats: 150 },"
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
