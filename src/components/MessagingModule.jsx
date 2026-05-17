import React from 'react';
import { 
  Plus, 
  X, 
  Send, 
  HelpCircle, 
  Heart, 
  MoreHorizontal, 
  FileText, 
  Download, 
  Smile 
} from 'lucide-react';

const MessagingModule = () => {
  const messages = [
    {
      id: 1,
      name: "Grade 2A Parents",
      snippet: "Thank you for attending the...",
      time: "Yesterday",
      active: true,
      hasBadge: true,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
    },
    {
      id: 2,
      name: "Aranya Patal Parents",
      snippet: "Thank you: osufaoxoe...",
      time: "Yesterday",
      active: false,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka"
    },
    {
      id: 3,
      name: "Vihaan Cupts Parents",
      snippet: "Thank you for the optiata!",
      time: "Yesterday",
      active: false,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vihaan"
    },
    {
      id: 4,
      name: "Kram 2S Ksanna",
      snippet: "Acchtoes. Scabes project...",
      time: "2 day",
      active: false,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Kram"
    },
    {
      id: 5,
      name: "Mya Gingh Forards",
      snippet: "Can we sschedule a mosking?",
      time: "2 day",
      active: false,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mya"
    }
  ];

  return (
    <div className="max-w-[100%] mx-auto py-4 font-sans">
      {/* Container */}
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden h-[800px]">
        
        {/* Close Icon */}
        <button className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors z-20">
          <X size={20} />
        </button>

        {/* 1. Header Section */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-[#1E293B] tracking-tight">My Messages</h1>
            <p className="text-gray-400 text-sm mt-1 font-semibold">Communicate with students and parents.</p>
          </div>
          <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-100 transition-all active:scale-95 mr-6">
            <Plus size={20} strokeWidth={3} />
            <span>Send New Message</span>
          </button>
        </div>

        {/* 2. Tabs Section */}
        <div className="px-8 flex items-center justify-between border-b border-gray-100/60">
          <div className="flex gap-10">
            <button className="py-4 text-[#8b5cf6] font-bold border-b-4 border-[#8b5cf6] relative text-lg">
              Inbox
            </button>
            <button className="py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors text-lg">
              Sent
            </button>
            <button className="py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors text-lg">
              Conversations
            </button>
          </div>
          <div className="pr-4 text-[#8b5cf6] opacity-30">
            <Send size={32} className="transform rotate-12" />
          </div>
        </div>

        {/* 3. Body Section (Split Pane) */}
        <div className="flex flex-1 min-h-0">
          
          {/* Left Pane (Message List) - 1/3 width */}
          <div className="w-1/3 border-r border-gray-100 overflow-y-auto custom-scrollbar">
            {messages.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-start gap-4 p-5 cursor-pointer transition-all border-b border-gray-50/50 ${item.active ? 'bg-[#F9F7FF]' : 'hover:bg-gray-50'}`}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-[15px] truncate ${item.active ? 'text-[#1E293B]' : 'text-[#334155]'}`}>
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-bold whitespace-nowrap ml-2">
                      {item.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-400 truncate font-semibold">
                      {item.snippet}
                    </p>
                    {item.hasBadge && (
                      <div className="bg-[#9333ea] rounded-full p-1 shadow-sm shrink-0">
                        <HelpCircle size={12} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Pane (Message Thread View) - 2/3 width */}
          <div className="w-2/3 p-10 bg-white flex flex-col overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B]">Grade 2A Parents</h2>
              <p className="text-xs font-bold text-gray-400 mt-1 tracking-wide uppercase">3 May 2025-18:32 PM</p>
            </div>

            {/* Message Bubble */}
            <div className="max-w-[95%] self-start space-y-6">
              <div className="bg-[#F5F3FF] p-8 rounded-[40px] rounded-tl-none border border-[#EDE9FE] shadow-sm">
                <div className="space-y-4">
                  <p className="text-[#334155] text-lg leading-relaxed font-semibold">
                    Thank you for attending the parent meeting today. Today. firat the homework calclations attached.
                  </p>
                  <p className="text-[#334155] text-lg leading-relaxed font-semibold">
                    Let me know if you have my question?
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-8">
                  <button className="text-[#EF4444] hover:scale-110 transition-transform flex items-center justify-center">
                    <Heart size={22} fill="currentColor" />
                  </button>
                  <button className="text-gray-300 hover:text-gray-500">
                    <MoreHorizontal size={24} />
                  </button>
                </div>
              </div>

              {/* Attachment Card */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400/80 shadow-inner group-hover:scale-105 transition-transform">
                    <FileText size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#1E293B]">Homework, Gatharias.pdf</h4>
                    <p className="text-xs font-bold text-gray-400">12 MB</p>
                  </div>
                </div>
                <button className="p-3 text-[#8b5cf6] hover:bg-purple-50 rounded-2xl transition-colors">
                  <Download size={24} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Footer Section (Message Input) */}
        <div className="p-8 border-t border-gray-100 flex items-center gap-6 bg-white">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Type New Message..." 
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-[24px] py-5 px-8 pr-16 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-purple-50 focus:bg-white transition-all placeholder-gray-400 text-slate-700 shadow-sm"
            />
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8b5cf6] transition-colors">
              <Smile size={24} />
            </button>
          </div>
          <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-12 py-5 rounded-[24px] font-bold text-[15px] shadow-xl shadow-purple-100 transition-all active:scale-95">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingModule;
