import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  PenTool, 
  BookOpen, 
  Send, 
  RefreshCcw, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  History, 
  Trash2, 
  PlusCircle, 
  ExternalLink, 
  Printer, 
  Bookmark, 
  Clock, 
  X, 
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { generateContent, getModelForGrade } from '../../utils/aiClient';
import { WRITING_GENRES, synthesizeExemplarFallback } from '../../data/writingTemplates';
import VisualFeedbackCard from './VisualFeedbackCard';
import { db } from '../../firebase';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';

const STORAGE_KEY_HISTORY = 'hwz_saved_essays_history';
const STORAGE_KEY_LAST_SESSION = 'hwz_last_writing_session';

const SAMPLE_DRAFTS = {
  persuasive: {
    topic: "Should we go to Japan after my 10th Birthday?",
    draft: `Should we go to Japan after my 10th Birthday?

In my opinions I think we should go to Japan after my 10th Birthday.

1. Firstly, We shoud go to Japan after my 10th birthday because after my 10th birthday I can go on holiday and finally get to rest how much I want to.

2. Secondly, We should go to Japan because we will have a nice time there and go to many nice places.

3. Finally, Going to Japan is a good choice because we can have very nice food there and it would be yummy.

Conclusion: The above reasons conclude that we should go to Japan after my 10th birthday.`
  },
  narrative: {
    topic: "The Mysterious Map Found in the Attic",
    draft: `One rainy day I was bored so I went up to the dark attic. I found an old wooden chest under a dusty blanket. Inside it was a rolled up map with weird symbols on it.

Suddenly the map started glowing blue! I was scared but I touched it anyway. The floor shook and a trapdoor opened underneath me.

I fell down into a hidden cave system under our house. There was a glowing key on a stone pedestal. I grabbed it and ran back up the stairs. It was the best adventure ever.`
  },
  informative: {
    topic: "Why Honeybees Are Important to Humans",
    draft: `Honeybees are small insects that live in hives. They make honey from flower nectar.

Bees are very important because they pollinate crops. When bees visit flowers they move pollen from one plant to another. Without bees many fruits and vegetables would not grow.

In conclusion, bees make yummy honey and help farmers grow food so we must protect them.`
  },
  essay: {
    topic: "Analyze how technology impacts human relationships",
    draft: `Technology has become very common in modern society. People use smartphones and social media every day to communicate with friends and family.

On one hand, smartphones allow people to stay in touch across long distances. You can video call someone on the other side of the world instantly.

However, spending too much screen time reduces face-to-face interaction. People often stare at their phones during dinner instead of talking to each other.

Therefore, technology has both good and bad effects on human relationships and we should use it wisely.`
  }
};

