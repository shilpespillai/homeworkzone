import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Music, 
  Scissors, 
  Smile, 
  Trash2, 
  Download, 
  Play, 
  Volume2, 
  Sparkles, 
  Eye, 
  CheckCircle,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ═══════════════════════════════════════════════════════════════
//  PIANO KEYS CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const PIANO_KEYS = [
  { note: "C4", label: "Do (C)", freq: 261.63, color: "bg-red-400 border-red-500" },
  { note: "D4", label: "Re (D)", freq: 293.66, color: "bg-orange-400 border-orange-500" },
  { note: "E4", label: "Mi (E)", freq: 329.63, color: "bg-yellow-400 border-yellow-500" },
  { note: "F4", label: "Fa (F)", freq: 349.23, color: "bg-green-400 border-green-500" },
  { note: "G4", label: "So (G)", freq: 392.00, color: "bg-cyan-400 border-cyan-500" },
  { note: "A4", label: "La (A)", freq: 440.00, color: "bg-blue-400 border-orange-1000" },
  { note: "B4", label: "Ti (B)", freq: 493.88, color: "bg-orange-400 border-orange-1000" },
  { note: "C5", label: "Do (C5)", freq: 523.25, color: "bg-green-400 border-green-1000" }
];

const MELODIES = [
  {
    name: "Twinkle Twinkle Little Star 🌟",
    notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"]
  },
  {
    name: "Mary Had a Little Lamb 🐑",
    notes: ["E4", "D4", "C4", "D4", "E4", "E4", "E4", "D4", "D4", "D4", "E4", "G4", "G4"]
  },
  {
    name: "Row Your Boat 🚣",
    notes: ["C4", "C4", "C4", "D4", "E4", "E4", "D4", "E4", "F4", "G4", "C5", "C5"]
  }
];

// ═══════════════════════════════════════════════════════════════
//  DIY CRAFTS DATABASE
// ═══════════════════════════════════════════════════════════════
const CRAFTS = [
  {
    id: 1,
    title: "Paper Origami Butterfly 🦋",
    difficulty: "Easy",
    materials: "Square colorful paper piece, scissors.",
    steps: [
      "Fold the square paper in half diagonally both ways to form an 'X' crease.",
      "Fold in half horizontally and vertically, then collapse the paper into a waterbomb triangle.",
      "Fold the top two corners of the triangle up toward the peak.",
      "Flip over, pull the bottom peak up past the top edge, and fold it over the edge to lock.",
      "Fold the butterfly in half slightly to shape the wings and set free!"
    ]
  },
  {
    id: 2,
    title: "The Cardboard Space Rocket 🚀",
    difficulty: "Medium",
    materials: "Toilet paper roll, silver foil, tape, paper cup, markers.",
    steps: [
      "Wrap the cardboard toilet paper tube in silver foil or color it with bright paint.",
      "Cut a small paper cup to make a cone, then tape it to the top as the rocket nose cone.",
      "Draw circular astronaut windows on the body using markers.",
      "Cut out three small cardboard triangles and tape them near the base as stabilizing fins.",
      "Glue red, orange, and yellow tissue paper strips to the bottom for blazing rocket fire!"
    ]
  },
  {
    id: 3,
    title: "DIY Pressed Leaf Bookmark 🔖",
    difficulty: "Easy",
    materials: "Fresh leaves or flowers, heavy book, clear tape, ribbon.",
    steps: [
      "Go outside and collect a few beautiful green or orange fallen leaves.",
      "Place them inside a heavy book between clean paper towels for 2 days to press flat.",
      "Cut a strip of colored cardboard or paper to use as the bookmark base.",
      "Arrange your pressed leaves on the strip, and cover completely with clear packing tape.",
      "Punch a hole at the top and tie a colorful yarn ribbon. Happy reading!"
    ]
  }
];

