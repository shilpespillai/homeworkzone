/**
 * pricingConfig.js
 *
 * Single source of truth for HomeworkZone plan pricing, seat limits, and paper quotas.
 * Defaults reflect the latest pricing (updated Aug 2026).
 * The admin can override ALL values via Firestore: system/pricing
 * and they will be fetched and cached at app load.
 *
 * NOTHING IS HARDCODED in the app — all values flow from here.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// ─── Default pricing (fallback only — always prefer Firestore values) ─────────

export const DEFAULT_PRICING = {
  // ── Option A: Elastic Monthly ─────────────────────────────────────────────
  optionA_perStudentPerMonth: 5.00,
  optionA_perStudentPerMonth_inr: 99,
  optionA_seatLimit: 10,           // seats included (no Stripe quantity needed)
  optionA_paperQuota: 25,          // papers per month

  // ── Option B: Monthly Flat Tiers (with PPP for INR) ───────────────────────
  optionB_starter_price: 50,
  optionB_starter_price_inr: 999,
  optionB_starter_maxStudents: 20,
  optionB_starter_paperQuota: 60,  // papers per month

  optionB_growth_price: 80,
  optionB_growth_price_inr: 1999,
  optionB_growth_maxStudents: 30,
  optionB_growth_paperQuota: 100,  // papers per month

  optionB_school_price: 99,
  optionB_school_price_inr: 3499,
  optionB_school_maxStudents: 150,
  optionB_school_paperQuota: 150,  // papers per month

  // ── Option C: Yearly Graduated ────────────────────────────────────────────
  optionC_tier1_max: 100,
  optionC_tier1_rate: 24,
  optionC_tier1_rate_inr: 499,
  optionC_tier2_max: 500,
  optionC_tier2_rate: 20,
  optionC_tier2_rate_inr: 399,
  optionC_tier3_max: 1000,
  optionC_tier3_rate: 16,
  optionC_tier3_rate_inr: 299,
  optionC_tier4_rate: 14,
  optionC_tier4_rate_inr: 199,
  optionC_paperQuota: 2500,        // papers per year

  // ── Free Trial ────────────────────────────────────────────────────────────
  free_seatLimit: 5,
  free_paperQuota: 5,              // total (lifetime trial)
};

// ─── In-memory cache ─────────────────────────────────────────────────────────
let _cachedPricing = null;

/**
 * Fetch pricing from Firestore system/pricing doc.
 * Falls back to DEFAULT_PRICING if doc doesn't exist.
 * Caches result in memory for the session.
 */
export async function fetchPricing() {
  if (_cachedPricing) return _cachedPricing;
  try {
    const snap = await getDoc(doc(db, 'system', 'pricing'));
    if (snap.exists()) {
      _cachedPricing = { ...DEFAULT_PRICING, ...snap.data() };
    } else {
      _cachedPricing = { ...DEFAULT_PRICING };
    }
  } catch (err) {
    console.warn('[pricingConfig] Failed to load from Firestore, using defaults.', err);
    _cachedPricing = { ...DEFAULT_PRICING };
  }
  return _cachedPricing;
}

/**
 * Save pricing to Firestore system/pricing doc.
 * Also updates the in-memory cache immediately.
 */
export async function savePricing(newPricing) {
  const merged = { ...DEFAULT_PRICING, ...newPricing };
  await setDoc(doc(db, 'system', 'pricing'), merged);
  _cachedPricing = merged;
  return merged;
}

/** Invalidate the in-memory cache (call after saving to force reload). */
export function invalidatePricingCache() {
  _cachedPricing = null;
}

/**
 * Get the paper quota for a given plan from the pricing config.
 * All consumers should call this instead of hardcoding values.
 */
