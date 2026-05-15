import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  BookOpen, 
  FlaskConical, 
  Calculator,
  ChevronRight,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  Star,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CURRICULUMS = [
  { id: 'au', name: 'Australia', icon: '🇦🇺' },
  { id: 'uk', name: 'United Kingdom', icon: '🇬🇧' },
  { id: 'us', name: 'United States', icon: '🇺🇸' },
  { id: 'in', name: 'India', icon: '🇮🇳' },
];

const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

const SUBJECTS = [
  { id: 'english', name: 'English', icon: <BookOpen className="w-6 h-6" />, color: 'bg-english text-white shadow-[0_5px_0_0_#b04c95]' },
  { id: 'maths', name: 'Maths', icon: <Calculator className="w-6 h-6" />, color: 'bg-maths text-white shadow-[0_5px_0_0_#d35400]' },
  { id: 'science', name: 'Science', icon: <FlaskConical className="w-6 h-6" />, color: 'bg-science text-white shadow-[0_5px_0_0_#1591a3]' },
];

export default function HomeworkGenerator() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    country: 'au',
    grade: 'Grade 3',
    subject: 'maths',
    topic: '',
    questionCount: 5
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setResult({
        title: `${config.subject.toUpperCase()}: ${config.topic || 'General Review'}`,
        questions: [
          { id: 1, text: "What is 12 + 15?", options: ["25", "27", "30", "22"], answer: "27" },
          { id: 2, text: "What is half of 50?", options: ["20", "25", "30", "15"], answer: "25" },
        ]
      });
      setStep(4);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in pb-20">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-yellow-50 text-yellow-500 flex-center rounded-[24px] shadow-tactile border-2 border-yellow-100/50">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight lowercase">Homework Generator</h2>
          <p className="text-xs text-slate-400 uppercase font-black tracking-[0.25em]">Create AI missions for your classroom</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Step 1: Core Settings */}
        <div className={`card-bubble space-y-8 transition-all border-none bg-white shadow-2xl shadow-slate-200/40 ${step === 1 ? 'ring-4 ring-primary/10' : 'opacity-40 grayscale-[0.5]'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white flex-center rounded-2xl text-sm font-black rotate-[-10deg]">01</div>
            <h3 className="text-xl font-black lowercase">core settings</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Country</label>
              <div className="grid grid-cols-2 gap-3">
                {CURRICULUMS.map(c => (
                  <div 
                    key={c.id}
                    onClick={() => setConfig({...config, country: c.id})}
                    className={`p-4 rounded-[20px] border-2 text-sm font-black cursor-pointer transition-all flex items-center gap-3 ${
                      config.country === c.id ? 'border-primary bg-primary/5 text-primary shadow-tactile' : 'border-slate-50 hover:border-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-xl">{c.icon}</span> {c.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Grade</label>
              <select 
                value={config.grade}
                onChange={(e) => setConfig({...config, grade: e.target.value})}
                className="input h-14 rounded-[20px] border-4 border-slate-50 font-black text-md"
              >
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          
          {step === 1 && <button onClick={() => setStep(2)} className="btn-bubble btn-primary w-full h-14">next mission <ChevronRight className="w-5 h-5" /></button>}
        </div>

        {/* Step 2: Subject Matter */}
        <div className={`card-bubble space-y-8 transition-all border-none bg-white shadow-2xl shadow-slate-200/40 ${step === 2 ? 'ring-4 ring-primary/10' : 'opacity-40 grayscale-[0.5]'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white flex-center rounded-2xl text-sm font-black rotate-[5deg]">02</div>
            <h3 className="text-xl font-black lowercase">subject matter</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              {SUBJECTS.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setConfig({...config, subject: s.id})}
                  className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all flex items-center gap-5 ${
                    config.subject === s.id ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-slate-50 hover:border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-14 h-14 flex-center rounded-[20px] ${s.color}`}>{s.icon}</div>
                  <span className="text-lg font-black lowercase">{s.name}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mission Topic (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Fractions, Space, Poetry" 
                value={config.topic}
                onChange={(e) => setConfig({...config, topic: e.target.value})}
                className="input h-14 rounded-[20px] border-4 border-slate-50 font-bold"
              />
            </div>
          </div>

          {step === 2 && (
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-bubble bg-white border-4 border-slate-50 text-slate-400 h-14 px-6 shadow-tactile">back</button>
              <button onClick={() => setStep(3)} className="btn-bubble btn-primary h-14 flex-1">review AI</button>
            </div>
          )}
        </div>

        {/* Step 3: AI Execution */}
        <div className={`card-bubble space-y-8 transition-all border-none bg-white shadow-2xl shadow-slate-200/40 ${step === 3 ? 'ring-4 ring-primary/10' : 'opacity-40 grayscale-[0.5]'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white flex-center rounded-2xl text-sm font-black rotate-[-5deg]">03</div>
            <h3 className="text-xl font-black lowercase">AI Execution</h3>
          </div>

          <div className="p-6 bg-[#f8f9fe] rounded-[32px] border-2 border-slate-50 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex-center shadow-tactile text-primary">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Selected Engine</p>
                <p className="text-sm font-black text-slate-900">GPT-4o legacy</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mission Summary</p>
              <p className="text-sm text-slate-500 font-bold leading-relaxed lowercase">
                Building <span className="text-primary font-black">{config.questionCount} challenges</span> for <span className="text-primary font-black">{config.grade}</span> students in <span className="text-primary font-black">{config.subject}</span>.
              </p>
            </div>
          </div>

          {step === 3 && (
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-bubble btn-primary w-full h-16 text-xl bg-slate-900 hover:bg-black shadow-[0_8px_0_0_#000000]"
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6 text-yellow-400" />}
              {isGenerating ? 'igniting...' : 'launch mission!'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {step === 4 && result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-bubble p-12 border-none bg-white shadow-2xl shadow-emerald-200/30 ring-4 ring-emerald-50"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-emerald-500 text-white flex-center rounded-[24px] shadow-[0_6px_0_0_#065f46] animate-bounce">
                  <Star className="w-8 h-8 fill-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 lowercase">Mission Built Successfully!</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">ready to deploy to your classroom</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="btn-bubble bg-white border-4 border-slate-50 text-slate-400 px-8 shadow-tactile">preview</button>
                <button className="btn-bubble btn-primary bg-emerald-500 hover:bg-emerald-600 shadow-[0_6px_0_0_#065f46] px-10">Assign to Students!</button>
              </div>
            </div>

            <div className="bg-[#f8f9fe] p-10 rounded-[40px] space-y-8">
              <p className="text-2xl font-black text-slate-900 lowercase border-b-4 border-white pb-6">{result.title}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.questions.map(q => (
                  <div key={q.id} className="card-bubble p-6 bg-white border-none shadow-sm group hover:border-primary transition-all">
                    <p className="text-md font-black text-slate-900 mb-6 lowercase">{q.id}. {q.text}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {q.options.map(opt => (
                        <div key={opt} className={`p-3 rounded-2xl border-2 text-xs font-black transition-all ${opt === q.answer ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50/50 border-slate-50 text-slate-400'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
