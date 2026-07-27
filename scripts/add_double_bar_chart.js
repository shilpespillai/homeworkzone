import fs from 'fs';

let text = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');

// 1. Add Legend to recharts import list (on line 64/65)
text = text.replace(
  /ResponsiveContainer\s*\n\s*\}\s*from\s*'recharts';/,
  `ResponsiveContainer,\n  Legend\n} from 'recharts';`
);

// 2. Add classSubtopicsData calculation above subtopicsData calculation
const targetSubtopicsCalc = `            // Calculation of umbrella concept mastery for Report A
            const subtopicsData = {};`;

const replacementSubtopicsCalc = `            // Class-wide concept accuracy for benchmark
            const classSubtopicsData = {};
            currentSubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw || !hw.questions) return;
               hw.questions.forEach(q => {
                  const rawSubtopic = getQuestionSubtopic(hw, q);
                  const subtopic = mapToUmbrellaCategory(rawSubtopic, hw.subject);
                  if (!classSubtopicsData[subtopic]) {
                     classSubtopicsData[subtopic] = {
                        name: subtopic,
                        correctCount: 0,
                        totalCount: 0
                     };
                  }
                  const studentSelection = sub.answers?.[q.id];
                  const actualAnswer = q.answer;
                  const isCorrect = checkIsAnswerCorrect(studentSelection, actualAnswer);
                  
                  classSubtopicsData[subtopic].totalCount += 1;
                  if (isCorrect) {
                     classSubtopicsData[subtopic].correctCount += 1;
                  }
               });
            });

            // Calculation of umbrella concept mastery for Report A
            const subtopicsData = {};`;

text = text.replace(targetSubtopicsCalc, replacementSubtopicsCalc);

// 3. Attach classAverage to subtopicsArray entries
const targetSubtopicsArray = `            const subtopicsArray = Object.keys(subtopicsData).map(name => {
               const data = subtopicsData[name];
               const accuracy = data.totalCount > 0 ? Math.round((data.correctCount / data.totalCount) * 100) : 0;
               let tier = 'Needs Focus';
               if (accuracy >= 80) tier = 'Mastered';
               else if (accuracy >= 60) tier = 'Reviewing';
               
               return {
                  name,
                  accuracy,
                  correctCount: data.correctCount,
                  totalCount: data.totalCount,
                  tier
               };
            });`;

const replacementSubtopicsArray = `            const subtopicsArray = Object.keys(subtopicsData).map(name => {
               const data = subtopicsData[name];
               const accuracy = data.totalCount > 0 ? Math.round((data.correctCount / data.totalCount) * 100) : 0;
               let tier = 'Needs Focus';
               if (accuracy >= 80) tier = 'Mastered';
               else if (accuracy >= 60) tier = 'Reviewing';
               
               const classData = classSubtopicsData[name];
               const classAverage = classData && classData.totalCount > 0 
                  ? Math.round((classData.correctCount / classData.totalCount) * 100) 
                  : 0;
               
               return {
                  name,
                  accuracy,
                  classAverage,
                  correctCount: data.correctCount,
                  totalCount: data.totalCount,
                  tier
               };
            });`;

text = text.replace(targetSubtopicsArray, replacementSubtopicsArray);

// 4. Update the Recharts BarChart component to render the double bar conditional layout
const targetBarChart = `                                  {/* Bar Chart — Accuracy by Category */}
                                  <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex flex-col justify-between">
                                     <h3 className="text-sm font-black text-[#14532d] uppercase tracking-widest mb-4">Accuracy by Concept</h3>
                                     <ResponsiveContainer width="100%" height={260}>
                                        <BarChart 
                                           data={[...subtopicsArray].sort((a, b) => b.accuracy - a.accuracy).slice(0, 8)} 
                                           layout="vertical" 
                                           margin={{ left: 10, right: 30, top: 5, bottom: 5 }}
                                        >
                                           <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                           <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                           <YAxis 
                                              type="category" 
                                              dataKey="name" 
                                              width={160} 
                                              tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                                              tickFormatter={(val) => val.length > 22 ? \`\${val.substring(0, 20)}...\` : val}
                                              tickLine={false} 
                                              axisLine={false} 
                                           />
                                           <RechartsTooltip
                                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px', fontWeight: 700 }}
                                              formatter={(value) => [\`\${value}%\`, 'Accuracy']}
                                           />
                                           <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={16}>
                                              {[...subtopicsArray].sort((a, b) => b.accuracy - a.accuracy).slice(0, 8).map((entry, index) => (
                                                 <Cell
                                                    key={\`bar-\${index}\`}
                                                    fill={entry.accuracy >= 80 ? '#34d399' : entry.accuracy >= 60 ? '#60a5fa' : '#fb7185'}
                                                 />
                                              ))}
                                           </Bar>
                                        </BarChart>
                                     </ResponsiveContainer>
                                  </div>`;

const replacementBarChart = `                                  {/* Bar Chart — Accuracy by Category */}
                                  <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex flex-col justify-between">
                                     <h3 className="text-sm font-black text-[#14532d] uppercase tracking-widest mb-4">Accuracy by Concept</h3>
                                     <ResponsiveContainer width="100%" height={260}>
                                        <BarChart 
                                           data={[...subtopicsArray].sort((a, b) => b.accuracy - a.accuracy).slice(0, 8)} 
                                           layout="vertical" 
                                           margin={{ left: 10, right: 30, top: 5, bottom: 5 }}
                                           barGap={2}
                                        >
                                           <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                           <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                           <YAxis 
                                              type="category" 
                                              dataKey="name" 
                                              width={160} 
                                              tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                                              tickFormatter={(val) => val.length > 22 ? \`\${val.substring(0, 20)}...\` : val}
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
                                              {[...subtopicsArray].sort((a, b) => b.accuracy - a.accuracy).slice(0, 8).map((entry, index) => (
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
                                  </div>`;

text = text.replace(targetBarChart, replacementBarChart);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', text, 'utf8');
console.log('Successfully added double bar comparison chart!');
