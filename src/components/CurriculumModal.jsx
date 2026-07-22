import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Search, ChevronDown, ChevronUp, Plus, Trash2, Sparkles } from 'lucide-react';

const getTheme = (idx) => {
  const themes = [
    { bg: 'bg-rose-50', headerBg: 'bg-rose-100', text: 'text-rose-800', textMuted: 'text-rose-600', border: 'border-rose-200', checkBg: 'bg-rose-500', checkBorder: 'border-rose-500', skillHover: 'hover:bg-rose-100/50', skillSelected: 'bg-rose-100/80 text-rose-900' },
    { bg: 'bg-amber-50', headerBg: 'bg-amber-100', text: 'text-amber-800', textMuted: 'text-amber-600', border: 'border-amber-200', checkBg: 'bg-amber-500', checkBorder: 'border-amber-500', skillHover: 'hover:bg-amber-100/50', skillSelected: 'bg-amber-100/80 text-amber-900' },
    { bg: 'bg-emerald-50', headerBg: 'bg-emerald-100', text: 'text-emerald-800', textMuted: 'text-emerald-600', border: 'border-emerald-200', checkBg: 'bg-emerald-500', checkBorder: 'border-emerald-500', skillHover: 'hover:bg-emerald-100/50', skillSelected: 'bg-emerald-100/80 text-emerald-900' },
    { bg: 'bg-fuchsia-50', headerBg: 'bg-fuchsia-100', text: 'text-fuchsia-800', textMuted: 'text-fuchsia-600', border: 'border-fuchsia-200', checkBg: 'bg-fuchsia-500', checkBorder: 'border-fuchsia-500', skillHover: 'hover:bg-fuchsia-100/50', skillSelected: 'bg-fuchsia-100/80 text-fuchsia-900' },
    { bg: 'bg-orange-50', headerBg: 'bg-orange-100', text: 'text-orange-800', textMuted: 'text-orange-600', border: 'border-orange-200', checkBg: 'bg-orange-500', checkBorder: 'border-orange-500', skillHover: 'hover:bg-orange-100/50', skillSelected: 'bg-orange-100/80 text-orange-900' },
  ];
  return themes[idx % themes.length];
};

