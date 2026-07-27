import fs from 'fs';

let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');

// 1. Replace trajectory chartData calculation (around line 4919-4947)
const targetCalc = `            // Calculations for Report C
            const selectedStudentSubs = currentSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(selectedReportStudent));
            selectedStudentSubs.sort((a, b) => {
               const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(a.submittedAt || 0);
               const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(b.submittedAt || 0);
               return dateA - dateB;
            });

            const chartData = selectedStudentSubs.map((sub, idx) => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               const hwTitle = hw ? hw.title : 'Mission';
               
               const hwSubs = currentSubmissions.filter(s => s.homeworkId === sub.homeworkId);
               const classAvg = hwSubs.length > 0 ? Math.round(hwSubs.reduce((acc, s) => acc + (s.score || 0), 0) / hwSubs.length) : 0;
               
               const dateStr = sub.submittedAt ? new Date(sub.submittedAt.toDate ? sub.submittedAt.toDate() : sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : \`Quiz \${idx + 1}\`;
               
               return {
                  name: dateStr,
                  title: hwTitle,
                  studentScore: sub.score,
                  classAverage: classAvg
               };
            });

            const startingScore = chartData.length > 0 ? chartData[0].studentScore : 0;
            const currentScore = chartData.length > 0 ? chartData[chartData.length - 1].studentScore : 0;
            const growth = chartData.length > 1 ? currentScore - startingScore : 0;`;

const replacementCalc = `            // Calculations for Report C: Growth Trajectory over time
            const classroomHws = [...currentHomeworks].sort((a, b) => {
               const dateA = new Date(a.dueDate || a.createdAt || 0);
               const dateB = new Date(b.dueDate || b.createdAt || 0);
               return dateA - dateB;
            });

            const trajectoryChartData = classroomHws.map((hw, idx) => {
               const hwSubs = currentSubmissions.filter(s => s.homeworkId === hw.id);
               const classAvg = hwSubs.length > 0 ? Math.round(hwSubs.reduce((acc, s) => acc + (s.score || 0), 0) / hwSubs.length) : 0;
               
               let studentScore = null;
               if (selectedReportStudent) {
                  const studentSub = hwSubs.find(s => normalizeName(s.studentName) === normalizeName(selectedReportStudent));
                  if (studentSub) {
                     studentScore = studentSub.score;
                  }
               }
               
               const dateStr = hw.dueDate ? new Date(hw.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : \`Quiz \${idx + 1}\`;
               
               return {
                  name: dateStr,
                  title: hw.title,
                  studentScore,
                  classAverage: classAvg
               };
            }).filter(item => {
               if (!selectedReportStudent) {
                  return item.classAverage > 0;
               }
               return true;
            });

            const startingScore = trajectoryChartData.length > 0 
               ? (selectedReportStudent 
                  ? (trajectoryChartData.find(d => d.studentScore !== null)?.studentScore || 0)
                  : trajectoryChartData[0].classAverage) 
               : 0;

            const currentScore = trajectoryChartData.length > 0 
               ? (selectedReportStudent 
                  ? [...trajectoryChartData].reverse().find(d => d.studentScore !== null)?.studentScore || 0
                  : trajectoryChartData[trajectoryChartData.length - 1].classAverage) 
               : 0;

            const growth = trajectoryChartData.length > 1 ? currentScore - startingScore : 0;`;

content = content.replace(targetCalc, replacementCalc);

