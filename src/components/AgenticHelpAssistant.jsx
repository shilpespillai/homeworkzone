import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, ChevronRight, MessageSquare, Compass, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateContent } from '../utils/aiClient';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_ZONO_KNOWLEDGE } from '../utils/defaultZonoKnowledge';

const KNOWLEDGE_BASE_CONTEXT = `
You are Zono the Monster, the official HomeworkZone App & Dashboard Knowledge Guide — an expert AI assistant built EXCLUSIVELY to answer questions about how the HomeworkZone web application works, where features are located, how to use dashboard tools, navigate tabs, and configure settings.

CRITICAL ABSOLUTE BOUNDARY RULE:
• You are STRICTLY a Dashboard & App Knowledge Base Guide.
• You MUST NEVER answer, solve, or provide solutions for student homework questions, math problems, science questions, essay writing, or quiz exercises.
• If a user asks you to solve a math/science/homework question (e.g. "What is 15 x 12?", "Solve this fraction", "Write an essay for me"), you MUST DECLINE POLITELY with this response:
  "I am Zono, your HomeworkZone Dashboard Guide! 🦖 I can help you navigate the app, create exam papers, schedule assignments, and understand test reports, but I am not designed to solve homework or test questions for students."

YOUR EXCLUSIVE DOMAIN (App & Dashboard Assistance):

1. DASHBOARD NAVIGATION & FEATURES:
- Explaining where tabs are located (Dashboard, My Classes, Homework/Test Builder, Scheduler, Gradebook, Reports, Test Reports, Messages, Rewards, My Prompts, Tuition Fees, Revenue, Settings).
- How to switch active classrooms, view student profiles, and send messages to students/parents.

2. HOMEWORK & TEST BUILDER:
- Explaining how to select subjects, topics, micro-topics, set question counts, pick difficulty levels, and set time limits.
- How to use the International Exam Simulator Presets (NSW Selective, ACER, ICAS, Digital SAT, NAPLAN, UK 11+).

3. TEST REPORTS & LEADERBOARDS:
- How to view raw scores, class average percentages, standardized performance bands, item analysis, and worked logic booklets under 'Test Reports'.

4. AUTOMATED SCHEDULER:
- How teachers schedule recurring daily/weekly curriculum homework automation.

5. MY PROMPTS & ADMIN SYNCING:
- How to edit subject prompts under 'My Prompts'.
- Explaining that master admin prompts created by shilpeshpillai81@gmail.com publish to system/default_subject_prompts and sync to all teachers.

6. TUITION FEES & REVENUE:
- Explaining tuition plan setups, fee tracking, invoice statuses, and revenue analytics.

7. STUDENT PASSWORDS & MANAGEMENT:
- If asked how to reset a student password or what to do if a student forgot their password, YOU MUST ALWAYS ANSWER:
  "To reset a student's password, go to the [NAVIGATE:My Classes] tab (or Dashboard) and scroll to your Student Roster. Find the student, and click the **Key (🔑)** icon at the end of their row next to the delete button. This will reset their password, and they will be prompted to create a brand new password the next time they log in!"

DIRECTIVE ON NAVIGATION ACTION TAGS:
If appropriate to help the user locate a feature, include action tags in your response like:
[NAVIGATE:Homework/Test Builder]
[NAVIGATE:Test Reports]
[NAVIGATE:Scheduler]
[NAVIGATE:Gradebook]
[NAVIGATE:My Prompts]
[NAVIGATE:My Classes]
[NAVIGATE:Tuition Fees]
Our UI will automatically convert these tags into interactive buttons that jump the user directly to that tab!

BEHAVIOR GUIDELINES:
- SPEED & BREVITY FIRST: Be concise, direct, and fast. Give actionable answers in 2-4 short bullet points or 1-2 tight paragraphs.
- Never write lengthy essays, generic filler, or repetitive disclaimers.
- Immediately provide the exact steps and any relevant [NAVIGATE:TabName] action tags so the user can take action instantly.
- Friendly tone with monster/dino emojis (🦖, 🐾, 🧠) where appropriate.
`;

const SUGGESTED_QUESTIONS = [
  "How do I reset a student's password?",
  "How do I generate an NSW Selective practice exam?",
  "Where can I see Test Reports & Class Leaderboards?",
  "How do admin default prompts sync across teachers?",
  "What subjects and micro-topics are supported?"
];

