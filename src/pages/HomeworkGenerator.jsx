import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FlaskConical, 
  Pencil, 
  Book, 
  Upload, 
  Users, 
  Calendar, 
  Clock, 
  Star,
  Rocket,
  Wand2,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Trash2,
  History,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';

const SUBJECTS = [
  { 
    id: 'english', 
    name: 'English', 
    titleColor: 'text-orange-500',
    bgColor: 'bg-[#fffdf0]', 
    borderColor: 'border-orange-200',
    selectedBorder: 'border-orange-400 ring-4 ring-orange-100',
    desc: 'Reading, writing, grammar and more!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_0_0_#c2410c] transform -rotate-6">
        Aa
      </div>
    )
  },
  { 
    id: 'maths', 
    name: 'Maths', 
    titleColor: 'text-blue-500',
    bgColor: 'bg-[#f4faff]', 
    borderColor: 'border-blue-200',
    selectedBorder: 'border-blue-400 ring-4 ring-blue-100',
    desc: 'Numbers, shapes, patterns and more!',
    renderGraphic: () => (
      <div className="flex gap-1 transform rotate-2">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black shadow-[0_4px_0_0_#c2410c] -translate-y-2">1</div>
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-black shadow-[0_4px_0_0_#15803d]">2</div>
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black shadow-[0_4px_0_0_#1d4ed8] translate-y-2">3</div>
      </div>
    )
  },
  { 
    id: 'science', 
    name: 'Science', 
    titleColor: 'text-green-600',
    bgColor: 'bg-[#f4fbf4]', 
    borderColor: 'border-green-200',
    selectedBorder: 'border-green-500 ring-4 ring-green-100',
    desc: 'Discover, explore and learn amazing things!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 shadow-inner overflow-hidden border-4 border-green-200">
        <FlaskConical className="w-10 h-10 text-green-500" />
      </div>
    )
  },
];

export default function HomeworkGenerator({ user, classrooms = [], activeClassroom }) {
  const [formData, setFormData] = useState({
    subject: 'maths',
    title: '',
    instructions: '',
    classId: '',
    dueDate: '',
    time: '',
    points: '10'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [isAiAccepted, setIsAiAccepted] = useState(false);

  const [activeTab, setActiveTab] = useState('create');
  const [pastHomeworks, setPastHomeworks] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [expandedHomeworkId, setExpandedHomeworkId] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);

  const fetchPastHomeworks = async () => {
    if (!user?.uid) return;
    setIsLoadingHistory(true);
    try {
      const q = activeClassroom 
        ? query(collection(db, 'homeworks'), where('teacherId', '==', user.uid), where('assignedClassId', '==', activeClassroom.id))
        : query(collection(db, 'homeworks'), where('teacherId', '==', user.uid));
      const snap = await getDocs(q);
      const hwList = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      
      hwList.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      setPastHomeworks(hwList);
    } catch (err) {
      console.error("Fetch past homework error:", err);
    }
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPastHomeworks();
    }
  }, [activeTab, user, activeClassroom]);

  const handleDeleteHomework = async (hwId) => {
    if (!window.confirm("Are you sure you want to delete this homework? 🗑️")) return;
    try {
      await deleteDoc(doc(db, 'homeworks', hwId));
      fetchPastHomeworks();
    } catch (err) {
      console.error("Delete homework error:", err);
      alert("Oops! Failed to delete homework.");
    }
  };

  const getPlaceholder = () => {
    if (formData.subject === 'maths') return `e.g. 'Make ${questionCount} questions about adding fractions with unlike denominators'...`;
    if (formData.subject === 'science') return `e.g. 'Make ${questionCount} questions about the solar system and planets'...`;
    if (formData.subject === 'english') return `e.g. 'Make ${questionCount} questions about identifying nouns vs verbs in a sentence'...`;
    return "Describe what the AI should generate...";
  };

  const handleGenerateAI = async () => {
    const activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';
    const activeKey = localStorage.getItem(`hwz_${activeModel}_key`);

    if (!activeKey) return alert("Please set your API Key in the Power Hub first! 🔑");
    if (!formData.title) return alert("Please provide a Title first to guide generation! 🎯");

    setIsAiAccepted(false);
    setIsGenerating(true);
    try {
      const prompt = `You are an expert curriculum designer. 
      Create a ${questionCount}-question multiple-choice quiz for students about the following topic:
      Subject: ${formData.subject}
      Topic: ${formData.title}
      Specific Content Instructions: ${formData.instructions}
      
      Ensure the questions test the students' knowledge on the specific content instructions provided. DO NOT generate meta-questions about the instructions themselves.
      
      Return ONLY a JSON object with a single key "questions" containing an array of objects. Each object must have: "id" (number), "text" (string, the question), "options" (array of exactly 4 strings), and "answer" (string, matching one option exactly). Do not include any markdown formatting.`;

      let questions = [];

      if (activeModel.includes('gpt') || activeModel === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
          })
        });
        
        if (!res.ok) throw new Error("OpenAI request failed");
        
        const data = await res.json();
        const rawContent = data.choices[0].message.content;
        const firstBrace = rawContent.indexOf('{');
        const lastBrace = rawContent.lastIndexOf('}');
        const cleanContent = firstBrace !== -1 && lastBrace !== -1 ? rawContent.substring(firstBrace, lastBrace + 1) : rawContent;
        const content = JSON.parse(cleanContent);
        questions = content.questions || content;
      } else if (activeModel.includes('gemini')) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          })
        });

        if (!res.ok) throw new Error("Gemini request failed");

        const data = await res.json();
        const contentText = data.candidates[0].content.parts[0].text;
        const firstBrace = contentText.indexOf('{');
        const lastBrace = contentText.lastIndexOf('}');
        const cleanContent = firstBrace !== -1 && lastBrace !== -1 ? contentText.substring(firstBrace, lastBrace + 1) : contentText;
        const content = JSON.parse(cleanContent);
        questions = content.questions || content;
      }

      setGeneratedQuestions(questions);
    } catch (err) {
      console.error("AI Gen Error:", err);
      alert("Failed to generate questions. ❌");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.classId) {
      alert("Please fill in the title and select a class! 🎒");
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        title: formData.title,
        subject: formData.subject,
        instructions: formData.instructions,
        assignedClassId: formData.classId,
        dueDate: formData.dueDate,
        time: formData.time,
        points: formData.points,
        questions: generatedQuestions || [], // if AI generated, save them
        teacherId: user?.uid,
        status: 'published',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'homeworks'), payload);
      alert("Homework Published Successfully! 🚀");
      
      // Reset form
      setFormData({
        subject: 'maths',
        title: '',
        instructions: '',
        classId: '',
        dueDate: '',
        time: '',
        points: '10'
      });
      setGeneratedQuestions(null);
      setIsAiAccepted(false);
    } catch (err) {
      console.error("Publish Error:", err);
      alert("Failed to publish homework. ❌");
    }
    setIsPublishing(false);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in font-nunito pb-10">
      
      {/* Tab Switcher */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 border border-slate-200/60 shadow-sm">
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-8 py-3 rounded-full font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'create' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <PlusCircle className="w-4 h-4" /> Create New
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-8 py-3 rounded-full font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <History className="w-4 h-4" /> Past Homeworks
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <>
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-black text-[#1a237e] tracking-tight mb-2">Create Homework</h1>
              <div className="relative inline-block">
                 <p className="text-lg text-slate-500 font-bold">Prepare fun and meaningful homework for your students!</p>
                 <svg className="absolute -bottom-2 left-0 w-32 h-3 text-purple-400 opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none">
                   <path d="M0,10 Q10,20 20,10 T40,10 T60,10 T80,10 T100,10" fill="none" stroke="currentColor" strokeWidth="3" />
                 </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-4 relative mt-4">
              <div className="bg-white border-2 border-pink-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm relative z-10">
                <Star className="w-5 h-5 text-pink-400 fill-current" />
                <span className="font-bold text-slate-700">Hi, Teacher!</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <img src="/mascot.png" alt="Mascot" className="w-20 h-20 object-contain absolute -top-8 -left-16 drop-shadow-md" />
            </div>
          </div>

      {/* Step 1: Choose Subject */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-black">1</div>
          <h2 className="text-2xl font-black text-[#1a237e]">Choose Subject</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBJECTS.map((sub) => (
            <div 
              key={sub.id}
              onClick={() => setFormData({...formData, subject: sub.id})}
              className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center text-center group ${sub.bgColor} ${formData.subject === sub.id ? sub.selectedBorder : sub.borderColor}`}
            >
              {/* Radio Button */}
              <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.subject === sub.id ? 'border-blue-500' : 'border-slate-300 bg-white'}`}>
                {formData.subject === sub.id && <div className="w-3 h-3 rounded-full bg-blue-500" />}
              </div>
              
              <h3 className={`text-2xl font-black mb-8 ${sub.titleColor}`}>{sub.name}</h3>
              
              <div className="h-24 flex items-center justify-center mb-6">
                {sub.renderGraphic()}
              </div>
              
              <p className="text-slate-600 font-bold text-sm px-4">{sub.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Col: Details */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-black">2</div>
            <h2 className="text-2xl font-black text-[#1a237e]">Homework Details</h2>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-[#1a237e]">Title</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Enter homework title..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl px-4 text-slate-700 font-bold outline-none focus:border-purple-400 transition-colors"
              />
              <Pencil className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between mb-2">
               <label className="font-bold text-[#1a237e]">Number of Questions</label>
               <span className="font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-xl text-sm">{questionCount}</span>
            </div>
            <input 
               type="range" 
               min="1" 
               max="50" 
               value={questionCount} 
               onChange={(e) => setQuestionCount(Number(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
               <span>1 (Quick check)</span>
               <span>50 (Full exam)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-[#1a237e]">Prompt / Instructions for Students</label>
            <div className="relative">
              <textarea 
                placeholder={getPlaceholder()}
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                className="w-full h-32 bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-purple-400 transition-colors resize-none"
              />
              <Book className="absolute right-4 bottom-4 w-6 h-6 text-purple-400 opacity-50" />
            </div>
          </div>

          {/* AI Generator Box inside Details */}
          <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-100 flex flex-col items-center text-center space-y-4">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
               <Wand2 className="w-6 h-6" />
             </div>
             <div>
                <h4 className="font-black text-purple-900">Magic Quiz Builder</h4>
                <p className="text-xs font-bold text-purple-600/70">Automatically generate {questionCount} multiple-choice questions based on your title & instructions.</p>
             </div>
             {generatedQuestions ? (
               isAiAccepted ? (
                 <div className="w-full bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between animate-in zoom-in duration-300">
                   <div className="flex items-center gap-3 text-emerald-700 font-bold text-sm">
                     <CheckCircle2 className="w-5 h-5" />
                     {generatedQuestions.length} Questions Saved to Draft! Scroll down to publish.
                   </div>
                   <button onClick={() => setIsAiAccepted(false)} className="text-xs text-emerald-600 font-bold hover:underline px-4 py-2 bg-white rounded-lg border border-emerald-200">View Questions</button>
                 </div>
               ) : (
                 <div className="w-full text-left bg-white p-6 rounded-2xl border border-purple-200 space-y-6">
                   <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                     <div className="flex items-center gap-2 text-emerald-600 font-black">
                       <CheckCircle2 className="w-5 h-5" /> {generatedQuestions.length} Questions Ready!
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => setIsAiAccepted(true)} className="text-xs text-white font-bold px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition-colors">Accept & Continue</button>
                     </div>
                   </div>
                   <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                     {generatedQuestions.map((q, idx) => (
                       <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                         <p className="font-bold text-slate-800 text-sm mb-3"><span className="text-purple-600 mr-1">Q{idx + 1}.</span> {q.text}</p>
                         <div className="grid grid-cols-2 gap-2">
                           {q.options.map((opt, i) => (
                             <div key={i} className={`px-3 py-2 rounded-lg text-xs font-bold border ${opt === q.answer ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                               {opt}
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                     <button onClick={handleGenerateAI} className="text-xs text-purple-600 font-bold hover:underline px-4 py-2 bg-purple-50 rounded-lg">Regenerate</button>
                     <button onClick={() => {setGeneratedQuestions(null); setIsAiAccepted(false);}} className="text-xs text-rose-500 font-bold hover:underline px-4 py-2 bg-rose-50 rounded-lg">Discard</button>
                   </div>
                 </div>
               )
             ) : (
               <button 
                 onClick={handleGenerateAI}
                 disabled={isGenerating}
                 className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-sm transition-all"
               >
                 {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                 {isGenerating ? 'Generating...' : 'Auto-Generate Questions'}
               </button>
             )}
          </div>

          <div className="space-y-2">
            <label className="font-bold text-[#1a237e] flex items-center gap-2">
              Attach Resources <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors text-center">
              <Upload className="w-6 h-6 text-purple-400 mb-2" />
              <p className="font-bold text-purple-600 text-sm">Upload worksheets, images or videos</p>
              <p className="text-xs font-bold text-slate-400">Drag & drop or click to upload</p>
            </div>
          </div>
        </div>

        {/* Right Col: Assign To */}
        <div className="space-y-8 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-black">3</div>
            <h2 className="text-2xl font-black text-[#1a237e]">Assign To</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-bold text-[#1a237e]">Class</label>
              <div className="relative">
                <Users className="absolute left-4 top-4 w-5 h-5 text-blue-400" />
                <select 
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 text-slate-700 font-bold outline-none focus:border-purple-400 appearance-none"
                >
                  <option value="">Select a class</option>
                  {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronRight className="absolute right-4 top-4 w-5 h-5 text-slate-400 rotate-90" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[#1a237e]">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 w-5 h-5 text-blue-400" />
                <input 
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 text-slate-700 font-bold outline-none focus:border-purple-400 appearance-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[#1a237e] flex items-center gap-2">
                Time <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-4 w-5 h-5 text-rose-400" />
                <input 
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 text-slate-700 font-bold outline-none focus:border-purple-400 appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Kid Illustration Box */}
          <div className="mt-8 bg-orange-50/50 rounded-3xl p-8 relative flex flex-col items-center justify-end h-64 border-2 border-orange-100 overflow-visible">
             <div className="absolute -top-6 right-4 bg-pink-100 px-6 py-4 rounded-2xl rounded-br-sm shadow-sm border border-pink-200 z-10">
                <p className="font-black text-pink-700 text-sm">You're making<br/>learning awesome! 🌟</p>
             </div>
             {/* Simple drawing if mascot image doesn't exist */}
             <div className="w-48 h-48 bg-contain bg-bottom bg-no-repeat opacity-90" style={{ backgroundImage: "url('/dino-reading.png')" }}></div>
          </div>

        </div>
      </div>
      
      {/* Bottom Footer Bar */}
      <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <label className="font-bold text-[#1a237e] text-sm flex items-center gap-2">
              Add Points <span className="text-slate-400 font-normal text-xs">(optional)</span>
            </label>
            <select 
              value={formData.points}
              onChange={(e) => setFormData({...formData, points: e.target.value})}
              className="bg-transparent font-black text-slate-700 outline-none cursor-pointer"
            >
              <option value="5">5 Points</option>
              <option value="10">10 Points</option>
              <option value="20">20 Points</option>
              <option value="50">50 Points</option>
            </select>
          </div>
          <span className="text-xs font-bold text-slate-400 ml-2">Reward your students!</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-purple-50 hover:bg-purple-100 text-purple-600 font-black px-8 py-4 rounded-2xl transition-colors">
            Save as Draft
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-black px-10 py-4 rounded-2xl flex items-center gap-3 transition-colors shadow-[0_4px_0_0_#219653] hover:translate-y-1 hover:shadow-none disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Homework 🚀'}
          </button>
        </div>
      </div>
      </>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-5xl font-black text-[#1a237e] tracking-tight mb-2">Past Homeworks</h1>
              <p className="text-lg text-slate-500 font-bold">Manage and review previously assigned homework.</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <Filter className="w-5 h-5 text-purple-400" />
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date:</label>
                 <input 
                   type="date"
                   value={filterDate}
                   onChange={(e) => setFilterDate(e.target.value)}
                   className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                 />
              </div>
              {filterDate && (
                <button onClick={() => setFilterDate('')} className="ml-2 text-xs font-bold text-rose-500 hover:underline">
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
          ) : pastHomeworks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <Book className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No past homeworks found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pastHomeworks.filter(hw => {
                if (!filterDate) return true;
                const assignedDate = hw.createdAt?.toMillis ? new Date(hw.createdAt.toMillis()).toISOString().split('T')[0] : '';
                const dueDate = hw.dueDate || '';
                return assignedDate === filterDate || dueDate === filterDate;
              }).map(hw => (
                <div key={hw.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group flex flex-col w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${hw.subject === 'maths' ? 'bg-blue-100 text-blue-700' : hw.subject === 'science' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {hw.subject}
                      </span>
                      <h3 className="text-xl font-black text-slate-800">{hw.title}</h3>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
                       <div className="flex items-center gap-2" title="Date Assigned"><Calendar className="w-4 h-4" /> {hw.createdAt?.toMillis ? new Date(hw.createdAt.toMillis()).toLocaleDateString() : 'N/A'}</div>
                       <div className="flex items-center gap-2" title="Due Date"><Clock className="w-4 h-4" /> {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : 'No Due'}</div>
                       <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {hw.questions?.length || 0} Qs</div>
                       
                       <button 
                         onClick={() => handleDeleteHomework(hw.id)}
                         className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100 ml-4"
                         title="Delete Homework"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 font-bold mb-4">{hw.instructions || 'No instructions provided.'}</p>
                  
                  {hw.questions && hw.questions.length > 0 && (
                    <div className="mt-2 border-t border-slate-100 pt-4">
                      <button 
                        onClick={() => setExpandedHomeworkId(expandedHomeworkId === hw.id ? null : hw.id)}
                        className="flex items-center gap-2 text-sm font-black text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        {expandedHomeworkId === hw.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {expandedHomeworkId === hw.id ? 'Hide Questions' : 'View Full Homework Questions'}
                      </button>
                      
                      <AnimatePresence>
                        {expandedHomeworkId === hw.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-6 space-y-4"
                          >
                            {hw.questions.map((q, idx) => (
                              <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <p className="font-bold text-slate-800 text-sm mb-4"><span className="text-purple-600 mr-2">Q{idx + 1}.</span> {q.text}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {q.options.map((opt, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl text-xs font-bold border flex items-center gap-3 ${opt === q.answer ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                                      <div className={`w-5 h-5 rounded-full flex-center text-[10px] ${opt === q.answer ? 'bg-emerald-200' : 'bg-slate-100'}`}>
                                        {['A', 'B', 'C', 'D'][i]}
                                      </div>
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}
              
              {pastHomeworks.length > 0 && pastHomeworks.filter(hw => {
                if (!filterDate) return true;
                const assignedDate = hw.createdAt?.toMillis ? new Date(hw.createdAt.toMillis()).toISOString().split('T')[0] : '';
                const dueDate = hw.dueDate || '';
                return assignedDate === filterDate || dueDate === filterDate;
              }).length === 0 && (
                <div className="text-center py-10 bg-white rounded-3xl border border-slate-200">
                   <p className="text-slate-500 font-bold">No homework matches this date.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
