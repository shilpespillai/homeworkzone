const fs = require("fs");
let content = fs.readFileSync("src/pages/TeacherDashboard.jsx", "utf-8");
content = content.replace(
    "const optionCAnnual = calculateOptionCAnnual(Math.max(31, calcSeats));",
    "const optionCAnnual = calcSeats < 31 ? Infinity : calculateOptionCAnnual(calcSeats);"
);

const searchFor = "<span>$" + "{optionCAnnual.toLocaleString()} / year</span>";
const replaceWith = "<span>{optionCAnnual === Infinity ? \"Not Available\" : $$" + "{optionCAnnual.toLocaleString()} / year}</span>";

content = content.replace(searchFor, replaceWith);
fs.writeFileSync("src/pages/TeacherDashboard.jsx", content, "utf-8");
console.log("Done");
