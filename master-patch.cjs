const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
const originalLength = file.length;

// 1. Add state variable
if (!file.includes("promptViewMode")) {
  file = file.replace(
    /const \[masterPromptsMap, setMasterPromptsMap\] = useState\(DEFAULT_SUBJECT_PROMPTS\);/,
    "const [masterPromptsMap, setMasterPromptsMap] = useState(DEFAULT_SUBJECT_PROMPTS);\n  const [promptViewMode, setPromptViewMode] = useState('personal');"
  );
}

// 2. handleSaveModalPrompt
file = file.replace(
  /const handleSaveModalPrompt = async \(\) => \{[\s\S]*?setActivePromptModalSubject\(null\);\n  \};/,
  `const handleSaveModalPrompt = async () => {
    if (!activePromptModalSubject) return;
    setIsSavingPrompts(true);
    
    if (isAdminUser && promptViewMode === 'global') {
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
  };`
);

// 3. handleSavePrompts
file = file.replace(
  /const handleSavePrompts = async \(\) => \{[\s\S]*?alert\("Failed to save prompts\. [^"]+"\);\n    \}\n    setIsSavingPrompts\(false\);\n  \};/,
  `const handleSavePrompts = async () => {
    if (!user?.uid) return;
    setIsSavingPrompts(true);
    try {
      if (isAdminUser && promptViewMode === 'global') {
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
    }
    setIsSavingPrompts(false);
  };`
);

// 4. handleAddSubject
file = file.replace(
  /const handleAddSubject = async \(\) => \{[\s\S]*?alert\("AI failed to generate a specialized prompt\. We saved a default premium template instead! [^"]+"\);\n    \}\n  \};/,
  `const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      alert("Please enter a subject name! 🎨");
      return;
    }
    const cleanName = newSubjectName.trim().toLowerCase();
    const displaySubject = newSubjectName.trim();
    
    if (isAdminUser && promptViewMode === 'global') {
      if (masterPromptsMap[cleanName] !== undefined && masterPromptsMap[cleanName] !== null) {
        alert("This subject already exists in Global Prompts! 💡");
        return;
      }
      setMasterPromptsMap(prev => ({
        ...prev,
        [cleanName]: "Generating premium prompt using AI... 🪄 Please wait a moment."
      }));
    } else {
      if (subjectPrompts[cleanName] !== undefined && subjectPrompts[cleanName] !== null) {
        alert("This subject already exists in Personal Prompts! 💡");
        return;
      }
      setSubjectPrompts(prev => ({
        ...prev,
        [cleanName]: "Generating premium prompt using AI... 🪄 Please wait a moment."
      }));
    }
    setNewSubjectName('');

    try {
      const generatedText = await generateContent({
        prompt: \`Write a highly detailed, customized, and structured instruction prompt template for another AI to generate high-quality worksheets and questions specifically for the subject: "\${displaySubject}". The generated prompt must contain subject-specific details (for example, if the subject is "\${displaySubject}", the instructions must specify key concepts, terminology, question structures, and topics unique to "\${displaySubject}"). It should dynamically cater to the grade and difficulty level selected. Do not write a generic template containing '{SUBJECT}'. Write a concrete prompt tailored specifically to "\${displaySubject}". Output only the prompt text itself, with no explanations or markdown quotes.\`,
        systemInstruction: "You are an expert AI prompt engineer. Write a highly detailed, professional, structured instruction prompt for another AI to generate high-quality worksheets and questions. Output ONLY the resulting prompt.",
        temperature: 0.7,
        tier: getModelTier(user)
      });
      
      if (isAdminUser && promptViewMode === 'global') {
        setMasterPromptsMap(prev => ({ ...prev, [cleanName]: generatedText }));
      } else {
        setSubjectPrompts(prev => ({ ...prev, [cleanName]: generatedText }));
      }
    } catch (err) {
      console.error("AI Prompt Gen Error:", err);
      if (isAdminUser && promptViewMode === 'global') {
        setMasterPromptsMap(prev => ({ ...prev, [cleanName]: getPremiumPromptTemplate(displaySubject) }));
      } else {
        setSubjectPrompts(prev => ({ ...prev, [cleanName]: getPremiumPromptTemplate(displaySubject) }));
      }
      alert("AI failed to generate a specialized prompt. We saved a default premium template instead! 🔧");
    }
  };`
);

// 5. handleDeleteSubject
file = file.replace(
  /const handleDeleteSubject = async \(subKey\) => \{[\s\S]*?console\.error\("Failed to delete subject prompt from database:", err\);\n        \}\n      \}\n    \}\n  \};/,
  `const handleDeleteSubject = async (subKey) => {
    if (await window.confirmCustom(\`Are you sure you want to delete the generic prompt for "\${subKey}"?\`)) {
      if (isAdminUser && promptViewMode === 'global') {
        const updated = { ...masterPromptsMap };
        updated[subKey] = null;
        setMasterPromptsMap(updated);
        if (user?.uid) {
          try {
            await saveMasterDefaultPromptsIfAdmin(db, user, updated);
          } catch (err) {
            console.error("Failed to delete from global master:", err);
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
            console.error("Failed to delete subject prompt from database:", err);
          }
        }
      }
    }
  };`
);

// 6. UI Rendering Updates
// We will replace the activeSubjectKeys definition
file = file.replace(
  /case 'My Prompts': \{\s*const activeSubjectKeys = Object\.keys\(subjectPrompts\)\.filter\(k => subjectPrompts\[k\] !== null\);/,
  `case 'My Prompts': {
              const currentPrompts = (isAdminUser && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
              const activeSubjectKeys = Object.keys(currentPrompts || {}).filter(k => currentPrompts[k] !== null);`
);

// Add the toggle
file = file.replace(
  /<h1 className="text-2xl sm:text-3xl font-black text-\[#14532d\] tracking-tight">\s*My Subject Prompts\s*<\/h1>/,
  `<h1 className="text-2xl sm:text-3xl font-black text-[#14532d] tracking-tight">
                             {isAdminUser && promptViewMode === 'global' ? 'Global Master Prompts' : 'My Subject Prompts'}
                          </h1>
                          {isAdminUser && (
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
                          )}`
);

// activeSubjectKeys map loop
file = file.replace(
  /activeSubjectKeys\.map\(subKey => \{\s*const hasPrompt = !!subjectPrompts\[subKey\];/,
  `activeSubjectKeys.map(subKey => {
                                const currentMap = (isAdminUser && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
                                const hasPrompt = !!currentMap[subKey];`
);

// handleEditSubject
file = file.replace(
  /const handleEditSubject = \(subKey\) => \{\s*setActivePromptModalSubject\(subKey\);\s*setEditingPromptContent\(subjectPrompts\[subKey\] \|\| getPremiumPromptTemplate\(subKey\)\);\s*\};/,
  `const handleEditSubject = (subKey) => {
                                      setActivePromptModalSubject(subKey);
                                      const currentMap = (isAdminUser && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
                                      setEditingPromptContent(currentMap[subKey] || getPremiumPromptTemplate(subKey));
                                   };`
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);

if (file.length === originalLength) {
  console.log("WARNING: File length is the same, replacements might have failed!");
} else {
  console.log("Applied ALL patch replacements successfully! Original length:", originalLength, "New length:", file.length);
}
