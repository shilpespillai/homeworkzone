const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const stateTarget = "const [masterPromptsMap, setMasterPromptsMap] = useState(DEFAULT_SUBJECT_PROMPTS);";
if (!file.includes("promptViewMode")) {
  file = file.replace(stateTarget, stateTarget + "\n  const [promptViewMode, setPromptViewMode] = useState('personal');");
}

const myPromptsCaseTarget = `           case 'My Prompts': {
              const activeSubjectKeys = Object.keys(subjectPrompts).filter(k => subjectPrompts[k] !== null);`;

const myPromptsCaseNew = `           case 'My Prompts': {
              const currentPrompts = (isAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
              const activeSubjectKeys = Object.keys(currentPrompts || {}).filter(k => currentPrompts[k] !== null);`;

if (file.includes(myPromptsCaseTarget)) {
  file = file.replace(myPromptsCaseTarget, myPromptsCaseNew);
}

const mapRenderTarget = `activeSubjectKeys.map(subKey => {
                                const hasPrompt = !!subjectPrompts[subKey];`;

const mapRenderNew = `activeSubjectKeys.map(subKey => {
                                const currentMap = (isAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
                                const hasPrompt = !!currentMap[subKey];`;

if (file.includes(mapRenderTarget)) {
  file = file.replace(mapRenderTarget, mapRenderNew);
}

const handleEditTarget = `const handleEditSubject = (subKey) => {
                                      setActivePromptModalSubject(subKey);
                                      setEditingPromptContent(subjectPrompts[subKey] || getPremiumPromptTemplate(subKey));
                                   };`;

const handleEditNew = `const handleEditSubject = (subKey) => {
                                      setActivePromptModalSubject(subKey);
                                      const currentMap = (isAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
                                      setEditingPromptContent(currentMap[subKey] || getPremiumPromptTemplate(subKey));
                                   };`;

if (file.includes(handleEditTarget)) {
  file = file.replace(handleEditTarget, handleEditNew);
}

const headerTarget = `<h1 className="text-2xl sm:text-3xl font-black text-[#14532d] tracking-tight">
                             My Subject Prompts
                          </h1>`;
  
const headerNew = `<h1 className="text-2xl sm:text-3xl font-black text-[#14532d] tracking-tight">
                             {isAdmin && promptViewMode === 'global' ? 'Global Master Prompts' : 'My Personal Prompts'}
                          </h1>
                          {isAdmin && (
                            <div className="flex bg-emerald-50/50 p-1 rounded-xl w-fit mt-2 border border-emerald-100">
                              <button 
                                onClick={() => setPromptViewMode('personal')} 
                                className={\`px-4 py-1.5 rounded-lg text-xs font-black transition-all \${promptViewMode === 'personal' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200' : 'text-emerald-600 hover:bg-emerald-50'}\`}
                              >
                                Personal
                              </button>
                              <button 
                                onClick={() => setPromptViewMode('global')} 
                                className={\`px-4 py-1.5 rounded-lg text-xs font-black transition-all \${promptViewMode === 'global' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200' : 'text-emerald-600 hover:bg-emerald-50'}\`}
                              >
                                Global Master
                              </button>
                            </div>
                          )}`;

if (file.includes(headerTarget)) {
  file = file.replace(headerTarget, headerNew);
}

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Fixed State and UI.");
