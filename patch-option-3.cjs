const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

// 1. Add state variable
if (!file.includes("const [promptViewMode, setPromptViewMode] = useState('personal');")) {
  file = file.replace(
    "const [masterPromptsMap, setMasterPromptsMap] = useState(DEFAULT_SUBJECT_PROMPTS);",
    "const [masterPromptsMap, setMasterPromptsMap] = useState(DEFAULT_SUBJECT_PROMPTS);\n  const [promptViewMode, setPromptViewMode] = useState('personal');"
  );
}

// 2. Rewrite handleSaveModalPrompt
const oldHandleSaveModalPrompt = /const handleSaveModalPrompt = async \(\) => \{[\s\S]*?setActivePromptModalSubject\(null\);\n    setIsSavingPrompts\(false\);\n  \};/;
const newHandleSaveModalPrompt = `const handleSaveModalPrompt = async () => {
    if (!activePromptModalSubject) return;
    setIsSavingPrompts(true);
    
    if (isAdmin && promptViewMode === 'global') {
      const updatedPrompts = {
        ...masterPromptsMap,
        [activePromptModalSubject]: editingPromptContent
      };
      setMasterPromptsMap(updatedPrompts);
      if (user?.uid) {
        try {
          await saveMasterDefaultPromptsIfAdmin(db, user, updatedPrompts);
        } catch (err) {
          console.error("Save Master Prompt Error:", err);
        }
      }
    } else {
      const updatedPrompts = {
        ...subjectPrompts,
        [activePromptModalSubject]: editingPromptContent
      };
      setSubjectPrompts(updatedPrompts);
      if (user?.uid) {
        try {
          await updateDoc(doc(db, 'teachers', user.uid), {
            subjectPrompts: updatedPrompts
          });
        } catch (err) {
          console.error("Save Prompt Error:", err);
        }
      }
    }
    setActivePromptModalSubject(null);
    setIsSavingPrompts(false);
  };`;

file = file.replace(oldHandleSaveModalPrompt, newHandleSaveModalPrompt);

// 3. Rewrite handleSavePrompts
const oldHandleSavePrompts = /const handleSavePrompts = async \(\) => \{[\s\S]*?setIsSavingPrompts\(false\);\n    \}\n  \};/;
const newHandleSavePrompts = `const handleSavePrompts = async () => {
    if (!user?.uid) return;
    setIsSavingPrompts(true);
    try {
      if (isAdmin && promptViewMode === 'global') {
        await saveMasterDefaultPromptsIfAdmin(db, user, masterPromptsMap);
        alert("Global Master Prompts saved successfully! 🌍🚀");
      } else {
        await updateDoc(doc(db, 'teachers', user.uid), {
          subjectPrompts: subjectPrompts
        });
        alert("Personal Subject Prompts saved successfully! 🚀🪄");
      }
    } catch (err) {
      console.error("Save Prompts Error:", err);
      alert("Failed to save prompts. ❌");
    } finally {
      setIsSavingPrompts(false);
    }
  };`;

file = file.replace(oldHandleSavePrompts, newHandleSavePrompts);

// 4. Rewrite handleAddSubject
const oldHandleAddSubject = /const handleAddSubject = \(\) => \{[\s\S]*?setNewSubjectName\(''\);\n  \};/;
const newHandleAddSubject = `const handleAddSubject = () => {
    const cleanName = newSubjectName.trim();
    if (!cleanName) return;

    if (isAdmin && promptViewMode === 'global') {
      if (masterPromptsMap[cleanName] !== undefined && masterPromptsMap[cleanName] !== null) {
        alert("Subject already exists in Global Prompts!");
        return;
      }
      setMasterPromptsMap(prev => ({
        ...prev,
        [cleanName]: getPremiumPromptTemplate(cleanName)
      }));
    } else {
      if (subjectPrompts[cleanName] !== undefined && subjectPrompts[cleanName] !== null) {
        alert("Subject already exists in Personal Prompts!");
        return;
      }
      setSubjectPrompts(prev => ({
        ...prev,
        [cleanName]: getPremiumPromptTemplate(cleanName)
      }));
    }
    setNewSubjectName('');
  };`;

file = file.replace(oldHandleAddSubject, newHandleAddSubject);

// 5. Delete Subject Logic
const oldHandleDeleteSubject = /const handleDeleteSubject = async \(subKey\) => \{[\s\S]*?\}\n  \};/;
const newHandleDeleteSubject = `const handleDeleteSubject = async (subKey) => {
    if (!window.confirm(\`Are you sure you want to delete the prompt for "\${subKey}"?\`)) return;

    if (isAdmin && promptViewMode === 'global') {
      const updated = { ...masterPromptsMap };
      updated[subKey] = null; 
      setMasterPromptsMap(updated);
      if (user?.uid) {
        try {
          await saveMasterDefaultPromptsIfAdmin(db, user, updated);
        } catch (err) {
          console.error("Delete Global Subject Error:", err);
        }
      }
    } else {
      const updated = { ...subjectPrompts };
      updated[subKey] = null; 
      setSubjectPrompts(updated);
      if (user?.uid) {
        try {
          await updateDoc(doc(db, 'teachers', user.uid), {
            subjectPrompts: updated
          });
        } catch (err) {
          console.error("Delete Subject Error:", err);
        }
      }
    }
  };`;

file = file.replace(oldHandleDeleteSubject, newHandleDeleteSubject);

// 6. UI Updates in 'My Prompts' block
const myPromptsTarget = `case 'My Prompts': {
              const activeSubjectKeys = Object.keys(subjectPrompts).filter(k => subjectPrompts[k] !== null);`;

const myPromptsReplacement = `case 'My Prompts': {
              const currentPrompts = (isAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
              const activeSubjectKeys = Object.keys(currentPrompts || {}).filter(k => currentPrompts[k] !== null);`;

file = file.replace(myPromptsTarget, myPromptsReplacement);

// 7. Render toggle inside UI
const uiHeaderTarget = `<h1 className="text-2xl sm:text-3xl font-black text-[#14532d] tracking-tight">
                             My Subject Prompts
                          </h1>`;

const uiHeaderReplacement = `<h1 className="text-2xl sm:text-3xl font-black text-[#14532d] tracking-tight">
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

file = file.replace(uiHeaderTarget, uiHeaderReplacement);

// 8. Fix "activeSubjectKeys.map" render
const mapTarget = `activeSubjectKeys.map(subKey => {
                                const hasPrompt = !!subjectPrompts[subKey];`;

const mapReplacement = `activeSubjectKeys.map(subKey => {
                                const currentMap = (isAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
                                const hasPrompt = !!currentMap[subKey];`;

file = file.replace(mapTarget, mapReplacement);

// 9. Fix modal prompt loading
const handleEditSubjectTarget = `const handleEditSubject = (subKey) => {
    setActivePromptModalSubject(subKey);
    setEditingPromptContent(subjectPrompts[subKey] || getPremiumPromptTemplate(subKey));
  };`;

const handleEditSubjectReplacement = `const handleEditSubject = (subKey) => {
    setActivePromptModalSubject(subKey);
    const currentMap = (isAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
    setEditingPromptContent(currentMap[subKey] || getPremiumPromptTemplate(subKey));
  };`;

file = file.replace(handleEditSubjectTarget, handleEditSubjectReplacement);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Successfully patched TeacherDashboard for Option 3.");
