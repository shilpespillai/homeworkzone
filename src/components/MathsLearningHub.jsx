import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Lightbulb, 
  Target, 
  Play, 
  Check, 
  X, 
  Award, 
  ArrowRight,
  BookOpen,
  Volume2,
  ChevronRight,
  Zap
} from 'lucide-react';

const normalizeName = (name) => (name || '').trim().toLowerCase();

import { MATHS_CURRICULUM } from '../data/mathsCurriculum';
import { 
  FractionVisualizer,
  PlaceValueVisualizer,
  ClockVisualizer,
  ComparingCrocodile,
  Shapes3DVisualizer,
  FractionsPosterInfographic,
  AngleVisualizer,
  NumberLineVisualizer,
  OperationsVisualizer,
  MeasurementVisualizer,
  MoneyVisualizer,
  EvenOddVisualizer,
  RomanNumeralsVisualizer,
  AreaPerimeterVisualizer,
  GraphsVisualizer,
  AlgebraVisualizer,
  VolumeVisualizer,
  NumberTheoryVisualizer,
  Geometry2DVisualizer,
  PercentageVisualizer,
  CoordinatePlaneVisualizer,
  ProbabilityVisualizer
} from './MathsVisualizers';

const getVisualizer = (topicTitle) => {
  const title = normalizeName(topicTitle);
  
  // 1. Clock Visualizer (Time)
  if (
    title === 'half past' ||
    title === 'reading o\'clock' ||
    title === 'quarter past' ||
    title === 'quarter to' ||
    title === 'elapsed time introduction' ||
    title === 'elapsed time' ||
    title === 'timetables'
  ) {
    return <ClockVisualizer />;
  }
  
  // 2. Roman Numerals
  if (title === 'roman numerals') {
    return <RomanNumeralsVisualizer />;
  }
  
  // 3. Area & Perimeter
  if (
    title === 'area introduction' ||
    title === 'area' ||
    title === 'perimeter' ||
    title === 'area of triangles' ||
    title === 'area of rectangles' ||
    title === 'area of composite shapes'
  ) {
    return <AreaPerimeterVisualizer />;
  }
  
  // 4. Graphs & Stats
  if (
    title === 'picture graphs' ||
    title === 'bar graphs' ||
    title === 'line graphs' ||
    title === 'mean, mode, median' ||
    title === 'mean, median, mode, range'
  ) {
    return <GraphsVisualizer />;
  }
  
  // 5. Algebra
  if (
    title === 'variables introduction' ||
    title === 'expressions' ||
    title === 'equations' ||
    title === 'function machines'
  ) {
    return <AlgebraVisualizer />;
  }
  
  // 6. Volume
  if (
    title === 'volume introduction' ||
    title === 'volume' ||
    title === 'volume of cubes' ||
    title === 'volume of rectangular prisms'
  ) {
    return <VolumeVisualizer />;
  }
  
  // 7. Number Theory
  if (
    title === 'factors' ||
    title === 'multiples' ||
    title === 'prime numbers' ||
    title === 'composite numbers' ||
    title === 'lcm' ||
    title === 'hcf/gcf'
  ) {
    return <NumberTheoryVisualizer />;
  }
  
  // 8. 2D Geometry & Symmetry
  if (
    title === '2d shapes' ||
    title === 'symmetry' ||
    title === 'parallel & perpendicular lines' ||
    title === 'quadrilaterals' ||
    title === 'circles'
  ) {
    return <Geometry2DVisualizer />;
  }
  
  // 9. Percentage Visualizer
  if (
    title === 'tenths' ||
    title === 'hundredths' ||
    title === 'introduction to percentages' ||
    title === 'discounts' ||
    title === 'profit and loss' ||
    title === 'percentage increase'
  ) {
    return <PercentageVisualizer />;
  }
  
  // 10. Coordinate Plane
  if (
    title === 'the coordinate plane' ||
    title === 'plotting points'
  ) {
    return <CoordinatePlaneVisualizer />;
  }
  
  // 11. Probability
  if (title === 'probability basics') {
    return <ProbabilityVisualizer />;
  }
  
  // 12. Fraction Slicer (Pizza)
  if (
    title === 'numerator & denominator' ||
    title === 'mixed numbers' ||
    title === 'ratios'
  ) {
    return <FractionVisualizer />;
  }
  
  // Fallbacks for general categories
  if (
    title.includes('fraction') || 
    title.includes('half') || 
    title.includes('halves') || 
    title.includes('third') || 
    title.includes('thirds') || 
    title.includes('fourth') || 
    title.includes('fourths') || 
    title.includes('quarter')
  ) {
    return <FractionsPosterInfographic />;
  }
  
  if (title.includes('angle') || title === 'triangles') {
    return <AngleVisualizer />;
  }
  
  if (
    title.includes('comparing numbers') || 
    title.includes('comparing (> < =)') || 
    title.includes('greater than') || 
    title.includes('less than') ||
    title.includes('compare')
  ) {
    return <ComparingCrocodile />;
  }
  
  if (
    title.includes('place value') || 
    title.includes('ones and tens') || 
    title.includes('hundreds, tens, ones') || 
    title.includes('expanded form') ||
    title === 'counting to 1000' ||
    title.includes('millions')
  ) {
    return <PlaceValueVisualizer />;
  }
  
  if (
    title.includes('o\'clock') || 
    title.includes('clock') ||
    title.includes('time') 
  ) {
    return <ClockVisualizer />;
  }
  
  if (
    title.includes('3d shape') || 
    title.includes('3d solids') || 
    title.includes('solid')
  ) {
    return <Shapes3DVisualizer />;
  }
  
  if (
    title.includes('money') || 
    title.includes('coin') || 
    title.includes('purchase') || 
    title.includes('change')
  ) {
    return <MoneyVisualizer />;
  }
  
  if (
    title.includes('addition') || 
    title.includes('subtraction') || 
    title.includes('multiplication') || 
    title.includes('division') || 
    title.includes('times tables') || 
    title.includes('multiply') || 
    title.includes('divide') || 
    title.includes('fact families') || 
    title.includes('number bonds') || 
    title.includes('array') ||
    title.includes('operations') ||
    title.includes('add') ||
    title.includes('subtract') ||
    title === 'equal groups' ||
    title === 'equal sharing' ||
    title === 'grouping' ||
    title === 'remainders' ||
    title === 'rates'
  ) {
    return <OperationsVisualizer />;
  }
  
  if (
    title.includes('length') || 
    title.includes('weight') || 
    title.includes('capacity') || 
    title.includes('meter') || 
    title.includes('centimeter') || 
    title.includes('liter') || 
    title.includes('kilogram')
  ) {
    return <MeasurementVisualizer />;
  }
  
  if (title.includes('even') || title.includes('odd')) {
    return <EvenOddVisualizer />;
  }

  if (
    title.includes('counting') || 
    title.includes('pattern') || 
    title.includes('before') || 
    title.includes('after') || 
    title.includes('between')
  ) {
    return <NumberLineVisualizer />;
  }
  
  return null;
};

