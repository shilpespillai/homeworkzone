import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  X, 
  Printer, 
  Image as ImageIcon,
  Sparkles,
  Move,
  RotateCcw,
  FolderTree,
  Eye,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { 
  ENGLISH_INFOGRAPHIC_DOMAINS, 
  ENGLISH_INFOGRAPHICS 
} from '../data/englishInfographicsData';

export default function EnglishKnowledgeTree({ selectedTopicName }) {
  // Tree state
  const [activeDomainId, setActiveDomainId] = useState('foundations'); // which branch to expand below, or 'all'
  const [treeZoom, setTreeZoom] = useState(1);
  
  // Independent Lightbox State (No box, freeform zoom & drag-to-pan)
  const [activeImageTopic, setActiveImageTopic] = useState(null);
  const [imgZoom, setImgZoom] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Map topics by domain
  const topicsByDomain = React.useMemo(() => {
    const map = {};
    ENGLISH_INFOGRAPHIC_DOMAINS.forEach(d => {
      map[d.id] = ENGLISH_INFOGRAPHICS.filter(t => t.domainId === d.id);
    });
    return map;
  }, []);

  const totalReadyCount = React.useMemo(() => {
    return ENGLISH_INFOGRAPHICS.filter(i => Boolean(i.imageSrc)).length;
  }, []);

  // Open independent image
  const openImage = (topic) => {
    if (topic.imageSrc) {
      setImgZoom(1);
      setPanPos({ x: 0, y: 0 });
      setActiveImageTopic(topic);
    }
  };

  const closeImage = () => {
    setActiveImageTopic(null);
    setImgZoom(1);
    setPanPos({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Drag-to-pan handlers for independent lightbox
  const handleMouseDown = (e) => {
    if (imgZoom > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - panPos.x,
        y: e.clientY - panPos.y
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && imgZoom > 1) {
      setPanPos({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation for image lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeImageTopic) {
        closeImage();
      }
      if (activeImageTopic) {
        if (e.key === '+' || e.key === '=') {
          setImgZoom(prev => Math.min(3.5, prev + 0.25));
        } else if (e.key === '-') {
          setImgZoom(prev => Math.max(0.6, prev - 0.25));
        } else if (e.key === '0') {
          setImgZoom(1);
          setPanPos({ x: 0, y: 0 });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageTopic]);

  return (
    <div className="space-y-6 max-w-full mx-auto animate-in fade-in duration-300 font-sans">
      {/* Top Controls Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider mb-1">
            <FolderTree className="w-3.5 h-3.5" /> Hierarchical Knowledge Flowchart
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🌳</span> English Knowledge Tree
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Flowchart node tree. Click any node with a <span className="text-blue-600 font-bold">🖼️ Poster badge</span> to view the independent infographic full screen.
          </p>
        </div>

        {/* Tree Zoom & Branch Quick Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveDomainId('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeDomainId === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All 7 Branches
            </button>
            {ENGLISH_INFOGRAPHIC_DOMAINS.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveDomainId(d.id)}
                className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  activeDomainId === d.id
                    ? 'bg-slate-900 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{d.icon}</span>
                <span className="hidden xl:inline">L{d.levelNumber}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1 border border-slate-200">
            <button
              onClick={() => setTreeZoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
              className="p-1.5 hover:bg-white rounded-xl text-slate-700 transition-colors cursor-pointer"
              title="Zoom Tree Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold px-1.5 text-slate-700 min-w-[40px] text-center">
              {Math.round(treeZoom * 100)}%
            </span>
            <button
              onClick={() => setTreeZoom(prev => Math.min(1.5, Number((prev + 0.1).toFixed(1))))}
              className="p-1.5 hover:bg-white rounded-xl text-slate-700 transition-colors cursor-pointer"
              title="Zoom Tree In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTreeZoom(1)}
              className="text-[10px] font-black px-2 py-1 hover:bg-white rounded-xl text-slate-600 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* --- PANORAMIC EXACT FLOWCHART TREE CANVAS --- */}
      <div className="bg-white rounded-[32px] border-2 border-slate-200 shadow-sm p-6 sm:p-10 overflow-x-auto min-h-[640px]">
        <div 
          className="transition-transform duration-150 origin-top-left inline-block min-w-max pb-20 pt-4 px-8"
          style={{ transform: `scale(${treeZoom})` }}
        >
          {/* LEVEL 0: ROOT NODE */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900 text-white px-8 py-3 rounded-xl shadow-md border-2 border-slate-700 flex items-center gap-3">
              <span className="text-xl">🌳</span>
              <span className="text-sm font-black tracking-wider uppercase">English Knowledge Tree</span>
              <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                7 Domains • 54 Topics
              </span>
            </div>
          </div>

          {/* SVG ORTHOGONAL CROSSBAR FROM ROOT TO THE 7 DOMAINS */}
          <div className="relative w-full flex justify-center mb-8">
            <div className="w-[96%] h-6 relative">
              {/* Vertical line from root */}
              <div className="absolute left-1/2 -top-8 w-0.5 h-8 bg-slate-400 -translate-x-1/2" />
              {/* Horizontal crossbar spanning across all 7 domains */}
              <div className="w-full h-0.5 bg-slate-400 absolute top-0" />
            </div>
          </div>

          {/* LEVEL 1: THE 7 DOMAIN BRANCHES */}
          <div className="grid grid-cols-7 gap-6 sm:gap-8 relative">
            {ENGLISH_INFOGRAPHIC_DOMAINS.map((domain) => {
              const isSelected = activeDomainId === 'all' || activeDomainId === domain.id;
              const topics = topicsByDomain[domain.id] || [];
              const readyCount = topics.filter(t => Boolean(t.imageSrc)).length;

              return (
                <div 
                  key={domain.id} 
                  className={`flex flex-col items-center transition-all ${
                    isSelected ? 'opacity-100' : 'opacity-35'
                  }`}
                  style={{ minWidth: '220px' }}
                >
                  {/* Vertical drop line from horizontal spine to domain node */}
                  <div className="w-0.5 h-6 bg-slate-400 -mt-8 mb-2" />

                  {/* Domain Node Box (Level 1) */}
                  <div 
                    onClick={() => setActiveDomainId(activeDomainId === domain.id ? 'all' : domain.id)}
                    className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-2 shadow-sm cursor-pointer ${
                      activeDomainId === domain.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-4 ring-slate-200'
                        : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{domain.icon}</span>
                      <div className="truncate text-left">
                        <p className="text-[9px] font-black uppercase opacity-75">Branch {domain.levelNumber}</p>
                        <p className="text-xs font-black truncate">{domain.title}</p>
                      </div>
                    </div>
                    {readyCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[9px] font-black shrink-0">
                        {readyCount} 🖼️
                      </span>
                    )}
                  </div>

                  {/* Vertical drop line from domain node to children stem */}
                  <div className="w-0.5 h-6 bg-slate-400 my-1" />

                  {/* LEVEL 2: TOPIC NODES STEM & LEAVES */}
                  <div className="w-full pl-4 border-l-2 border-slate-300 space-y-2.5 relative mt-1">
                    {topics.map((topic) => {
                      const hasImage = Boolean(topic.imageSrc);

                      return (
                        <div key={topic.id} className="relative group">
                          {/* Horizontal connector stem from vertical spine */}
                          <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-slate-300 -translate-y-1/2" />

                          {/* Topic Node Box */}
                          <div
                            onClick={() => openImage(topic)}
                            className={`p-2.5 px-3 rounded-xl border transition-all flex items-center justify-between gap-2 text-left select-none ${
                              hasImage
                                ? 'bg-white border-blue-500 shadow-sm hover:shadow-lg hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer scale-100 hover:scale-[1.03]'
                                : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {topic.topicNumber}
                              </span>
                              <span className="text-[11px] font-bold text-slate-800 truncate">
                                {topic.title}
                              </span>
                            </div>

                            {hasImage && (
                              <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-sm">
                                <ImageIcon className="w-2.5 h-2.5" /> Poster
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* --- FULL-SCREEN INDEPENDENT IMAGE VIEWER (NO BOX CONTAINER / FREEFORM) --- */}
      {/* ========================================================================= */}
      {activeImageTopic && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg select-none overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Floating Top Header Controls Bar (Floating pill, not attached to any box) */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/90 text-white px-5 py-2.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 pr-2 border-r border-white/20">
              <span className="text-xs font-black px-2 py-0.5 bg-blue-600 rounded-md text-white">
                {activeImageTopic.topicNumber}
              </span>
              <span className="text-xs font-bold text-white max-w-[200px] sm:max-w-xs truncate">
                {activeImageTopic.title}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setImgZoom(prev => Math.max(0.5, Number((prev - 0.25).toFixed(2))))}
                className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold px-1 min-w-[44px] text-center text-amber-300">
                {Math.round(imgZoom * 100)}%
              </span>
              <button
                onClick={() => setImgZoom(prev => Math.min(3.5, Number((prev + 0.25).toFixed(2))))}
                className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setImgZoom(1); setPanPos({ x: 0, y: 0 }); }}
                className="text-[10px] font-black px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-full text-slate-200 cursor-pointer ml-1"
                title="Reset View (0)"
              >
                Reset
              </button>
            </div>

            {/* Print & Close */}
            <div className="flex items-center gap-1 pl-2 border-l border-white/20">
              <button
                onClick={() => window.print()}
                className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                title="Print Infographic"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={closeImage}
                className="p-1.5 bg-rose-600 hover:bg-rose-500 rounded-full text-white transition-colors cursor-pointer ml-1"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Instructions Bottom Pill */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-[11px] font-bold text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full border border-white/10 pointer-events-none backdrop-blur-sm">
            Drag to pan when zoomed • Scroll to zoom • Press Esc to close
          </div>

          {/* THE RAW INDEPENDENT IMAGE (NO BOX / CONTAINER) */}
          <div 
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
              cursor: imgZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            <img
              src={activeImageTopic.imageSrc}
              alt={activeImageTopic.title}
              draggable={false}
              className="max-w-[92vw] max-h-[90vh] object-contain transition-transform duration-75 shadow-2xl rounded-lg"
              style={{
                transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${imgZoom})`,
                transformOrigin: 'center center'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