export default function WritingAnalyzer() {
  const [genreKey, setGenreKey] = useState('persuasive');
  const [grade, setGrade] = useState('Grade 5');
  const [topic, setTopic] = useState(SAMPLE_DRAFTS.persuasive.topic);
  const [studentDraft, setStudentDraft] = useState(SAMPLE_DRAFTS.persuasive.draft);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [savedHistory, setSavedHistory] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');

  const activeGenre = WRITING_GENRES[genreKey] || WRITING_GENRES.persuasive;

  // 1. On Mount: Load saved history and restore last session if available
  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
      setSavedHistory(storedHistory);

      const lastSession = JSON.parse(localStorage.getItem(STORAGE_KEY_LAST_SESSION) || 'null');
      if (lastSession && lastSession.analysisData) {
        setTopic(lastSession.topic || '');
        setStudentDraft(lastSession.studentDraft || '');
        setGenreKey(lastSession.genreKey || 'persuasive');
        setGrade(lastSession.grade || 'Grade 5');
        setAnalysisData(lastSession.analysisData);
      } else if (storedHistory.length > 0) {
        // If last session wasn't explicitly set, restore the most recent saved essay
        const latest = storedHistory[0];
        setTopic(latest.topic || '');
        setStudentDraft(latest.studentDraft || '');
        setGenreKey(latest.genreKey || 'persuasive');
        setGrade(latest.grade || 'Grade 5');
        setAnalysisData(latest.analysisData);
      }
    } catch (e) {
      console.warn("Error restoring writing history:", e);
    }
  }, []);

  // Save new essay to history & persist
  const saveEssayToHistory = async (finalAnalysisData) => {
    const newEntry = {
      id: `essay_${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-AU', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      topic: topic.trim() || 'Untitled Writing Piece',
      genreKey,
      genreName: activeGenre.name,
      grade,
      studentDraft,
      analysisData: finalAnalysisData
    };

    // Update local state and localStorage
    const updatedHistory = [newEntry, ...savedHistory.filter(item => item.id !== newEntry.id)].slice(0, 50);
    setSavedHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
      localStorage.setItem(STORAGE_KEY_LAST_SESSION, JSON.stringify(newEntry));
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }

    // Cloud backup sync if student is logged in
    try {
      const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student') || 'null');
      if (savedStudent?.teacher?.uid && savedStudent?.classroom?.id && savedStudent?.name) {
        const studentRef = doc(
          db, 
          'teachers', 
          savedStudent.teacher.uid, 
          'classrooms', 
          savedStudent.classroom.id, 
          'students', 
          savedStudent.name.toLowerCase().trim()
        );
        await setDoc(studentRef, {
          savedWritingSummaries: arrayUnion({
            id: newEntry.id,
            timestamp: newEntry.timestamp,
            dateStr: newEntry.dateStr,
            topic: newEntry.topic,
            genreKey: newEntry.genreKey,
            grade: newEntry.grade
          })
        }, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore sync skipped:", err);
    }
  };

  // Load a saved essay from history
  const handleLoadSavedEssay = (item) => {
    setTopic(item.topic || '');
    setStudentDraft(item.studentDraft || '');
    setGenreKey(item.genreKey || 'persuasive');
    setGrade(item.grade || 'Grade 5');
    setAnalysisData(item.analysisData || null);
    setIsHistoryModalOpen(false);

    try {
      localStorage.setItem(STORAGE_KEY_LAST_SESSION, JSON.stringify(item));
    } catch (e) {}
  };

  // Delete a saved essay from history
  const handleDeleteSavedEssay = (id, e) => {
    e.stopPropagation();
    const updated = savedHistory.filter(item => item.id !== id);
    setSavedHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch (err) {}
  };

  // Start fresh essay
  const handleStartNewEssay = () => {
    setTopic('');
    setStudentDraft('');
    setAnalysisData(null);
    setErrorMsg(null);
    try {
      localStorage.removeItem(STORAGE_KEY_LAST_SESSION);
    } catch (e) {}
  };

  // Handle genre change
  const handleGenreChange = (key) => {
    setGenreKey(key);
    if (!analysisData && SAMPLE_DRAFTS[key]) {
      setTopic(SAMPLE_DRAFTS[key].topic);
      setStudentDraft(SAMPLE_DRAFTS[key].draft);
    }
  };

  // Run analysis
  const handleAnalyze = async () => {
    if (!studentDraft.trim()) {
      setErrorMsg("Please type or paste your writing draft first!");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    const systemInstruction = `You are an expert English Writing & Essay Assessor. Analyze student writing drafts and generate an upgraded exemplar version, targeted callouts, checklist evaluations, and vocabulary upgrades.
Output STRICT JSON matching this schema:
{
  "improvedTitle": "string",
  "exemplarParagraphs": ["string (upgraded paragraphs corresponding to student draft)"],
  "annotations": [
    { "paraIndex": number, "targetText": "string", "label": "string", "color": "green|blue|purple|rose" }
  ],
  "diagnosticChecks": {
    "ideasContent": [boolean, boolean, boolean],
    "sentenceStructure": [boolean, boolean, boolean],
    "vocabulary": [boolean, boolean],
    "organisation": [boolean, boolean, boolean]
  },
  "wordReplacements": [
    { "weakWord": "string", "replacements": ["string", "string"] }
  ],
  "customStarters": ["string (3-5 topic-tailored sentence starters)"],
  "customLinkingWords": {
    "adding": ["string"],
    "explaining": ["string"],
    "contrasting": ["string"]
  }
}`;

    const prompt = `Target Grade: ${grade}
Writing Structure/Genre: ${activeGenre.name} (${activeGenre.id})
Topic: ${topic}

Student Submission:
"""
${studentDraft}
"""

Analyze this draft for Grade ${grade} standards. Provide:
1. An improved, highly polished exemplar version of the student's text.
2. Annotations highlighting specific upgrades (opening statement, specific reasons/actions, better details/examples, stronger words, powerful conclusion).
3. Boolean checklist evaluations matching category item counts (${activeGenre.checklistCategories.map(c => `${c.id}:${c.items.length}`).join(', ')}).
4. 3-4 weak or repetitive words found in the student draft with 2-3 strong synonym replacements.
5. 4 dynamic, topic-tailored sentence starters and transition words.`;

    try {
      // Use Google Gemini Flash across all writing formats (Persuasive, Narrative, Informative, and Essays)
      const providerModel = 'gemini';
      const responseText = await generateContent({
        prompt,
        systemInstruction,
        responseMimeType: 'application/json',
        provider: providerModel
      });

      const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonStr);
      setAnalysisData(parsedData);
      saveEssayToHistory(parsedData);
    } catch (err) {
      console.warn("Live AI endpoint unavailable, generating intelligent local exemplar:", err);
      const fallbackResult = synthesizeExemplarFallback(topic, studentDraft, genreKey, grade);
      setAnalysisData(fallbackResult);
      saveEssayToHistory(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredHistory = savedHistory.filter(item => {
    if (historyFilter === 'all') return true;
    return item.genreKey === historyFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-500/20 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Writing & Essay Studio
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Make Your Writing Shine! 🌟
            </h1>
            <p className="text-indigo-200 text-xs md:text-sm font-medium">
              Write your story, persuasive piece, or essay below and click the button to see great examples, helpful tips, and smart word upgrades!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Saved Essays Button */}
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center gap-2 border border-white/20 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <FolderOpen className="w-4 h-4 text-yellow-400" />
              <span>Saved Essays ({savedHistory.length})</span>
            </button>

            {/* New Essay Button */}
            <button
              onClick={handleStartNewEssay}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Piece</span>
            </button>

            {/* Grade Selector */}
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-slate-300">Grade:</span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="bg-indigo-950 text-yellow-300 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-yellow-400/40 focus:outline-none cursor-pointer"
              >
                {['Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Genre Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          {Object.keys(WRITING_GENRES).map((key) => {
            const g = WRITING_GENRES[key];
            const isActive = genreKey === key;
            return (
              <button
                key={key}
                onClick={() => handleGenreChange(key)}
                className={`p-3 rounded-2xl font-extrabold text-xs md:text-sm flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-yellow-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                <span className="text-xl">{g.icon}</span>
                <span>{g.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Input Form Section */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600" />
            <span>Student Submission ({grade})</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {activeGenre.badge}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-1">
              Writing Topic / Prompt Title:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Should we go to Japan after my 10th Birthday?"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-1">
              Student Draft Text:
            </label>
            <textarea
              rows={6}
              value={studentDraft}
              onChange={(e) => setStudentDraft(e.target.value)}
              placeholder="Type or paste student draft text here..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-serif text-sm md:text-base text-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (SAMPLE_DRAFTS[genreKey]) {
                setTopic(SAMPLE_DRAFTS[genreKey].topic);
                setStudentDraft(SAMPLE_DRAFTS[genreKey].draft);
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Load Sample Draft</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" />
                <span>Checking & Leveling Up Your Writing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Check & Level-Up My Writing! ✨</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Visual Feedback Output Card */}
      {analysisData && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <span>Your Level-Up Feedback Card</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer border border-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print / Save PDF</span>
              </button>
              <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-300 flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-indigo-600" /> Saved Automatically
              </span>
            </div>
          </div>

          <VisualFeedbackCard
            studentDraft={studentDraft}
            analysisData={analysisData}
            genreKey={genreKey}
            grade={grade}
          />
        </div>
      )}

      {/* 4. Saved Essays History Modal */}
      {isHistoryModalOpen && (
        <div 
          onClick={() => setIsHistoryModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-yellow-300 shadow-md">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">Saved Essays & Exemplar Reports</h3>
                  <p className="text-slate-400 text-xs font-medium">
                    All previously analyzed pieces are preserved here. Click any piece to reopen.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filter Tabs */}
            <div className="flex gap-2 p-4 bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: `All Pieces (${savedHistory.length})` },
                { id: 'persuasive', label: 'Persuasive' },
                { id: 'narrative', label: 'Narrative' },
                { id: 'informative', label: 'Informative' },
                { id: 'essay', label: 'Essays' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setHistoryFilter(f.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all whitespace-nowrap ${
                    historyFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Modal History List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-4xl">📝</div>
                  <h4 className="text-base font-black text-slate-700">No Saved Essays Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you analyze writing drafts, they will automatically be preserved here so you can revisit them anytime!
                  </p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadSavedEssay(item)}
                    className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                          {item.grade}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {item.genreName || item.genreKey}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.dateStr}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.topic}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1 font-serif">
                        {item.studentDraft}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleLoadSavedEssay(item)}
                        className="px-4 py-2 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSavedEssay(item.id, e)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Saved Essay"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-600">
              <span>{savedHistory.length} total saved reports stored securely</span>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
