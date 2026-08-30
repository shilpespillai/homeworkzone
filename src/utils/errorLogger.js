import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

let isListening = false;
let lastLogTime = 0;
const LOG_COOLDOWN_MS = 1500; // Prevent spamming Firestore with the exact same error in a loop

export const initErrorLogger = () => {
  if (isListening) return;
  isListening = true;

  const getContextInfo = () => {
    let authUser = null;
    try {
      const auth = getAuth();
      authUser = auth.currentUser;
    } catch (e) {}

    let student = null;
    try {
      const savedStudent = localStorage.getItem('hwz_active_student');
      if (savedStudent) student = JSON.parse(savedStudent);
    } catch (e) {}

    const activeNav = (typeof window !== 'undefined' && window.__HZ_ACTIVE_NAV__) || (typeof localStorage !== 'undefined' && localStorage.getItem('hwz_last_active_nav')) || '';
    const pathname = (typeof window !== 'undefined' && window.location.pathname) || '/';

    let moduleName = 'Dashboard';
    if (activeNav) {
      moduleName = activeNav.replace(/^Learning:\s*/i, '');
    } else if (pathname.includes('teacher')) {
      moduleName = 'Teacher Dashboard';
    } else if (pathname.includes('admin')) {
      moduleName = 'Admin Panel';
    } else if (pathname.includes('student') || pathname.includes('quiz')) {
      moduleName = 'Student Quiz';
    } else if (pathname.length > 1) {
      moduleName = pathname;
    }

    let userRole = 'Guest';
    let userName = 'Anonymous User';
    let userEmail = 'N/A';
    let userId = 'anonymous';

    if (authUser) {
      userId = authUser.uid;
      userEmail = authUser.email || 'N/A';
      userName = authUser.displayName || (authUser.email ? authUser.email.split('@')[0] : 'Teacher User');
      userRole = authUser.email && (authUser.email.includes('admin') || authUser.email === 'shilpesh.pillai@gmail.com') ? 'Admin' : 'Teacher';
    } else if (student && student.name) {
      userName = student.name;
      userId = student.id || student.studentId || student.name;
      userEmail = student.classroomId ? `Classroom: ${student.classroomId}` : (student.email || 'N/A');
      userRole = 'Student';
    }

    return {
      userId,
      userEmail,
      userName,
      userRole,
      module: moduleName,
      screen: activeNav ? `${activeNav} (${pathname})` : pathname
    };
  };

  const logErrorToFirestore = async (errorMsg, stack, source) => {
    // Basic rate limiting to prevent Firebase quota exhaustion on infinite loops
    const now = Date.now();
    if (now - lastLogTime < LOG_COOLDOWN_MS) return;
    lastLogTime = now;

    try {
      const msgStr = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);

      // Do not attempt Firestore writes if it is a permission/auth error or noise
      if (
        msgStr.includes('permission') ||
        msgStr.includes('permission-denied') ||
        msgStr.includes('auth/admin-restricted') ||
        msgStr.includes('Failed to log error') ||
        msgStr.includes('ResizeObserver loop')
      ) {
        return;
      }

      const ctx = getContextInfo();

      await addDoc(collection(db, 'error_logs'), {
        message: msgStr || 'Unknown Error',
        stack: stack || '',
        module: ctx.module,
        screen: ctx.screen,
        userId: ctx.userId,
        userEmail: ctx.userEmail,
        userName: ctx.userName,
        userRole: ctx.userRole,
        source: source || 'window.onerror',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        timestamp: serverTimestamp(),
        status: 'new'
      });
    } catch (dbErr) {
      // Silently ignore to prevent infinite recursive loops
    }
  };

  // 1. Catch unhandled runtime errors
  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.') return;
    const stack = event.error ? event.error.stack : '';
    logErrorToFirestore(event.message, stack, 'window.error');
  });

  // 2. Catch unhandled promise rejections (like failed fetch calls)
  window.addEventListener('unhandledrejection', (event) => {
    const errorMsg = event.reason ? (event.reason.message || String(event.reason)) : 'Unhandled Promise Rejection';
    const stack = event.reason ? event.reason.stack : '';
    logErrorToFirestore(errorMsg, stack, 'unhandledrejection');
  });

  // 3. Catch manual console.error logs
  const originalConsoleError = console.error;
  console.error = function (...args) {
    originalConsoleError.apply(console, args);

    // Ignore some common harmless React dev warnings if necessary
    const rawMsg = args.join(' ');
    if (rawMsg.includes('Warning: React does not recognize') || rawMsg.includes('Download the React DevTools')) return;

    const errorMsg = args.map(arg =>
      typeof arg === 'object' ? (arg instanceof Error ? arg.message : JSON.stringify(arg)) : String(arg)
    ).join(' ');

    const stack = args.find(arg => arg instanceof Error)?.stack || new Error().stack || '';

    logErrorToFirestore(errorMsg, stack, 'console.error');
  };
};