export function getPaperQuota(planId, pricing = DEFAULT_PRICING) {
  const p = { ...DEFAULT_PRICING, ...pricing };
  if (!planId || planId === 'free' || planId === 'free_trial' || planId === 'free_expired') {
    return p.free_paperQuota;
  }
  if (planId === 'admin' || planId === 'superuser') return Infinity;
  if (planId === 'option-a' || planId === 'option_a_elastic') return p.optionA_paperQuota;
  if (planId === 'option-b-starter') return p.optionB_starter_paperQuota;
  if (planId === 'option-b-growth') return p.optionB_growth_paperQuota;
  if (planId === 'option-b-school') return p.optionB_school_paperQuota;
  if (planId === 'option-c' || planId === 'option_c_school') return p.optionC_paperQuota;
  return p.free_paperQuota;
}

/**
 * Get the seat limit for a given plan from the pricing config.
 */
export function getSeatLimit(planId, pricing = DEFAULT_PRICING) {
  const p = { ...DEFAULT_PRICING, ...pricing };
  if (!planId || planId === 'free' || planId === 'free_trial' || planId === 'free_expired') {
    return p.free_seatLimit;
  }
  if (planId === 'admin' || planId === 'superuser') return Infinity;
  if (planId === 'option-a' || planId === 'option_a_elastic') return p.optionA_seatLimit;
  if (planId === 'option-b-starter') return p.optionB_starter_maxStudents;
  if (planId === 'option-b-growth') return p.optionB_growth_maxStudents;
  if (planId === 'option-b-school') return p.optionB_school_maxStudents;
  if (planId === 'option-c' || planId === 'option_c_school') return Infinity;
  return p.free_seatLimit;
}

/**
 * Calculate the annual Option C cost for a given number of seats,
 * using the provided pricing config object.
 */
export function calcOptionCAnnual(seats, pricing = DEFAULT_PRICING) {
  const p = { ...DEFAULT_PRICING, ...pricing };
  let cost = 0;

  const t1 = p.optionC_tier1_max;
  const t2 = p.optionC_tier2_max;
  const t3 = p.optionC_tier3_max;

  const r1 = p.optionC_tier1_rate;
  const r2 = p.optionC_tier2_rate;
  const r3 = p.optionC_tier3_rate;
  const r4 = p.optionC_tier4_rate;

  if (seats <= t1) {
    cost = seats * r1;
  } else if (seats <= t2) {
    cost = (t1 * r1) + ((seats - t1) * r2);
  } else if (seats <= t3) {
    cost = (t1 * r1) + ((t2 - t1) * r2) + ((seats - t2) * r3);
  } else {
    cost = (t1 * r1) + ((t2 - t1) * r2) + ((t3 - t2) * r3) + ((seats - t3) * r4);
  }

  return cost;
}

/** Get MRR for a teacher given their plan, student count and pricing config. */
export function getTeacherMRR(billing, studentCount, pricing = DEFAULT_PRICING) {
  const p = { ...DEFAULT_PRICING, ...pricing };
  if (!billing || !['active', 'trialing'].includes(billing.status)) return 0;
  const planId = billing.planId;
  if (planId === 'option-a') return studentCount * p.optionA_perStudentPerMonth;
  if (planId === 'option-b-starter') return p.optionB_starter_price;
  if (planId === 'option-b-growth') return p.optionB_growth_price;
  if (planId === 'option-b-school') return p.optionB_school_price;
  if (planId === 'option-c') return calcOptionCAnnual(studentCount, p) / 12;
  return 0;
}

/**
 * Automatically detect whether the user is based in India (to display INR PPP rates)
 * or international/Western markets (to display USD rates).
 */
export function detectUserCurrency() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = (typeof navigator !== 'undefined' && navigator.language) || '';
    if (
      tz.includes('Calcutta') ||
      tz.includes('Kolkata') ||
      lang.toLowerCase().includes('en-in') ||
      lang.toLowerCase().includes('hi')
    ) {
      return 'inr';
    }
  } catch (e) {
    // Fallback on error
  }
  return 'usd';
}

/**
 * Format a price with its corresponding currency symbol.
 */
export function formatPrice(amount, currency = 'usd') {
  if (currency === 'inr') {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  }
  return `$${Number(amount).toLocaleString('en-US')}`;
}
