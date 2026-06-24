import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { Compass, Map, Trophy, Users, Award, Sparkles, X } from 'lucide-react';

const TRACK_COORDS = {
  forest: [
    { x: 60,  y: 360 }, // 0
    { x: 140, y: 240 }, // 1
    { x: 240, y: 180 }, // 2
    { x: 320, y: 300 }, // 3
    { x: 440, y: 340 }, // 4
    { x: 520, y: 200 }, // 5
    { x: 600, y: 130 }, // 6
    { x: 700, y: 260 }, // 7
    { x: 800, y: 320 }, // 8
    { x: 890, y: 190 }, // 9
    { x: 960, y: 90 }   // 10 (Finish!)
  ],
  space: [
    { x: 80,  y: 220 },  // 0
    { x: 180, y: 120 },  // 1
    { x: 300, y: 80 },   // 2
    { x: 450, y: 150 },  // 3
    { x: 520, y: 280 },  // 4
    { x: 420, y: 365 },  // 5
    { x: 280, y: 330 },  // 6
    { x: 320, y: 220 },  // 7
    { x: 620, y: 200 },  // 8
    { x: 800, y: 140 },  // 9
    { x: 940, y: 220 }   // 10
  ],
  sports: [
    { x: 100, y: 330 },  // 0
    { x: 280, y: 330 },  // 1
    { x: 460, y: 330 },  // 2
    { x: 640, y: 330 },  // 3
    { x: 820, y: 330 },  // 4
    { x: 910, y: 230 },  // 5
    { x: 820, y: 130 },  // 6
    { x: 640, y: 130 },  // 7
    { x: 460, y: 130 },  // 8
    { x: 280, y: 130 },  // 9
    { x: 100, y: 130 }   // 10
  ]
};

const MILESTONE_DETAILS = {
  forest: [
    { name: "Start Base Camp ⛺", desc: "Adventure begins here!" },
    { name: "Whispering Woods 🌳", desc: "Hear the wind rustle through the ancient leaves." },
    { name: "Mushroom Glade 🍄", desc: "A cozy clearing filled with colorful, glowing mushrooms." },
    { name: "Babbling Brook 🌊", desc: "Hop across the slippery stones to stay dry!" },
    { name: "Fairy Ring 🧚", desc: "Magical fairy dust shimmers all around you." },
    { name: "Firefly Hollow 🪰", desc: "Warm glowing lights show you the path ahead." },
    { name: "Shadowy Path 🌲", desc: "Be brave! The sun will shine again soon." },
    { name: "Ancient Oak 🌳", desc: "A giant tree that has stood here for a thousand years." },
    { name: "Waterfall Climb 🌊", desc: "Scale the wet rocks beside the thundering waters!" },
    { name: "Dragon's Cave 🐉", desc: "Quietly sneak past the sleeping keeper of the gate." },
    { name: "Treasure Castle 🏰", desc: "You made it! Unlock the legendary gold chest! 🎉" }
  ],
  space: [
    { name: "Launch Pad 🚀", desc: "Ignition sequence starts... 3, 2, 1, lift off!" },
    { name: "Orbit Station 🛰️", desc: "Float above the Earth's atmosphere." },
    { name: "Moon Crater ☄️", desc: "Bounce around in low gravity!" },
    { name: "Asteroid Belt 🪨", desc: "Steer carefully through the giant floating rocks." },
    { name: "Mars Outpost 🔴", desc: "Explore the dusty canyons of the red planet." },
    { name: "Jupiter's Ring 🪐", desc: "Sail along the ice particles of the gas giant." },
    { name: "Nebula Clouds 🌌", desc: "Fly through glowing pink and purple stellar gas." },
    { name: "Wormhole Leap 🌀", desc: "Hold tight! Folding space and time!" },
    { name: "Star Cluster ✨", desc: "Zipping through millions of bright solar systems." },
    { name: "Supernova Edge 💥", desc: "Watch out for the energy flares of a dying star!" },
    { name: "Galaxy Portal 🌌", desc: "Welcome to deep space! You are a cosmic master! 🌟" }
  ],
  sports: [
    { name: "Warmup Zone 🤸", desc: "Get stretched and ready for action!" },
    { name: "Sprint Lane 🏃", desc: "Dash forward as fast as your legs can carry you!" },
    { name: "Hurdle Jump 🚧", desc: "Leap over the obstacles with perfect timing." },
    { name: "Relay Pass 🏃‍♂️", desc: "Pass the baton to your teammates to keep going!" },
    { name: "Long Jump Pit 🦘", desc: "Fly through the air and land in the sand." },
    { name: "High Jump Bar 🪜", desc: "Arch your back and clear the bar!" },
    { name: "Discus Circle ☄️", desc: "Spin and launch the disc into the distance." },
    { name: "Penalty Kick ⚽", desc: "Aim, shoot, and SCORE past the goalkeeper!" },
    { name: "Water Obstacle 🏊", desc: "Leap over the water pool and stay strong." },
    { name: "Final Stretch 🏁", desc: "The crowd is cheering! Almost at the line!" },
    { name: "Victory Podium 🏆", desc: "Take your place on the Gold stand! Champion! 🎖️" }
  ]
};

