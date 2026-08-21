// Centralized Paper Quota & Booster Manager for Homework Zone
// All limits come from pricingConfig (Firestore-backed). Nothing is hardcoded here.

import { getPaperQuota, DEFAULT_PRICING } from './pricingConfig';

/**
 * Calculates how many papers were generated during the current billing cycle.
 * For free plans, counts total ever. For paid plans, counts from billing cycle start.
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
 * Pass a `pricing` object (from fetchPricing()) for live DB values.
 * Falls back to DEFAULT_PRICING if not provided.
 */
export const getBaseQuotaForPlan = (planId, studentCount = 1, pricing = DEFAULT_PRICING) => {
  return getPaperQuota(planId, pricing);
};

/**
 * Checks if a user can generate a new paper.
 * Pass `pricing` (from fetchPricing()) to use live DB quota values.
 */
export const checkCanGeneratePaper = ({
  user,
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

  if ((isAdmin || isSuperUser) && !simulatedPlan) {
    return { canGenerate: true, remaining: Infinity, limit: Infinity, usage: 0, isUnlimited: true };
  }

  const baseQuota = getPaperQuota(effectivePlan, pricing);
  const totalLimit = baseQuota + (topUpCredits || 0);

  let usage = 0;
  if (isMaxed) {
    usage = baseQuota;
  } else if (effectivePlan === 'free' || effectivePlan === 'free_trial' || effectivePlan === 'free_expired') {
    usage = Array.isArray(allHomeworks) ? allHomeworks.length : 0;
  } else {
    usage = getMonthlyUsageCount(allHomeworks);
  }

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
