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
    
    if (snap.exists()) {
      const data = snap.data();
      const lastMonthKey = data.currentCycleMonth || '';
      const isNewCycle = lastMonthKey !== currentMonthKey;

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
 * Uses persistent non-decrementing counters so deleting papers does NOT allow cheating quotas.
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
}) => {
  const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
  const isMaxed = simulatedPlan && simulatedPlan.endsWith('_maxed');
  const cleanPlan = isMaxed ? simulatedPlan.replace('_maxed', '') : simulatedPlan;
  const effectivePlan = cleanPlan || activePlanId;

  // Read persistent counters directly from teacher profile / billing doc
  const persistentTotal = Number(teacherProfile?.papersGeneratedTotal ?? teacherBilling?.papersGeneratedTotal ?? 0);
  const persistentMonth = Number(teacherProfile?.papersGeneratedThisMonth ?? teacherBilling?.papersGeneratedThisMonth ?? 0);

  // If a new calendar month started since last generation, persistentMonth resets
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const recordedMonthKey = teacherProfile?.currentCycleMonth || teacherBilling?.currentCycleMonth || '';
  const effectiveMonthUsage = (recordedMonthKey && recordedMonthKey !== currentMonthKey) ? 0 : persistentMonth;

  let usage = 0;
  if (isMaxed) {
    usage = getPaperQuota(effectivePlan, pricing);
  } else if (effectivePlan === 'free' || effectivePlan === 'free_trial' || effectivePlan === 'free_expired') {
    // For free plans, count cumulative lifetime generated papers (NEVER decrements on delete)
    const existingDocCount = Array.isArray(allHomeworks) ? allHomeworks.length : 0;
    usage = Math.max(persistentTotal, existingDocCount);
  } else {
    // For paid monthly plans, count papers generated in the active cycle (NEVER decrements on delete)
    const activeMonthlyDocCount = getMonthlyUsageCount(allHomeworks, teacherBilling?.billingCycleResetDate);
    usage = Math.max(effectiveMonthUsage, activeMonthlyDocCount);
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
