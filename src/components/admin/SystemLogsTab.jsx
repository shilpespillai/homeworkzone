import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, limit, getDocs, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Clock, Monitor, User, AlertCircle, RefreshCw, Crown, Trash2, 
  CalendarX, X, AlertTriangle, CheckCircle2, Loader2, Search, Filter, 
  Copy, Check, Code, Shield, GraduationCap, Laptop, Sparkles, ChevronRight
} from 'lucide-react';

export default function SystemLogsTab({ adminTeachers = [] }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [purgeDays, setPurgeDays] = useState(30);
  const [confirmModal, setConfirmModal] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'error_logs'), orderBy('timestamp', 'desc'), limit(150));
      const snap = await getDocs(q);
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.warn("Failed to fetch error logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'error_logs'), orderBy('timestamp', 'desc'), limit(150));
    const unsubscribe = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    }, (err) => {
      console.warn("Failed listening to error logs in real-time:", err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Copied error details to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to infer module if missing in older logs
  const getLogModule = (log) => {
    if (log.module && log.module !== 'Unknown' && log.module !== '/') return log.module;
    const msg = (log.message || '').toLowerCase();
    const stack = (log.stack || '').toLowerCase();
    const screen = (log.screen || '').toLowerCase();

    if (screen.includes('curious') || msg.includes('curious') || stack.includes('curiousmind')) return 'Curious Mind Hub';
    if (screen.includes('message') || msg.includes('message') || stack.includes('messaging')) return 'Messaging';
    if (screen.includes('library') || msg.includes('library') || stack.includes('libraryzone')) return 'Library Zone';
    if (screen.includes('adventure') || msg.includes('adventure') || stack.includes('adventuremaze')) return 'Adventure Maze';
    if (screen.includes('arts') || msg.includes('arts') || stack.includes('artsandfun')) return 'Arts & Fun';
    if (screen.includes('quiz') || msg.includes('quiz') || stack.includes('studentquiz')) return 'Student Quiz';
    if (screen.includes('teacher') || msg.includes('teacher') || stack.includes('teacherdashboard')) return 'Teacher Dashboard';
    if (screen.includes('admin') || msg.includes('admin') || stack.includes('adminpanel')) return 'Admin Panel';
    if (msg.includes('split') || msg.includes('auth')) return 'App Shell / Auth';
    return log.screen && log.screen !== '/' ? log.screen : 'Dashboard';
  };

  // Helper to infer user information if missing
  const getLogUserInfo = (log) => {
    const teacher = adminTeachers.find(t => t.id === log.userId || t.email === log.userEmail);
    
    let name = log.userName;
    let email = log.userEmail;
    let role = log.userRole;

    if (teacher) {
      name = teacher.name || teacher.displayName || name;
      email = teacher.email || email;
      role = (teacher.email?.includes('admin') || teacher.email === 'shilpesh.pillai@gmail.com') ? 'Admin' : 'Teacher';
    }

    if (!name || name === 'Anonymous' || name === 'Unknown User') {
      if (email && email !== 'N/A' && email !== 'Unknown') {
        name = email.split('@')[0];
      } else if (log.userId && log.userId !== 'anonymous') {
        name = `User ${log.userId.slice(0, 6)}`;
      } else {
        name = 'Active User';
      }
    }

    if (!role) {
      if (email && (email.includes('admin') || email === 'shilpesh.pillai@gmail.com')) role = 'Admin';
      else if (teacher || (log.userId && log.userId.length > 20)) role = 'Teacher';
      else if (email && email.includes('Classroom')) role = 'Student';
      else role = 'Teacher / User';
    }

    return { name, email: email || 'N/A', role, teacher };
  };

  const formatTime = (ts) => {
    if (!ts) return 'Unknown time';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return {
      full: date.toLocaleString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }),
      relative: getRelativeTimeString(date)
    };
  };

  const getRelativeTimeString = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getUserPlanBadge = (userId, teacher) => {
    const t = teacher || adminTeachers.find(item => item.id === userId);
    if (!t) return null;
    
    const plan = t.billing?.planId || 'free';
    const isPaid = plan !== 'free' && plan !== 'free_trial' && plan !== 'free_expired';
    
    if (isPaid) {
      return (
        <span className="flex items-center gap-1 text-[9px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase border border-amber-200 shadow-xs">
          <Crown className="w-2.5 h-2.5 text-amber-600" /> Pro
        </span>
      );
    }
    return <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase border border-slate-200">Free</span>;
  };

  const getModuleBadgeColor = (moduleName) => {
    const m = moduleName.toLowerCase();
    if (m.includes('curious')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (m.includes('message')) return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    if (m.includes('teacher')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (m.includes('admin')) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (m.includes('quiz') || m.includes('homework')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (m.includes('library')) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const handleDeleteAll = () => {
    setConfirmModal({
      title: "Delete All Error Logs?",
      message: "Are you sure you want to permanently delete ALL error logs? This will wipe the crash history and cannot be undone.",
      confirmText: "Yes, Delete All Logs",
      isDestructive: true,
      action: async () => {
        setIsDeleting(true);
        try {
          const snap = await getDocs(collection(db, 'error_logs'));
          await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'error_logs', d.id))));
          showToast(`Successfully deleted ${snap.docs.length} error logs!`);
          fetchLogs();
        } catch (err) {
          console.error(err);
          showToast("Failed to delete error logs.", true);
        } finally {
          setIsDeleting(false);
          setConfirmModal(null);
        }
      }
    });
  };

  const handlePurgeOld = () => {
    setConfirmModal({
      title: `Purge Logs Older Than ${purgeDays} Days?`,
      message: `Are you sure you want to delete all error logs created more than ${purgeDays} days ago?`,
      confirmText: `Purge Older Than ${purgeDays}d`,
      isDestructive: false,
      action: async () => {
        setIsDeleting(true);
        try {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - purgeDays);
          
          const q = query(collection(db, 'error_logs'), where('timestamp', '<', cutoffDate));
          const snap = await getDocs(q);
          
          if (snap.empty) {
            showToast(`No logs found older than ${purgeDays} days.`);
            setIsDeleting(false);
            setConfirmModal(null);
            return;
          }
          
          await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'error_logs', d.id))));
          showToast(`Successfully purged ${snap.docs.length} old logs!`);
          fetchLogs();
        } catch (err) {
          console.error(err);
          showToast("Failed to purge logs.", true);
        } finally {
          setIsDeleting(false);
          setConfirmModal(null);
        }
      }
    });
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const moduleName = getLogModule(log);
      const userInfo = getLogUserInfo(log);
      
      // Module filter
      if (selectedModule !== 'ALL' && moduleName !== selectedModule) return false;
      
      // Role filter
      if (selectedRole !== 'ALL' && userInfo.role.toLowerCase() !== selectedRole.toLowerCase()) return false;
      
      // Search filter
      if (searchTerm.trim()) {
        const queryStr = searchTerm.toLowerCase();
        const msgMatch = (log.message || '').toLowerCase().includes(queryStr);
        const stackMatch = (log.stack || '').toLowerCase().includes(queryStr);
        const userMatch = userInfo.name.toLowerCase().includes(queryStr) || userInfo.email.toLowerCase().includes(queryStr);
        const moduleMatch = moduleName.toLowerCase().includes(queryStr);
        if (!msgMatch && !stackMatch && !userMatch && !moduleMatch) return false;
      }
      return true;
    });
  }, [logs, selectedModule, selectedRole, searchTerm, adminTeachers]);

  // Unique modules for filter dropdown
  const uniqueModules = useMemo(() => {
    const set = new Set();
    logs.forEach(l => set.add(getLogModule(l)));
    return Array.from(set);
  }, [logs]);

  return (
    <div className="px-6 py-8 min-h-[calc(100vh-64px)] pb-24">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                System Error Logs
                <span className="text-xs font-black bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {logs.length} Total Logs
                </span>
              </h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Real-time console crashes, runtime errors, and user session telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3 py-1.5 shadow-sm">
            <span className="text-xs font-bold text-slate-500 mr-2">Purge:</span>
            <select 
              value={purgeDays} 
              onChange={(e) => setPurgeDays(Number(e.target.value))}
              className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer"
            >
              <option value={7}>&gt; 7 Days</option>
              <option value={14}>&gt; 14 Days</option>
              <option value={30}>&gt; 30 Days</option>
              <option value={60}>&gt; 60 Days</option>
            </select>
            <button 
              onClick={handlePurgeOld}
              disabled={isDeleting || isLoading}
              className="ml-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-2.5 py-1 rounded-xl border border-rose-200 text-xs flex items-center gap-1 transition-all disabled:opacity-50"
            >
              <CalendarX className="w-3 h-3" /> Purge
            </button>
          </div>

          <button 
            onClick={handleDeleteAll}
            disabled={isDeleting || isLoading || logs.length === 0}
            className="bg-white hover:bg-rose-50 text-rose-600 font-black text-xs px-3.5 py-2 rounded-2xl shadow-sm border border-rose-200 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>

          <button 
            onClick={fetchLogs}
            disabled={isDeleting || isLoading}
            className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-4 py-2 rounded-2xl shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by error message, user name, email, stack trace..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <select 
              value={selectedModule} 
              onChange={(e) => setSelectedModule(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer w-full"
            >
              <option value="ALL">All Modules ({logs.length})</option>
              {uniqueModules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 w-full md:w-auto">
            <User className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer w-full"
            >
              <option value="ALL">All Roles</option>
              <option value="Teacher">Teachers</option>
              <option value="Student">Students</option>
              <option value="Admin">Admins</option>
              <option value="Guest">Guests</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Error Logs Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left table-fixed min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="px-5 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider w-[160px]">
                  Timestamp
                </th>
                <th className="px-5 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider w-[220px]">
                  User Account
                </th>
                <th className="px-5 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider w-[190px]">
                  Module / Screen
                </th>
                <th className="px-5 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                  Error Message & Stack Trace
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-400 font-bold">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
                    Loading real-time logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-400 font-bold">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400 opacity-60" />
                    {searchTerm || selectedModule !== 'ALL' || selectedRole !== 'ALL' 
                      ? 'No error logs match your active search filters.'
                      : 'No errors logged! The system is 100% healthy.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const time = formatTime(log.timestamp);
                  const moduleName = getLogModule(log);
                  const user = getLogUserInfo(log);
                  const isCopied = copiedId === log.id;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* 1. Timestamp */}
                      <td className="px-5 py-4 align-top w-[160px]">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-800">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {time.relative}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 pl-5">
                            {time.full}
                          </span>
                        </div>
                      </td>

                      {/* 2. User Account */}
                      <td className="px-5 py-4 align-top w-[220px]">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-indigo-600 shrink-0 shadow-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-slate-800 truncate" title={user.name}>
                                {user.name}
                              </span>
                              {getUserPlanBadge(log.userId, user.teacher)}
                            </div>

                            <div className="text-[10px] font-bold text-slate-400 truncate mt-0.5" title={user.email}>
                              {user.email}
                            </div>

                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                user.role === 'Student' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {user.role}
                              </span>
                              {log.userId && log.userId !== 'anonymous' && (
                                <span className="text-[9px] font-mono text-slate-300 truncate max-w-[80px]" title={log.userId}>
                                  {log.userId.slice(0, 8)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Module / Screen */}
                      <td className="px-5 py-4 align-top w-[190px]">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-xl border shadow-2xs ${getModuleBadgeColor(moduleName)}`}>
                            <Monitor className="w-3 h-3 shrink-0" />
                            <span className="truncate">{moduleName}</span>
                          </span>

                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            Src: {log.source || 'runtime'}
                          </span>
                        </div>
                      </td>

                      {/* 4. Error Message & Stack */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-xs font-black text-rose-600 leading-snug break-words flex-1">
                            {log.message}
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => copyToClipboard(`${log.message}\n\nStack:\n${log.stack || 'N/A'}\n\nModule: ${moduleName}\nUser: ${user.name} (${user.email})`, log.id)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200 transition-all text-[10px] font-bold flex items-center gap-1"
                              title="Copy full error message & context"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>

                            <button
                              onClick={() => setSelectedLog({ ...log, inferredModule: moduleName, inferredUser: user })}
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition-all text-[10px] font-bold flex items-center gap-0.5"
                              title="Inspect full error telemetry"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {log.stack && (
                          <details className="mt-2.5 group/stack">
                            <summary className="text-[10px] font-black text-slate-400 hover:text-indigo-600 cursor-pointer list-none flex items-center gap-1 select-none transition-colors">
                              <Code className="w-3 h-3" />
                              <span>View Stack Trace</span>
                            </summary>
                            <pre className="mt-1.5 p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[10px] leading-relaxed overflow-x-auto max-h-40 border border-slate-800 selection:bg-rose-500 selection:text-white">
                              {log.stack}
                            </pre>
                          </details>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
              className="bg-white rounded-[32px] p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Error Telemetry Inspection</h3>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      Log ID: {selectedLog.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Error Message Banner */}
              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 mb-5">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block mb-1">Error Message</span>
                <p className="text-sm font-black text-rose-700 leading-snug">{selectedLog.message}</p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Module</span>
                  <span className="text-xs font-black text-slate-800 mt-0.5 block">{selectedLog.inferredModule}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">User Role</span>
                  <span className="text-xs font-black text-indigo-600 mt-0.5 block">{selectedLog.inferredUser?.role || 'User'}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Source</span>
                  <span className="text-xs font-black text-slate-700 mt-0.5 block">{selectedLog.source || 'runtime'}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 col-span-2 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">User Account</span>
                  <span className="text-xs font-black text-slate-800 mt-0.5 block">
                    {selectedLog.inferredUser?.name} ({selectedLog.inferredUser?.email})
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">User ID</span>
                  <span className="text-[10px] font-mono text-slate-600 mt-0.5 block truncate">{selectedLog.userId || 'N/A'}</span>
                </div>
              </div>

              {/* Stack Trace */}
              {selectedLog.stack && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-slate-500" /> Stack Trace
                    </span>
                    <button 
                      onClick={() => copyToClipboard(selectedLog.stack, `modal-stack-${selectedLog.id}`)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy Stack
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-56 border border-slate-800">
                    {selectedLog.stack}
                  </pre>
                </div>
              )}

              {/* Device & User Agent */}
              {selectedLog.userAgent && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-6">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">User Agent / Device</span>
                  <span className="text-[10px] font-mono text-slate-600 leading-relaxed block break-all">
                    {selectedLog.userAgent}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Animated Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-100 relative overflow-hidden"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${confirmModal.isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                  {confirmModal.isDestructive ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{confirmModal.title}</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1.5 leading-relaxed">{confirmModal.message}</p>
                </div>
                <button
                  onClick={() => !isDeleting && setConfirmModal(null)}
                  disabled={isDeleting}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.action}
                  disabled={isDeleting}
                  className={`flex-1 py-3.5 text-white rounded-2xl font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${confirmModal.isDestructive ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-[#EA580C] hover:bg-[#C2410C] shadow-orange-200'}`}
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isDeleting ? 'Deleting...' : confirmModal.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-[250] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-xs font-black ${toastMessage.isError ? 'bg-rose-900 text-white border-rose-800 shadow-rose-900/30' : 'bg-slate-900 text-white border-slate-800 shadow-slate-950/40'}`}
          >
            {toastMessage.isError ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
