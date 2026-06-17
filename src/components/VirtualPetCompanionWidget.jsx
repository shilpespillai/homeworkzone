import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { playEat, playLevelUp, playPetChirp } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { Heart, Sparkles, Smile, Crown, Scissors } from 'lucide-react';

const ACCESSORY_OFFSETS = {
  bunny: {
    crown: { top: '0%', left: '33%', width: '34%' },
    wizard: { top: '-23%', left: '20%', width: '60%' },
    cape: { top: '55%', left: '12%', width: '76%' },
    sunglasses: { top: '35%', left: '26%', width: '48%' },
    bowtie: { top: '65%', left: '38%', width: '24%' }
  },
  bear: {
    crown: { top: '-5%', left: '32%', width: '36%' },
    wizard: { top: '-28%', left: '22%', width: '56%' },
    cape: { top: '50%', left: '10%', width: '80%' },
    sunglasses: { top: '30%', left: '23%', width: '54%' },
    bowtie: { top: '70%', left: '38%', width: '24%' }
  },
  monkey: {
    crown: { top: '-2%', left: '34%', width: '32%' },
    wizard: { top: '-25%', left: '24%', width: '52%' },
    cape: { top: '55%', left: '15%', width: '70%' },
    sunglasses: { top: '32%', left: '25%', width: '50%' },
    bowtie: { top: '75%', left: '38%', width: '24%' }
  },
  squirrel: {
    crown: { top: '2%', left: '32%', width: '36%' },
    wizard: { top: '-22%', left: '20%', width: '60%' },
    cape: { top: '52%', left: '12%', width: '76%' },
    sunglasses: { top: '36%', left: '26%', width: '48%' },
    bowtie: { top: '68%', left: '38%', width: '24%' }
  },
  koala: {
    crown: { top: '-3%', left: '32%', width: '36%' },
    wizard: { top: '-26%', left: '22%', width: '56%' },
    cape: { top: '52%', left: '10%', width: '80%' },
    sunglasses: { top: '32%', left: '22%', width: '56%' },
    bowtie: { top: '72%', left: '38%', width: '24%' }
  }
};

const PET_TYPES = [
  { id: 'bunny', label: 'Bunny 🐰', image: '/assets/animals/bunny.png' },
  { id: 'bear', label: 'Bear 🐻', image: '/assets/animals/bear.png' },
  { id: 'monkey', label: 'Monkey 🐵', image: '/assets/animals/monkey.png' },
  { id: 'squirrel', label: 'Squirrel 🐿️', image: '/assets/animals/squirrel.png' },
  { id: 'koala', label: 'Koala 🐨', image: '/assets/animals/koala.png' }
];

