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
              desc="Your central command center for the entire Homework Zone platform. It provides a real-time, global overview of all your classes and enrolled students. You can instantly see quick statistics on active assignments, monitor pending grading tasks that require your attention, track overall student progress, and view total revenue summaries if you are an independent tutor. The intuitive layout ensures you never miss a critical update."
              image="/images/teacher-dashboard.jpg"
            />
            <DocItem 
              icon={<img src="/ic-classes.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Classes" />}
              title="My Classes"
              desc="A comprehensive classroom management system. Here you can easily group students into specific classrooms or subjects. Generate unique, secure 6-digit invite codes for students to join your class without needing email addresses. You can also view detailed class rosters, manage your elastic student quotas seamlessly, and access powerful class-level settings to tailor the learning experience."
              image="/images/my-classes.jpg"
            />
            <DocItem 
              icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />}
              title="Homework/Test Builder"
              desc="The core AI-powered engine of the platform! Simply enter a curriculum topic, paste a text passage, or provide learning objectives, and the advanced AI automatically generates high-quality assessments. It creates a perfect mix of multiple-choice, short-answer, and interactive drag-and-drop questions that are dynamically perfectly suited for your selected grade level and subject area."
              image="/images/homeworkbuilder.jpg"
            />
            <DocItem 
              icon={<Calendar className="w-6 h-6 text-pink-500" />}
              title="Scheduler"
              desc="Fully automate your curriculum delivery workflow. The Scheduler allows you to create assignments weeks or months in advance and schedule them to automatically release to specific classes or individual students at precise dates and times. Perfect for maintaining a consistent homework cadence without daily manual intervention."
              image="/images/homework_test_scheduler.jpg"
            />
            <DocItem 
              icon={<Trophy className="w-6 h-6 text-emerald-500" />}
              title="Gradebook"
              desc="Effortlessly review student submissions in one place. The intelligent system automatically grades all multiple-choice and interactive questions instantly, saving you hours of administrative work. For text-based answers, it provides a clean, side-by-side interface for teachers to review, leave personalized feedback, and assign manual grades quickly."
            />
            <DocItem 
              icon={<BarChart className="w-6 h-6 text-orange-500" />}
              title="Class Reports"
              desc="Unlock deep analytics tracking student performance over time. Identify weak spots in specific subtopics across entire classes, track daily engagement metrics, and export beautiful data visualizations perfectly formatted for parent-teacher conferences."
              image="/images/teacher_reports.jpg"
            />
            <DocItem 
              icon={<BarChart className="w-6 h-6 text-rose-500" />}
              title="Test Reports"
              desc="Dive into specific summative assessment data. This dedicated view breaks down performance on formal tests and exams, providing question-by-question analytics to help you understand exactly where students struggled the most."
              image="/images/test_reports.jpg"
            />
            <DocItem 
              icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />}
              title="Messages"
              desc="Maintain a secure, monitored communication channel with your students. Broadcast important announcements to entire classes or send direct, encouraging feedback and reminders to individual student dashboards. It ensures all communication stays within the educational platform."
            />
            <DocItem 
              icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />}
              title="Rewards"
              desc="Take full control of the platform's gamification engine! Customize XP point multipliers, adjust daily coin rewards, and manage the unlockable avatar accessories that students can earn by completing tasks and maintaining learning streaks. This keeps engagement high and motivates consistent practice."
            />
            <DocItem 
              icon={<MessageSquare className="w-6 h-6 text-orange-500" />}
              title="My Prompts"
              desc="A massive time-saver for power users. Save your custom AI prompts, pedagogical structures, and specific formatting templates to quickly generate your favorite style of questions without needing to re-type complex instructions every time you build a new quiz."
              image="/images/myprompts.jpg"
            />
            <DocItem 
              icon={<CreditCard className="w-6 h-6 text-green-500" />}
              title="Tuition Fees & Revenue"
              desc="An integrated financial suite built specifically for private tutors and independent educators. Manage your billing cycles, set custom tuition rates, send automated professional invoices, and track payments securely directly from parents within the platform."
              image="/images/set_tuitionfees.jpg"
            />
            <DocItem 
              icon={<Settings className="w-6 h-6 text-slate-500" />}
              title="Settings & Billing"
              desc="Manage your overarching teacher account configuration. Upgrade your subscription plan, expand your elastic student seat capacity as your business grows, customize your dashboard's visual theme, set data retention policies, and update your vital account notification preferences."
              image="/images/data_retentionpolicy.jpg"
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
              image="/images/math-learning-banner.png"
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
