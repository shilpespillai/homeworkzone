// Centralized Paper Quota & Booster Manager for Homework Zone
// All limits come from pricingConfig (Firestore-backed). Nothing is hardcoded here.

import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { getPaperQuota, DEFAULT_PRICING } from './pricingConfig';

/**
 * Records a paper generation in the persistent non-decrementing ledger.
 * Deleting a paper afterwards will NEVER reduce these counters.
 */
export const recordPaperGeneration = async (db, teacherUid) => {
  if (!db || !teacherUid) return;
  try {
    const teacherRef = doc(db, 'teachers', teacherUid);
    const snap = await getDoc(teacherRef);
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    let nextTotal = 1;
    let nextMonth = 1;

    if (snap.exists()) {
      const data = snap.data();
      const lastMonthKey = data.currentCycleMonth || '';
      const isNewCycle = lastMonthKey !== currentMonthKey;

      nextTotal = (Number(data.papersGeneratedTotal) || 0) + 1;
      nextMonth = isNewCycle ? 1 : ((Number(data.papersGeneratedThisMonth) || 0) + 1);

      const updateData = {
        papersGeneratedTotal: increment(1),
        currentCycleMonth: currentMonthKey,
        lastPaperGeneratedAt: new Date().toISOString()
      };

      if (isNewCycle) {
        updateData.papersGeneratedThisMonth = 1;
      } else {
        updateData.papersGeneratedThisMonth = increment(1);
      }

      await setDoc(teacherRef, updateData, { merge: true });
    } else {
      await setDoc(teacherRef, {
        papersGeneratedTotal: 1,
        papersGeneratedThisMonth: 1,
        currentCycleMonth: currentMonthKey,
        lastPaperGeneratedAt: new Date().toISOString()
      }, { merge: true });
    }

    // Also update client-side water-mark cache for instantaneous feedback
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`hwz_max_papers_${teacherUid}`, String(nextTotal));
        localStorage.setItem(`hwz_month_papers_${teacherUid}_${currentMonthKey}`, String(nextMonth));
      } catch (e) {}
    }
  } catch (err) {
    console.error('[quotaManager] Failed to record paper generation:', err);
  }
};

/**
 * Calculates how many papers were generated during the current billing cycle from homework docs.
 */
export const getMonthlyUsageCount = (allHomeworks = [], billingCycleResetDate = null) => {
  if (!Array.isArray(allHomeworks) || allHomeworks.length === 0) return 0;

  const now = new Date();
  let cycleStart = new Date(now.getFullYear(), now.getMonth(), 1);

  if (billingCycleResetDate) {
    const reset = new Date(billingCycleResetDate);
    if (!isNaN(reset.getTime()) && reset <= now) {
      cycleStart = reset;
    }
  }

  return allHomeworks.filter(hw => {
    if (!hw.createdAt) return false;
    let hwDate;
    if (hw.createdAt.seconds) {
      hwDate = new Date(hw.createdAt.seconds * 1000);
    } else {
      hwDate = new Date(hw.createdAt);
    }
    return !isNaN(hwDate.getTime()) && hwDate >= cycleStart;
  }).length;
};

/**
 * Returns the base paper quota for a given planId, reading from pricingConfig.
 */
export const getBaseQuotaForPlan = (planId, studentCount = 1, pricing = DEFAULT_PRICING) => {
  return getPaperQuota(planId, pricing);
};

/**
 * Checks if a user can generate a new paper.
 * Uses persistent non-decrementing counters with high-water mark lock so deleting papers can NEVER reduce usage.
 */
