const fs = require('fs');

let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8').replace(/\r\n/g, '\n');

function replaceExact(pattern, replacement) {
  if (content.includes(pattern)) {
    content = content.replace(pattern, replacement);
    console.log("Success replacing block.");
  } else {
    console.error("FAILED to find block:\n", pattern.substring(0, 100) + "...");
    process.exit(1);
  }
}

// 1. Add promptViewMode state
const stateTarget = "const [masterPromptsMap, setMasterPromptsMap] = useState(DEFAULT_SUBJECT_PROMPTS);";
const stateNew = stateTarget + "\n  const [promptViewMode, setPromptViewMode] = useState('personal');";
replaceExact(stateTarget, stateNew);

// 2. Add isPromptAdmin
const adminTarget = "const isAdminUser = teacherData?.isAdmin === true || teacherData?.role === 'admin';";
const adminNew = adminTarget + "\n  const isPromptAdmin = isAdminUser || (user?.email?.toLowerCase().trim() === 'shilpeshpillai81@gmail.com');";
replaceExact(adminTarget, adminNew);

// 3. handleSaveModalPrompt
const modalTarget = `  const handleSaveModalPrompt = async () => {
    if (!activePromptModalSubject) return;
    setIsSavingPrompts(true);
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
        const isMasterSaved = await saveMasterDefaultPromptsIfAdmin(db, user, updatedPrompts);
        if (isMasterSaved) {
          setMasterPromptsMap(updatedPrompts);
        }
      } catch (err) {
        console.error("Save Prompt Error:", err);
      }
    }
    setIsSavingPrompts(false);
    setActivePromptModalSubject(null);
  };`;
const modalNew = `  const handleSaveModalPrompt = async () => {
    if (!activePromptModalSubject) return;
    setIsSavingPrompts(true);
    
    if (isPromptAdmin && promptViewMode === 'global') {
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
    setIsSavingPrompts(false);
    setActivePromptModalSubject(null);
  };`;
replaceExact(modalTarget, modalNew);

// 4. handleSavePrompts
const saveNew = `  const handleSavePrompts = async () => {
    if (!user?.uid) return;
    setIsSavingPrompts(true);
    try {
      if (isPromptAdmin && promptViewMode === 'global') {
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
  };`;

// Regex for savePrompts due to emojis
const saveRegex = /  const handleSavePrompts = async \(\) => \{[\s\S]*?alert\("Failed to save prompts\. [^"]+"\);\n    \}\n    setIsSavingPrompts\(false\);\n  \};/;
if (saveRegex.test(content)) {
  content = content.replace(saveRegex, saveNew);
  console.log("Success replacing block.");
} else {
  console.error("FAILED to find handleSavePrompts via Regex.");
  process.exit(1);
}

// 5. handleAddSubject
const addNew = `  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      alert("Please enter a subject name! 🎨");
      return;
    }
    const cleanName = newSubjectName.trim().toLowerCase();
    const displaySubject = newSubjectName.trim();
    
    if (isPromptAdmin && promptViewMode === 'global') {
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
      
      if (isPromptAdmin && promptViewMode === 'global') {
        setMasterPromptsMap(prev => ({ ...prev, [cleanName]: generatedText }));
      } else {
        setSubjectPrompts(prev => ({ ...prev, [cleanName]: generatedText }));
      }
    } catch (err) {
      console.error("AI Prompt Gen Error:", err);
      if (isPromptAdmin && promptViewMode === 'global') {
        setMasterPromptsMap(prev => ({ ...prev, [cleanName]: getPremiumPromptTemplate(displaySubject) }));
      } else {
        setSubjectPrompts(prev => ({ ...prev, [cleanName]: getPremiumPromptTemplate(displaySubject) }));
      }
      alert("AI failed to generate a specialized prompt. We saved a default premium template instead! 🔧");
    }
  };`;

const addRegex = /  const handleAddSubject = async \(\) => \{[\s\S]*?alert\("AI failed to generate a specialized prompt\. We saved a default premium template instead! 🔧"\);\n    \}\n  \};/;
if (addRegex.test(content)) {
  content = content.replace(addRegex, addNew);
  console.log("Success replacing block.");
} else {
  console.error("FAILED to find handleAddSubject via Regex.");
  process.exit(1);
}

// 6. handleDeleteSubject
const deleteTarget = `  const handleDeleteSubject = async (subKey) => {
    if (await window.confirmCustom(\`Are you sure you want to delete the generic prompt for "\${subKey}"?\`)) {
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
  };`;
const deleteNew = `  const handleDeleteSubject = async (subKey) => {
    if (await window.confirmCustom(\`Are you sure you want to delete the generic prompt for "\${subKey}"?\`)) {
      if (isPromptAdmin && promptViewMode === 'global') {
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
  };`;
replaceExact(deleteTarget, deleteNew);

// 7. UI Rendering
const myPromptsTarget = `           case 'My Prompts': {
              const activeSubjectKeys = Object.keys(subjectPrompts).filter(k => subjectPrompts[k] !== null);`;
const myPromptsNew = `           case 'My Prompts': {
              const currentPrompts = (isPromptAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
              const activeSubjectKeys = Object.keys(currentPrompts || {}).filter(k => currentPrompts[k] !== null);`;
replaceExact(myPromptsTarget, myPromptsNew);

const headerTarget = `<h1 className="text-2xl sm:text-3xl font-black text-[#14532d] tracking-tight">
                             My Subject Prompts
                          </h1>`;
const headerNew = `<h1 className="text-2xl sm:text-3xl font-black text-[#14532d] tracking-tight">
                             {isPromptAdmin && promptViewMode === 'global' ? 'Global Master Prompts' : 'My Subject Prompts'}
                          </h1>
                          {isPromptAdmin && (
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
replaceExact(headerTarget, headerNew);

const loopTarget = `                          {activeSubjectKeys.map((subKey) => {
                             const style = resolveSubjectStyle(subKey);
                             const displayName = subKey.charAt(0).toUpperCase() + subKey.slice(1);
                             const hasPrompt = !!subjectPrompts[subKey];`;
const loopNew = `                          {activeSubjectKeys.map((subKey) => {
                             const style = resolveSubjectStyle(subKey);
                             const displayName = subKey.charAt(0).toUpperCase() + subKey.slice(1);
                             const currentMap = (isPromptAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
                             const hasPrompt = !!currentMap[subKey];`;
replaceExact(loopTarget, loopNew);

const openModalTarget = `  const handleOpenPromptModal = (subKey) => {
    setActivePromptModalSubject(subKey);
    setEditingPromptContent(subjectPrompts[subKey] || getPremiumPromptTemplate(subKey));
  };`;
const openModalNew = `  const handleOpenPromptModal = (subKey) => {
    setActivePromptModalSubject(subKey);
    const currentMap = (isPromptAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
    setEditingPromptContent(currentMap[subKey] || getPremiumPromptTemplate(subKey));
  };`;
replaceExact(openModalTarget, openModalNew);

// Convert back to CRLF if needed (though Vite accepts LF fine, but whatever)
fs.writeFileSync('src/pages/TeacherDashboard.jsx', content.replace(/\n/g, '\r\n'));
console.log("Successfully rewrote TeacherDashboard.jsx!");
