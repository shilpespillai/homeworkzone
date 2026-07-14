import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { playEat, playLevelUp, playPetChirp } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { Scissors, Lock } from 'lucide-react';

// ─── Accessory position offsets per pet type ──────────────────────────────────
const ACCESSORY_OFFSETS = {
  bunny:    { crown: { top: '0%',   left: '33%', width: '34%' }, wizard: { top: '-23%', left: '20%', width: '60%' }, cape: { top: '55%', left: '12%', width: '76%' }, sunglasses: { top: '35%', left: '26%', width: '48%' }, bowtie: { top: '65%', left: '38%', width: '24%' } },
  bear:     { crown: { top: '-5%',  left: '32%', width: '36%' }, wizard: { top: '-28%', left: '22%', width: '56%' }, cape: { top: '50%', left: '10%', width: '80%' }, sunglasses: { top: '30%', left: '23%', width: '54%' }, bowtie: { top: '70%', left: '38%', width: '24%' } },
  monkey:   { crown: { top: '-2%',  left: '34%', width: '32%' }, wizard: { top: '-25%', left: '24%', width: '52%' }, cape: { top: '55%', left: '15%', width: '70%' }, sunglasses: { top: '32%', left: '25%', width: '50%' }, bowtie: { top: '75%', left: '38%', width: '24%' } },
  squirrel: { crown: { top: '2%',   left: '32%', width: '36%' }, wizard: { top: '-22%', left: '20%', width: '60%' }, cape: { top: '52%', left: '12%', width: '76%' }, sunglasses: { top: '36%', left: '26%', width: '48%' }, bowtie: { top: '68%', left: '38%', width: '24%' } },
  koala:    { crown: { top: '-3%',  left: '32%', width: '36%' }, wizard: { top: '-26%', left: '22%', width: '56%' }, cape: { top: '52%', left: '10%', width: '80%' }, sunglasses: { top: '32%', left: '22%', width: '56%' }, bowtie: { top: '72%', left: '38%', width: '24%' } },
};

const PET_TYPES = [
  { id: 'bunny',    label: 'Bunny 🐰',    image: '/assets/animals/bunny.png' },
  { id: 'bear',     label: 'Bear 🐻',     image: '/assets/animals/bear.png' },
  { id: 'monkey',   label: 'Monkey 🐵',   image: '/assets/animals/monkey.png' },
  { id: 'squirrel', label: 'Squirrel 🐿️', image: '/assets/animals/squirrel.png' },
  { id: 'koala',    label: 'Koala 🐨',    image: '/assets/animals/koala.png' },
];

// ─── Level Perk Roadmap (every 5 levels, 20 milestones) ──────────────────────
const LEVEL_PERKS = {
  5:   { name: '🏅 Apprentice Title',        desc: 'Earn the Apprentice rank badge!',               type: 'title' },
  10:  { name: '✨ Golden Glow',              desc: 'Your pet shines with a golden aura!',           type: 'visual' },
  15:  { name: '🌿 Meadow Scene',            desc: 'A cosy meadow blooms behind your pet!',         type: 'background' },
  20:  { name: '🎖️ Scholar Title',           desc: 'Level up to the Scholar rank!',                 type: 'title' },
  25:  { name: '🎪 Spin Trick',              desc: 'Your pet learns to spin when you pet them!',    type: 'trick' },
  30:  { name: '💬 Wisdom Bubble',           desc: 'Your pet shares daily study tips!',             type: 'bubble' },
  35:  { name: '🏆 Champion Title',          desc: 'Earn the Champion rank badge!',                 type: 'title' },
  40:  { name: '🌌 Starry Night Scene',      desc: 'Stars twinkle behind your pet!',                type: 'background' },
  45:  { name: '🌈 Rainbow Aura',            desc: 'Rainbow colours dance around your pet!',        type: 'visual' },
  50:  { name: '👑 Master + Crown',          desc: 'Master rank + permanent crown on your pet!',    type: 'title' },
  55:  { name: '⚡ XP Boost',               desc: 'Each feed gives 47% more XP!',                  type: 'mechanic' },
  60:  { name: '🔥 Elite + Sparks',          desc: 'Elite rank with floating ember sparks!',        type: 'title' },
  65:  { name: '🌊 Ocean Scene',             desc: 'Ocean waves roll behind your pet!',             type: 'background' },
  70:  { name: '⭐ Legend Title',            desc: 'You are a Legend!',                             type: 'title' },
  75:  { name: '💎 Diamond Shimmer',         desc: 'Glitter sparkles swirl around your pet!',       type: 'visual' },
  80:  { name: '🌟 Mythic + Prismatic Ring', desc: 'Mythic rank with a colour-shifting glow!',      type: 'title' },
  85:  { name: '🚀 Galaxy Scene',            desc: 'Deep space swirls behind your pet!',            type: 'background' },
  90:  { name: '🦄 Grandmaster',             desc: 'Grandmaster rank + rainbow shimmer on pet!',    type: 'title' },
  95:  { name: '🎆 Rainbow Pulse',           desc: 'The whole card pulses with rainbow light!',     type: 'visual' },
  100: { name: '🎓 MAXED OUT',               desc: 'Legend of Legends! Time to retire your pet.',   type: 'retire' },
};

