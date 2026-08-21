const fs = require('fs');
let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const target =   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('booster_success') === 'true') {
      const creditsAdded = parseInt(params.get('credits') || '0', 10);
      if (creditsAdded > 0) {
        setTeacherData(prev => ({
          ...prev,
          topUpCredits: (prev?.topUpCredits || 0) + creditsAdded
        }));
        setTimeout(() => alert(\Successfully added \ papers to your quota!\), 500);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);;

const replacement =   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('booster_success') === 'true') {
      const creditsAdded = parseInt(params.get('credits') || '0', 10);
      const sessionId = params.get('session_id');
      
      if (creditsAdded > 0 && sessionId && user?.uid) {
        const processed = localStorage.getItem(\ooster_\\);
        if (!processed) {
          localStorage.setItem(\ooster_\\, 'true');
          
          setTeacherData(prev => ({
            ...prev,
            topUpCredits: (prev?.topUpCredits || 0) + creditsAdded
          }));
          
          setDoc(doc(db, 'teachers', user.uid), {
             topUpCredits: increment(creditsAdded)
          }, { merge: true }).catch(console.error);
          
          setTimeout(() => alert(\Successfully added \ papers to your quota!\), 500);
        }
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);;

content = content.replace(target, replacement);

// ensure 'increment' is imported from firebase/firestore
if (!content.includes('increment,')) {
    content = content.replace('import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, onSnapshot, orderBy, limit, deleteDoc } from "firebase/firestore";', 'import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, onSnapshot, orderBy, limit, deleteDoc, increment } from "firebase/firestore";');
}

fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf-8');
console.log('Fixed TeacherDashboard');