export default function CurriculumModal({
  isOpen,
  onClose,
  curriculumData,
  selectedSkills,
  setSelectedSkills,
  customTopics = [],
  onAddCustomTopic,
  onDeleteCustomTopic
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => {
      const isSelected = prev.some(s => s.id === skill.id);
      if (isSelected) return prev.filter(s => s.id !== skill.id);
      return [...prev, skill];
    });
  };

  const handleSelectCategory = (category, categorySkills, selectAll) => {
    if (selectAll) {
      setSelectedSkills(prev => {
        const newSkills = [...prev];
        categorySkills.forEach(s => {
          if (!newSkills.some(ns => ns.id === s.id)) newSkills.push(s);
        });
        return newSkills;
      });
    } else {
      setSelectedSkills(prev => prev.filter(s => s.category !== category));
    }
  };

  // Collect available category names from standard curriculum
  const availableCategories = useMemo(() => {
    const cats = new Set();
    if (curriculumData && Array.isArray(curriculumData)) {
      curriculumData.forEach(s => {
        if (s.category) {
          cats.add(s.category.replace(/^[A-Z]{1,2}\.\s+/, ''));
        }
      });
    }
    return Array.from(cats).sort();
  }, [curriculumData]);

  const handleSaveCustomTopic = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let targetCat = newCategory;
    if (newCategory === '__new__' && customCategoryInput.trim()) {
      targetCat = customCategoryInput.trim();
    }
    if (!targetCat) {
      targetCat = 'Custom Topics';
    }

    const newSkill = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newTitle.trim(),
      category: targetCat,
      isCustom: true
    };

    if (typeof onAddCustomTopic === 'function') {
      onAddCustomTopic(newSkill);
    }

    // Auto select newly created topic
    setSelectedSkills(prev => [...prev, newSkill]);

    // Reset form state
    setNewTitle('');
    setNewCategory('');
    setCustomCategoryInput('');
    setShowAddForm(false);
  };

  const groupedData = useMemo(() => {
    const combinedData = [
      ...(curriculumData || []),
      ...(customTopics || []).map(ct => ({ ...ct, isCustom: true }))
    ];

    if (combinedData.length === 0) return [];
    
    // Check if data is categorised
    const hasCategories = combinedData.some(s => s.category);
    
    let filtered = combinedData;
    if (searchTerm) {
      filtered = filtered.filter(s => 
        (s.title && s.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (hasCategories) {
      const groups = {};
      filtered.forEach(skill => {
        let cat = skill.category || "Other";
        if (skill.category && !skill.isCustom) {
          // Strip out IXL's alphabetical prefixes like "A. ", "AA. ", "Z. "
          cat = skill.category.replace(/^[A-Z]{1,2}\.\s+/, '');
        }
        if (!groups[cat]) groups[cat] = [];
        // Avoid duplicate ID injection if custom topic shares ID
        if (!groups[cat].some(existing => existing.id === skill.id)) {
          groups[cat].push(skill);
        }
      });
      return Object.entries(groups).map(([category, skills]) => ({ category, skills }));
    } else {
      return [{ category: "All Skills", skills: filtered }];
    }
  }, [curriculumData, customTopics, searchTerm]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/30 backdrop-blur-md"
      >
        <motion.div 
          initial={{ y: 50, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-[40px] shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border-4 border-white"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b-2 border-slate-100 flex items-center justify-between bg-amber-50 shrink-0">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-rose-500 drop-shadow-sm tracking-tight">Discover Topics</h2>
              <p className="text-sm md:text-base font-bold text-amber-700 mt-1">Pick or add custom skills for your child's next activity! ✨</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddForm(prev => !prev)}
                className="px-4 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-md"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>{showAddForm ? "Close Form" : "Add Custom Topic"}</span>
              </button>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-110 hover:rotate-90 transition-all duration-300 shadow-sm"
              >
                <X className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Add Custom Topic Form Drawer */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-rose-50/70 border-b-4 border-rose-200 shrink-0"
              >
                <form onSubmit={handleSaveCustomTopic} className="p-6 max-w-3xl mx-auto space-y-4">
                  <div className="flex items-center gap-2 text-rose-700 font-black text-lg">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Create Custom Skill / Topic</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Topic Title <span className="text-rose-500">*</span></label>
                      <input 
                        type="text"
                        placeholder="e.g. Solar System & Planets, Money Word Problems..."
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full bg-white border-2 border-rose-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Category <span className="text-rose-500">*</span></label>
                      <select 
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        className="w-full bg-white border-2 border-rose-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                      >
                        <option value="">Select Existing Category...</option>
                        {availableCategories.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                        <option value="__new__">+ Create New Category</option>
                      </select>
                    </div>
                  </div>

                  {newCategory === '__new__' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">New Category Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Science Projects, Creative Writing..."
                        value={customCategoryInput}
                        onChange={e => setCustomCategoryInput(e.target.value)}
                        className="w-full bg-white border-2 border-rose-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-200/50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-black text-sm text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200"
                    >
                      Save Topic
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          <div className="p-6 bg-amber-50/50 border-b-2 border-slate-50 shrink-0">
            <div className="relative max-w-3xl mx-auto">
              <input 
                type="text"
                placeholder="Search for something fun..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border-4 border-amber-200 rounded-3xl py-4 pl-14 pr-6 text-lg font-bold text-slate-600 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all shadow-sm placeholder:text-slate-300"
              />
              <Search className="w-6 h-6 text-amber-400 absolute left-5 top-1/2 -translate-y-1/2 stroke-[3]" />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar">
            {groupedData.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <div className="text-2xl text-slate-400 font-black">Oops! No skills found.</div>
                <div className="text-slate-400 mt-2 font-bold">Try searching for something else or add a custom topic above!</div>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 gap-6 space-y-6">
                {groupedData.map((group, idx) => {
                  const theme = getTheme(idx);
                  const isExpanded = expandedCategories[group.category];
                  const selectedInGroup = group.skills.filter(s => selectedSkills.some(sel => sel.id === s.id)).length;
                  const isAllSelected = selectedInGroup === group.skills.length && group.skills.length > 0;

                  return (
                    <div key={idx} className={`break-inside-avoid bg-white rounded-[32px] border-4 ${theme.border} overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md`}>
                      <div 
                        className={`flex items-center justify-between p-5 ${theme.headerBg} cursor-pointer transition-colors`} 
                        onClick={() => toggleCategory(group.category)}
                      >
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSelectCategory(group.category, group.skills, !isAllSelected); }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center border-4 shrink-0 transition-all ${isAllSelected ? `${theme.checkBg} ${theme.checkBorder}` : `bg-white ${theme.border}`}`}
                          >
                            {isAllSelected && <Check className="w-5 h-5 text-white stroke-[4]" />}
                          </button>
                          <div>
                            <h3 className={`font-black ${theme.text} text-lg leading-tight`}>{group.category}</h3>
                            <p className={`text-xs font-bold ${theme.textMuted} mt-1 uppercase tracking-wider`}>{group.skills.length} skills • {selectedInGroup} selected</p>
                          </div>
                        </div>
                        <div className={`${theme.textMuted} shrink-0 bg-white/50 p-2 rounded-full`}>
                          {isExpanded ? <ChevronUp className="w-5 h-5 stroke-[3]" /> : <ChevronDown className="w-5 h-5 stroke-[3]" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white"
                          >
                            <div className="p-3 space-y-1">
                              {group.skills.map(skill => {
                                const isSelected = selectedSkills.some(s => s.id === skill.id);
                                return (
                                  <div 
                                    key={skill.id}
                                    onClick={() => toggleSkill(skill)}
                                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${isSelected ? theme.skillSelected : theme.skillHover}`}
                                  >
                                    <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
                                      <div className={`w-6 h-6 rounded-lg border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${isSelected ? `${theme.checkBg} ${theme.checkBorder}` : `bg-white ${theme.border}`}`}>
                                        {isSelected && <Check className="w-4 h-4 text-white stroke-[4]" />}
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-base font-bold ${isSelected ? theme.text : 'text-slate-500'}`}>{skill.title}</span>
                                        {skill.isCustom && (
                                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-200">
                                            ✨ Custom
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {skill.isCustom && typeof onDeleteCustomTopic === 'function' && (
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteCustomTopic(skill.id);
                                          setSelectedSkills(prev => prev.filter(s => s.id !== skill.id));
                                        }}
                                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                                        title="Delete Custom Topic"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t-4 border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl font-black text-emerald-600">{selectedSkills.length}</span>
              </div>
              <span className="text-lg font-bold text-slate-400">skills ready!</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setSelectedSkills([])} className="px-6 py-4 rounded-2xl text-base font-bold text-rose-400 bg-rose-50 hover:bg-rose-100 transition-colors">Clear All</button>
              <button onClick={onClose} className="px-10 py-4 rounded-2xl text-lg font-black text-white bg-emerald-500 hover:bg-emerald-600 hover:scale-105 shadow-lg shadow-emerald-200 transition-all">Done!</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