const GIFTS = [
  { emoji: "💎", name: "Crystal of Clarity", desc: "A glowing blue crystal that helps you focus." },
  { emoji: "👑", name: "Crown of the Scholar", desc: "Worn by the wisest students in the realm." },
  { emoji: "🐉", name: "Dragon Egg", desc: "It's warm to the touch. Keep it safe!" },
  { emoji: "🪄", name: "Magic Wand", desc: "Sparks fly when you wave it." },
  { emoji: "🦄", name: "Unicorn Horn", desc: "Shimmers with all the colors of the rainbow." },
  { emoji: "🏆", name: "Golden Chalice", desc: "A legendary cup of victory." },
  { emoji: "🌟", name: "Fallen Star", desc: "It still glows with cosmic energy." },
  { emoji: "🧭", name: "Explorer's Compass", desc: "It always points towards your next goal." },
  { emoji: "📜", name: "Ancient Scroll", desc: "Contains secrets of the old masters." },
  { emoji: "🔮", name: "Mystic Orb", desc: "You can see galaxies swirling inside." }
];

const getSubmissionDate = (sub) => {
  if (sub.submittedAt?.toDate) return sub.submittedAt.toDate();
  if (sub.submittedAt) return new Date(sub.submittedAt);
  return new Date(0);
};

const isDateInCurrentWeek = (date) => {
  const now = new Date();
  
  // Get the start of the current week (Monday 00:00:00)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Get the end of the current week (Sunday 23:59:59.999)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
};

