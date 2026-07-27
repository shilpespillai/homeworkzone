import fs from 'fs';

let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');

// 1. Add RadarChart imports
content = content.replace(
  /ResponsiveContainer,\r?\n\s*Legend\r?\n\s*\}\s*from\s*'recharts';/g,
  `ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';`
);

// 2. Replace Bar Chart — Accuracy by Subject with Radar Chart
content = content.replace(
  /\{\/\* Bar Chart — Accuracy by Subject \*\/\}[\s\S]*?<BarChart[\s\S]*?<\/BarChart>[\s\S]*?<\/div>/,
  `{/* Radar Chart — Accuracy by Subject */}
                                  <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex flex-col justify-between">
                                     <h3 className="text-sm font-black text-[#14532d] uppercase tracking-widest mb-4">Subject Performance Profile</h3>
                                     <ResponsiveContainer width="100%" height={260}>
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={subjectsArray}>
                                           <PolarGrid stroke="#f1f5f9" />
                                           <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#334155' }} />
                                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} />
                                           {selectedReportStudent ? (
                                              <>
                                                 <Radar name="Student Accuracy" dataKey="accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                                                 <Radar name="Class Average" dataKey="classAverage" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.15} />
                                              </>
                                           ) : (
                                              <Radar name="Class Average" dataKey="classAverage" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                           )}
                                           <RechartsTooltip
                                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px', fontWeight: 700 }}
                                           />
                                           <Legend 
                                              verticalAlign="bottom" 
                                              height={36} 
                                              iconType="circle"
                                              iconSize={8}
                                              wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }}
                                           />
                                        </RadarChart>
                                     </ResponsiveContainer>
                                  </div>`
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf8');
console.log('Successfully converted subject performance chart to a radar chart!');
