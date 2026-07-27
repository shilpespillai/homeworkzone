import fs from 'fs';

let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');

// 1. Calculate classSubjectsData and subjectsArray right after subtopicsArray calculation (around line 4689)
const targetInsert = `            // Filtering, Sorting, and Pagination for Concept Mastery (Report A)`;

const replacementInsert = `            // Class-wide accuracy by subject
            const classSubjectsData = {};
            currentSubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw || !hw.questions) return;
               
               let rawSubject = hw.subject || 'general';
               let subjectName = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1);
               if (rawSubject.toLowerCase() === 'maths') subjectName = 'Mathematics';
               if (rawSubject.toLowerCase() === 'logical reasoning') subjectName = 'Logical Reasoning';
               
               if (!classSubjectsData[subjectName]) {
                  classSubjectsData[subjectName] = {
                     name: subjectName,
                     correctCount: 0,
                     totalCount: 0
                  };
               }
               
               hw.questions.forEach(q => {
                  const studentSelection = sub.answers?.[q.id];
                  const actualAnswer = q.answer;
                  const isCorrect = checkIsAnswerCorrect(studentSelection, actualAnswer);
                  
                  classSubjectsData[subjectName].totalCount += 1;
                  if (isCorrect) {
                     classSubjectsData[subjectName].correctCount += 1;
                  }
               });
            });

            // Selected student accuracy by subject
            const studentSubjectsData = {};
            const subjectSubmissions = selectedReportStudent 
               ? currentSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(selectedReportStudent))
               : currentSubmissions;

            subjectSubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw || !hw.questions) return;
               
               let rawSubject = hw.subject || 'general';
               let subjectName = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1);
               if (rawSubject.toLowerCase() === 'maths') subjectName = 'Mathematics';
               if (rawSubject.toLowerCase() === 'logical reasoning') subjectName = 'Logical Reasoning';
               
               if (!studentSubjectsData[subjectName]) {
                  studentSubjectsData[subjectName] = {
                     name: subjectName,
                     correctCount: 0,
                     totalCount: 0
                  };
               }
               
               hw.questions.forEach(q => {
                  const studentSelection = sub.answers?.[q.id];
                  const actualAnswer = q.answer;
                  const isCorrect = checkIsAnswerCorrect(studentSelection, actualAnswer);
                  
                  studentSubjectsData[subjectName].totalCount += 1;
                  if (isCorrect) {
                     studentSubjectsData[subjectName].correctCount += 1;
                  }
               });
            });

            const subjectsArray = Object.keys(classSubjectsData).map(name => {
               const classData = classSubjectsData[name];
               const classAverage = classData.totalCount > 0 ? Math.round((classData.correctCount / classData.totalCount) * 100) : 0;
               
               const studentData = studentSubjectsData[name];
               const accuracy = studentData && studentData.totalCount > 0 
                  ? Math.round((studentData.correctCount / studentData.totalCount) * 100) 
                  : (selectedReportStudent ? 0 : classAverage);
               
               let tier = 'Needs Focus';
               if (accuracy >= 80) tier = 'Mastered';
               else if (accuracy >= 60) tier = 'Reviewing';

               return {
                  name,
                  accuracy,
                  classAverage,
                  tier
               };
            }).sort((a, b) => b.accuracy - a.accuracy);

            // Filtering, Sorting, and Pagination for Concept Mastery (Report A)`;

content = content.replace(targetInsert, replacementInsert);

// 2. Replace the Accuracy by Concept BarChart rendering block to use subjectsArray instead of subtopicsArray
content = content.replace(
  /\{?\/\* Bar Chart — Accuracy by Category \*\/\}?\r?\n\s*<div className="bg-white rounded-\[40px\] p-8 border border-orange-100 shadow-sm flex flex-col justify-between">[\s\S]*?<\/BarChart>[\s\S]*?<\/ResponsiveContainer>\r?\n\s*<\/div>/,
  `{/* Bar Chart — Accuracy by Subject */}
                                  <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex flex-col justify-between">
                                     <h3 className="text-sm font-black text-[#14532d] uppercase tracking-widest mb-4">Accuracy by Subject</h3>
                                     <ResponsiveContainer width="100%" height={260}>
                                        <BarChart 
                                           data={subjectsArray} 
                                           layout="vertical" 
                                           margin={{ left: 10, right: 30, top: 5, bottom: 5 }}
                                           barGap={2}
                                        >
                                           <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                           <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                           <YAxis 
                                              type="category" 
                                              dataKey="name" 
                                              width={140} 
                                              tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                                              tickLine={false} 
                                              axisLine={false} 
                                           />
                                           <RechartsTooltip
                                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px', fontWeight: 700 }}
                                           />
                                           <Legend 
                                              verticalAlign="top" 
                                              height={36} 
                                              iconType="circle"
                                              iconSize={8}
                                              wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingBottom: '10px' }}
                                           />
                                           <Bar name={selectedReportStudent ? "Student Accuracy" : "Class Average"} dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={selectedReportStudent ? 8 : 14}>
                                              {subjectsArray.map((entry, index) => (
                                                 <Cell
                                                    key={\`bar-\${index}\`}
                                                    fill={entry.accuracy >= 80 ? '#10b981' : entry.accuracy >= 60 ? '#3b82f6' : '#f43f5e'}
                                                 />
                                              ))}
                                           </Bar>
                                           {selectedReportStudent && (
                                              <Bar name="Class Average" dataKey="classAverage" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={8} />
                                           )}
                                        </BarChart>
                                     </ResponsiveContainer>
                                  </div>`
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf8');
console.log('Successfully updated concept accuracy bar chart to subject-wise accuracy bar chart!');
