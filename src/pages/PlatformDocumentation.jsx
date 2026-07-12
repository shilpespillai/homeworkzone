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
      <div className="max-w-6xl mx-auto px-8 py-12 print:py-0 print:px-0">
        
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
              desc="Your central command center for the entire Homework Zone platform. It provides a real-time, global overview of all your classes and enrolled students."
              points={[
                "Instantly view quick statistics on active assignments.",
                "Monitor pending grading tasks that require your attention.",
                "Track overall student progress metrics seamlessly.",
                "View total revenue summaries if you are an independent tutor.",
                "Utilize an intuitive layout to ensure you never miss a critical update."
              ]}
              image="/images/teacher-dashboard.jpg"
            />
            <DocItem 
              icon={<img src="/ic-classes.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Classes" />}
              title="My Classes"
              desc="A comprehensive classroom management system to easily group students into specific classrooms or subjects."
              points={[
                "Generate unique, secure 6-digit invite codes for students to join without email addresses.",
                "View and manage detailed class rosters and student lists.",
                "Seamlessly manage your elastic student quotas.",
                "Access powerful class-level settings to tailor the learning experience."
              ]}
              image="/images/my-classes.jpg"
            />
            <DocItem 
              icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />}
              title="Homework/Test Builder"
              desc="The core AI-powered engine of the platform designed to drastically reduce lesson planning time."
              points={[
                "Enter any curriculum topic, paste a text passage, or provide learning objectives.",
                "AI automatically generates high-quality, relevant assessments.",
                "Creates a perfect mix of multiple-choice, short-answer, and interactive drag-and-drop questions.",
                "Dynamically scales difficulty perfectly suited for your selected grade level and subject area."
              ]}
              image="/images/homeworkbuilder.jpg"
            />
            <DocItem 
              icon={<Calendar className="w-6 h-6 text-pink-500" />}
              title="Scheduler"
              desc="Fully automate your curriculum delivery workflow without daily manual intervention."
              points={[
                "Create assignments weeks or months in advance.",
                "Schedule content to automatically release to specific classes.",
                "Set precise dates and times for homework deployment.",
                "Maintain a consistent homework cadence effortlessly."
              ]}
              image="/images/homework_test_scheduler.jpg"
            />
            <DocItem 
              icon={<Trophy className="w-6 h-6 text-emerald-500" />}
              title="Gradebook"
              desc="Effortlessly review student submissions in one consolidated interface, saving hours of administrative work."
              points={[
                "Intelligent system automatically grades all multiple-choice and interactive questions instantly.",
                "Provides a clean, side-by-side interface for teachers to review text-based answers.",
                "Leave personalized feedback directly on student submissions.",
                "Assign manual grades quickly and efficiently."
              ]}
            />
            <DocItem 
              icon={<BarChart className="w-6 h-6 text-orange-500" />}
              title="Class Reports"
              desc="Unlock deep analytics tracking student performance over time to make data-driven educational decisions."
              points={[
                "Identify weak spots in specific subtopics across entire classes.",
                "Track daily and weekly student engagement metrics.",
                "Export beautiful data visualizations for parent-teacher conferences.",
                "Monitor cohort trends and overall classroom health."
              ]}
              image="/images/teacher_reports.jpg"
            />
            <DocItem 
              icon={<BarChart className="w-6 h-6 text-rose-500" />}
              title="Test Reports"
              desc="Dive into specific summative assessment data for formal exams."
              points={[
                "Dedicated view breaking down performance specifically on formal tests.",
                "Provides question-by-question analytics.",
                "Understand exactly where students struggled the most.",
                "Isolate common misconceptions and tricky distractors."
              ]}
              image="/images/test_reports.jpg"
            />
            <DocItem 
              icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />}
              title="Messages"
              desc="Maintain a secure, monitored communication channel with your students directly within the platform."
              points={[
                "Broadcast important announcements to entire classes at once.",
                "Send direct, encouraging feedback to specific students.",
                "Issue reminders to individual student dashboards.",
                "Ensure all communication stays professional and within the educational ecosystem."
              ]}
            />
            <DocItem 
              icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />}
              title="Rewards"
              desc="Take full control of the platform's gamification engine to keep engagement high."
              points={[
                "Customize XP point multipliers to incentivize specific tasks.",
                "Adjust daily coin rewards for student milestones.",
                "Manage the unlockable avatar accessories available in the store.",
                "Motivate consistent practice by maintaining and rewarding learning streaks."
              ]}
            />
            <DocItem 
              icon={<MessageSquare className="w-6 h-6 text-orange-500" />}
              title="My Prompts"
              desc="A massive time-saver for power users aiming to create highly specific assessments."
              points={[
                "Save your custom AI prompts permanently.",
                "Store specific pedagogical structures and formatting templates.",
                "Quickly generate your favorite style of questions.",
                "Eliminate the need to re-type complex AI instructions every time you build a new quiz."
              ]}
              image="/images/myprompts.jpg"
            />
            <DocItem 
              icon={<CreditCard className="w-6 h-6 text-green-500" />}
              title="Tuition Fees & Revenue"
              desc="An integrated financial suite built specifically for private tutors and independent educators."
              points={[
                "Manage your billing cycles directly from the dashboard.",
                "Set custom tuition rates for individual students or classes.",
                "Send automated, professional invoices to parents.",
                "Track payments securely directly from parents within the platform."
              ]}
              image="/images/set_tuitionfees.jpg"
            />
            <DocItem 
              icon={<Settings className="w-6 h-6 text-slate-500" />}
              title="Settings & Billing"
              desc="Manage your overarching teacher account configuration and platform preferences."
              points={[
                "Upgrade your subscription plan to access premium features.",
                "Expand your elastic student seat capacity as your business or classroom grows.",
                "Customize your dashboard's visual theme.",
                "Set data retention policies and update your vital account notification preferences."
              ]}
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
              desc="The student's central home base, featuring an engaging map-like learning path."
              points={[
                "Displays upcoming 'Missions' (homework assignments) requiring completion.",
                "Showcases recent achievements and unlocked milestones.",
                "Provides quick access to their interactive Virtual Pet Companion.",
                "Tracks and displays their current XP level and progress bar."
              ]}
              image="/images/math-learning-banner.png"
            />
            <DocItem 
              icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />}
              title="My Homework"
              desc="A comprehensive list of all pending assignments and past submissions."
              points={[
                "Launch into interactive quizzes directly from the assignment list.",
                "Engage with rich media including images and reading passages.",
                "Utilize built-in TTS (Text-to-Speech) for reading assistance.",
                "Complete interactive drag-and-drop elements and multiple-choice questions."
              ]}
            />
            <DocItem 
              icon={<Award className="w-6 h-6 text-rose-500" />}
              title="Exam Arena"
              desc="A formal testing environment specifically designed for NAPLAN-style and summative assessments."
              points={[
                "Enforces strict assessment timers to simulate real exam conditions.",
                "Prevents premature answer reveals to maintain testing integrity.",
                "Creates a distraction-free zone focused on uninterrupted focus.",
                "Results are held until the teacher releases them."
              ]}
            />
            <DocItem 
              icon={<Trophy className="w-6 h-6 text-emerald-500" />}
              title="Mission Reports"
              desc="Detailed feedback and analytics on completed assignments."
              points={[
                "Review graded tests to understand specific mistakes.",
                "See direct, personalized teacher comments.",
                "Track improvement over time across different subjects.",
                "Analyze exactly which topics require more practice."
              ]}
            />
            <DocItem 
              icon={<User className="w-6 h-6 text-green-500" />}
              title="My Profile"
              desc="The personalization hub where students can express their digital identity."
              points={[
                "Spend earned coins to customize the avatar with new accessories.",
                "Unlock and equip new banners to personalize the profile page.",
                "View total lifetime XP accumulated.",
                "Track and maintain the daily login streak for bonus rewards."
              ]}
            />
            <DocItem 
              icon={<Compass className="w-6 h-6 text-amber-500" />}
              title="Adventure Maze"
              desc="A fun, gamified maze mini-game integrated directly into the dashboard."
              points={[
                "Use earned rewards and keys to unlock new paths.",
                "Discover hidden secrets and easter eggs within the maze.",
                "Take short, rewarding brain-breaks between intense learning sessions.",
                "Foster a sense of exploration and continued engagement."
              ]}
            />
            <DocItem 
              icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />}
              title="My Messages"
              desc="A secure, read-only inbox for receiving communications from the teacher."
              points={[
                "Read direct feedback on specific assignments.",
                "Receive important class-wide announcements.",
                "Get encouraging messages and stickers from the teacher.",
                "Contains a notification badged counter for unread messages."
              ]}
            />
            <DocItem 
              icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />}
              title="My Rewards"
              desc="The 'Piggy Bank' vault where all accomplishments are stored."
              points={[
                "Admire the total collection of earned gold coins.",
                "Review achievement badges unlocked by hitting learning milestones.",
                "Access printable certificates awarded for completing major subject blocks.",
                "Track progress toward the next big reward tier."
              ]}
            />
            <DocItem 
              icon={<CreditCard className="w-6 h-6 text-green-500" />}
              title="Tuition & Fees (Parent Portal)"
              desc="A secure area designed specifically for parents."
              points={[
                "View complete payment history.",
                "Download receipts for tax or record-keeping purposes.",
                "Pay outstanding invoices securely via Stripe integration.",
                "Manage saved payment methods and subscription status."
              ]}
            />
            <DocItem 
              icon={<FileText className="w-6 h-6 text-rose-500" />}
              title="Child Report (Parent Portal)"
              desc="A simplified, parent-friendly progress report."
              points={[
                "Track the child's learning journey at a high level.",
                "Avoid complex grading metrics in favor of clear progress indicators.",
                "View recent achievements and completion rates.",
                "Understand areas where the child excels or needs assistance."
              ]}
            />
            <DocItem 
              icon={<BookOpen className="w-6 h-6 text-orange-500" />}
              title="Learning Academy"
              desc="A collapsible library of self-paced learning modules."
              points={[
                "Categorized by core concepts (e.g., Fractions, Geometry, Algebra).",
                "Students can voluntarily take practice quizzes on their own time.",
                "Earn extra XP and coins for completing self-directed learning.",
                "Encourages independent exploration and mastery."
              ]}
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

function DocItem({ icon, title, desc, points, image }) {
  return (
    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 page-break-inside-avoid">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black text-slate-800 mb-3">{title}</h3>
          <p className="text-slate-600 font-medium leading-relaxed mb-4">{desc}</p>
          
          {points && points.length > 0 && (
            <ul className="space-y-3">
              {points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 font-medium leading-relaxed">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {image && (
        <div className="mt-8 md:ml-[88px]">
          <img src={image} alt={title} className="w-full h-auto rounded-2xl shadow-lg border border-slate-200 object-cover" />
        </div>
      )}
    </div>
  );
}