export default function AgenticHelpAssistant({ setDashboardTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Rawr! I'm **Zono**, your HomeworkZone AI Dashboard Guide. Ask me anything about how the app works, resetting passwords, generating exam papers, or tracking test reports!"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const [customKnowledge, setCustomKnowledge] = useState(DEFAULT_ZONO_KNOWLEDGE);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const snap = await getDoc(doc(db, 'system', 'zono_knowledge'));
        if (snap.exists() && snap.data()?.text) {
          setCustomKnowledge(snap.data().text);
        }
      } catch (err) {
        console.warn("Could not load dynamic Zono knowledge, using default:", err);
      }
    };
    fetchKnowledge();
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputQuery).trim();
    if (!queryText || isThinking) return;

    // Append user message
    const newMessages = [...messages, { sender: 'user', text: queryText }];
    setMessages(newMessages);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    try {
      // Keep conversation history compact (last 4 turns) to maximize response speed
      const conversationHistory = newMessages.slice(-4).map(m => `${m.sender === 'user' ? 'User' : 'Zono'}: ${m.text}`).join('\n');

      const promptPayload = `
=== HOMEWORKZONE MASTER KNOWLEDGE BASE ===
${customKnowledge || DEFAULT_ZONO_KNOWLEDGE}

=== RECENT CONVERSATION ===
${conversationHistory}

=== USER QUESTION ===
"${queryText}"

Answer the user's question directly and concisely based on the Knowledge Base above. Include clickable action tags like [NAVIGATE:TabName] (e.g. [NAVIGATE:My Classes], [NAVIGATE:Homework/Test Builder], [NAVIGATE:Settings]) if relevant.
`;

      const responseText = await generateContent({
        prompt: promptPayload,
        systemInstruction: KNOWLEDGE_BASE_CONTEXT,
        provider: 'gemini',
        maxTokens: 800,
        temperature: 0.4
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: responseText || "I'm sorry, I couldn't fetch an answer right now. Please try asking again!"
        }
      ]);
    } catch (err) {
      console.error("Zono Help Assistant Error:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "Oops! I ran into a network hiccup while answering. Please try asking again! 🤖"
        }
      ]);
    }

    setIsThinking(false);
  };

  // Render formatted text with clickable Navigation Action Tags
  const renderMessageText = (text) => {
    if (!text) return null;

    // Regex to detect [NAVIGATE:TabName]
    const navRegex = /\[NAVIGATE:(.*?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = navRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const tabName = match[1];

      if (matchIndex > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, matchIndex) });
      }

      parts.push({ type: 'button', tabName });
      lastIndex = navRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return (
      <div className="space-y-3 leading-relaxed">
        {parts.map((part, pIdx) => {
          if (part.type === 'button') {
            return (
              <button
                key={pIdx}
                onClick={() => {
                  if (setDashboardTab) setDashboardTab(part.tabName);
                  setIsOpen(false);
                }}
                className="my-1.5 inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-600 active:scale-95 text-white font-black text-xs py-2 px-3.5 rounded-xl shadow-sm transition-all"
              >
                <Compass className="w-4 h-4 text-white" /> Open {part.tabName} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            );
          }

          // Simple Markdown formatting parser (bold, bullet points, code)
          const lines = part.content.split('\n');
          return (
            <div key={pIdx} className="space-y-1">
              {lines.map((line, lIdx) => {
                let trimmed = line.trim();
                if (!trimmed) return <div key={lIdx} className="h-1" />;

                const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
                if (isBullet) {
                  trimmed = trimmed.replace(/^[•\-]\s*/, '');
                }

                // Bold replacement **bold**
                const formattedLine = trimmed.split(/(\*\*.*?\*\*)/g).map((chunk, cIdx) => {
                  if (chunk.startsWith('**') && chunk.endsWith('**')) {
                    return <strong key={cIdx} className="font-extrabold text-slate-900">{chunk.slice(2, -2)}</strong>;
                  }
                  return chunk;
                });

                return (
                  <p key={lIdx} className={`${isBullet ? 'pl-4 relative text-slate-700' : 'text-slate-800'}`}>
                    {isBullet && <span className="absolute left-0 text-orange-500 font-bold">•</span>}
                    {formattedLine}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Bot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(prev => !prev)}
          className="bg-slate-950 hover:bg-slate-900 text-white p-4 rounded-full shadow-2xl border-2 border-orange-400/80 flex items-center gap-3 group transition-all"
          title="Ask Zono"
        >
          <div className="relative">
            <img src="/zono.jpg" className="w-9 h-9 object-cover rounded-full group-hover:rotate-12 transition-transform drop-shadow-md" alt="Zono" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <span className="font-black text-xs uppercase tracking-wider pr-1 hidden sm:inline text-slate-100">
            Ask Zono
          </span>
        </motion.button>
      </div>

      {/* Floating AI Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] h-[550px] bg-white border-2 border-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans"
          >
            {/* Top Bar Header */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md">
                  <img src="/zono.jpg" className="w-8 h-8 object-cover rounded-full drop-shadow-sm" alt="Zono" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-100 flex items-center gap-1.5">
                    Zono the Guide <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Instant System Support Agent</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Conversation Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 font-black border border-orange-200 mt-1">
                        <img src="/zono.jpg" className="w-5 h-5 object-cover rounded-full" alt="Zono" />
                      </div>
                    )}

                    <div className={`p-4 rounded-2xl max-w-[85%] border shadow-sm ${isUser ? 'bg-slate-950 text-white border-slate-950 font-medium rounded-tr-none' : 'bg-white text-slate-900 border-slate-200 rounded-tl-none'}`}>
                      {isUser ? msg.text : renderMessageText(msg.text)}
                    </div>
                  </div>
                );
              })}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="flex gap-3 items-center text-slate-500 italic font-bold text-xs p-2">
                  <span className="text-slate-500 font-bold text-xs flex items-center gap-1.5">
                    Zono is thinking... <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  </span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto flex gap-2 no-scrollbar">
              {SUGGESTED_QUESTIONS.map((q, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => handleSendMessage(q)}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200/60 rounded-full text-[10px] font-black shrink-0 transition-all active:scale-95 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-orange-500" /> {q}
                </button>
              ))}
            </div>

            {/* Input Box Footer */}
            <div className="p-3 bg-white border-t-2 border-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask how to use any feature or exam paper..."
                className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 transition-colors"
              />
              <button
                disabled={!inputQuery.trim() || isThinking}
                onClick={() => handleSendMessage()}
                className="w-10 h-10 bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-white rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-md"
              >
                <Send className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}




