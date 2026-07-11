import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';

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

export default function CurriculumModal({ isOpen, onClose, curriculumData, selectedSkills, setSelectedSkills }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

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

  const groupedData = useMemo(() => {
    if (!curriculumData) return [];
    
    // Check if data is categorised
    const hasCategories = curriculumData.some(s => s.category);
    
    let filtered = curriculumData;
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (hasCategories) {
      const groups = {};
      filtered.forEach(skill => {
        if (skill.category) {
          // Strip out IXL's alphabetical prefixes like "A. ", "AA. ", "Z. " directly from the object
          skill.category = skill.category.replace(/^[A-Z]{1,2}\.\s+/, '');
        }
        let cat = skill.category || "Other";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(skill);
      });
      return Object.entries(groups).map(([category, skills]) => ({ category, skills }));
    } else {
      return [{ category: "All Skills", skills: filtered }];
    }
  }, [curriculumData, searchTerm]);

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
          <div className="p-8 border-b-2 border-slate-100 flex items-center justify-between bg-amber-50">
            <div>
              <h2 className="text-4xl font-black text-rose-500 drop-shadow-sm tracking-tight">Discover Topics</h2>
              <p className="text-base font-bold text-amber-700 mt-2">Pick the perfect skills for your next adventure! ✨</p>
            </div>
            <button 
              onClick={onClose}
              className="w-14 h-14 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-110 hover:rotate-90 transition-all duration-300 shadow-sm"
            >
              <X className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 bg-amber-50/50 border-b-2 border-slate-50">
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
                <div className="text-slate-400 mt-2 font-bold">Try searching for something else.</div>
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
                                    className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all ${isSelected ? theme.skillSelected : theme.skillHover}`}
                                  >
                                    <div className={`w-6 h-6 rounded-lg border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${isSelected ? `${theme.checkBg} ${theme.checkBorder}` : `bg-white ${theme.border}`}`}>
                                      {isSelected && <Check className="w-4 h-4 text-white stroke-[4]" />}
                                    </div>
                                    <span className={`text-base font-bold ${isSelected ? theme.text : 'text-slate-500'}`}>{skill.title}</span>
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
          <div className="p-6 border-t-4 border-slate-100 flex items-center justify-between bg-white">
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
