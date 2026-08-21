const fs = require('fs');
let file = fs.readFileSync('src/components/PaperQuotaBoosterModal.jsx', 'utf-8');

file = file.replace(
    /successUrl: \\\\$\\{window\.location\.origin\\}\/dashboard\?booster_success=true\,/g,
    "successUrl: ${window.location.origin}/dashboard/teacher?booster_success=true,"
);
file = file.replace(
    /cancelUrl: \\\\$\\{window\.location\.origin\\}\/dashboard\,/g,
    "cancelUrl: ${window.location.origin}/dashboard/teacher,"
);

fs.writeFileSync('src/components/PaperQuotaBoosterModal.jsx', file, 'utf-8');
console.log('Fixed URLs in Booster Modal');
