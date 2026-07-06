import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Send, 
  HelpCircle, 
  Heart, 
  MoreHorizontal, 
  FileText, 
  Download, 
  Smile,
  MessageSquare,
  Volume2,
  Video,
  Trash2
} from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const MessagingModule = ({ studentName, teacher, classroom, classroomStudents = [], getStudentAvatar }) => {
  const [activeTab, setActiveTab] = useState('Inbox');
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [activeClassmate, setActiveClassmate] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessageBody, setNewMessageBody] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  // Real-time listener for messages
  useEffect(() => {
    if (!teacher?.uid || !studentName) return;

    // Presence listener
    const presenceRef = collection(db, 'presence');
    const presenceQuery = query(presenceRef, where('classId', '==', classroom?.id || ''));
    const unsubPresence = onSnapshot(presenceQuery, (snap) => {
       const onlineMap = {};
       snap.docs.forEach(doc => {
          const data = doc.data();
          if (data.isOnline && data.studentName) {
             // Check if heartbeat is recent (within 2 mins)
             const lastActive = new Date(data.lastActive).getTime();
             if (Date.now() - lastActive < 120000) {
                 onlineMap[data.studentName.toLowerCase()] = true;
             }
          }
       });
       setOnlineUsers(onlineMap);
    });

    const messagesRef = collection(db, 'messages');
    
    // Fetch all messages involving this teacher (since student is linked to teacher)
    const q = query(
      messagesRef, 
      where('teacherId', '==', teacher.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
         const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
         const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
         return dateB - dateA;
      });

      // Filter based on roles and recipient types
      const filtered = allMsgs.filter(msg => {
        if (activeTab === 'Inbox') {
          return msg.senderRole === 'teacher' && 
                 msg.recipientType === 'student' && 
                 msg.recipientId?.toLowerCase() === studentName?.toLowerCase();
        } else if (activeTab === 'Sent') {
          return msg.senderRole === 'student' && 
                 msg.senderId?.toLowerCase() === studentName?.toLowerCase();
        } else if (activeTab === 'Announcements') {
          return msg.senderRole === 'teacher' && 
                 (msg.recipientType === 'all' || 
                  (msg.recipientType === 'class' && msg.recipientId === classroom?.id));
        } else if (activeTab === 'Classmates') {
          return msg.senderRole === 'student' && 
                 msg.recipientType === 'student' && 
                 (msg.senderId?.toLowerCase() === studentName?.toLowerCase() || 
                  msg.recipientId?.toLowerCase() === studentName?.toLowerCase());
        }
        return false;
      });

      setMessages(filtered);
      
      // Auto-select the first message if none is active or if active message is not in current list
      if (activeTab !== 'Classmates') {
        if (filtered.length > 0) {
          if (!activeMessage || !filtered.find(m => m.id === activeMessage.id)) {
            setActiveMessage(filtered[0]);
          }
        } else {
          setActiveMessage(null);
        }
      }
    }, (error) => {
      console.error("Error loading messages:", error);
    });

    return () => {
       unsubscribe();
       unsubPresence();
    };
  }, [teacher, studentName, classroom, activeTab]);

  // Mark viewed messages as read
  useEffect(() => {
    if (activeTab === 'Classmates' && activeClassmate) {
      messages.forEach(msg => {
        if (!msg.isRead && msg.recipientId?.toLowerCase() === studentName?.toLowerCase() && msg.senderId?.toLowerCase() === activeClassmate.name?.toLowerCase()) {
          updateDoc(doc(db, 'messages', msg.id), { isRead: true }).catch(console.error);
        }
      });
    } else if (activeMessage && !activeMessage.isRead && activeMessage.recipientId?.toLowerCase() === studentName?.toLowerCase()) {
      updateDoc(doc(db, 'messages', activeMessage.id), { isRead: true }).catch(console.error);
    }
  }, [activeTab, activeClassmate, activeMessage, messages, studentName]);

  const handleDeleteMessage = async (e, msgId) => {
    e.stopPropagation();
    if (await window.confirmCustom("Are you sure you want to delete this message forever? 🗑️")) {
      try {
        await deleteDoc(doc(db, 'messages', msgId));
        if (activeMessage?.id === msgId) setActiveMessage(null);
      } catch (err) {
        console.error("Error deleting message:", err);
        window.alert("Oops! Could not delete message. ❌");
      }
    }
  };

  // Handle sending a new message to the teacher
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageBody.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        teacherId: teacher.uid,
        senderId: studentName,
        senderName: studentName,
        senderRole: 'student',
        recipientType: 'teacher',
        recipientId: teacher.uid,
        recipientName: teacher.displayName || 'Teacher',
        subject: newSubject.trim() || 'New Question',
        content: newMessageBody.trim(),
        createdAt: new Date().toISOString(),
        classId: classroom?.id || null
      });

      setNewSubject('');
      setNewMessageBody('');
      setShowModal(false);
      setActiveTab('Sent');
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Oops! Couldn't send your message. Try again! 🚀");
    }
  };

  // Handle reply in right pane
  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      if (activeTab === 'Classmates' && activeClassmate) {
        await addDoc(collection(db, 'messages'), {
          teacherId: teacher.uid,
          senderId: studentName,
          senderName: studentName,
          senderRole: 'student',
          recipientType: 'student',
          recipientId: activeClassmate.name,
          recipientName: activeClassmate.name,
          subject: `Chat`,
          content: replyText.trim(),
          createdAt: new Date().toISOString(),
          classId: classroom?.id || null
        });
      } else if (activeMessage) {
        await addDoc(collection(db, 'messages'), {
          teacherId: teacher.uid,
          senderId: studentName,
          senderName: studentName,
          senderRole: 'student',
          recipientType: 'teacher',
          recipientId: teacher.uid,
          recipientName: teacher.displayName || 'Teacher',
          subject: `Re: ${activeMessage?.subject || 'Message'}`,
          content: replyText.trim(),
          createdAt: new Date().toISOString(),
          classId: classroom?.id || null
        });
        setActiveTab('Sent');
      }
      setReplyText('');
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  return (
    <div className="max-w-[100%] mx-auto py-4 font-sans relative">
      {/* Container */}
      <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-orange-100/50 flex flex-col relative overflow-hidden h-[750px]">
        
        {/* 1. Header Section */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-[#14532d] tracking-tight">My Messages</h1>
            <p className="text-[#166534] text-sm mt-1 font-bold italic">Communicate safely with your teacher.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-95 mr-6"
          >
            <Plus size={20} strokeWidth={3} />
            <span>Ask Teacher a Question</span>
          </button>
        </div>

        {/* 2. Tabs Section */}
        <div className="px-8 flex items-center justify-between border-b border-orange-100/60">
          <div className="flex gap-10">
            {['Inbox', 'Sent', 'Announcements', 'Classmates'].map((tab) => (
              <button 
                key={tab}
                onClick={() => {
                   setActiveTab(tab);
                   if (tab !== 'Classmates') setActiveClassmate(null);
                }}
                className={`py-4 font-black relative text-base transition-colors ${activeTab === tab ? 'text-[#EA580C] border-b-4 border-[#EA580C]' : 'text-[#166534] hover:text-blue-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="pr-4 text-[#EA580C] opacity-30">
            <Send size={24} className="transform rotate-12" />
          </div>
        </div>

        {/* 3. Body Section (Split Pane) */}
        <div className="flex flex-1 min-h-0 bg-slate-50/30">
          
          {/* Left Pane (Message List or Classmates List) - 1/3 width */}
          <div className="w-1/3 border-r border-orange-100/60 overflow-y-auto custom-scrollbar bg-white">
            {activeTab === 'Classmates' ? (
              classroomStudents.filter(s => s.name?.toLowerCase() !== studentName?.toLowerCase()).map((cm) => (
                <div 
                  key={cm.id || cm.name} 
                  onClick={() => setActiveClassmate(cm)}
                  className={`flex items-center gap-4 p-5 cursor-pointer transition-all border-b border-slate-50 ${activeClassmate?.name === cm.name ? 'bg-green-50/30' : 'hover:bg-slate-50/50'}`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm bg-green-50 flex items-center justify-center">
                      <img 
                        src={getStudentAvatar ? getStudentAvatar(cm.name) : `https://api.dicebear.com/7.x/adventurer/svg?seed=${cm.name || 'Felix'}`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {/* Online status indicator */}
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${onlineUsers[cm.name?.toLowerCase()] ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-black text-sm truncate ${activeClassmate?.name === cm.name ? 'text-[#14532d]' : 'text-slate-700'}`}>
                      {cm.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold">
                      {onlineUsers[cm.name?.toLowerCase()] ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              messages.length > 0 ? (
                messages.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setActiveMessage(item)}
                    className={`group flex items-start gap-4 p-5 cursor-pointer transition-all border-b border-slate-50 ${activeMessage?.id === item.id ? 'bg-green-50/30' : 'hover:bg-slate-50/50'}`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm bg-green-50 flex items-center justify-center">
                      {activeTab === 'Announcements' ? (
                        <Volume2 className="text-[#EA580C] w-6 h-6" />
                      ) : (
                        <img 
                          src={getStudentAvatar ? getStudentAvatar(item.senderName) : `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.senderName || 'Felix'}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-black text-sm truncate ${activeMessage?.id === item.id ? 'text-[#14532d]' : 'text-slate-700'}`}>
                          {activeTab === 'Announcements' ? 'Class Announcement' : item.senderName}
                        </h3>
                        <div className="flex items-center gap-2 ml-2">
                           {activeTab !== 'Announcements' && (
                             <button 
                               onClick={(e) => handleDeleteMessage(e, item.id)}
                               className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                               title="Delete Message"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                           <span className="text-[10px] text-[#166534] font-bold whitespace-nowrap">
                             {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}
                           </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-[#166534] truncate font-bold">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 px-6 text-center text-[#166534] font-bold italic text-sm">
                  No messages here yet! 💌
                </div>
              )
            )}
          </div>

          {/* Right Pane (Message Thread View) - 2/3 width */}
          <div className="w-2/3 p-10 flex flex-col justify-between min-h-0 bg-blue-50/10">
            {activeTab === 'Classmates' ? (
              activeClassmate ? (
                <div className="flex flex-col h-full justify-between">
                  <div className="mb-6 border-b border-orange-100/50 pb-4 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black text-[#14532d]">Chat with {activeClassmate.name}</h2>
                      <p className="text-[10px] font-black text-slate-400 mt-1 tracking-wide uppercase">
                        {onlineUsers[activeClassmate.name?.toLowerCase()] ? '🟢 Online Now' : '⚪ Offline'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 flex flex-col-reverse gap-4">
                    {/* Messages are sorted descending in state, so we reverse for display */}
                    {[...messages]
                      .filter(m => (m.senderId?.toLowerCase() === activeClassmate.name?.toLowerCase() && m.recipientId?.toLowerCase() === studentName?.toLowerCase()) || 
                                   (m.senderId?.toLowerCase() === studentName?.toLowerCase() && m.recipientId?.toLowerCase() === activeClassmate.name?.toLowerCase()))
                      .map(msg => (
                        <div key={msg.id} className={`max-w-[80%] p-4 rounded-[24px] ${msg.senderId?.toLowerCase() === studentName?.toLowerCase() ? 'bg-[#EA580C] text-white self-end rounded-tr-none shadow-orange-100 shadow-md' : 'bg-white text-slate-700 self-start rounded-tl-none border border-orange-100 shadow-sm'}`}>
                          {msg.content.includes('[DAILY_ROOM:') || msg.content.includes('[JITSI_MEET_ROOM:') ? (
                            <div className="flex flex-col items-start gap-2">
                              <p className="font-bold text-sm opacity-50">Expired Video Call</p>
                            </div>
                          ) : (
                            <p className="font-bold text-sm">{msg.content}</p>
                          )}
                          <p className={`text-[9px] mt-1 text-right opacity-70`}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                          </p>
                        </div>
                      ))
                    }
                    {messages.filter(m => (m.senderId?.toLowerCase() === activeClassmate.name?.toLowerCase() && m.recipientId?.toLowerCase() === studentName?.toLowerCase()) || (m.senderId?.toLowerCase() === studentName?.toLowerCase() && m.recipientId?.toLowerCase() === activeClassmate.name?.toLowerCase())).length === 0 && (
                       <div className="text-center text-slate-400 font-bold italic py-10 w-full">Say hi to {activeClassmate.name}! 👋</div>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-orange-100/50 flex items-center gap-4 bg-transparent">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder={`Message ${activeClassmate.name}...`} 
                      className="w-full bg-white border border-blue-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-50 transition-all placeholder-blue-200 text-slate-700 shadow-sm"
                    />
                    <button 
                      onClick={handleSendReply}
                      className="bg-[#14532d] hover:bg-[#166534] text-white p-4 rounded-full font-black text-sm shadow-lg shadow-green-100 transition-all active:scale-95 flex-shrink-0"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#166534] font-bold italic text-sm gap-2">
                  <MessageSquare size={48} className="stroke-1 text-blue-200" />
                  <span>Select a classmate to start chatting! 💬</span>
                </div>
              )
            ) : activeMessage ? (
              <div className="flex flex-col h-full justify-between">
                <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
                  <div className="mb-6 border-b border-orange-100/50 pb-4 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black text-[#14532d]">{activeMessage.subject || 'No Subject'}</h2>
                      <p className="text-[10px] font-black text-[#166534] mt-1 tracking-wide uppercase">
                        From: {activeMessage.senderName} • {activeMessage.createdAt ? new Date(activeMessage.createdAt).toLocaleString() : ''}
                      </p>
                    </div>
                    {activeTab === 'Announcements' && (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black border border-amber-200">
                        📢 Announcement
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="max-w-[95%] self-start space-y-6">
                    <div className="bg-white p-8 rounded-[32px] rounded-tl-none border border-orange-100 shadow-sm relative">
                      <div className="space-y-4">
                        <p className="text-slate-600 text-base leading-relaxed font-bold whitespace-pre-wrap">
                          {activeMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Section (Message Input for Direct Message Replies) */}
                {activeTab === 'Inbox' && (
                  <div className="pt-6 mt-4 border-t border-orange-100/50 flex items-center gap-4 bg-transparent">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                        placeholder="Reply to teacher..." 
                        className="w-full bg-white border border-blue-100 rounded-[20px] py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white transition-all placeholder-blue-200 text-slate-700 shadow-sm"
                      />
                    </div>
                    <button 
                      onClick={handleSendReply}
                      className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-8 py-4 rounded-[20px] font-black text-sm shadow-xl shadow-orange-100 transition-all active:scale-95"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#166534] font-bold italic text-sm gap-2">
                <MessageSquare size={48} className="stroke-1 text-blue-200" />
                <span>Select a message to view the conversation! 🎈</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#14532d]/20 backdrop-blur-sm z-[999] flex-center p-4">
          <div className="bg-white rounded-[32px] border border-orange-100 w-full max-w-lg p-8 shadow-2xl relative animate-bounce-short">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-[#166534] hover:text-blue-500 transition-all"
            >
              <X size={20} strokeWidth={3} />
            </button>
            <h3 className="text-2xl font-black text-[#14532d] mb-6 flex items-center gap-3">
              <MessageSquare className="text-[#EA580C]" /> Ask Your Teacher
            </h3>
            
            <form onSubmit={handleSendMessage} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-[#166534] uppercase tracking-widest block mb-2">To</label>
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-600">
                  🎒 Teacher: {teacher?.displayName || 'Class Instructor'}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[#166534] uppercase tracking-widest block mb-2">Subject</label>
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Question about Maths quiz"
                  className="w-full bg-white border border-blue-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-50 transition-all text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#166534] uppercase tracking-widest block mb-2">Message</label>
                <textarea 
                  value={newMessageBody}
                  onChange={(e) => setNewMessageBody(e.target.value)}
                  placeholder="Write your question here..."
                  rows={4}
                  className="w-full bg-white border border-blue-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-50 transition-all text-slate-700 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm transition-colors border border-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white py-4 rounded-2xl font-black text-sm transition-colors shadow-lg shadow-orange-100"
                >
                  Send Message 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingModule;