// 2. Replace the dropdown placeholder and the conditional blocks on Growth Trajectory Tab (around lines 5340-5462)
const targetTabContents = `                              <select 
                                  value={selectedReportStudent} 
                                  onChange={(e) => setSelectedReportStudent(e.target.value)} 
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/25 shadow-sm"
                               >
                                  <option value="">-- Choose Student --</option>
                                  {currentStudents.map((st, i) => (
                                     <option key={i} value={st.name}>{st.name}</option>
                                  ))}
                               </select>
                            </div>
                         </div>

                         {selectedReportStudent ? (() => {
                            if (selectedStudentSubs.length === 0) {
                               return (
                                  <div className="bg-white rounded-[40px] py-20 text-center text-[#166534] font-bold italic border border-orange-100 shadow-sm">
                                     {selectedReportStudent} has not submitted any quizzes yet.
                                  </div>
                               );
                            }

                            return (
                               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                  {/* Statistics Block */}
                                  <div className="lg:col-span-4 flex flex-col gap-6">
                                     <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                        <div>
                                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Starting Accuracy</span>
                                           <span className="text-3xl font-black text-[#14532d]">{startingScore}%</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex-center text-blue-600 font-black">
                                           1st
                                        </div>
                                     </div>

                                     <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                        <div>
                                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Current Accuracy</span>
                                           <span className="text-3xl font-black text-[#14532d]">{currentScore}%</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex-center text-[#EA580C] font-black">
                                           Last
                                        </div>
                                     </div>

                                     <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                        <div>
                                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Growth Index</span>
                                           <div className="flex items-center gap-2">
                                              <span className={\`text-3xl font-black \${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}\`}>
                                                 {growth >= 0 ? \`+\${growth}%\` : \`\${growth}%\`}
                                              </span>
                                              {growth >= 0 ? (
                                                 <ArrowUpRight className="w-6 h-6 text-emerald-500" />
                                              ) : (
                                                 <ArrowDownRight className="w-6 h-6 text-rose-500" />
                                              )}
                                           </div>
                                        </div>
                                        <div className={\`w-12 h-12 rounded-2xl flex-center font-black \${growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}\`}>
                                           {growth >= 0 ? '↑' : '↓'}
                                        </div>
                                     </div>
                                  </div>

                                  {/* Line Chart Component */}
                                  <div className="lg:col-span-8 bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 space-y-6 flex flex-col justify-between">
                                     <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-black text-slate-800">Performance Over Time</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider">
                                           <div className="flex items-center gap-1.5 text-[#EA580C]">
                                              <span className="w-3 h-3 rounded-full bg-[#EA580C] inline-block" />
                                              <span>{selectedReportStudent}</span>
                                           </div>
                                           <div className="flex items-center gap-1.5 text-[#FFAB91]">
                                              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#FFAB91] inline-block" />
                                              <span>Class Average</span>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                           <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                              <XAxis dataKey="name" stroke="#cbd5e1" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                                              <YAxis domain={[0, 100]} stroke="#cbd5e1" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                                              <RechartsTooltip 
                                                 content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                       const data = payload[0].payload;
                                                       return (
                                                          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl text-xs space-y-1 font-bold">
                                                             <p className="text-[#EA580C] font-black">{data.title}</p>
                                                             <p className="text-slate-300">Date: {data.name}</p>
                                                             <p>Student Score: <span className="text-[#EA580C] font-black">{data.studentScore}%</span></p>
                                                             <p>Class Avg: <span className="text-[#FFAB91] font-black">{data.classAverage}%</span></p>
                                                          </div>
                                                       );
                                                    }
                                                    return null;
                                                 }}
                                              />
                                              <Line type="monotone" dataKey="studentScore" stroke="#EA580C" strokeWidth={4} activeDot={{ r: 8 }} />
                                              <Line type="monotone" dataKey="classAverage" stroke="#FFAB91" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                                           </LineChart>
                                        </ResponsiveContainer>
                                     </div>
                                  </div>
                               </div>
                            );
                         })() : (
                            <div className="bg-white rounded-[40px] py-20 text-center text-[#166534] font-bold italic border border-orange-100 shadow-sm">
                               Please select a student from the dropdown menu to inspect chronological progress maps.
                            </div>
                         )}`;

