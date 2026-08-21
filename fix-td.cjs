const fs = require('fs');
let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const hook =   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const isBooster = params.get('booster_success') === 'true';

    if (sessionId && user?.uid && !isVerifyingPayment) {
      const verifyPayment = async () => {
        setIsVerifyingPayment(true);
        try {
          const action = isBooster ? 'verify-booster' : 'verify-subscription';
          const res = await fetch('/api/billing-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, sessionId, teacherId: user.uid, email: user.email || 'sub@topup.com' })
          });
          const data = await res.json();
          if (data.success) {
            if (isBooster) {
              const credits = data.credits || 15;
              // Visual immediate bump
              setTeacherData(prev => ({
                ...prev,
                topUpCredits: (prev?.topUpCredits || 0) + credits
              }));
              setBoosterSuccessData(credits);
            } else {
              setTeacherData(prev => ({
                ...prev,
                billing: { ...prev?.billing, planId: data.planId, status: 'active' }
              }));
              setTimeout(() => alert('Subscription activated successfully!'), 500);
            }
          } else {
            setBoosterErrorMsg(data.message || 'Still processing or failed.');
          }
        } catch (err) {
          console.error('Error verifying payment:', err);
          setBoosterErrorMsg('Network error verifying payment.');
        } finally {
          setIsVerifyingPayment(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      
      // Prevent double calling
      const processed = localStorage.getItem(\erify_\\);
      if (!processed) {
        localStorage.setItem(\erify_\\, 'true');
        verifyPayment();
      } else {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user]);;

// We must replace the old useEffect handling booster_success
const oldHookRegex = /  useEffect\(\(\) => \{\n    const params = new URLSearchParams\(window\.location\.search\);\n    if \(params\.get\('booster_success'\) === 'true'\) \{[\s\S]*?  \}, \[user\]\);/;

content = content.replace(oldHookRegex, hook);
fs.writeFileSync('src/pages/TeacherDashboard.jsx', content);
