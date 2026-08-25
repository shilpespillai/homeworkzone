import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Terminal, Clock, Monitor, User, AlertCircle, RefreshCw, Crown, Trash2, CalendarX } from 'lucide-react';

export default function SystemLogsTab({ adminTeachers = [] }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [purgeDays, setPurgeDays] = useState(30);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'error_logs'), orderBy('timestamp', 'desc'), limit(100));
      const snap = await getDocs(q);
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.warn("Failed to fetch error logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to permanently delete ALL error logs? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const snap = await getDocs(collection(db, 'error_logs'));
      await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'error_logs', d.id))));
      alert(`Successfully deleted ${snap.docs.length} logs!`);
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete logs.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePurgeOld = async () => {
    if (!window.confirm(`Are you sure you want to delete logs older than ${purgeDays} days?`)) return;
    
    setIsDeleting(true);
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - purgeDays);
      
      const q = query(collection(db, 'error_logs'), where('timestamp', '<', cutoffDate));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        alert("No logs found older than " + purgeDays + " days.");
        setIsDeleting(false);
        return;
      }
      
      await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'error_logs', d.id))));
      alert(`Successfully purged ${snap.docs.length} old logs!`);
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert("Failed to purge logs.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return 'Unknown time';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString();
  };

  const getUserPlanBadge = (userId) => {
    if (!userId || userId === 'Unauthenticated') return null;
    const teacher = adminTeachers.find(t => t.id === userId);
    if (!teacher) return <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">Unknown</span>;
    
    const plan = teacher.billing?.planId || 'free';
    const isPaid = plan !== 'free' && plan !== 'free_trial' && plan !== 'free_expired';
    
    if (isPaid) {
      return (
        <span className="flex items-center gap-1 text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase border border-amber-200">
          <Crown className="w-2.5 h-2.5" /> Paid
        </span>
      );
    }
    return <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase border border-slate-200">Free</span>;
  };

  return (
    <div className="px-6 py-8 min-h-[calc(100vh-64px)] pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Terminal className="w-7 h-7 text-rose-500" /> System Error Logs
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            Real-time console errors and crash reports from active users.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 shadow-sm mr-2">
            <span className="text-xs font-bold text-slate-500 mr-2">Purge older than:</span>
            <select 
              value={purgeDays} 
              onChange={(e) => setPurgeDays(Number(e.target.value))}
              className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
            <button 
              onClick={handlePurgeOld}
              disabled={isDeleting || isLoading}
              className="ml-3 bg-white hover:bg-rose-50 text-rose-600 font-bold px-3 py-1.5 rounded-lg border border-rose-200 text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <CalendarX className="w-3.5 h-3.5" /> Purge
            </button>
          </div>

          <button 
            onClick={handleDeleteAll}
            disabled={isDeleting || isLoading || logs.length === 0}
            className="bg-white hover:bg-rose-50 text-rose-600 font-bold px-4 py-2 rounded-xl shadow-sm border border-rose-200 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>

          <button 
            onClick={fetchLogs}
            disabled={isDeleting || isLoading}
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider w-1/3">Error Message</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">User Account</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Screen / Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-bold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-300" /> Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-bold">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-green-400 opacity-50" />
                    No errors logged yet! System is healthy.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-rose-50/30 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-bold text-rose-600 mb-1 leading-tight break-words pr-4">
                        {log.message}
                      </div>
                      {log.stack && (
                        <details className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded-lg cursor-pointer max-h-32 overflow-y-auto">
                          <summary className="font-bold text-slate-500 mb-1 outline-none">View Stack Trace</summary>
                          {log.stack}
                        </details>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {log.userName || log.userEmail || 'Unknown User'}
                        {getUserPlanBadge(log.userId)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium ml-5 mt-1">
                        {log.userEmail}
                      </div>
                      <div className="text-[9px] text-slate-300 font-mono ml-5 mt-0.5">
                        {log.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md inline-flex">
                        <Monitor className="w-3.5 h-3.5" />
                        {log.screen || 'Unknown'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-2 ml-1">
                        Src: {log.source}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
