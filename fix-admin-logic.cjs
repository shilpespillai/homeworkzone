const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

// 1. Insert isPromptAdmin definition near isAdminUser
if (!file.includes("const isPromptAdmin")) {
  file = file.replace(
    /const isAdminUser = teacherData\?\.isAdmin === true \|\| teacherData\?\.role === 'admin';/,
    `const isAdminUser = teacherData?.isAdmin === true || teacherData?.role === 'admin';\n  const isPromptAdmin = isAdminUser || (user?.email?.toLowerCase().trim() === 'shilpeshpillai81@gmail.com');`
  );
}

// 2. Replace isAdminUser with isPromptAdmin for the prompt logic
file = file.replace(/isAdminUser && promptViewMode/g, "isPromptAdmin && promptViewMode");

// 3. Replace the toggle wrapper
file = file.replace(
  /\{isAdminUser && \(\s*<div className="flex bg-emerald-50\/50 p-1 rounded-xl w-fit mt-2 border border-emerald-100">/,
  `{isPromptAdmin && (
                            <div className="flex bg-emerald-50/50 p-1 rounded-xl w-fit mt-2 border border-emerald-100">`
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Fixed Admin verification logic.");
