const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const t3 = `  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      alert("Please enter a subject name! 🎨");
      return;
    }
    const cleanName = newSubjectName.trim().toLowerCase();
    const displaySubject = newSubjectName.trim();
    if (subjectPrompts[cleanName] !== undefined && subjectPrompts[cleanName] !== null) {
      alert("This subject already exists! 💡");
      return;
    }
    setSubjectPrompts(prev => ({
      ...prev,
      [cleanName]: "Generating premium prompt using AI... 🪄 Please wait a moment."
    }));
    setNewSubjectName('');

    try {
      const generatedText = await generateContent({
        prompt: \`Write a highly detailed, customized, and structured instruction prompt template for another AI to generate high-quality worksheets and questions specifically for the subject: "\${displaySubject}". The generated prompt must contain subject-specific details (for example, if the subject is "\${displaySubject}", the instructions must specify key concepts, terminology, question structures, and topics unique to "\${displaySubject}"). It should dynamically cater to the grade and difficulty level selected. Do not write a generic template containing '{SUBJECT}'. Write a concrete prompt tailored specifically to "\${displaySubject}". Output only the prompt text itself, with no explanations or markdown quotes.\`,
        systemInstruction: "You are an expert AI prompt engineer. Write a highly detailed, professional, structured instruction prompt for another AI to generate high-quality worksheets and questions. Output ONLY the resulting prompt.",
        temperature: 0.7,
        tier: getModelTier(user)
      });
      
      setSubjectPrompts(prev => ({
        ...prev,
        [cleanName]: generatedText
      }));
    } catch (err) {
      console.error("AI Prompt Gen Error:", err);
      setSubjectPrompts(prev => ({
        ...prev,
        [cleanName]: getPremiumPromptTemplate(displaySubject)
      }));
      alert("AI failed to generate a specialized prompt. We saved a default premium template instead! 🔧");
    }
  };`;

const r3 = `  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      alert("Please enter a subject name! 🎨");
      return;
    }
    const cleanName = newSubjectName.trim().toLowerCase();
    const displaySubject = newSubjectName.trim();
    
    if (isAdmin && promptViewMode === 'global') {
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
      
      if (isAdmin && promptViewMode === 'global') {
        setMasterPromptsMap(prev => ({ ...prev, [cleanName]: generatedText }));
      } else {
        setSubjectPrompts(prev => ({ ...prev, [cleanName]: generatedText }));
      }
    } catch (err) {
      console.error("AI Prompt Gen Error:", err);
      if (isAdmin && promptViewMode === 'global') {
        setMasterPromptsMap(prev => ({ ...prev, [cleanName]: getPremiumPromptTemplate(displaySubject) }));
      } else {
        setSubjectPrompts(prev => ({ ...prev, [cleanName]: getPremiumPromptTemplate(displaySubject) }));
      }
      alert("AI failed to generate a specialized prompt. We saved a default premium template instead! 🔧");
    }
  };`;

file = file.replace(/const handleAddSubject = async \(\) => \{[\s\S]*?alert\("AI failed to generate a specialized prompt\. We saved a default premium template instead! [^"]+"\);\n    \}\n  \};/, r3);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Fixed handleAddSubject.");
