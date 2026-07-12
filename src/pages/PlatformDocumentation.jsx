import React from 'react';
import { 
  LayoutDashboard, BookOpen, Calendar, Trophy, BarChart, MessageSquare, 
  Settings, Award, Compass, User, CreditCard, FileText, Download 
} from 'lucide-react';

export default function PlatformDocumentation() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Non-printable Header Action */}
      <div className="print:hidden bg-indigo-50 border-b border-indigo-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h2 className="text-xl font-black text-indigo-900">Platform Documentation</h2>
          <p className="text-sm font-medium text-indigo-700">Intensive Guide for Teachers and Students</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download as PDF
        </button>
      </div>

      {/* Printable Document Content */}
      <div className="max-w-4xl mx-auto px-8 py-12 print:py-0 print:px-0">
        
        {/* Cover Page */}
        <div className="text-center py-20 print:h-screen print:flex print:flex-col print:justify-center page-break-after">
          <img src="/logo.png?v=3" className="w-64 h-auto mx-auto mb-12 mix-blend-multiply" alt="Homework Zone Logo" />
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Intensive User Guide
          </h1>
          <p className="text-2xl font-bold text-slate-500 mb-12">
            The Complete Manual for the Homework Zone Platform
          </p>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full mb-12" />
          <p className="text-lg font-medium text-slate-400 uppercase tracking-widest">
            Teacher Dashboard & Student Dashboard
          </p>
        </div>

        {/* Teacher Dashboard Section */}
        <div className="page-break-before pt-12">
          <div className="flex items-center gap-4 mb-10 border-b-4 border-indigo-100 pb-6">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black text-slate-800">Teacher Dashboard</h2>
          </div>
          
          <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">
            The Teacher Dashboard is your command center. It offers a powerful suite of AI tools to generate, schedule, and grade curriculum, alongside robust classroom management features. Below is an intensive breakdown of every feature available in your sidebar navigation.
          </p>

          <div className="space-y-8">
            <DocItem 
              icon={<LayoutDashboard className="w-6 h-6 text-blue-500" />}
              title="Dashboard"
              desc="A global overview of all classes and students. It provides quick statistics on active assignments, pending grading tasks, overall student progress, and total revenue summaries for independent tutors."
              image="/images/docs-teacher-dashboard.png"
            />
            <DocItem 
              icon={<img src="/ic-classes.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Classes" />}
              title="My Classes"
              desc="Manage individual classrooms. Here you can generate unique student invite codes, view specific class rosters, manage student quotas, and access class-level settings."
            />
            <DocItem 
              icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />}
              title="Homework/Test Builder"
              desc="The core AI engine! Enter any topic or paste a text passage, and the AI automatically generates multiple-choice, short answer, and interactive drag-and-drop questions perfectly suited for the selected grade level and subject."
              image="/images/docs-ai-builder.png"
            />
            <DocItem 
              icon={<Calendar className="w-6 h-6 text-pink-500" />}
              title="Scheduler"
              desc="Automate your curriculum delivery. Create assignments in advance and schedule them to be released to specific classes or students at precise dates and times."
            />
            <DocItem 
              icon={<Trophy className="w-6 h-6 text-emerald-500" />}
              title="Gradebook"
              desc="Review student submissions. The system auto-grades multiple-choice and interactive questions instantly, while providing a clean, side-by-side interface for teachers to review and grade text-based answers."
            />
            <DocItem 
              icon={<BarChart className="w-6 h-6 text-orange-500" />}
              title="Reports & Test Reports"
              desc="Deep analytics tracking student performance. Identify weak spots in specific subtopics across classes, track engagement, and export data for parent-teacher conferences."
            />
            <DocItem 
              icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />}
              title="Messages"
              desc="Communicate safely with students and broadcast announcements to entire classes. Send feedback, motivation, or reminders directly to student dashboards."
            />
            <DocItem 
              icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />}
              title="Rewards"
              desc="The gamification center! Customize XP point multipliers, coin rewards, and unlockable avatar accessories that students can earn by completing tasks and maintaining streaks."
            />
            <DocItem 
              icon={<MessageSquare className="w-6 h-6 text-orange-500" />}
              title="My Prompts"
              desc="Save custom AI prompts and templates to quickly generate your favorite style of questions or specific pedagogical structures without re-typing instructions."
            />
            <DocItem 
              icon={<CreditCard className="w-6 h-6 text-green-500" />}
              title="Tuition Fees & Revenue"
              desc="For private tutors and independent educators: Manage billing, send automated invoices, and track payments from parents securely within the platform."
            />
            <DocItem 
              icon={<Settings className="w-6 h-6 text-slate-500" />}
              title="Settings & Billing"
              desc="Manage your teacher subscription plan, expand your student seat capacity, customize your dashboard theme, and update your account notification preferences."
            />
          </div>
        </div>

        {/* Student Dashboard Section */}
        <div className="page-break-before pt-20">
          <div className="flex items-center gap-4 mb-10 border-b-4 border-orange-100 pb-6">
            <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black text-slate-800">Student Dashboard</h2>
          </div>
          
          <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">
            The Student Dashboard is designed as a highly engaging, gamified learning environment. It encourages daily practice through rewards, virtual companions, and interactive learning modules.
          </p>

          <div className="space-y-8">
            <DocItem 
              icon={<LayoutDashboard className="w-6 h-6 text-red-500" />}
              title="Dashboard"
              desc="The student's home base. Displays upcoming 'Missions' (homework assignments), recent achievements, their interactive Virtual Pet Companion, and their current XP level."
              image="/images/docs-student-dashboard.png"
            />
            <DocItem 
              icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />}
              title="My Homework"
              desc="A comprehensive list of all pending assignments and past submissions. Students can launch into interactive quizzes featuring rich media, TTS (Text-to-Speech), and drag-and-drop elements."
            />
            <DocItem 
              icon={<Award className="w-6 h-6 text-rose-500" />}
              title="Exam Arena"
              desc="A formal testing environment for NAPLAN-style and summative assessments. It enforces strict timers, prevents premature answer reveals, and focuses on uninterrupted focus."
            />
            <DocItem 
              icon={<Trophy className="w-6 h-6 text-emerald-500" />}
              title="Mission Reports"
              desc="Detailed feedback on completed assignments. Students can review their graded tests to understand mistakes, see teacher comments, and track their improvement over time."
            />
            <DocItem 
              icon={<User className="w-6 h-6 text-green-500" />}
              title="My Profile"
              desc="The personalization hub. Students can spend their earned coins to customize their avatar, unlock new banners, view their total XP, and track their daily login streak."
            />
            <DocItem 
              icon={<Compass className="w-6 h-6 text-amber-500" />}
              title="Adventure Maze"
              desc="A fun, gamified maze mini-game where students use their earned rewards to unlock new paths, discover hidden secrets, and take short brain-breaks between learning sessions."
            />
            <DocItem 
              icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />}
              title="My Messages"
              desc="A secure inbox for reading direct feedback, class announcements, and encouraging messages from their teacher. Contains a badged counter for unread messages."
            />
            <DocItem 
              icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />}
              title="My Rewards"
              desc="The 'Piggy Bank' vault. Students can admire their collection of earned coins, achievement badges, and printable certificates unlocked by hitting learning milestones."
            />
            <DocItem 
              icon={<CreditCard className="w-6 h-6 text-green-500" />}
              title="Tuition & Fees (Parent Portal)"
              desc="A secure area designed specifically for parents to view payment history, download receipts, and pay outstanding invoices securely."
            />
            <DocItem 
              icon={<FileText className="w-6 h-6 text-rose-500" />}
              title="Child Report (Parent Portal)"
              desc="A simplified progress report designed for parents to track their child's learning journey without needing to decipher complex grading metrics."
            />
            <DocItem 
              icon={<BookOpen className="w-6 h-6 text-orange-500" />}
              title="Learning Academy"
              desc="A collapsible library of self-paced learning modules categorized by math concepts (e.g., Fractions, Geometry, Algebra). Students can voluntarily take practice quizzes to earn extra XP on their own time!"
            />
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .page-break-after { page-break-after: always; }
          .page-break-before { page-break-before: always; }
          .page-break-inside-avoid { page-break-inside: avoid; }
          /* Hide app UI elements outside of this component if printed */
        }
      `}} />
    </div>
  );
}

function DocItem({ icon, title, desc, image }) {
  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 page-break-inside-avoid">
      <div className="flex items-start gap-6">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-600 font-medium leading-relaxed">{desc}</p>
        </div>
      </div>
      {image && (
        <div className="mt-6 md:ml-[88px]">
          <img src={image} alt={title} className="w-full h-auto rounded-2xl shadow-md border border-slate-200 object-cover" />
        </div>
      )}
    </div>
  );
}