const getWeeklyResetCountdown = () => {
  const now = new Date();
  
  // Get next Monday 00:00:00
  const nextMonday = new Date(now);
  const day = nextMonday.getDay();
  const diff = nextMonday.getDate() + (day === 0 ? 1 : 8 - day);
  nextMonday.setDate(diff);
  nextMonday.setHours(0, 0, 0, 0);
  
  const msDiff = nextMonday.getTime() - now.getTime();
  const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((msDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  return `${hours}h`;
};

export default function AdventureMazeView({ 
  classroom, 
  teacher, 
  classroomStudents = [], 
  submissions = [], 
  studentName,
  getStudentAvatar 
}) {
  const [liveClassroom, setLiveClassroom] = useState(classroom);
  const [liveSubmissions, setLiveSubmissions] = useState(submissions);
  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [countdownText, setCountdownText] = useState(getWeeklyResetCountdown());
  const [claimedTreasures, setClaimedTreasures] = useState([]);
  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);
  const [activeGift, setActiveGift] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownText(getWeeklyResetCountdown());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student') || '{}');
  const teacherUid = teacher?.uid || savedStudent?.teacher?.uid;
  const classroomId = classroom?.id || savedStudent?.classroom?.id;

  useEffect(() => {
    if (studentName && classroomId) {
      try {
        const saved = localStorage.getItem(`hwz_treasures_${studentName}_${classroomId}`);
        if (saved) setClaimedTreasures(JSON.parse(saved));
      } catch (e) {}
    }
  }, [studentName, classroomId]);

  const handleOpenTreasure = (lap) => {
    const gift = GIFTS[(lap - 1) % GIFTS.length];
    setActiveGift(gift);
    setIsTreasureModalOpen(true);
    const updated = [...claimedTreasures, lap];
    setClaimedTreasures(updated);
    if (studentName && classroomId) {
      localStorage.setItem(`hwz_treasures_${studentName}_${classroomId}`, JSON.stringify(updated));
    }
  };

  // Real-time listener for classroom doc to track active map track changes
  useEffect(() => {
    if (!teacherUid || !classroomId) return;
    const classroomRef = doc(db, 'teachers', teacherUid, 'classrooms', classroomId);
    const unsubscribe = onSnapshot(classroomRef, (snap) => {
      if (snap.exists()) {
        setLiveClassroom({ id: snap.id, ...snap.data() });
      }
    });
    return () => unsubscribe();
  }, [teacherUid, classroomId]);

  // Real-time listener for submissions to track points changes
  useEffect(() => {
    if (!classroomId) return;
    const q = query(collection(db, 'submissions'), where('classId', '==', classroomId));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setLiveSubmissions(list);
    });
    return () => unsubscribe();
  }, [classroomId]);

  const activeTrack = liveClassroom?.activeTrack || 'forest'; // 'forest', 'space', 'sports'

  const activeCoords = useMemo(() => {
    return TRACK_COORDS[activeTrack] || TRACK_COORDS.forest;
  }, [activeTrack]);

  // Map student points
  const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');

  const studentsWithMilestones = useMemo(() => {
    // 1. Calculate scores for all students in class roster
    const scores = {};
    classroomStudents.forEach(s => {
      scores[s.name] = 0;
    });

    liveSubmissions.forEach(sub => {
      // Filter by current week
      const subDate = getSubmissionDate(sub);
      if (!isDateInCurrentWeek(subDate)) return;

      const subName = normalizeName(sub.studentName);
      const matched = classroomStudents.find(s => normalizeName(s.name) === subName || normalizeName(s.id) === subName);
      if (matched) {
        const correct = sub.correctCount || 0;
        const wrong = (sub.totalQuestions || 0) - correct;
        // +10 XP per correct answer, -5 XP per wrong answer
        const net = (correct * 10) - (wrong * 5);
        scores[matched.name] = (scores[matched.name] || 0) + net;
      }
    });

    // Ensure the current student is represented
    const activeStudentName = classroomStudents.find(s => normalizeName(s.name) === normalizeName(studentName))?.name || studentName;
    if (scores[activeStudentName] === undefined) {
      scores[activeStudentName] = 0;
    }

    // 2. Map scores to milestones (50 points = 1 milestone)
    const list = Object.keys(scores).map(name => {
      // Floor at 0 — students can't go below the start line
      const pts = Math.max(0, scores[name] || 0);
      
      const totalSteps = Math.floor(pts / 50);
      let lap = 1;
      let milestone = 0;
      if (totalSteps > 0) {
        if (totalSteps % 10 === 0) {
          milestone = 10;
          lap = Math.floor(totalSteps / 10);
        } else {
          milestone = totalSteps % 10;
          lap = Math.floor(totalSteps / 10) + 1;
        }
      }

      const studentObj = classroomStudents.find(s => normalizeName(s.name) === normalizeName(name)) || {};
      
      return {
        name,
        points: pts,
        milestone,
        lap,
        avatarUrl: studentObj.avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`,
        isMe: normalizeName(name) === normalizeName(studentName)
      };
    });

    return list;
  }, [classroomStudents, liveSubmissions, studentName]);

  // Group students by milestone to cluster them without overlapping
  const studentsByMilestone = useMemo(() => {
    const map = {};
    for (let i = 0; i <= 10; i++) {
      map[i] = [];
    }
    studentsWithMilestones.forEach(s => {
      map[s.milestone].push(s);
    });
    return map;
  }, [studentsWithMilestones]);

  // Get offset coordinates for multiple students clustering on a milestone node
  const getOffsetPosition = (milestoneIdx, studentIdx, totalInMilestone) => {
    const base = activeCoords[milestoneIdx];
    if (totalInMilestone <= 1) return { x: base.x, y: base.y };
    // Arrange in a neat little circle surrounding the milestone dot
    const radius = 26; // pixels distance
    const angle = (studentIdx * 2 * Math.PI) / totalInMilestone;
    return {
      x: base.x + radius * Math.cos(angle),
      y: base.y + radius * Math.sin(angle)
    };
  };

  // Build SVG path coordinates string
  const pathD = useMemo(() => {
    return activeCoords.map((c, i) => (i === 0 ? 'M' : 'L') + ` ${c.x} ${c.y}`).join(' ');
  }, [activeCoords]);

  // Theme Visual Assets/Styles
  const themeStyles = {
    forest: {
      gradient: "from-emerald-50 via-teal-50 to-green-100/50",
      pathColor: "#8B5A2B", // Wooden branch brown
      pathOutline: "#4E2F13",
      centerDashes: "#FCD34D", // Gold dashes
      nodeColor: "fill-emerald-400 stroke-emerald-600",
      nodeColorCompleted: "fill-emerald-600 stroke-emerald-800",
      finishColor: "text-amber-500 fill-amber-500",
      skyColor: "bg-[#1E3A1A]/10",
      finishNode: "🏰"
    },
    space: {
      gradient: "from-slate-950 via-green-950 to-orange-950",
      pathColor: "#4F46E5", // Bright cosmic blue-purple glow
      pathOutline: "#818CF8",
      centerDashes: "#22D3EE", // Cyan laser dashes
      nodeColor: "fill-orange-500 stroke-orange-400",
      nodeColorCompleted: "fill-cyan-500 stroke-cyan-300",
      finishColor: "text-yellow-400 fill-yellow-300",
      skyColor: "bg-[#0B0F19]/80",
      finishNode: "🌌"
    },
    sports: {
      gradient: "from-orange-50 via-amber-50 to-orange-100/50",
      pathColor: "#EA580C", // Athletics reddish-orange lane track
      pathOutline: "#9A3412",
      centerDashes: "#FFFFFF", // White lane markings
      nodeColor: "fill-amber-400 stroke-amber-600",
      nodeColorCompleted: "fill-rose-500 stroke-rose-700",
      finishColor: "text-yellow-500 fill-yellow-400",
      skyColor: "bg-[#431407]/10",
      finishNode: "🏆"
    }
  };

  const style = themeStyles[activeTrack];
  const milestoneData = MILESTONE_DETAILS[activeTrack];

  return (
    <div className={`w-full bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300`}>
      
      {/* Map Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#2D3748] flex items-center gap-2">
            <span>🗺️</span> Co-op Adventure Maze
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400">
              See your class climb the tracks in real-time! Finish quests to unlock new check points!
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="text-[#EA580C] bg-[#FFF0EB] border border-[#FFD2C4]/40 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
              🏁 Weekly Reset: {countdownText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Active track:
          </span>
          <span className={`px-4 py-2 rounded-2xl text-xs font-black capitalize shadow-sm ${
            activeTrack === 'space' 
              ? 'bg-[#EA580C] text-white shadow-orange-200' 
              : activeTrack === 'sports' 
              ? 'bg-orange-500 text-white shadow-orange-200' 
              : 'bg-emerald-500 text-white shadow-emerald-200'
          }`}>
            {activeTrack === 'space' ? '🚀 Cosmic Space Maze' : activeTrack === 'sports' ? '🏃 Athletics Track' : '🌲 Enchanted Forest'}
          </span>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className={`relative w-full rounded-[24px] overflow-hidden border border-slate-100 bg-gradient-to-br ${style.gradient} aspect-[1000/450]`}>
        
        {/* Sky overlays/nebulae for Space layout */}
        {activeTrack === 'space' && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Glowing planetary shapes or stars */}
            <div className="absolute top-[15%] left-[20%] w-32 h-32 rounded-full bg-orange-500/10 blur-xl" />
            <div className="absolute bottom-[20%] right-[30%] w-48 h-48 rounded-full bg-green-500/10 blur-2xl" />
            <div className="absolute top-[40%] right-[10%] w-24 h-24 rounded-full bg-cyan-400/10 blur-lg" />
          </div>
        )}

        <svg viewBox="0 0 1000 450" className="w-full h-full select-none">
          <defs>
            {/* Cosmic glow filter for Space theme */}
            <filter id="space-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Theme Background Illustration */}
          <image 
            href={`/assets/adventure_${activeTrack}.png`}
            x="0"
            y="0"
            width="1000"
            height="450"
            preserveAspectRatio="none"
          />

          {/* 1. Track Draw (Background / Border layer) */}
          <path 
            d={pathD} 
            fill="none" 
            stroke={style.pathOutline} 
            strokeWidth="24" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity={activeTrack === 'space' ? 0.6 : 0.85}
          />
          <path 
            d={pathD} 
            fill="none" 
            stroke={style.pathColor} 
            strokeWidth="18" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter={activeTrack === 'space' ? 'url(#space-glow)' : undefined}
          />
          
          {/* Center dashes */}
          <path 
            d={pathD} 
            fill="none" 
            stroke={style.centerDashes} 
            strokeWidth="2" 
            strokeDasharray="10 12" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity={activeTrack === 'sports' ? 1.0 : 0.8}
          />

          {/* 2. Milestone Node Circles */}
          {activeCoords.map((node, idx) => {
            const hasStudentsHere = studentsByMilestone[idx]?.length > 0;
            const isFinish = idx === 10;
            
            return (
              <g key={idx} className="cursor-pointer group/node">
                {/* Node Outer Ring */}
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={isFinish ? "24" : "15"} 
                  className={`transition-all duration-300 ${
                    hasStudentsHere ? 'fill-white stroke-yellow-400 stroke-[4px] shadow-sm' : 'fill-slate-100/90 stroke-slate-300/80 stroke-[3px]'
                  }`} 
                />
                
                {/* Node Inner Ring */}
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={isFinish ? "18" : "9"} 
                  className={
                    idx === 10 
                      ? 'fill-yellow-400' 
                      : hasStudentsHere 
                      ? (activeTrack === 'space' ? 'fill-cyan-400' : activeTrack === 'sports' ? 'fill-rose-500' : 'fill-emerald-500') 
                      : 'fill-slate-300'
                  }
                />

                {/* Milestone Node Number or Emoji */}
                <text 
                  x={node.x} 
                  y={node.y + 4} 
                  textAnchor="middle" 
                  className="text-[9px] font-black fill-white select-none pointer-events-none"
                >
                  {isFinish ? style.finishNode : idx}
                </text>

                {/* Milestone Node Hover Tooltip triggers */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  className="fill-transparent stroke-transparent cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.ownerDocument.documentElement.getBoundingClientRect();
                    setHoveredStudent({
                      type: 'milestone',
                      name: milestoneData[idx].name,
                      desc: milestoneData[idx].desc,
                      x: node.x,
                      y: node.y - 45
                    });
                  }}
                  onMouseLeave={() => setHoveredStudent(null)}
                />
              </g>
            );
          })}

          {/* 3. Classmate Avatars Layer */}
          {Object.keys(studentsByMilestone).map((mIdx) => {
            const milestoneIndex = parseInt(mIdx, 10);
            const list = studentsByMilestone[milestoneIndex];
            
            return list.map((st, sIdx) => {
              const pos = getOffsetPosition(milestoneIndex, sIdx, list.length);
              
              return (
                <g 
                  key={st.name} 
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredStudent({
                      type: 'student',
                      name: st.name,
                      points: st.points,
                      milestoneName: milestoneData[milestoneIndex].name,
                      milestone: st.milestone,
                      lap: st.lap,
                      isMe: st.isMe,
                      x: pos.x,
                      y: pos.y - 45
                    });
                  }}
                  onMouseLeave={() => setHoveredStudent(null)}
                >
                  {/* Outer pulse highlights for "Me" */}
                  {st.isMe && (
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r="22" 
                      className="fill-transparent stroke-amber-400 stroke-2 animate-ping" 
                    />
                  )}

                  {/* Golden frame for Me or Top score */}
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r="19" 
                    className={`stroke-2 ${st.isMe ? 'fill-amber-400 stroke-amber-300' : 'fill-slate-100 stroke-white'}`} 
                  />

                  {/* Avatar clipping mask */}
                  <g className="clip-avatar">
                    <clipPath id={`avatar-clip-${st.name.replace(/\s+/g, '-')}`}>
                      <circle cx={pos.x} cy={pos.y} r="16" />
                    </clipPath>
                    
                    <image 
                      href={st.avatarUrl} 
                      x={pos.x - 16} 
                      y={pos.y - 16} 
                      width="32" 
                      height="32" 
                      clipPath={`url(#avatar-clip-${st.name.replace(/\s+/g, '-')})`}
                    />
                  </g>

                  {/* Tiny active bubble */}
                  {st.isMe && (
                    <circle 
                      cx={pos.x + 12} 
                      cy={pos.y - 12} 
                      r="5" 
                      className="fill-emerald-400 stroke-white stroke-1" 
                    />
                  )}

                  {/* Lap badge */}
                  {st.lap > 1 && (
                    <g>
                      <circle 
                        cx={pos.x - 12} 
                        cy={pos.y + 12} 
                        r="8" 
                        className="fill-amber-500 stroke-white stroke-1" 
                      />
                      <text
                        x={pos.x - 12}
                        y={pos.y + 14.5}
                        dominantBaseline="central"
                        textAnchor="middle"
                        className="text-[8px] font-black fill-white select-none pointer-events-none"
                        style={{ fontSize: '7px' }}
                      >
                        {`L${st.lap}`}
                      </text>
                    </g>
                  )}
                </g>
              );
            });
          })}
        </svg>

        {/* Real-time floating HTML Tooltip overlay relative to the SVG coordinates */}
        {hoveredStudent && (
          <div 
            className="absolute bg-slate-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-2xl shadow-xl z-30 pointer-events-none text-left space-y-1 transition-all duration-150 animate-in fade-in zoom-in-95"
            style={{ 
              left: `${(hoveredStudent.x / 1000) * 100}%`, 
              top: `${(hoveredStudent.y / 450) * 100}%`,
              transform: 'translate(-50%, -100%)',
              minWidth: '160px'
            }}
          >
            {/* Tooltip Arrow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900/95" />
            
            {hoveredStudent.type === 'milestone' ? (
              <>
                <p className="text-xs font-black text-yellow-300">{hoveredStudent.name}</p>
                <p className="text-[9px] text-slate-300 font-semibold leading-normal">{hoveredStudent.desc}</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black truncate max-w-[120px]">{hoveredStudent.name}</span>
                  {hoveredStudent.isMe && (
                    <span className="text-[8px] bg-amber-400 text-slate-900 font-bold px-1 rounded">ME</span>
                  )}
                </div>
                <p className="text-[9px] font-black text-green-300 truncate">{hoveredStudent.milestoneName}</p>
                <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 border-t border-slate-800 pt-1 mt-1">
                  <span>🏆 {hoveredStudent.points} XP</span>
                  <span>•</span>
                  <span>Lap {hoveredStudent.lap}</span>
                  <span>•</span>
                  <span>Milestone {hoveredStudent.milestone}</span>
                </div>
                <div className="text-[8px] text-slate-500 font-semibold mt-0.5">
                  ✅ +10 correct &nbsp;|&nbsp; ❌ -5 wrong
                </div>
              </>
            )}
          </div>
        )}

        {/* Treasure Chest Overlay */}
        {(() => {
          const me = studentsWithMilestones.find(s => s.isMe);
          if (me && me.milestone === 10 && !claimedTreasures.includes(me.lap)) {
            const finalCoords = activeCoords[10];
            return (
              <div 
                className="absolute z-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform animate-bounce"
                style={{ 
                  left: `${(finalCoords.x / 1000) * 100}%`, 
                  top: `${(finalCoords.y / 450) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-15px'
                }}
                onClick={() => handleOpenTreasure(me.lap)}
              >
                <div className="text-4xl drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] filter">🎁</div>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Track Legend panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center text-xl shadow-inner">
            🏅
          </div>
          <div>
            <h4 className="text-xs font-black text-[#2D3748]">Co-op Mission Target</h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Unlock landmarks! Help your class reach the Castle, Galaxy, or Podium by solving quizzes!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-l border-slate-200/60 pl-0 md:pl-6">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Classmates</span>
            <span className="text-sm font-black text-[#2D3748] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#EA580C]" /> {classroomStudents.length}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Completed Lap 1</span>
            <span className="text-sm font-black text-emerald-500 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> {studentsWithMilestones.filter(s => s.lap > 1 || s.milestone === 10).length}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">My Progress</span>
            <span className="text-sm font-black text-amber-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> {(() => {
                const me = studentsWithMilestones.find(s => s.isMe);
                if (!me) return 'Lap 1, M0';
                return `Lap ${me.lap}, M${me.milestone}`;
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Treasure Modal */}
      {isTreasureModalOpen && activeGift && (
        <div className="fixed inset-0 z-50 flex-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] w-full max-w-md p-8 text-center relative shadow-2xl animate-in zoom-in-75 duration-500 flex flex-col items-center">
             <button 
                onClick={() => setIsTreasureModalOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2"
             >
                <X className="w-5 h-5" />
             </button>
             
             <h3 className="text-2xl font-black text-slate-800 mb-2">You opened a chest!</h3>
             <p className="text-sm font-bold text-slate-500 mb-8">A mysterious item was inside...</p>
             
             <div className="w-32 h-32 bg-amber-50 rounded-full flex-center text-6xl mb-6 shadow-inner border-4 border-amber-100 relative">
               <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
               <span className="relative z-10 animate-bounce">{activeGift.emoji}</span>
             </div>
             
             <h4 className="text-xl font-black text-amber-500 mb-2">{activeGift.name}</h4>
             <p className="text-sm font-bold text-slate-600 leading-relaxed mb-6">
               {activeGift.desc}
             </p>
             
             <button 
                onClick={() => setIsTreasureModalOpen(false)}
                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-2xl font-black text-lg transition-colors shadow-lg shadow-amber-400/30"
             >
                Awesome!
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
