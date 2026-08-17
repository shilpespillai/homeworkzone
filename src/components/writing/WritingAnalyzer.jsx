import React, { useState } from 'react';
import { Sparkles, PenTool, BookOpen, Send, RefreshCcw, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { generateContent, getModelForGrade } from '../../utils/aiClient';
import { WRITING_GENRES, synthesizeExemplarFallback } from '../../data/writingTemplates';
import VisualFeedbackCard from './VisualFeedbackCard';

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

  const activeGenre = WRITING_GENRES[genreKey] || WRITING_GENRES.persuasive;

  // Handle genre change
  const handleGenreChange = (key) => {
    setGenreKey(key);
    if (SAMPLE_DRAFTS[key]) {
      setTopic(SAMPLE_DRAFTS[key].topic);
      setStudentDraft(SAMPLE_DRAFTS[key].draft);
    }
  };

  // Run AI analysis
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
      // Use Gemini Flash for Narrative, and grade-tiered routing for other genres
      const providerModel = genreKey === 'narrative' ? 'gemini' : getModelForGrade(grade, 'English', 'anthropic');
      const responseText = await generateContent({
        prompt,
        systemInstruction,
        responseMimeType: 'application/json',
        provider: providerModel
      });

      // Clean up markdown codeblocks if returned
      const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonStr);
      setAnalysisData(parsedData);
    } catch (err) {
      console.warn("Live AI endpoint unavailable, generating intelligent local exemplar:", err);
      const fallbackResult = synthesizeExemplarFallback(topic, studentDraft, genreKey, grade);
      setAnalysisData(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-500/20 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Writing & Essay Studio
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Visual Writing Analysis & Exemplar Card
            </h1>
            <p className="text-indigo-200 text-xs md:text-sm font-medium">
              Submit your creative story, persuasive piece, informative report, or academic essay to receive an interactive visual exemplar report instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-slate-300">Grade Level:</span>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="bg-indigo-950 text-yellow-300 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-yellow-400/40 focus:outline-none cursor-pointer"
            >
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
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

      {/* Input Form Section */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600" />
            <span>Student Submission ({grade})</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {activeGenre.badge}
          </span>
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

        <div className="flex justify-between items-center pt-2">
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
                <span>Analyzing Writing & Formatting Exemplar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Generate Visual Exemplar Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Feedback Output Card */}
      {analysisData && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <span>Generated Exemplar Feedback Card</span>
            </h2>
            <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Interactive Feedback Card
            </span>
          </div>

          <VisualFeedbackCard
            studentDraft={studentDraft}
            analysisData={analysisData}
            genreKey={genreKey}
            grade={grade}
          />
        </div>
      )}
    </div>
  );
}
