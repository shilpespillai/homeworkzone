const fs = require('fs');

function applySafePatch() {
  let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

  // 1. Add state
  const stateTarget = "const [masterPromptsMap, setMasterPromptsMap] = useState(DEFAULT_SUBJECT_PROMPTS);";
  if (!file.includes("promptViewMode")) {
    file = file.replace(stateTarget, stateTarget + "\n  const [promptViewMode, setPromptViewMode] = useState('personal');");
  }

  // 2. handleSaveModalPrompt
  const oldModalPromptTarget = `  const handleSaveModalPrompt = async () => {
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
    setActivePromptModalSubject(null);
    setIsSavingPrompts(false);
  };`;

  const newModalPromptTarget = `  const handleSaveModalPrompt = async () => {
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

  if (file.includes(oldModalPromptTarget)) {
    file = file.replace(oldModalPromptTarget, newModalPromptTarget);
  } else {
    console.error("Failed to find handleSaveModalPrompt target");
  }

  // 3. handleSavePrompts
  const oldSavePromptsTarget = `  const handleSavePrompts = async () => {
    if (!user?.uid) return;
    setIsSavingPrompts(true);
    try {
      await updateDoc(doc(db, 'teachers', user.uid), {
        subjectPrompts: subjectPrompts
      });
      await saveMasterDefaultPromptsIfAdmin(db, user, subjectPrompts);
      alert("Generic Subject Prompts saved successfully! 🚀🪄");
    } catch (err) {
      console.error("Save Prompts Error:", err);
      alert("Failed to save prompts. ❌");
    }
    setIsSavingPrompts(false);
  };`;

  const newSavePromptsTarget = `  const handleSavePrompts = async () => {
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
    }
    setIsSavingPrompts(false);
  };`;

  if (file.includes(oldSavePromptsTarget)) {
    file = file.replace(oldSavePromptsTarget, newSavePromptsTarget);
  } else {
    console.error("Failed to find handleSavePrompts target");
  }

  // 4. handleAddSubject
  const oldAddSubjectTarget = `  const handleAddSubject = () => {
    const cleanName = newSubjectName.trim();
    if (!cleanName) return;

    if (subjectPrompts[cleanName] !== undefined && subjectPrompts[cleanName] !== null) {
      alert("Subject already exists!");
      return;
    }

    setSubjectPrompts(prev => ({
      ...prev,
      [cleanName]: getPremiumPromptTemplate(cleanName)
    }));
    setNewSubjectName('');
  };`;

  const newAddSubjectTarget = `  const handleAddSubject = () => {
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

  if (file.includes(oldAddSubjectTarget)) {
    file = file.replace(oldAddSubjectTarget, newAddSubjectTarget);
  } else {
    console.error("Failed to find handleAddSubject target");
  }

  // 5. handleDeleteSubject
  const oldDeleteSubjectTarget = `  const handleDeleteSubject = async (subKey) => {
    if (!window.confirm(\`Are you sure you want to delete the prompt for "\${subKey}"?\`)) return;

    const updated = { ...subjectPrompts };
    updated[subKey] = null; // Mark as null to effectively delete/hide it
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
  };`;

  const newDeleteSubjectTarget = `  const handleDeleteSubject = async (subKey) => {
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

  if (file.includes(oldDeleteSubjectTarget)) {
    file = file.replace(oldDeleteSubjectTarget, newDeleteSubjectTarget);
  } else {
    console.error("Failed to find handleDeleteSubject target");
  }

  // 6. UI Updates
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
  console.log("Safely applied Option 3.");
}

applySafePatch();
