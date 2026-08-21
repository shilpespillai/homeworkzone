const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const resumeLogic = `
  const [isResumingSub, setIsResumingSub] = useState(false);
  const handleResumeSubscription = async () => {
    if (!teacherBilling?.stripeSubscriptionId) return;
    
    setIsResumingSub(true);
    try {
      const response = await fetch('/api/resume-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: teacherBilling.stripeSubscriptionId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resume');
      
      // Update local state immediately for UI responsiveness
      setTeacherBilling(prev => ({ ...prev, cancelAtPeriodEnd: false }));
      alert("Success! Your subscription has been resumed and will renew automatically.");
    } catch (err) {
      console.error(err);
      alert("Error resuming subscription: " + err.message);
    } finally {
      setIsResumingSub(false);
    }
  };
`;

const targetAnchor = `  const handleSendRemediationMsg = async () => {`;

if (!file.includes('const handleResumeSubscription = async () => {')) {
  file = file.replace(targetAnchor, resumeLogic + '\n' + targetAnchor);
  fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
  console.log("Injected handleResumeSubscription.");
} else {
  console.log("Function already exists.");
}
