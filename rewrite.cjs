const fs = require('fs');
let file = fs.readFileSync('src/components/PaperQuotaBoosterModal.jsx', 'utf-8');

// The original handlePurchase
const search = \  const handlePurchase = async () => {
    const pack = packs.find(p => p.id === selectedPack);
    if (!pack) return;

    setIsProcessing(true);
    try {
      if (user?.uid) {
        const teacherRef = doc(db, 'teachers', user.uid);
        await updateDoc(teacherRef, {
          topUpCredits: increment(pack.credits)
        });
      }

      const updatedCredits = (topUpCredits || 0) + pack.credits;

      // Update parent state
      if (onCreditsUpdated) {
        onCreditsUpdated(updatedCredits);
      }

      setSuccessMessage(\\\Success! +\\\ Paper Credits added to your account 🎉\\\);
      setTimeout(() => {
        setSuccessMessage(null);
        setIsProcessing(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error("Error adding top-up credits:", err);
      // Local state fallback
      if (onCreditsUpdated) {
        onCreditsUpdated((topUpCredits || 0) + pack.credits);
      }
      setIsProcessing(false);
      onClose();
    }
  };\;

const replace = \  const handlePurchase = async () => {
    const pack = packs.find(p => p.id === selectedPack);
    if (!pack) return;

    setIsProcessing(true);
    try {
      if (!user?.uid || !user?.email) {
         throw new Error("User email or ID missing");
      }

      const res = await fetch('/api/billing-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: user.uid,
          email: user.email,
          planId: \\\ooster-\\\\\\,
          successUrl: \\\\\\/dashboard?booster_success=true\\\,
          cancelUrl: \\\\\\/dashboard\\\,
          action: 'checkout'
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session');
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      alert('Failed to connect to Stripe. Please try again.');
      setIsProcessing(false);
    }
  };\;

// Since there are emojis and template literals, let's just do a regex replace from "const handlePurchase =" to the end of the function.
// Or write it directly.
