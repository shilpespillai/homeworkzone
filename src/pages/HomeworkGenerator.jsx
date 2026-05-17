import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAI } from '../context/AIContext';

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

export default function HomeworkGenerator({ user, classrooms = [] }) {
  const { apiKey, model } = useAI();
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

  const handleGenerateAI = async () => {
    if (!apiKey) return alert("Please set your AI API Key in settings first! 🔑");
    if (!formData.title) return alert("Please provide a Title first so AI knows what to generate! 🎯");

    setIsGenerating(true);
    try {
      const prompt = `You are an expert teacher. Generate 5 multiple-choice questions for students on the subject of ${formData.subject}. Topic: ${formData.title}. Additional Instructions: ${formData.instructions}. Return ONLY a JSON object with a single key "questions" containing an array of objects. Each object must have: "id" (number), "text" (string, the question), "options" (array of exactly 4 strings), and "answer" (string, matching one option exactly). Do not include any markdown formatting.`;

      let questions = [];

      if (model.includes('gpt')) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
          })
        });
        
        if (!res.ok) throw new Error("OpenAI request failed");
        
        const data = await res.json();
        const content = JSON.parse(data.choices[0].message.content);
        questions = content.questions;
      } else if (model.includes('gemini')) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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
        const content = JSON.parse(contentText);
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
    } catch (err) {
      console.error("Publish Error:", err);
      alert("Failed to publish homework. ❌");
    }
    setIsPublishing(false);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in font-nunito pb-10">
      
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

          <div className="space-y-2">
            <label className="font-bold text-[#1a237e]">Instructions for Students</label>
            <div className="relative">
              <textarea 
                placeholder="Write clear instructions here..."
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
                <h4 className="font-black text-purple-900">AI Magic Quiz Builder</h4>
                <p className="text-xs font-bold text-purple-600/70">Let AI generate 5 multiple-choice questions based on your title & instructions.</p>
             </div>
             {generatedQuestions ? (
               <div className="w-full bg-white p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                 <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
                   <CheckCircle2 className="w-5 h-5" />
                   5 Questions Generated Successfully!
                 </div>
                 <button onClick={() => setGeneratedQuestions(null)} className="text-xs text-rose-500 font-bold hover:underline">Discard</button>
               </div>
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

    </div>
  );
}