const replacementTabContents = `                              <select 
                                  value={selectedReportStudent} 
                                  onChange={(e) => setSelectedReportStudent(e.target.value)} 
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/25 shadow-sm"
                               >
                                  <option value="">All Students (Class Average Trend)</option>
                                  {currentStudents.map((st, i) => (
                                     <option key={i} value={st.name}>{st.name}</option>
                                  ))}
                               </select>
                            </div>
                         </div>

                         {(() => {
                            if (trajectoryChartData.length === 0) {
                               return (
                                  <div className="bg-white rounded-[40px] py-20 text-center text-[#166534] font-bold italic border border-orange-100 shadow-sm">
                                     No completed quiz data is available for this classroom yet.
                                  </div>
                               );
                            }

                            return (
                               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                  {/* Statistics Block */}
                                  <div className="lg:col-span-4 flex flex-col gap-6">
                                     <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                        <div>
                                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                              {selectedReportStudent ? 'Starting Accuracy' : 'Class Start Avg'}
                                           </span>
                                           <span className="text-3xl font-black text-[#14532d]">{startingScore}%</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex-center text-blue-600 font-black">
                                           1st
                                        </div>
                                     </div>

                                     <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                        <div>
                                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                              {selectedReportStudent ? 'Current Accuracy' : 'Class Current Avg'}
                                           </span>
                                           <span className="text-3xl font-black text-[#14532d]">{currentScore}%</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex-center text-[#EA580C] font-black">
                                           Last
                                        </div>
                                     </div>

                                     <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                        <div>
                                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                              {selectedReportStudent ? 'Growth Index' : 'Class Growth Index'}
                                           </span>
                                           <div className="flex items-center gap-2">
                                              <span className={\`text-3xl font-black \${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}\`}>
                                                 {growth >= 0 ? \`+\${growth}%\` : \`\${growth}%\`}
                                              </span>
                                              {growth >= 0 ? (
                                                 <ArrowUpRight className="w-6 h-6 text-emerald-500" />
                                              ) : (
                                                 <ArrowDownRight className="w-6 h-6 text-rose-500" />
                                              )}
                                           </div>
                                        </div>
                                        <div className={\`w-12 h-12 rounded-2xl flex-center font-black \${growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}\`}>
                                           {growth >= 0 ? '↑' : '↓'}
                                        </div>
                                     </div>
                                  </div>

                                  {/* Line Chart Component */}
                                  <div className="lg:col-span-8 bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 space-y-6 flex flex-col justify-between">
                                     <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-black text-slate-800">Performance Over Time</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider">
                                           {selectedReportStudent && (
                                              <div className="flex items-center gap-1.5 text-[#EA580C]">
                                                 <span className="w-3 h-3 rounded-full bg-[#EA580C] inline-block" />
                                                 <span>{selectedReportStudent}</span>
                                              </div>
                                           )}
                                           <div className="flex items-center gap-1.5 text-[#FFAB91]">
                                              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#FFAB91] inline-block" />
                                              <span>Class Average</span>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                           <LineChart data={trajectoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                              <XAxis dataKey="name" stroke="#cbd5e1" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                                              <YAxis domain={[0, 100]} stroke="#cbd5e1" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                                              <RechartsTooltip 
                                                 content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                       const data = payload[0].payload;
                                                       return (
                                                          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl text-xs space-y-1 font-bold">
                                                             <p className="text-orange-400 font-black">{data.title}</p>
                                                             <p className="text-slate-300">Date: {data.name}</p>
                                                             {selectedReportStudent && data.studentScore !== null && (
                                                                <p>Student Score: <span className="text-[#EA580C] font-black">{data.studentScore}%</span></p>
                                                             )}
                                                             <p>Class Avg: <span className="text-[#FFAB91] font-black">{data.classAverage}%</span></p>
                                                          </div>
                                                       );
                                                    }
                                                    return null;
                                                 }}
                                              />
                                              {selectedReportStudent && (
                                                 <Line type="monotone" dataKey="studentScore" stroke="#EA580C" strokeWidth={4} activeDot={{ r: 8 }} connectNulls />
                                              )}
                                              <Line type="monotone" dataKey="classAverage" stroke="#FFAB91" strokeWidth={3} strokeDasharray="5 5" dot={true} />
                                           </LineChart>
                                        </ResponsiveContainer>
                                     </div>
                                  </div>
                               </div>
                            );
                         })()}`;

content = content.replace(targetTabContents, replacementTabContents);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf8');
console.log('Successfully updated trajectory calculations and tab rendering!');