export default function ArtsAndFunView({ studentName, currentStudentProfile }) {
  const [activeTab, setActiveTab] = useState('Draw & Color');

  // --- Drawing Canvas State ---
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#EF4444'); // Red default
  const [brushSize, setBrushSize] = useState(8);
  const [eraserMode, setEraserMode] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState(null); // '⭐' | '❤️' | '😊' | '🦉' | null
  const hueRef = useRef(0); // For rainbow brush

  // --- Music Room Synth State ---
  const [activeNote, setActiveNote] = useState(null);
  const [activeMelodyIndex, setActiveMelodyIndex] = useState(0);
  const [melodyStep, setMelodyStep] = useState(0);

  // --- Dress Up State ---
  const [mascotPet, setMascotPet] = useState('owl'); // owl | bunny | panda
  const [equippedItems, setEquippedItems] = useState({
    helmet: false,
    cape: false,
    glasses: false,
    bowtie: false,
    wizard: false
  });

  // Load redeemed items from profile on start
  useEffect(() => {
    if (currentStudentProfile?.redeemedItems) {
      const redeemed = currentStudentProfile.redeemedItems || [];
      setEquippedItems({
        helmet: redeemed.includes("Astronaut Helmet 🧑‍🚀"),
        glasses: redeemed.includes("Cool Sunglasses for Pet 😎") || redeemed.includes("Golden Badge Frame 🏅"),
        bowtie: redeemed.includes("Bowtie for Pet 🎀"),
        cape: redeemed.includes("Superhero Cape for Pet 🦸"),
        wizard: redeemed.includes("Wizard Hat for Pet 🧙") || redeemed.includes("Crown for Pet 👑")
      });
    }
  }, [currentStudentProfile]);

  // --- Canvas Drawing Hooks ---
  useEffect(() => {
    if (activeTab === 'Draw & Color' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [activeTab]);

  const getCoordinates = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Check if touch event
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    
    // Mouse event
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Stamp Mode logic
    if (selectedStamp) {
      ctx.font = `${brushSize * 4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, x, y);
      
      // confetti click effect
      confetti({
        particleCount: 15,
        spread: 20,
        origin: { 
          x: e.clientX / window.innerWidth, 
          y: e.clientY / window.innerHeight 
        }
      });
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || selectedStamp) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = brushSize;

    if (eraserMode) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      if (color === 'rainbow') {
        ctx.strokeStyle = `hsl(${hueRef.current}, 100%, 50%)`;
        hueRef.current = (hueRef.current + 8) % 360;
      } else {
        ctx.strokeStyle = color;
      }
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${studentName.replace(/\s+/g, '_')}_masterpiece.png`;
    link.href = canvas.toDataURL();
    link.click();
    confetti({ particleCount: 50, spread: 40 });
  };

  // --- Music Synthesizer (Oscillators) ---
  const playNote = (freq, noteName) => {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      
      const audioCtx = new AudioCtxClass();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);

      setActiveNote(noteName);
      setTimeout(() => {
        setActiveNote(null);
      }, 300);

      // Verify song guide progression
      const currentMelody = MELODIES[activeMelodyIndex];
      if (currentMelody && currentMelody.notes[melodyStep] === noteName) {
        if (melodyStep < currentMelody.notes.length - 1) {
          setMelodyStep(melodyStep + 1);
        } else {
          // Finished the melody! Confetti reward
          setMelodyStep(0);
          confetti({
            particleCount: 80,
            spread: 50,
            origin: { y: 0.8 }
          });
        }
      } else {
        // Reset steps if they hit the wrong key
        setMelodyStep(0);
      }
    } catch (e) {
      console.error("Web Audio API Error:", e);
    }
  };

  // Toggle accessories
  const toggleAccessory = (accName) => {
    setEquippedItems(prev => ({
      ...prev,
      [accName]: !prev[accName]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFBF7] font-sans">
      {/* Header Banner */}
      <header className="px-8 py-6 bg-gradient-to-r from-green-100 via-orange-50 to-pink-50 border-b border-green-200 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <span>🎨</span> Arts & Fun Zone
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-1">Unleash your creative genius and show off your unique imagination!</p>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="px-8 py-4 bg-white border-b border-slate-100 flex gap-3 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { label: 'Draw & Color', icon: '🎨' },
          { label: 'Music Room', icon: '🎵' },
          { label: 'Crafts & DIY', icon: '✂️' },
          { label: 'Dress Up & Play', icon: '🎭' }
        ].map(tab => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === tab.label 
                ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-500/20 scale-102' 
                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        
        {/* ==================== 1. DRAW & COLOR ==================== */}
        {activeTab === 'Draw & Color' && (
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 h-full items-stretch">
            {/* Canvas Area */}
            <div className="flex-1 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-col items-stretch min-h-[380px] lg:min-h-[500px]">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-green-500" /> Digital Canvas Board
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearCanvas}
                    className="p-2.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-sm"
                    title="Clear Canvas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={downloadCanvas}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" /> Save Art
                  </button>
                </div>
              </div>

              {/* Draw canvas element */}
              <div className="flex-1 border-4 border-dashed border-slate-200 rounded-3xl bg-slate-50 overflow-hidden relative min-h-[280px]">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={420}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                />
              </div>
            </div>

            {/* Toolbox Panel */}
            <div className="w-full lg:w-72 space-y-6">
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">🛠️ Drawing Tools</h3>
                
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setEraserMode(false); setSelectedStamp(null); }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      !eraserMode && !selectedStamp
                        ? 'bg-green-100 border-green-300 text-green-700 font-black' 
                        : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}
                  >
                    🖌️ Brush
                  </button>
                  <button
                    onClick={() => { setEraserMode(true); setSelectedStamp(null); }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      eraserMode 
                        ? 'bg-green-100 border-green-300 text-green-700 font-black' 
                        : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}
                  >
                    🧽 Eraser
                  </button>
                </div>

                {/* Brush size slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Brush Thickness</span>
                    <span>{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={40}
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full accent-green-600"
                  />
                </div>

                {/* Kid friendly colors */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500">Brush Colors</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { hex: '#EF4444', name: 'red' },
                      { hex: '#F97316', name: 'orange' },
                      { hex: '#F59E0B', name: 'yellow' },
                      { hex: '#10B981', name: 'green' },
                      { hex: '#3B82F6', name: 'blue' },
                      { hex: '#8B5CF6', name: 'purple' },
                      { hex: '#000000', name: 'black' }
                    ].map(c => (
                      <button
                        key={c.hex}
                        onClick={() => {
                          setColor(c.hex);
                          setEraserMode(false);
                          setSelectedStamp(null);
                        }}
                        className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
                          color === c.hex && !eraserMode && !selectedStamp
                            ? 'scale-110 border-slate-800 shadow-md' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    {/* Rainbow color button */}
                    <button
                      onClick={() => {
                        setColor('rainbow');
                        setEraserMode(false);
                        setSelectedStamp(null);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all bg-gradient-to-r from-red-400 via-green-400 to-blue-400 cursor-pointer ${
                        color === 'rainbow' && !eraserMode && !selectedStamp
                          ? 'scale-110 border-slate-800 shadow-md'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title="Rainbow Brush"
                    />
                  </div>
                </div>

                {/* Stamping tools */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500">Fun Emoji Stamps</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['⭐', '❤️', '😊', '🦉', '🐱', '🐼', '🍕', '🎉'].map(stamp => (
                      <button
                        key={stamp}
                        onClick={() => {
                          setSelectedStamp(stamp);
                          setEraserMode(false);
                        }}
                        className={`w-11 h-11 rounded-2xl border text-xl flex items-center justify-center transition-all cursor-pointer ${
                          selectedStamp === stamp
                            ? 'bg-green-100 border-green-300 shadow scale-110'
                            : 'bg-slate-50 border-slate-100 hover:scale-105'
                        }`}
                      >
                        {stamp}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. MUSIC ROOM ==================== */}
        {activeTab === 'Music Room' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="flex-1 space-y-2">
                <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full font-sans">Synthesizer Keyboard</span>
                <h3 className="text-xl font-black text-slate-800">Play Cute Melodies!</h3>
                <p className="text-xs font-semibold text-slate-500 font-sans">Click on the colorful piano keys below to play musical notes. Try to follow the highlighted note sequence to play a full nursery rhyme!</p>
              </div>
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow animate-pulse">
                <Music className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Song guide block */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span>🎵</span> Melody Sheet Guide
                </h4>
                <div className="flex bg-slate-50 rounded-xl p-0.5 border border-slate-100">
                  {MELODIES.map((mel, idx) => (
                    <button
                      key={mel.name}
                      onClick={() => {
                        setActiveMelodyIndex(idx);
                        setMelodyStep(0);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                        activeMelodyIndex === idx ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {mel.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Steps display */}
              <div className="bg-orange-50/30 border border-dashed border-orange-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-slate-500 mb-2">Rhyme: {MELODIES[activeMelodyIndex].name}</p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl mx-auto">
                  {MELODIES[activeMelodyIndex].notes.map((note, idx) => {
                    const isNext = idx === melodyStep;
                    const isPassed = idx < melodyStep;
                    return (
                      <span 
                        key={idx}
                        className={`w-7 h-7 text-[10px] font-black rounded-lg flex items-center justify-center border transition-all ${
                          isNext 
                            ? 'bg-amber-400 border-amber-500 text-slate-800 scale-110 shadow-sm animate-bounce' 
                            : isPassed 
                              ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                              : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {note.replace('4', '')}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Colorful Keyboard */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center px-2 text-xs font-bold text-slate-400 select-none">
                <span>◀ Low Pitch (Do)</span>
                <span>High Pitch (Do) ▶</span>
              </div>

              <div className="flex items-stretch justify-center h-44 gap-1.5 select-none bg-slate-900 p-4 rounded-3xl border-4 border-slate-800 shadow-lg">
                {PIANO_KEYS.map(key => {
                  const isActive = activeNote === key.note;
                  const isGuideNext = MELODIES[activeMelodyIndex].notes[melodyStep] === key.note;
                  
                  return (
                    <button
                      key={key.note}
                      onClick={() => playNote(key.freq, key.note)}
                      className={`flex-1 rounded-2xl flex flex-col justify-end items-center pb-4 transition-all duration-100 border-b-8 active:border-b-2 active:translate-y-1 relative shadow-inner cursor-pointer ${
                        key.color
                      } ${
                        isActive ? 'scale-98 opacity-90' : ''
                      }`}
                    >
                      {/* Highlight key if it is next in melody */}
                      {isGuideNext && (
                        <div className="absolute top-3 w-3 h-3 rounded-full bg-white animate-ping" />
                      )}
                      
                      <span className="text-[10px] font-black text-white uppercase drop-shadow-md">
                        {key.label.split(' ')[0]}
                      </span>
                      <span className="text-[8px] font-bold text-white/70 tracking-widest mt-0.5">
                        {key.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ==================== 3. CRAFTS & DIY ==================== */}
        {activeTab === 'Crafts & DIY' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CRAFTS.map(craft => (
                <div 
                  key={craft.id}
                  className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Level: {craft.difficulty}
                    </span>
                    <h3 className="text-base font-black text-slate-800">{craft.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 leading-tight">
                      🧺 Materials: {craft.materials}
                    </p>
                    <div className="space-y-2.5 pt-3 border-t border-slate-50">
                      {craft.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="w-4 h-4 bg-green-50 text-[9px] font-bold text-green-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-[10px] font-semibold text-slate-600 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 35 });
                    }}
                    className="w-full bg-green-50 hover:bg-green-100 border border-green-100/50 text-green-600 text-xs font-black py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    I Made This! 🎉
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. DRESS UP & PLAY ==================== */}
        {activeTab === 'Dress Up & Play' && (
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Mascot Character Viewer Card */}
            <div className="flex-1 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex flex-col items-center justify-center relative min-h-[380px]">
              
              {/* Stars badge decoration */}
              <div className="absolute top-6 left-6 bg-green-50 px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-green-500 fill-green-300" />
                <span className="text-[9px] font-black text-green-600 uppercase">My Pet Companion</span>
              </div>

              {/* Snapshot share button */}
              <button 
                onClick={() => {
                  confetti({ particleCount: 60, spread: 40 });
                }}
                className="absolute top-6 right-6 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 shadow-sm transition-colors cursor-pointer"
                title="Camera Snap"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Dynamic Mascot Display Panel */}
              <div className="w-64 h-64 bg-slate-50 border border-dashed border-slate-200 rounded-[40px] flex items-center justify-center relative select-none shadow-inner overflow-hidden mt-6">
                
                {/* LAYER 0: Cape Accessory (Drawn behind character) */}
                {equippedItems.cape && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <img 
                      src="https://img.icons8.com/fluency/96/poncho.png" 
                      className="w-44 h-44 object-contain translate-y-6 opacity-90 scale-x-[-1]" 
                      alt="Cape Behind" 
                    />
                  </div>
                )}

                {/* LAYER 1: Core Pet Avatar */}
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  {mascotPet === 'owl' && (
                    <img src="/assets/owl_mascot.png" className="w-40 h-40 object-contain drop-shadow-xl animate-float" alt="Owl Pet" />
                  )}
                  {mascotPet === 'bunny' && (
                    <img src="https://img.icons8.com/fluency/144/rabbit.png" className="w-40 h-40 object-contain drop-shadow-xl animate-float" alt="Bunny Pet" />
                  )}
                  {mascotPet === 'panda' && (
                    <img src="https://img.icons8.com/fluency/144/panda.png" className="w-40 h-40 object-contain drop-shadow-xl animate-float" alt="Panda Pet" />
                  )}
                </div>

                {/* LAYER 2: Glasses / Mask */}
                {equippedItems.glasses && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <img 
                      src="https://img.icons8.com/fluency/96/3d-glasses.png" 
                      className="w-20 h-20 object-contain -translate-y-3 translate-x-0.5" 
                      alt="Glasses" 
                    />
                  </div>
                )}

                {/* LAYER 3: Bowtie */}
                {equippedItems.bowtie && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <img 
                      src="https://img.icons8.com/fluency/96/tie.png" 
                      className="w-14 h-14 object-contain translate-y-12" 
                      alt="Bowtie" 
                    />
                  </div>
                )}

                {/* LAYER 4: Hat / Helmet Accessory */}
                {equippedItems.helmet && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <img 
                      src="https://img.icons8.com/fluency/96/astronaut.png" 
                      className="w-32 h-32 object-contain -translate-y-4" 
                      alt="Astronaut Helmet" 
                    />
                  </div>
                )}

                {equippedItems.wizard && !equippedItems.helmet && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <img 
                      src="https://img.icons8.com/fluency/96/wizard.png" 
                      className="w-24 h-24 object-contain -translate-y-16" 
                      alt="Wizard Hat" 
                    />
                  </div>
                )}

                {/* Cozy floor platform shadow */}
                <div className="absolute bottom-6 w-32 h-3.5 bg-slate-200/50 rounded-full blur-sm z-0" />
              </div>

              {/* Mascot chooser buttons */}
              <div className="flex gap-3 mt-6">
                {[
                  { id: 'owl', name: 'Owl 🦉' },
                  { id: 'bunny', name: 'Bunny 🐰' },
                  { id: 'panda', name: 'Panda 🐼' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setMascotPet(p.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                      mascotPet === p.id 
                        ? 'bg-green-600 border-green-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory Selector Panel */}
            <div className="w-full lg:w-80 space-y-6">
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">🧢 Closet Dresser</h3>
                  <p className="text-[9px] font-bold text-slate-400">Unlock these special accessories from the Reward Store to dress up your pet buddy!</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'helmet', label: "Astronaut Helmet 🧑‍🚀", points: 30 },
                    { id: 'wizard', label: "Wizard Hat 🧙", points: 30 },
                    { id: 'cape', label: "Superhero Cape 🦸", points: 40 },
                    { id: 'glasses', label: "Cool Sunglasses 😎", points: 15 },
                    { id: 'bowtie', label: "Bowtie Ribbon 🎀", points: 10 }
                  ].map(acc => {
                    const isPurchased = currentStudentProfile?.redeemedItems?.includes(
                      acc.label.includes("Astronaut") ? "Astronaut Helmet 🧑‍🚀" : 
                      acc.label.includes("Wizard") ? "Wizard Hat for Pet 🧙" :
                      acc.label.includes("Cape") ? "Superhero Cape for Pet 🦸" :
                      acc.label.includes("Sunglasses") ? "Cool Sunglasses for Pet 😎" :
                      "Bowtie for Pet 🎀"
                    );

                    return (
                      <div 
                        key={acc.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          equippedItems[acc.id] 
                            ? 'bg-green-50/50 border-green-200' 
                            : 'bg-slate-50/20 border-slate-100'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-slate-700 block">{acc.label}</span>
                          <span className={`text-[8px] font-bold ${isPurchased ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {isPurchased ? "Unlocked ✓" : `Locked - ${acc.points} XP`}
                          </span>
                        </div>

                        {isPurchased ? (
                          <button
                            onClick={() => toggleAccessory(acc.id)}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all cursor-pointer border ${
                              equippedItems[acc.id]
                                ? 'bg-green-600 border-green-600 text-white'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {equippedItems[acc.id] ? "Remove" : "Equip"}
                          </button>
                        ) : (
                          <span className="text-[16px]">🔒</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
