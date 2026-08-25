import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

let isListening = false;
let lastLogTime = 0;
const LOG_COOLDOWN_MS = 2000; // Prevent spamming Firestore with the exact same error in a loop

export const initErrorLogger = () => {
  if (isListening) return;
  isListening = true;

  const logErrorToFirestore = async (errorMsg, stack, source) => {
    // Basic rate limiting to prevent Firebase quota exhaustion on infinite loops
    const now = Date.now();
    if (now - lastLogTime < LOG_COOLDOWN_MS) return;
    lastLogTime = now;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      await addDoc(collection(db, 'error_logs'), {
        message: errorMsg || 'Unknown Error',
        stack: stack || '',
        screen: window.location.pathname + window.location.search || 'Unknown',
        userId: user ? user.uid : 'Unauthenticated',
        userEmail: user ? user.email : 'Unknown',
        userName: user ? (user.displayName || 'No Name') : 'Anonymous',
        source: source || 'window.onerror',
        userAgent: navigator.userAgent,
        timestamp: serverTimestamp(),
        status: 'new'
      });
    } catch (dbErr) {
      // Intentionally NOT using console.error here to prevent infinite recursive loops
      console.warn("Failed to log error to Firestore:", dbErr);
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
    if (rawMsg.includes('Warning: React does not recognize')) return;

    const errorMsg = args.map(arg => 
      typeof arg === 'object' ? (arg instanceof Error ? arg.message : JSON.stringify(arg)) : String(arg)
    ).join(' ');
    
    const stack = args.find(arg => arg instanceof Error)?.stack || new Error().stack || '';
    
    logErrorToFirestore(errorMsg, stack, 'console.error');
  };
};