const WISDOM_TIPS = [
  "You're doing amazing! Keep it up! 🌟",
  "Every question answered makes you smarter! 🧠",
  "10 minutes of practice beats hours of worry! ⏱️",
  "Mistakes help you grow — don't be afraid! 💪",
  "I believe in you! You've got this! 🐾",
  "Homework now = freedom later! 🎉",
  "You're my favourite student ever! 🌈",
  "Small steps every day = big results! 🚀",
  "Remember to take breaks and drink water! 💧",
  "You're smarter than you think! ✨",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getTitleRank = (level) => {
  if (level >= 100) return { label: 'Legend of Legends', emoji: '🎓', color: 'text-yellow-700',  bg: 'from-yellow-100 to-amber-100',  border: 'border-yellow-400' };
  if (level >= 90)  return { label: 'Grandmaster',        emoji: '🦄', color: 'text-purple-700',  bg: 'from-purple-100 to-pink-100',   border: 'border-purple-400' };
  if (level >= 80)  return { label: 'Mythic',             emoji: '🌟', color: 'text-indigo-700',  bg: 'from-indigo-100 to-blue-100',   border: 'border-indigo-400' };
  if (level >= 70)  return { label: 'Legend',             emoji: '⭐', color: 'text-orange-700',  bg: 'from-orange-100 to-amber-100',  border: 'border-orange-400' };
  if (level >= 60)  return { label: 'Elite',              emoji: '🔥', color: 'text-red-700',     bg: 'from-red-100 to-orange-100',    border: 'border-red-400' };
  if (level >= 50)  return { label: 'Master',             emoji: '👑', color: 'text-amber-700',   bg: 'from-amber-100 to-yellow-100',  border: 'border-amber-400' };
  if (level >= 35)  return { label: 'Champion',           emoji: '🏆', color: 'text-emerald-700', bg: 'from-emerald-100 to-green-100', border: 'border-emerald-400' };
  if (level >= 20)  return { label: 'Scholar',            emoji: '🎖️', color: 'text-blue-700',    bg: 'from-blue-100 to-sky-100',      border: 'border-blue-400' };
  if (level >= 5)   return { label: 'Apprentice',         emoji: '🏅', color: 'text-slate-600',   bg: 'from-slate-100 to-gray-100',    border: 'border-slate-300' };
  return null;
};

const getBgScene = (level) => {
  if (level >= 85) return 'galaxy';
  if (level >= 65) return 'ocean';
  if (level >= 40) return 'starry';
  if (level >= 15) return 'meadow';
  return null;
};

const getNextLockedPerk = (level) => {
  const milestones = Object.keys(LEVEL_PERKS).map(Number).sort((a, b) => a - b);
  const next = milestones.find(m => m > level);
  return next ? { level: next, ...LEVEL_PERKS[next] } : null;
};

const BG_SCENES = {
  meadow: { bg: 'bg-gradient-to-b from-sky-200 to-green-200', emojis: ['🌿','🌸','🦋','🌼','🌱'] },
  starry: { bg: 'bg-gradient-to-b from-slate-900 to-indigo-900', emojis: ['⭐','✨','🌟','💫','⭐'] },
  ocean:  { bg: 'bg-gradient-to-b from-cyan-300 to-blue-500',   emojis: ['🌊','🐚','🐠','🌊','💧'] },
  galaxy: { bg: 'bg-gradient-to-b from-purple-950 to-slate-900', emojis: ['🚀','✨','🌌','💫','🪐'] },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function VirtualPetCompanionWidget({
  currentStudentProfile,
  pointsBalance,
  onProfileUpdate,
  teacher,
  classroom,
  studentName,
}) {
  const [selectedPetType, setSelectedPetType] = useState('bunny');
  const [petNameInput, setPetNameInput] = useState('');
  const [isAdopting, setIsAdopting] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [showDressUp, setShowDressUp] = useState(false);
  const [showRetireConfirm, setShowRetireConfirm] = useState(false);
  const [isRetiring, setIsRetiring] = useState(false);
  const [randomTip] = useState(() => WISDOM_TIPS[Math.floor(Math.random() * WISDOM_TIPS.length)]);

  const pet = currentStudentProfile?.pet;
  const redeemedItems = currentStudentProfile?.redeemedItems || [];
  const equippedAccessories = pet?.equippedAccessories || [];
  const hallOfFame = pet?.hallOfFame || [];

  const petAccessoriesMap = {
    'Crown for Pet 👑': 'crown',
    'Wizard Hat for Pet 🧙': 'wizard',
    'Superhero Cape for Pet 🦸': 'cape',
    'Cool Sunglasses for Pet 😎': 'sunglasses',
    'Bowtie for Pet 🎀': 'bowtie',
  };
  const ownedAccessories = Object.keys(petAccessoriesMap)
    .filter(title => redeemedItems.includes(title))
    .map(title => ({ key: petAccessoriesMap[title], title: title.replace(' for Pet', '') }));

  // ─── Student ref helper ──────────────────────────────────────────────────
  const getStudentRef = () => {
    const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
    const actualClass   = classroom || savedStudent?.classroom;
    const actualTeacher = teacher   || savedStudent?.teacher;
    if (!actualClass?.id || !actualTeacher?.uid || !studentName) return null;
    return doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClass.id, 'students', studentName.trim().toLowerCase());
  };

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleAdopt = async () => {
    if (!petNameInput.trim()) return;
    setIsAdopting(true);
    try {
      const ref = getStudentRef();
      if (ref) {
        await updateDoc(ref, {
          pet: {
            petType: selectedPetType,
            petName: petNameInput.trim(),
            petHunger: 50,
            petMood: 50,
            petLevel: 1,
            petXp: 0,
            equippedAccessories: [],
            hallOfFame,
          },
        });
        triggerConfetti();
        playLevelUp();
        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error('Failed to adopt pet:', e);
    } finally {
      setIsAdopting(false);
    }
  };

  const handleFeed = async () => {
    if (pointsBalance < 10 || isFeeding) return;
    setIsFeeding(true);
    playEat();
    try {
      const ref = getStudentRef();
      if (ref && pet) {
        const xpGain = (pet.petLevel || 1) >= 55 ? 22 : 15; // ⚡ XP Boost perk at Level 55
        let newHunger = Math.min(100, (pet.petHunger || 0) + 20);
        let newXp    = (pet.petXp   || 0) + xpGain;
        let newLevel = Math.min(100, pet.petLevel || 1);
        let levelUpHappened = false;

        const threshold = newLevel * 100;
        if (newXp >= threshold && newLevel < 100) {
          newXp -= threshold;
          newLevel += 1;
          levelUpHappened = true;
        }

        await updateDoc(ref, {
          'pet.petHunger': newHunger,
          'pet.petXp':     newXp,
          'pet.petLevel':  newLevel,
          petSpentPoints:  increment(10),
        });

        if (levelUpHappened) {
          playLevelUp();
          triggerConfetti();
          const perk = LEVEL_PERKS[newLevel];
          const perkMsg = perk ? `\n🎁 New Perk Unlocked: ${perk.name}!` : '';
          setTimeout(() => {
            alert(`🎉 Amazing! ${pet.petName} levelled up to Level ${newLevel}!${perkMsg} Keep up the great work! 🌟`);
          }, 400);
        }

        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error('Failed to feed pet:', e);
    } finally {
      setIsFeeding(false);
    }
  };

  const handlePet = async () => {
    if (isWiggling || isSpinning) return;
    const canSpin = (pet?.petLevel || 1) >= 25;
    if (canSpin) setIsSpinning(true);
    else setIsWiggling(true);
    setShowHearts(true);
    playPetChirp();

    try {
      const ref = getStudentRef();
      if (ref && pet) {
        await updateDoc(ref, { 'pet.petMood': Math.min(100, (pet.petMood || 0) + 10) });
        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error('Failed to pet animal:', e);
    }

    setTimeout(() => { setIsWiggling(false); setIsSpinning(false); }, 600);
    setTimeout(() => setShowHearts(false), 1500);
  };

  const handleRetire = async () => {
    if (!pet || isRetiring) return;
    setIsRetiring(true);
    try {
      const ref = getStudentRef();
      if (ref) {
        const newHof = [...hallOfFame, {
          petName:      pet.petName,
          petType:      pet.petType,
          retiredAt:    new Date().toISOString(),
          levelReached: pet.petLevel,
        }];
        await updateDoc(ref, {
          pet: { petType: null, petName: null, petHunger: 0, petMood: 0, petLevel: 1, petXp: 0, equippedAccessories: [], hallOfFame: newHof },
        });
        triggerConfetti();
        playLevelUp();
        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error('Failed to retire pet:', e);
    } finally {
      setIsRetiring(false);
      setShowRetireConfirm(false);
    }
  };

  const toggleAccessory = async (accKey) => {
    if (!pet) return;
    const isEquipped  = equippedAccessories.includes(accKey);
    const newEquipped = isEquipped
      ? equippedAccessories.filter(k => k !== accKey)
      : [...equippedAccessories, accKey];
    try {
      const ref = getStudentRef();
      if (ref) {
        await updateDoc(ref, { 'pet.equippedAccessories': newEquipped });
        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error('Failed to toggle accessory:', e);
    }
  };

  // ─── Accessory SVGs ──────────────────────────────────────────────────────
  const renderAccessorySvg = (accKey) => {
    switch (accKey) {
      case 'crown':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
            <path d="M10 80 L20 30 L40 55 L50 25 L60 55 L80 30 L90 80 Z" fill="#FBBF24" />
            <rect x="10" y="75" width="80" height="8" rx="2" fill="#D97706" />
            <circle cx="20" cy="27" r="5" fill="#EF4444" /><circle cx="50" cy="22" r="5" fill="#3B82F6" /><circle cx="80" cy="27" r="5" fill="#EF4444" />
            <circle cx="30" cy="79" r="3" fill="#10B981" /><circle cx="50" cy="79" r="3" fill="#3B82F6" /><circle cx="70" cy="79" r="3" fill="#10B981" />
          </svg>
        );
      case 'wizard':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
            <path d="M50 8 L85 80 L15 80 Z" fill="#5B3E96" />
            <path d="M15 80 Q50 85 85 80 L87 85 Q50 91 13 85 Z" fill="#FBBF24" />
            <ellipse cx="50" cy="82" rx="42" ry="10" fill="#4C2A85" />
            <polygon points="50,30 52,35 57,35 53,38 55,43 50,40 45,43 47,38 43,35 48,35" fill="#FDE047" />
            <polygon points="38,55 39,58 42,58 40,60 41,63 38,61 35,63 36,60 34,58 37,58" fill="#FDE047" />
            <polygon points="62,55 63,58 66,58 64,60 65,63 62,61 59,63 60,60 58,58 61,58" fill="#FDE047" />
          </svg>
        );
      case 'cape':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_6px_8px_rgba(0,0,0,0.25)]">
            <path d="M30 40 C 5 70, -10 110, 5 115 C 20 120, 45 105, 60 110 C 75 105, 100 120, 115 115 C 130 110, 115 70, 90 40 C 75 42, 45 42, 30 40 Z" fill="#EF4444" />
            <path d="M40 38 Q60 48 80 38 Q75 30 60 32 Q45 30 40 38 Z" fill="#B91C1C" />
          </svg>
        );
      case 'sunglasses':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.3)]">
            <rect x="12" y="15" width="34" height="28" rx="12" fill="#1E293B" stroke="#F8FAFC" strokeWidth="4" />
            <rect x="54" y="15" width="34" height="28" rx="12" fill="#1E293B" stroke="#F8FAFC" strokeWidth="4" />
            <rect x="42" y="21" width="16" height="6" fill="#F8FAFC" />
            <path d="M18 20 L28 20 L20 32 L14 32 Z" fill="#FFFFFF" opacity="0.35" />
            <path d="M60 20 L70 20 L62 32 L56 32 Z" fill="#FFFFFF" opacity="0.35" />
          </svg>
        );
      case 'bowtie':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.2)]">
            <path d="M10 15 L50 30 L10 45 Z" fill="#EF4444" /><path d="M90 15 L50 30 L90 45 Z" fill="#EF4444" />
            <circle cx="50" cy="30" r="11" fill="#DC2626" />
            <path d="M15 20 L40 29 M15 40 L40 31" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
            <path d="M85 20 L60 29 M85 40 L60 31" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default: return null;
    }
  };

  // ─── CSS Animations ──────────────────────────────────────────────────────
  useEffect(() => {
    const styleId = 'pet-animations-styles-v2';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes petWiggle  { 0%,100%{transform:rotate(0deg) scale(1)} 25%{transform:rotate(-8deg) scale(1.05)} 75%{transform:rotate(8deg) scale(1.05)} }
        @keyframes petSpin    { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.1)} 100%{transform:rotate(360deg) scale(1)} }
        .animate-pet-wiggle { animation: petWiggle 0.4s ease-in-out 2; }
        .animate-pet-spin   { animation: petSpin   0.55s ease-in-out 1; }

        @keyframes heartFloat { 0%{transform:translateY(0) scale(0.5);opacity:0} 20%{opacity:.8} 100%{transform:translateY(-80px) scale(1.2);opacity:0} }
        .heart-particle { position:absolute; animation:heartFloat 1.2s ease-out forwards; pointer-events:none; }

        @keyframes goldenGlow { 0%,100%{box-shadow:0 0 10px 2px rgba(251,191,36,.5),inset 0 0 8px rgba(251,191,36,.1)} 50%{box-shadow:0 0 26px 7px rgba(251,191,36,.9),inset 0 0 16px rgba(251,191,36,.2)} }
        .glow-golden { animation: goldenGlow 2.2s ease-in-out infinite; }

        @keyframes rainbowBorderKf { 0%{border-color:#ef4444} 17%{border-color:#f97316} 33%{border-color:#eab308} 50%{border-color:#22c55e} 67%{border-color:#3b82f6} 83%{border-color:#a855f7} 100%{border-color:#ef4444} }
        .aura-rainbow { animation: rainbowBorderKf 2.5s linear infinite; border-width:3px !important; border-style:solid !important; }

        @keyframes prismaticKf { 0%{box-shadow:0 0 16px 4px rgba(251,191,36,.7)} 33%{box-shadow:0 0 16px 4px rgba(168,85,247,.7)} 66%{box-shadow:0 0 16px 4px rgba(59,130,246,.7)} 100%{box-shadow:0 0 16px 4px rgba(251,191,36,.7)} }
        .glow-prismatic { animation: prismaticKf 3.5s ease-in-out infinite; }

        @keyframes rainbowPulseKf { 0%{border-color:#ef4444;box-shadow:0 0 18px rgba(239,68,68,.4)} 20%{border-color:#f97316;box-shadow:0 0 18px rgba(249,115,22,.4)} 40%{border-color:#eab308;box-shadow:0 0 18px rgba(234,179,8,.4)} 60%{border-color:#22c55e;box-shadow:0 0 18px rgba(34,197,94,.4)} 80%{border-color:#3b82f6;box-shadow:0 0 18px rgba(59,130,246,.4)} 100%{border-color:#ef4444;box-shadow:0 0 18px rgba(239,68,68,.4)} }
        .pulse-rainbow-card { animation: rainbowPulseKf 3s linear infinite; border-width:3px !important; border-style:solid !important; }

        @keyframes shimmerHue { 0%{filter:hue-rotate(0deg) saturate(1.2)} 50%{filter:hue-rotate(180deg) saturate(1.5) brightness(1.1)} 100%{filter:hue-rotate(360deg) saturate(1.2)} }
        .shimmer-rainbow { animation: shimmerHue 3s linear infinite; }

        @keyframes sparkDrift  { 0%{transform:translateY(0) translateX(0) scale(1);opacity:1} 100%{transform:translateY(-55px) translateX(8px) scale(0);opacity:0} }
        .spark-particle { position:absolute; pointer-events:none; font-size:11px; animation:sparkDrift 1.8s ease-out infinite; }

        @keyframes diamondFloat { 0%,100%{transform:translateY(0) scale(1);opacity:.8} 50%{transform:translateY(-12px) scale(1.25);opacity:1} }
        .diamond-particle { position:absolute; pointer-events:none; font-size:9px; animation:diamondFloat 2s ease-in-out infinite; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // ─── Adoption View ────────────────────────────────────────────────────────
  if (!pet || !pet.petType) {
    return (
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-[32px] p-6 space-y-5 animate-in fade-in duration-300">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-black text-[#2D3748] flex items-center justify-center gap-2"><span>🐾</span> Study Pet Buddy</h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">Adopt a cute virtual companion! They grow stronger as you do your homework!</p>
        </div>

        {/* Hall of Fame — retired pets */}
        {hallOfFame.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-2">
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider text-center">🏆 Hall of Fame</p>
            {hallOfFame.map((retired, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-amber-800 font-bold">
                <img src={`/assets/animals/${retired.petType}.png`} className="w-5 h-5 object-contain" alt={retired.petType} />
                <span>{retired.petName}</span>
                <span className="text-amber-500 ml-auto">Retired at Lv. {retired.levelReached}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-5 gap-2">
          {PET_TYPES.map((pt) => (
            <button key={pt.id} onClick={() => setSelectedPetType(pt.id)}
              className={`p-2 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${selectedPetType === pt.id ? 'border-[#EA580C] bg-[#EA580C]/10 shadow-sm' : 'border-slate-100 hover:bg-slate-50'}`}>
              <img src={pt.image} className="w-8 h-8 object-contain" alt={pt.label} />
              <span className="text-[9px] font-black text-slate-700">{pt.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 flex items-center justify-center">
          <img src={PET_TYPES.find(p => p.id === selectedPetType)?.image} className="w-20 h-20 object-contain bounce-gentle" alt="Preview" />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Name your buddy</label>
            <input type="text" value={petNameInput} onChange={(e) => setPetNameInput(e.target.value.slice(0, 12))}
              placeholder="e.g. Barnaby, Pippin"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 text-xs font-semibold text-[#2D3748] placeholder:text-slate-300" />
          </div>
          <button onClick={handleAdopt} disabled={!petNameInput.trim() || isAdopting}
            className="w-full bg-[#EA580C] hover:bg-[#c2410c] text-white py-3 rounded-2xl font-black text-xs shadow-md transition-all disabled:opacity-40 hover:scale-[1.02] flex items-center justify-center gap-2">
            {isAdopting ? 'Welcoming companion...' : 'Adopt Study Buddy! 🎉'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Active Companion View ────────────────────────────────────────────────
  const level       = pet.petLevel || 1;
  const xpRequired  = level * 100;
  const xpPct       = Math.min(100, Math.round(((pet.petXp || 0) / xpRequired) * 100));
  const isMaxed     = level >= 100;
  const titleRank   = getTitleRank(level);
  const bgScene     = getBgScene(level);
  const nextPerk    = getNextLockedPerk(level);

  // Active perk flags
  const hasGoldenGlow      = level >= 10;
  const hasRainbowAura     = level >= 45;
  const hasSparks          = level >= 60;
  const hasDiamondShimmer  = level >= 75;
  const hasPrismaticRing   = level >= 80;
  const hasRainbowShimmer  = level >= 90;
  const hasRainbowPulse    = level >= 95;
  const hasWisdomBubble    = level >= 30;
  const hasCrownPerk       = level >= 50;  // Permanent crown overlay

  // Derived classes
  const widgetBorderClass = hasRainbowPulse ? 'pulse-rainbow-card' : hasPrismaticRing ? 'glow-prismatic' : 'border-slate-100';
  const canvasGlowClass   = hasRainbowAura  ? 'aura-rainbow'      : hasGoldenGlow    ? 'glow-golden'   : 'border-slate-100';
  const petImgClass       = hasRainbowShimmer ? 'shimmer-rainbow' : '';

  return (
    <div className={`bg-white/80 backdrop-blur-md border shadow-sm rounded-[32px] p-6 space-y-5 animate-in fade-in duration-300 relative overflow-hidden ${widgetBorderClass}`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-black text-[#2D3748] flex items-center gap-1.5"><span>✨</span> {pet.petName}</h3>
          <p className="text-[10px] font-black text-[#EA580C] uppercase tracking-wider">Level {level} Companion</p>
          {titleRank && (
            <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border bg-gradient-to-r ${titleRank.bg} ${titleRank.border} ${titleRank.color}`}>
              {titleRank.emoji} {titleRank.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isMaxed && (
            <button onClick={() => setShowRetireConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-[10px] shadow-md hover:scale-105 transition-all animate-pulse">
              🎓 Retire!
            </button>
          )}
          <button onClick={() => setShowDressUp(!showDressUp)}
            className={`p-2 rounded-xl border transition-all ${showDressUp ? 'border-[#EA580C] bg-[#EA580C]/10 text-[#EA580C]' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            title="Dress Up Pet">
            <Scissors className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Retire Confirmation ── */}
      {showRetireConfirm && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3 animate-in slide-in-from-top duration-200">
          <p className="text-xs font-black text-amber-800 text-center">🎓 Retire {pet.petName} to the Hall of Fame and adopt a new pet?</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleRetire} disabled={isRetiring} className="py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all">
              {isRetiring ? '...' : 'Yes, Retire! 🌟'}
            </button>
            <button onClick={() => setShowRetireConfirm(false)} className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Dress Up Panel ── */}
      {showDressUp && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">👕 Wardrobe</span>
            <span className="text-[9px] font-bold text-[#EA580C]">{ownedAccessories.length} Owned</span>
          </div>
          {ownedAccessories.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-semibold text-center py-2">No accessories yet. Check the Rewards Shop! 🛍️</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ownedAccessories.map((acc) => {
                const isEq = equippedAccessories.includes(acc.key);
                return (
                  <button key={acc.key} onClick={() => toggleAccessory(acc.key)}
                    className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-1.5 ${isEq ? 'border-[#EA580C] bg-[#EA580C]/10 text-[#EA580C] shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                    <span>{acc.title}</span>
                    <span className="text-[8px] bg-slate-100 text-slate-400 rounded px-1 uppercase font-semibold">{isEq ? 'Equipped' : 'Equip'}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Wisdom Bubble ── */}
      {hasWisdomBubble && (
        <div className="relative bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2.5 text-center">
          <p className="text-[10px] font-bold text-blue-700 leading-relaxed">{randomTip}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-50 border-r border-b border-blue-200 rotate-45" />
        </div>
      )}

      {/* ── Pet Canvas ── */}
      <div className={`relative w-40 h-40 mx-auto rounded-[28px] flex items-center justify-center shadow-inner group border-2 overflow-hidden ${canvasGlowClass} ${bgScene ? BG_SCENES[bgScene].bg : 'bg-slate-50/50'}`}>

        {/* Background scene emojis */}
        {bgScene && BG_SCENES[bgScene].emojis.map((em, i) => (
          <span key={i} className="absolute select-none pointer-events-none opacity-70"
            style={{ left: `${8 + i * 19}%`, bottom: `${5 + (i % 3) * 12}%`, fontSize: `${10 + (i % 3) * 3}px` }}>
            {em}
          </span>
        ))}

        {/* Heart particles */}
        {showHearts && (
          <>
            <span className="heart-particle text-xl" style={{ left: '20%', bottom: '20%', animationDelay: '0s' }}>❤️</span>
            <span className="heart-particle text-lg" style={{ left: '50%', bottom: '30%', animationDelay: '.2s' }}>💖</span>
            <span className="heart-particle text-xl" style={{ left: '80%', bottom: '15%', animationDelay: '.4s' }}>✨</span>
          </>
        )}

        {/* Spark particles — Level 60+ */}
        {hasSparks && [
          { l: '15%', b: '10%', d: '0s' }, { l: '75%', b: '20%', d: '.6s' },
          { l: '45%', b: '5%',  d: '1.2s' },{ l: '85%', b: '40%', d: '.3s' },
        ].map((p, i) => (
          <span key={i} className="spark-particle" style={{ left: p.l, bottom: p.b, animationDelay: p.d }}>🔥</span>
        ))}

        {/* Diamond shimmer — Level 75+ */}
        {hasDiamondShimmer && [
          { l: '10%', t: '15%', d: '0s' }, { l: '80%', t: '10%', d: '.7s' },
          { l: '50%', t: '5%',  d: '1.4s' },{ l: '25%', t: '70%', d: '.4s' },
          { l: '70%', t: '65%', d: '1.1s' },
        ].map((p, i) => (
          <span key={i} className="diamond-particle" style={{ left: p.l, top: p.t, animationDelay: p.d }}>💎</span>
        ))}

        {/* Pet wrapper */}
        <div className={`relative w-28 h-28 z-10 ${isSpinning ? 'animate-pet-spin' : isWiggling ? 'animate-pet-wiggle' : 'bounce-gentle'}`}>
          {/* Cape behind */}
          {equippedAccessories.includes('cape') && (
            <div className="absolute pointer-events-none z-0" style={{ top: ACCESSORY_OFFSETS[pet.petType].cape.top, left: ACCESSORY_OFFSETS[pet.petType].cape.left, width: ACCESSORY_OFFSETS[pet.petType].cape.width, height: ACCESSORY_OFFSETS[pet.petType].cape.width }}>
              {renderAccessorySvg('cape')}
            </div>
          )}
          {/* Pet image */}
          <img src={`/assets/animals/${pet.petType}.png`} className={`w-full h-full object-contain relative z-10 select-none pointer-events-none ${petImgClass}`} alt={pet.petName} />
          {/* Crown — from perk OR wardrobe */}
          {(hasCrownPerk || equippedAccessories.includes('crown')) && (
            <div className="absolute pointer-events-none z-20" style={{ top: ACCESSORY_OFFSETS[pet.petType].crown.top, left: ACCESSORY_OFFSETS[pet.petType].crown.left, width: ACCESSORY_OFFSETS[pet.petType].crown.width, height: ACCESSORY_OFFSETS[pet.petType].crown.width }}>
              {renderAccessorySvg('crown')}
            </div>
          )}
          {equippedAccessories.includes('wizard') && (
            <div className="absolute pointer-events-none z-20" style={{ top: ACCESSORY_OFFSETS[pet.petType].wizard.top, left: ACCESSORY_OFFSETS[pet.petType].wizard.left, width: ACCESSORY_OFFSETS[pet.petType].wizard.width, height: ACCESSORY_OFFSETS[pet.petType].wizard.width }}>
              {renderAccessorySvg('wizard')}
            </div>
          )}
          {equippedAccessories.includes('sunglasses') && (
            <div className="absolute pointer-events-none z-20" style={{ top: ACCESSORY_OFFSETS[pet.petType].sunglasses.top, left: ACCESSORY_OFFSETS[pet.petType].sunglasses.left, width: ACCESSORY_OFFSETS[pet.petType].sunglasses.width, height: `calc(${ACCESSORY_OFFSETS[pet.petType].sunglasses.width} * 0.6)` }}>
              {renderAccessorySvg('sunglasses')}
            </div>
          )}
          {equippedAccessories.includes('bowtie') && (
            <div className="absolute pointer-events-none z-20" style={{ top: ACCESSORY_OFFSETS[pet.petType].bowtie.top, left: ACCESSORY_OFFSETS[pet.petType].bowtie.left, width: ACCESSORY_OFFSETS[pet.petType].bowtie.width, height: `calc(${ACCESSORY_OFFSETS[pet.petType].bowtie.width} * 0.6)` }}>
              {renderAccessorySvg('bowtie')}
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Panel ── */}
      <div className="space-y-3">
        {/* Hunger */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-black text-slate-500">
            <span>🍔 Tummy Fullness</span><span>{pet.petHunger || 0}/100</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${(pet.petHunger||0)>=50?'bg-emerald-400':(pet.petHunger||0)>=20?'bg-amber-400':'bg-rose-400 animate-pulse'}`} style={{ width:`${pet.petHunger||0}%` }} />
          </div>
        </div>

        {/* Mood */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-black text-slate-500">
            <span>❤️ Happiness</span><span>{pet.petMood || 0}/100</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${(pet.petMood||0)>=50?'bg-pink-400':(pet.petMood||0)>=20?'bg-green-400':'bg-red-400 animate-pulse'}`} style={{ width:`${pet.petMood||0}%` }} />
          </div>
        </div>

        {/* XP */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-black text-[#EA580C]">
            <span>⭐ Level XP {level >= 55 && <span className="text-green-600 ml-1 font-black">⚡ +47% Boost</span>}</span>
            {isMaxed ? <span className="text-yellow-600 font-black">MAX LEVEL 🎓</span> : <span>{pet.petXp||0}/{xpRequired} ({xpPct}%)</span>}
          </div>
          <div className="w-full h-2 bg-orange-50 rounded-full overflow-hidden border border-orange-100/50">
            <div className="h-full bg-gradient-to-r from-[#EA580C] to-pink-400 rounded-full transition-all duration-500" style={{ width:`${isMaxed?100:xpPct}%` }} />
          </div>
        </div>

        {/* ── Next Locked Perk ── */}
        {nextPerk && !isMaxed && (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Next Perk — Level {nextPerk.level}</p>
              <p className="text-[11px] font-black text-slate-500 truncate">{nextPerk.name}</p>
              <p className="text-[9px] text-slate-400 font-semibold leading-tight">{nextPerk.desc}</p>
            </div>
            <span className="text-[9px] font-black text-slate-400 flex-shrink-0 bg-slate-200 px-2 py-1 rounded-lg">
              {nextPerk.level - level} lvls
            </span>
          </div>
        )}

        {/* Max Level Banner */}
        {isMaxed && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-3 text-center space-y-1">
            <p className="text-sm font-black text-yellow-700">🎓 MAXED OUT — Legend of Legends!</p>
            <p className="text-[10px] text-amber-600 font-semibold">Your pet reached the highest level! Retire them to the Hall of Fame and adopt a new companion to continue.</p>
          </div>
        )}
      </div>

      {/* ── Control Buttons ── */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {isMaxed ? (
          <button onClick={() => setShowRetireConfirm(true)}
            className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-xs shadow-md transition-all hover:scale-[1.03] active:scale-95">
            🎓 Retire Your Legend!
          </button>
        ) : (
          <>
            <button onClick={handleFeed} disabled={pointsBalance < 10 || isFeeding}
              className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all hover:scale-[1.03] active:scale-95">
              <span>🍎 Feed</span>
              <span className="bg-amber-500/30 text-[9px] px-1.5 py-0.5 rounded-md">-10 pts</span>
            </button>
            <button onClick={handlePet} disabled={isWiggling || isSpinning}
              className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-pink-400 hover:bg-pink-500 text-white font-black text-xs shadow-md transition-all hover:scale-[1.03] active:scale-95">
              {level >= 25 ? '🎪 Spin Buddy' : '✨ Pet Buddy'}
            </button>
          </>
        )}
      </div>

      {!isMaxed && pointsBalance < 10 && (
        <p className="text-[9px] text-center text-rose-500 font-bold">
          ⚠️ You need at least 10 homework points to feed your pet!
        </p>
      )}
    </div>
  );
}
