// Centralized Paper Quota & Booster Manager for Homework Zone

export const PLAN_QUOTAS = {
  free: { base: 5, period: 'total', label: 'Free Trial (5 Papers Total)' },
  option_a_elastic: { base: 25, period: 'month', label: 'Option A: Elastic ($5/mo - 25 Papers/mo)' },
  option_b_tuition_starter: { base: 60, period: 'month', label: 'Option B: Tuition Starter (60 Papers/mo)' },
  option_b_tuition_growth: { base: 100, period: 'month', label: 'Option B: Tuition Growth (100 Papers/mo)' },
  option_c_school: { base: 2500, period: 'year', label: 'Option C: School Year (2,500 Papers/yr)' },
  admin: { base: Infinity, period: 'unlimited', label: 'Unlimited Admin Access' },
};

/**
 * Calculates the monthly/period paper quota for a user
 */
export const getBaseQuotaForPlan = (planId, studentCount = 1) => {
  if (!planId || planId === 'free') return PLAN_QUOTAS.free.base;
  if (planId === 'admin' || planId === 'superuser') return Infinity;

  if (planId === 'option_a_elastic' || planId === 'parents' || planId === 'starter') {
    return PLAN_QUOTAS.option_a_elastic.base;
  }
  if (planId === 'option_b_tuition_growth' || planId === 'growth') {
    return PLAN_QUOTAS.option_b_tuition_growth.base;
  }
  if (planId === 'option_b_tuition' || planId === 'tuition' || planId === 'tutor') {
    return PLAN_QUOTAS.option_b_tuition_starter.base;
  }
  if (planId === 'option_c_school' || planId === 'school') {
    return PLAN_QUOTAS.option_c_school.base;
  }

  // Default paid fallback
  return 25;
};

/**
 * Calculates how many papers were generated during the current billing cycle month
 */
export const getMonthlyUsageCount = (allHomeworks = [], billingCycleResetDate = null) => {
  if (!Array.isArray(allHomeworks) || allHomeworks.length === 0) return 0;

  const now = new Date();
  let cycleStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current calendar month

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
 * Checks if a user can generate a new paper
 */
export const checkCanGeneratePaper = ({
  user,
  isAdmin = false,
  isSuperUser = false,
  activePlanId = 'free',
  allHomeworks = [],
  topUpCredits = 0
}) => {
  const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
  const isMaxed = simulatedPlan && simulatedPlan.endsWith('_maxed');
  const cleanPlan = isMaxed ? simulatedPlan.replace('_maxed', '') : simulatedPlan;
  const effectivePlan = cleanPlan || activePlanId;

  if ((isAdmin || isSuperUser) && !simulatedPlan) {
    return { canGenerate: true, remaining: Infinity, limit: Infinity, usage: 0, isUnlimited: true };
  }

  const baseQuota = getBaseQuotaForPlan(effectivePlan);
  const totalLimit = isMaxed ? baseQuota : baseQuota + (topUpCredits || 0);

  let usage = 0;
  if (isMaxed) {
    usage = totalLimit;
  } else if (effectivePlan === 'free') {
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
    topUpCredits: isMaxed ? 0 : (topUpCredits || 0),
    usage,
    isUnlimited: false
  };
};