export default function VirtualPetCompanionWidget({ 
  currentStudentProfile, 
  pointsBalance, 
  onProfileUpdate, 
  teacher, 
  classroom, 
  studentName 
}) {
  const [selectedPetType, setSelectedPetType] = useState('bunny');
  const [petNameInput, setPetNameInput] = useState('');
  const [isAdopting, setIsAdopting] = useState(false);
  
  const [isWiggling, setIsWiggling] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [showDressUp, setShowDressUp] = useState(false);

  const pet = currentStudentProfile?.pet;
  const redeemedItems = currentStudentProfile?.redeemedItems || [];
  const equippedAccessories = pet?.equippedAccessories || [];

  // Filter shop items that represent pet accessories and check if student redeemed them
  const petAccessoriesMap = {
    'Crown for Pet 👑': 'crown',
    'Wizard Hat for Pet 🧙': 'wizard',
    'Superhero Cape for Pet 🦸': 'cape',
    'Cool Sunglasses for Pet 😎': 'sunglasses',
    'Bowtie for Pet 🎀': 'bowtie'
  };

  const ownedAccessories = Object.keys(petAccessoriesMap)
    .filter(title => redeemedItems.includes(title))
    .map(title => ({
      key: petAccessoriesMap[title],
      title: title.replace(' for Pet', '')
    }));

  const handleAdopt = async () => {
    if (!petNameInput.trim()) return;
    setIsAdopting(true);
    try {
      const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
      const actualClass = classroom || savedStudent?.classroom;
      const actualTeacher = teacher || savedStudent?.teacher;
      
      if (actualClass?.id && actualTeacher?.uid && studentName) {
        const studentRef = doc(
          db, 
          'teachers', 
          actualTeacher.uid, 
          'classrooms', 
          actualClass.id, 
          'students', 
          studentName.trim().toLowerCase()
        );
        
        await updateDoc(studentRef, {
          pet: {
            petType: selectedPetType,
            petName: petNameInput.trim(),
            petHunger: 50,
            petMood: 50,
            petLevel: 1,
            petXp: 0,
            equippedAccessories: []
          }
        });
        
        triggerConfetti();
        playLevelUp();
        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error("Failed to adopt pet:", e);
    } finally {
      setIsAdopting(false);
    }
  };

  const handleFeed = async () => {
    if (pointsBalance < 10 || isFeeding) return;
    setIsFeeding(true);
    playEat();

    try {
      const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
      const actualClass = classroom || savedStudent?.classroom;
      const actualTeacher = teacher || savedStudent?.teacher;

      if (actualClass?.id && actualTeacher?.uid && studentName && pet) {
        const studentRef = doc(
          db, 
          'teachers', 
          actualTeacher.uid, 
          'classrooms', 
          actualClass.id, 
          'students', 
          studentName.trim().toLowerCase()
        );

        let newHunger = Math.min(100, (pet.petHunger || 0) + 20);
        let newXp = (pet.petXp || 0) + 15;
        let newLevel = pet.petLevel || 1;
        let levelUpHappened = false;

        const threshold = newLevel * 100;
        if (newXp >= threshold) {
          newXp = newXp - threshold;
          newLevel += 1;
          levelUpHappened = true;
        }

        await updateDoc(studentRef, {
          'pet.petHunger': newHunger,
          'pet.petXp': newXp,
          'pet.petLevel': newLevel,
          petSpentPoints: increment(10)
        });

        if (levelUpHappened) {
          playLevelUp();
          triggerConfetti();
          setTimeout(() => {
            alert(`🎉 Amazing! Your pet ${pet.petName} leveled up to Level ${newLevel}! Keep up the great work! 🌟`);
          }, 500);
        }

        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error("Failed to feed pet:", e);
    } finally {
      setIsFeeding(false);
    }
  };

  const handlePet = async () => {
    if (isWiggling) return;
    setIsWiggling(true);
    setShowHearts(true);
    playPetChirp();

    try {
      const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
      const actualClass = classroom || savedStudent?.classroom;
      const actualTeacher = teacher || savedStudent?.teacher;

      if (actualClass?.id && actualTeacher?.uid && studentName && pet) {
        const studentRef = doc(
          db, 
          'teachers', 
          actualTeacher.uid, 
          'classrooms', 
          actualClass.id, 
          'students', 
          studentName.trim().toLowerCase()
        );

        const newMood = Math.min(100, (pet.petMood || 0) + 10);

        await updateDoc(studentRef, {
          'pet.petMood': newMood
        });

        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error("Failed to pet animal:", e);
    }

    setTimeout(() => {
      setIsWiggling(false);
    }, 800);

    setTimeout(() => {
      setShowHearts(false);
    }, 1500);
  };

  const toggleAccessory = async (accKey) => {
    if (!pet) return;
    const isEquipped = equippedAccessories.includes(accKey);
    const newEquipped = isEquipped 
      ? equippedAccessories.filter(k => k !== accKey)
      : [...equippedAccessories, accKey];

    try {
      const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
      const actualClass = classroom || savedStudent?.classroom;
      const actualTeacher = teacher || savedStudent?.teacher;

      if (actualClass?.id && actualTeacher?.uid && studentName) {
        const studentRef = doc(
          db, 
          'teachers', 
          actualTeacher.uid, 
          'classrooms', 
          actualClass.id, 
          'students', 
          studentName.trim().toLowerCase()
        );

        await updateDoc(studentRef, {
          'pet.equippedAccessories': newEquipped
        });

        if (onProfileUpdate) onProfileUpdate();
      }
    } catch (e) {
      console.error("Failed to toggle accessory:", e);
    }
  };

  // SVG Accessory Drawings
  const renderAccessorySvg = (accKey) => {
    switch (accKey) {
      case 'crown':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
            <path d="M10 80 L20 30 L40 55 L50 25 L60 55 L80 30 L90 80 Z" fill="#FBBF24" />
            <rect x="10" y="75" width="80" height="8" rx="2" fill="#D97706" />
            <circle cx="20" cy="27" r="5" fill="#EF4444" />
            <circle cx="50" cy="22" r="5" fill="#3B82F6" />
            <circle cx="80" cy="27" r="5" fill="#EF4444" />
            <circle cx="30" cy="79" r="3" fill="#10B981" />
            <circle cx="50" cy="79" r="3" fill="#3B82F6" />
            <circle cx="70" cy="79" r="3" fill="#10B981" />
          </svg>
        );
      case 'wizard':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
            <path d="M50 8 L85 80 L15 80 Z" fill="#5B3E96" />
            <path d="M15 80 Q50 85 85 80 L87 85 Q50 91 13 85 Z" fill="#FBBF24" />
            <ellipse cx="50" cy="82" rx="42" ry="10" fill="#4C2A85" />
            {/* Tiny stars */}
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
            <path d="M10 15 L50 30 L10 45 Z" fill="#EF4444" />
            <path d="M90 15 L50 30 L90 45 Z" fill="#EF4444" />
            <circle cx="50" cy="30" r="11" fill="#DC2626" />
            {/* Details */}
            <path d="M15 20 L40 29 M15 40 L40 31" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
            <path d="M85 20 L60 29 M85 40 L60 31" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Custom keyframe styles injected dynamically
  useEffect(() => {
    const styleId = 'pet-animations-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes petWiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-8deg) scale(1.05); }
          75% { transform: rotate(8deg) scale(1.05); }
        }
        .animate-pet-wiggle {
          animation: petWiggle 0.4s ease-in-out infinite;
        }
        @keyframes heartFloat {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
        }
        .heart-particle {
          position: absolute;
          animation: heartFloat 1.2s ease-out forwards;
          color: #EF4444;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (!pet || !pet.petType) {
    // Adoption View
    return (
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-[32px] p-6 space-y-5 animate-in fade-in duration-300">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-black text-[#2D3748] flex items-center justify-center gap-2">
            <span>🐾</span> Study Pet Buddy
          </h3>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Adopt a cute virtual companion! They grow stronger as you do your homework!
          </p>
        </div>

        {/* Pet selection carousel */}
        <div className="grid grid-cols-5 gap-2">
          {PET_TYPES.map((pt) => (
            <button
              key={pt.id}
              onClick={() => setSelectedPetType(pt.id)}
              className={`p-2 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                selectedPetType === pt.id 
                  ? 'border-[#EA580C] bg-[#EA580C]/10 shadow-sm' 
                  : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <img src={pt.image} className="w-8 h-8 object-contain" alt={pt.label} />
              <span className="text-[9px] font-black text-slate-700 whitespace-nowrap overflow-hidden">
                {pt.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Preview */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 flex flex-col items-center justify-center">
          <img 
            src={PET_TYPES.find(p => p.id === selectedPetType)?.image} 
            className="w-20 h-20 object-contain bounce-gentle" 
            alt="Preview" 
          />
        </div>

        {/* Adoption Inputs */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Name your buddy
            </label>
            <input 
              type="text" 
              value={petNameInput}
              onChange={(e) => setPetNameInput(e.target.value.slice(0, 12))}
              placeholder="e.g. Barnaby, Pippin"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 text-xs font-semibold text-[#2D3748] placeholder:text-slate-300"
            />
          </div>

          <button
            onClick={handleAdopt}
            disabled={!petNameInput.trim() || isAdopting}
            className="w-full bg-[#EA580C] hover:bg-[#c2410c] text-white py-3 rounded-2xl font-black text-xs shadow-md transition-all disabled:opacity-40 disabled:hover:scale-100 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isAdopting ? 'Welcoming companion...' : 'Adopt Study Buddy! 🎉'}
          </button>
        </div>
      </div>
    );
  }

  // Active Companion View
  const progressToNextLevel = pet.petXp || 0;
  const xpRequired = pet.petLevel * 100;
  const xpPercentage = Math.min(100, Math.round((progressToNextLevel / xpRequired) * 100));

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-[32px] p-6 space-y-5 animate-in fade-in duration-300 relative overflow-hidden">
      
      {/* Top Header info */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-black text-[#2D3748] flex items-center gap-1.5">
            <span>✨</span> {pet.petName}
          </h3>
          <p className="text-[10px] font-black text-[#EA580C] uppercase tracking-wider">
            Level {pet.petLevel} Companion
          </p>
        </div>
        <button
          onClick={() => setShowDressUp(!showDressUp)}
          className={`p-2 rounded-xl border transition-all ${
            showDressUp 
              ? 'border-[#EA580C] bg-[#EA580C]/10 text-[#EA580C]' 
              : 'border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
          }`}
          title="Dress Up Pet"
        >
          <Scissors className="w-4 h-4" />
        </button>
      </div>

      {/* Dress Up Panel */}
      {showDressUp && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              👕 Wardrobe
            </span>
            <span className="text-[9px] font-bold text-[#EA580C]">
              {ownedAccessories.length} Accessories Owned
            </span>
          </div>

          {ownedAccessories.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-semibold text-center py-2">
              No accessories owned yet. Get some from the Rewards Shop! 🛍️
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ownedAccessories.map((acc) => {
                const isEquipped = equippedAccessories.includes(acc.key);
                return (
                  <button
                    key={acc.key}
                    onClick={() => toggleAccessory(acc.key)}
                    className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      isEquipped
                        ? 'border-[#EA580C] bg-[#EA580C]/10 text-[#EA580C] shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{acc.title}</span>
                    <span className="text-[8px] bg-slate-100 text-slate-400 rounded px-1 uppercase font-semibold">
                      {isEquipped ? 'Equipped' : 'Equip'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pet Interactive Canvas Area */}
      <div className="relative w-40 h-40 mx-auto bg-slate-50/50 border border-slate-100 rounded-[28px] flex items-center justify-center shadow-inner group">
        
        {/* Floating Heart Particles */}
        {showHearts && (
          <>
            <span className="heart-particle text-xl" style={{ left: '20%', bottom: '20%', animationDelay: '0s' }}>❤️</span>
            <span className="heart-particle text-lg" style={{ left: '50%', bottom: '30%', animationDelay: '0.2s' }}>💖</span>
            <span className="heart-particle text-xl" style={{ left: '80%', bottom: '15%', animationDelay: '0.4s' }}>✨</span>
          </>
        )}

        {/* Pet Display Wrapper */}
        <div className={`relative w-28 h-28 ${isWiggling ? 'animate-pet-wiggle' : 'bounce-gentle'}`}>
          
          {/* 1. Cape Accessory Overlay (sits behind pet) */}
          {equippedAccessories.includes('cape') && (
            <div 
              className="absolute pointer-events-none z-0" 
              style={{
                top: ACCESSORY_OFFSETS[pet.petType].cape.top,
                left: ACCESSORY_OFFSETS[pet.petType].cape.left,
                width: ACCESSORY_OFFSETS[pet.petType].cape.width,
                height: ACCESSORY_OFFSETS[pet.petType].cape.width // Square proportion
              }}
            >
              {renderAccessorySvg('cape')}
            </div>
          )}

          {/* 2. Primary Animal Image */}
          <img 
            src={`/assets/animals/${pet.petType}.png`} 
            className="w-full h-full object-contain relative z-10 select-none pointer-events-none" 
            alt={pet.petName} 
          />

          {/* 3. Crown Overlay */}
          {equippedAccessories.includes('crown') && (
            <div 
              className="absolute pointer-events-none z-20" 
              style={{
                top: ACCESSORY_OFFSETS[pet.petType].crown.top,
                left: ACCESSORY_OFFSETS[pet.petType].crown.left,
                width: ACCESSORY_OFFSETS[pet.petType].crown.width,
                height: ACCESSORY_OFFSETS[pet.petType].crown.width
              }}
            >
              {renderAccessorySvg('crown')}
            </div>
          )}

          {/* 4. Wizard Hat Overlay */}
          {equippedAccessories.includes('wizard') && (
            <div 
              className="absolute pointer-events-none z-20" 
              style={{
                top: ACCESSORY_OFFSETS[pet.petType].wizard.top,
                left: ACCESSORY_OFFSETS[pet.petType].wizard.left,
                width: ACCESSORY_OFFSETS[pet.petType].wizard.width,
                height: ACCESSORY_OFFSETS[pet.petType].wizard.width
              }}
            >
              {renderAccessorySvg('wizard')}
            </div>
          )}

          {/* 5. Sunglasses Overlay */}
          {equippedAccessories.includes('sunglasses') && (
            <div 
              className="absolute pointer-events-none z-20" 
              style={{
                top: ACCESSORY_OFFSETS[pet.petType].sunglasses.top,
                left: ACCESSORY_OFFSETS[pet.petType].sunglasses.left,
                width: ACCESSORY_OFFSETS[pet.petType].sunglasses.width,
                height: `calc(${ACCESSORY_OFFSETS[pet.petType].sunglasses.width} * 0.6)`
              }}
            >
              {renderAccessorySvg('sunglasses')}
            </div>
          )}

          {/* 6. Bowtie Overlay */}
          {equippedAccessories.includes('bowtie') && (
            <div 
              className="absolute pointer-events-none z-20" 
              style={{
                top: ACCESSORY_OFFSETS[pet.petType].bowtie.top,
                left: ACCESSORY_OFFSETS[pet.petType].bowtie.left,
                width: ACCESSORY_OFFSETS[pet.petType].bowtie.width,
                height: `calc(${ACCESSORY_OFFSETS[pet.petType].bowtie.width} * 0.6)`
              }}
            >
              {renderAccessorySvg('bowtie')}
            </div>
          )}
        </div>
      </div>

      {/* Pet Stats Info Panel */}
      <div className="space-y-3">
        {/* Hunger / Fullness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
            <span>🍔 Tummy Fullness</span>
            <span>{pet.petHunger || 0}/100</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                (pet.petHunger || 0) >= 50 ? 'bg-emerald-400' : (pet.petHunger || 0) >= 20 ? 'bg-amber-400' : 'bg-rose-400 animate-pulse'
              }`}
              style={{ width: `${pet.petHunger || 0}%` }}
            />
          </div>
        </div>

        {/* Mood / Happiness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
            <span>❤️ Happiness</span>
            <span>{pet.petMood || 0}/100</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                (pet.petMood || 0) >= 50 ? 'bg-pink-400' : (pet.petMood || 0) >= 20 ? 'bg-green-400' : 'bg-red-400 animate-pulse'
              }`}
              style={{ width: `${pet.petMood || 0}%` }}
            />
          </div>
        </div>

        {/* XP Progress to next level */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black text-[#EA580C]">
            <span>⭐ Level Experience</span>
            <span>{pet.petXp || 0}/{xpRequired} XP ({xpPercentage}%)</span>
          </div>
          <div className="w-full h-2 bg-orange-50 rounded-full overflow-hidden border border-orange-100/50">
            <div 
              className="h-full bg-gradient-to-r from-[#EA580C] to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={handleFeed}
          disabled={pointsBalance < 10 || isFeeding}
          className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all hover:scale-[1.03] active:scale-95"
        >
          <span>🍎 Feed</span>
          <span className="bg-amber-500/30 text-[9px] px-1.5 py-0.5 rounded-md">-10 pts</span>
        </button>

        <button
          onClick={handlePet}
          disabled={isWiggling}
          className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-pink-400 hover:bg-pink-500 text-white font-black text-xs shadow-md transition-all hover:scale-[1.03] active:scale-95"
        >
          <span>✨ Pet Buddy</span>
        </button>
      </div>

      {/* Tiny point warning */}
      {pointsBalance < 10 && (
        <p className="text-[9px] text-center text-rose-500 font-bold leading-normal">
          ⚠️ You need at least 10 homework points to feed your pet!
        </p>
      )}
    </div>
  );
}