export default function MathsLearningHub({ activeConcept = 'Numbers & Place Value', onConceptSelect }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('learn'); // 'learn', 'trick', 'practice'
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [practiceStatus, setPracticeStatus] = useState(null); // 'correct', 'incorrect', null
  const [zoomedImage, setZoomedImage] = useState(null);

  const getConceptGroup = (category) => {
    const cat = category.toLowerCase();
    
    if (
      cat.includes('counting') || 
      cat === 'numbers' || 
      cat === 'place value' || 
      cat.includes('number theory')
    ) {
      return 'Numbers & Place Value';
    }
    
    if (
      cat.includes('addition') || 
      cat.includes('subtraction') || 
      cat === 'operations' || 
      cat.includes('multiplication') || 
      cat.includes('division')
    ) {
      return 'Arithmetic & Operations';
    }
    
    if (
      cat.includes('fraction') || 
      cat.includes('decimal') || 
      cat.includes('percentage') || 
      cat.includes('ratio')
    ) {
      return 'Fractions & Decimals';
    }
    
    if (cat.includes('measurement') || cat.includes('money')) {
      return 'Measurement & Money';
    }
    
    if (cat.includes('time')) {
      return 'Time & Clocks';
    }
    
    if (cat.includes('geometry')) {
      return 'Geometry & Shapes';
    }
    
    if (cat.includes('algebra')) {
      return 'Algebra & Patterns';
    }
    
    if (cat.includes('data') || cat.includes('statistics') || cat.includes('probability')) {
      return 'Data & Probability';
    }
    
    return 'Other';
  };

  // Group concept topics by grade level
  const conceptTopics = [];
  Object.keys(MATHS_CURRICULUM).forEach(grade => {
    (MATHS_CURRICULUM[grade] || []).forEach(topic => {
      if (getConceptGroup(topic.category) === activeConcept) {
        conceptTopics.push({
          ...topic,
          grade: parseInt(grade, 10)
        });
      }
    });
  });

  const topicsByGrade = {};
  conceptTopics.forEach(topic => {
    if (!topicsByGrade[topic.grade]) {
      topicsByGrade[topic.grade] = [];
    }
    topicsByGrade[topic.grade].push(topic);
  });

  const sortedGrades = Object.keys(topicsByGrade).map(Number).sort((a, b) => a - b);

  const handleOpenTopic = (topic) => {
    setSelectedTopic(topic);
    setActiveTab('learn');
    setUserSelectedOption(null);
    setPracticeStatus(null);
  };

  const handleSelectOption = (option) => {
    if (practiceStatus === 'correct') return; // locked once correct
    setUserSelectedOption(option);
    if (option === selectedTopic.practice.answer) {
      setPracticeStatus('correct');
    } else {
      setPracticeStatus('incorrect');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-10">
      
      {/* Banner */}
      <div className="relative rounded-[40px] overflow-hidden shadow-lg h-56 md:h-64 flex items-center border border-green-200 bg-orange-50/20">
        <img 
          src="/images/math-learning-banner.png" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 object-center" 
          alt="Maths Academy Banner" 
        />
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-[50%] z-10" />
        <div className="absolute inset-0 z-20 flex items-center p-8 md:p-12 text-left">
          <div className="max-w-[48%]">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest block w-fit mb-2">Maths Academy</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-green-900 tracking-tight leading-tight">
              Master Your Math Powers!
            </h1>
            <p className="mt-2 text-[10px] sm:text-xs md:text-sm text-slate-600 font-bold leading-relaxed">
              Explore engaging lessons, try fun magic tricks, and play practice games to level up!
            </p>
          </div>
        </div>
      </div>

      {/* Concept Selector Tabs in Hub */}
      <div className="flex flex-wrap bg-green-50/50 p-2 rounded-[32px] border border-green-150/40 w-full max-w-4xl mx-auto gap-2 justify-center">
        {[
          { name: 'Numbers & Place Value', emoji: '🔢' },
          { name: 'Arithmetic & Operations', emoji: '🧮' },
          { name: 'Fractions & Decimals', emoji: '🍕' },
          { name: 'Measurement & Money', emoji: '📏' },
          { name: 'Time & Clocks', emoji: '⏰' },
          { name: 'Geometry & Shapes', emoji: '📐' },
          { name: 'Algebra & Patterns', emoji: '⚡' },
          { name: 'Data & Probability', emoji: '📊' }
        ].map((concept) => (
          <button
            key={concept.name}
            onClick={() => {
              if (typeof onConceptSelect === 'function') {
                onConceptSelect(concept.name);
              }
            }}
            className={`px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all ${
              activeConcept === concept.name
                ? 'bg-white text-orange-600 shadow-sm scale-105'
                : 'text-slate-500 hover:text-slate-750 hover:bg-white/40'
            }`}
          >
            {concept.emoji} {concept.name}
          </button>
        ))}
      </div>

      {/* Progressive Topics List Grouped by Grade Level */}
      <div className="space-y-12 text-left">
        {/* Concept Infographic Images for Numbers & Place Value */}
        {activeConcept === 'Numbers & Place Value' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full max-w-6xl mx-auto">
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">🔢 Let's Learn Hundreds, Tens & Ones!</span>
              <div 
                onClick={() => setZoomedImage('/placevalue-concept-1.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/placevalue-concept-1.jpg" 
                  alt="Hundreds, Tens & Ones Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-[32px] border border-green-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-green-700 uppercase tracking-widest mb-3 block">⚡ Let's Learn Regrouping & Trading!</span>
              <div 
                onClick={() => setZoomedImage('/placevalue-concept-2.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/placevalue-concept-2.jpg" 
                  alt="Place Value Regrouping & Trading Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Concept Infographic Images for Arithmetic & Operations */}
        {activeConcept === 'Arithmetic & Operations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full max-w-6xl mx-auto">
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">🧮 Let's Learn Operations!</span>
              <div 
                onClick={() => setZoomedImage('/operations-concept-1.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/operations-concept-1.jpg" 
                  alt="Operations Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-[32px] border border-green-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-green-700 uppercase tracking-widest mb-3 block">✖️ Let's Learn Multiplication!</span>
              <div 
                onClick={() => setZoomedImage('/operations-concept-3.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/operations-concept-3.jpg" 
                  alt="Multiplication Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">➗ Let's Learn Division!</span>
              <div 
                onClick={() => setZoomedImage('/operations-concept-2.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/operations-concept-2.jpg" 
                  alt="Division Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Concept Infographic Images for Fractions & Decimals */}
        {activeConcept === 'Fractions & Decimals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full max-w-6xl mx-auto">
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">🍰 Let's Learn Fractions!</span>
              <div 
                onClick={() => setZoomedImage('/fractions-concept.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/fractions-concept.jpg" 
                  alt="Fractions Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-[32px] border border-green-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-green-700 uppercase tracking-widest mb-3 block">🔢 Let's Learn Decimal Fractions!</span>
              <div 
                onClick={() => setZoomedImage('/decimals-concept.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/decimals-concept.jpg" 
                  alt="Decimal Fractions Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Concept Infographic Images for Measurement & Money */}
        {activeConcept === 'Measurement & Money' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full max-w-6xl mx-auto">
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">📏 Let's Learn Measurement!</span>
              <div 
                onClick={() => setZoomedImage('/measurement-concept.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/measurement-concept.jpg" 
                  alt="Measurement Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-[32px] border border-green-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-green-700 uppercase tracking-widest mb-3 block">💰 Let's Learn Money & Coins!</span>
              <div 
                onClick={() => setZoomedImage('/money-concept.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/money-concept.jpg" 
                  alt="Money and Coins Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Concept Infographic Images for Time & Clocks */}
        {activeConcept === 'Time & Clocks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full max-w-6xl mx-auto">
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">⏰ Let's Learn Time!</span>
              <div 
                onClick={() => setZoomedImage('/time-concept-1.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/time-concept-1.jpg" 
                  alt="Time Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-[32px] border border-green-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-green-700 uppercase tracking-widest mb-3 block">⏱️ Let's Learn Elapsed Time!</span>
              <div 
                onClick={() => setZoomedImage('/time-concept-2.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/time-concept-2.jpg" 
                  alt="Elapsed Time Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Concept Infographic Images for Geometry & Shapes */}
        {activeConcept === 'Geometry & Shapes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full max-w-6xl mx-auto">
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">📐 Explore Geometry: Lines & Shapes!</span>
              <div 
                onClick={() => setZoomedImage('/geometry-concept-1.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/geometry-concept-1.jpg" 
                  alt="Geometry Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-[32px] border border-green-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-green-700 uppercase tracking-widest mb-3 block">📐 Let's Learn Angles & Protractors!</span>
              <div 
                onClick={() => setZoomedImage('/geometry-concept-2.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/geometry-concept-2.jpg" 
                  alt="Angles and Protractors Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Concept Infographic Images for Data & Probability */}
        {activeConcept === 'Data & Probability' && (
          <div className="grid grid-cols-1 max-w-3xl mx-auto mb-8">
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">📊 Let's Learn Data & Probability!</span>
              <div 
                onClick={() => setZoomedImage('/data-probability-concept.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/data-probability-concept.jpg" 
                  alt="Data & Probability Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Concept Infographic Images for Algebra & Patterns */}
        {activeConcept === 'Algebra & Patterns' && (
          <div className="grid grid-cols-1 max-w-3xl mx-auto mb-8">
            <div className="bg-white p-4 rounded-[32px] border border-orange-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-3 block">⚡ Let's Learn Algebra & Operations!</span>
              <div 
                onClick={() => setZoomedImage('/algebra-concept.jpg')}
                className="w-full overflow-hidden rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
              >
                <img 
                  src="/algebra-concept.jpg" 
                  alt="Algebra Concept Infographic" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {sortedGrades.map((gradeLevel) => (
          <div key={gradeLevel} className="space-y-4">
            <h2 className="text-lg font-black text-green-900 tracking-tight border-b-2 border-slate-100 pb-2 flex items-center gap-2">
              <span>🎓</span> Grade {gradeLevel} Progression
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicsByGrade[gradeLevel].map((topic, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-4 transition-all"
                  onClick={() => handleOpenTopic(topic)}
                >
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    {topic.emoji}
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-black uppercase tracking-wider block w-fit mb-1">
                      {topic.category}
                    </span>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight leading-tight">{topic.title}</h3>
                    <span className="text-[10px] text-orange-500 font-black uppercase tracking-wider flex items-center gap-1 pt-1">
                      Start Lesson <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Details Overlay Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedTopic(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-blue-50"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 bg-blue-50/20 border-b border-blue-50 flex items-center justify-between shrink-0 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">
                    {selectedTopic.emoji}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block">Grade {selectedTopic.grade} Maths</span>
                    <h3 className="text-lg font-black text-green-900 tracking-tight">{selectedTopic.title}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-400 hover:text-rose-500 hover:bg-rose-50 hover:scale-105 transition-all shadow-sm border border-blue-50"
                >
                  ✕
                </button>
              </div>

              {/* Sub-tabs Navigation */}
              <div className="flex bg-orange-50/40 p-1.5 border-b border-blue-50 shrink-0">
                <button
                  onClick={() => setActiveTab('learn')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'learn'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> 📖 Learn
                </button>
                <button
                  onClick={() => setActiveTab('trick')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'trick'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" /> 💡 Magic Trick
                </button>
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'practice'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Target className="w-4 h-4" /> 🎯 Solve It!
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6 text-left">
                
                {/* 📖 Learn Tab */}
                {activeTab === 'learn' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Interactive Visualizer Widget */}
                    {getVisualizer(selectedTopic.title)}

                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-3">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-current" />
                        The Magic Concept
                      </h4>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">
                        {selectedTopic.concept}
                      </p>
                    </div>

                    <div className="bg-green-50/50 border border-green-100 rounded-3xl p-6 space-y-3 relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-6xl opacity-10">🧩</div>
                      <h4 className="text-xs font-black text-green-700 uppercase tracking-widest flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-green-500 fill-current" />
                        Fun Example
                      </h4>
                      <p className="text-sm font-bold text-green-955 leading-relaxed">
                        {selectedTopic.example}
                      </p>
                    </div>
                  </div>
                )}

                {/* 💡 Magic Trick Tab */}
                {activeTab === 'trick' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 space-y-3 relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-6xl opacity-10">💡</div>
                      <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500 fill-current" />
                        Easy Tip / Technique
                      </h4>
                      <p className="text-sm font-bold text-amber-950 leading-relaxed">
                        {selectedTopic.trick}
                      </p>
                    </div>
                    
                    {/* Dialog Balloon */}
                    <div className="flex gap-4 items-end bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                      <img src="/mascot.png" className="w-16 h-16 object-contain mix-blend-multiply" alt="Mascot" />
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm p-4 text-xs font-bold text-slate-600 shadow-sm relative flex-1">
                        "Remember: Math is like a video game. The more tricks you know, the easier it is to defeat the boss monsters!"
                      </div>
                    </div>
                  </div>
                )}

                {/* 🎯 Solve It Practice Tab */}
                {activeTab === 'practice' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="bg-orange-50/30 border border-orange-100/30 rounded-3xl p-6 space-y-4">
                      <h4 className="text-xs font-black text-orange-700 uppercase tracking-widest flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-orange-500" />
                        Quick Quiz Challenge
                      </h4>
                      <p className="text-base font-black text-slate-800">
                        {selectedTopic.practice.question}
                      </p>
                    </div>

                    {/* Answer Options */}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTopic.practice.options.map((opt, optIdx) => {
                        const isSelected = opt === userSelectedOption;
                        const isCorrectOption = opt === selectedTopic.practice.answer;
                        
                        let optClasses = "p-5 rounded-2xl border-2 font-black text-sm text-center transition-all cursor-pointer ";
                        if (practiceStatus === 'correct' && isCorrectOption) {
                          optClasses += "bg-emerald-50 border-emerald-400 text-emerald-800 scale-105 shadow-md shadow-emerald-50";
                        } else if (practiceStatus === 'incorrect' && isSelected) {
                          optClasses += "bg-rose-50 border-rose-300 text-rose-800";
                        } else if (isSelected) {
                          optClasses += "border-orange-400 bg-orange-50/30 text-orange-800";
                        } else {
                          optClasses += "border-slate-100 bg-white hover:border-slate-300 text-slate-700";
                        }

                        return (
                          <motion.div
                            key={optIdx}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSelectOption(opt)}
                            className={optClasses}
                          >
                            {opt}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Practice Feedbacks */}
                    <AnimatePresence>
                      {practiceStatus === 'correct' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex gap-4 text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg shrink-0">
                            ✓
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-black text-emerald-950 text-sm">Correct Answer!</h5>
                            <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                              {selectedTopic.practice.explanation}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {practiceStatus === 'incorrect' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex gap-4 text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-rose-400 flex items-center justify-center text-white font-black text-lg shrink-0">
                            ✕
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-black text-rose-950 text-sm">Try Again!</h5>
                            <p className="text-xs font-bold text-rose-800 leading-relaxed">
                              That is not quite it. Look at the "Learn" or "Magic Trick" tab for a hint, then try again! 🚀
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Zoomed Infographic Lightbox Overlay */}
      <AnimatePresence>
        {zoomedImage && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-zoom-out"
              onClick={() => setZoomedImage(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center z-10"
            >
              {/* Close Button overlay */}
              <button 
                onClick={() => setZoomedImage(null)}
                className="absolute -top-12 right-2 md:-right-6 w-10 h-10 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-500 rounded-full flex items-center justify-center transition-all shadow-lg border border-slate-100 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <img 
                src={zoomedImage} 
                alt="Zoomed Infographic" 
                className="max-w-full max-h-[85vh] object-contain rounded-[24px] shadow-2xl border-4 border-white/10 cursor-zoom-out"
                onClick={() => setZoomedImage(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