export const checkCanGeneratePaper = ({
  user,
  teacherProfile = {},
  teacherBilling = {},
  isAdmin = false,
  isSuperUser = false,
  activePlanId = 'free',
  allHomeworks = [],
  topUpCredits = 0,
  pricing = DEFAULT_PRICING,
  db = null
}) => {
  const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
  const isMaxed = simulatedPlan && simulatedPlan.endsWith('_maxed');
  const cleanPlan = isMaxed ? simulatedPlan.replace('_maxed', '') : simulatedPlan;
  const effectivePlan = cleanPlan || activePlanId;

  const teacherUid = user?.uid || teacherProfile?.uid || teacherBilling?.uid || '';
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // 1. Read persistent counters directly from teacher profile / billing doc
  const persistentTotal = Number(teacherProfile?.papersGeneratedTotal ?? teacherBilling?.papersGeneratedTotal ?? 0);
  const persistentMonth = Number(teacherProfile?.papersGeneratedThisMonth ?? teacherBilling?.papersGeneratedThisMonth ?? 0);

  // 2. Read local client high-water marks (prevents state race conditions)
  let localStoredTotal = (typeof localStorage !== 'undefined' && teacherUid) 
    ? Number(localStorage.getItem(`hwz_max_papers_${teacherUid}`) || 0) 
    : 0;
  let localStoredMonth = (typeof localStorage !== 'undefined' && teacherUid) 
    ? Number(localStorage.getItem(`hwz_month_papers_${teacherUid}_${currentMonthKey}`) || 0) 
    : 0;

  // 3. Document count water-mark
  const existingDocCount = Array.isArray(allHomeworks) ? allHomeworks.length : 0;
  const activeMonthlyDocCount = getMonthlyUsageCount(allHomeworks, teacherBilling?.billingCycleResetDate);

  // 🔥 CRITICAL RESET CHECK:
  // If Firestore explicitly has 0 persistent papers AND 0 existing homework documents (e.g. freshly created or deleted/reset account),
  // then any stale client localStorage count MUST be purged and disregarded!
  if (persistentTotal === 0 && existingDocCount === 0) {
    localStoredTotal = 0;
    localStoredMonth = 0;
    if (typeof localStorage !== 'undefined' && teacherUid) {
      try {
        localStorage.removeItem(`hwz_max_papers_${teacherUid}`);
        localStorage.removeItem(`hwz_month_papers_${teacherUid}_${currentMonthKey}`);
      } catch (e) {}
    }
  }

  // 4. Calculate unyielding high-water marks (RATCHET: monotonically increasing only)
  const recordedMonthKey = teacherProfile?.currentCycleMonth || teacherBilling?.currentCycleMonth || '';
  const effectivePersistentMonth = (recordedMonthKey && recordedMonthKey !== currentMonthKey) ? 0 : persistentMonth;

  const waterMarkTotal = Math.max(persistentTotal, localStoredTotal, existingDocCount);
  const waterMarkMonth = Math.max(effectivePersistentMonth, localStoredMonth, activeMonthlyDocCount);

  // 5. If current document count or water-mark exceeds recorded Firestore total, persist it to prevent rollback on delete
  if (teacherUid && typeof localStorage !== 'undefined') {
    try {
      if (waterMarkTotal > localStoredTotal) {
        localStorage.setItem(`hwz_max_papers_${teacherUid}`, String(waterMarkTotal));
      }
      if (waterMarkMonth > localStoredMonth) {
        localStorage.setItem(`hwz_month_papers_${teacherUid}_${currentMonthKey}`, String(waterMarkMonth));
      }
    } catch (e) {}
  }

  if (db && teacherUid && (waterMarkTotal > persistentTotal || waterMarkMonth > persistentMonth)) {
    // Asynchronous ratchet backfill to Firestore
    setDoc(doc(db, 'teachers', teacherUid), {
      papersGeneratedTotal: waterMarkTotal,
      papersGeneratedThisMonth: waterMarkMonth,
      currentCycleMonth: currentMonthKey
    }, { merge: true }).catch(() => {});
  }

  let usage = 0;
  if (isMaxed) {
    usage = getPaperQuota(effectivePlan, pricing);
  } else if (effectivePlan === 'free' || effectivePlan === 'free_trial' || effectivePlan === 'free_expired') {
    // For free plans: count lifetime cumulative papers (NEVER decreases even if all docs deleted)
    usage = waterMarkTotal;
  } else {
    // For paid monthly plans: count papers generated in the active billing cycle
    usage = waterMarkMonth;
  }

  if ((isAdmin || isSuperUser) && !simulatedPlan) {
    return { canGenerate: true, remaining: Infinity, limit: Infinity, usage, isUnlimited: true };
  }

  const baseQuota = getPaperQuota(effectivePlan, pricing);
  const totalLimit = baseQuota + (topUpCredits || 0);

  const remaining = Math.max(0, totalLimit - usage);
  const canGenerate = usage < totalLimit;

  return {
    canGenerate,
    remaining,
    limit: totalLimit,
    baseQuota,
    topUpCredits: topUpCredits || 0,
    usage,
    isUnlimited: false,
  };
};
