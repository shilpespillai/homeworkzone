/**
 * pricingConfig.js
 *
 * Single source of truth for HomeworkZone plan pricing.
 * Defaults reflect the latest pricing (updated Aug 2026).
 * The admin can override these via Firestore: system/pricing
 * and they will be fetched and cached at app load.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// ─── Default pricing (hardcoded fallback) ────────────────────────────────────

export const DEFAULT_PRICING = {
  // Option A: Elastic Monthly
  optionA_perStudentPerMonth: 5.00,

  // Option B: Monthly flat tiers
  optionB_starter_price: 50,      // up to 20 students
  optionB_starter_maxStudents: 20,
  optionB_growth_price: 80,       // up to 30 students
  optionB_growth_maxStudents: 30,
  optionB_school_price: 99,       // 31–150 students (unchanged)
  optionB_school_maxStudents: 150,

  // Option C: Schools — yearly per-student graduated tiers
  optionC_tier1_max: 100,         // 31–100 students
  optionC_tier1_rate: 24,         // $24/student/year (unchanged)
  optionC_tier2_max: 500,         // 101–500 students
  optionC_tier2_rate: 20,         // $20/student/year (up from $18)
  optionC_tier3_max: 1000,        // 501–1,000 students
  optionC_tier3_rate: 16,         // $16/student/year (up from $12)
  optionC_tier4_rate: 14,         // 1,001+ students — $14/student/year (up from $8)
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
 * Calculate the annual Option C cost for a given number of seats,
 * using the provided pricing config object.
 *
 * Tier structure (31+ students):
 *   31 – tier1_max:           tier1_rate / student / year
 *   tier1_max+1 – tier2_max:  tier2_rate / student / year
 *   tier2_max+1 – tier3_max:  tier3_rate / student / year
 *   tier3_max+1+:             tier4_rate / student / year
 */
export function calcOptionCAnnual(seats, pricing = DEFAULT_PRICING) {
  const p = { ...DEFAULT_PRICING, ...pricing };
  let cost = 0;

  const t1 = p.optionC_tier1_max;    // e.g. 100
  const t2 = p.optionC_tier2_max;    // e.g. 500
  const t3 = p.optionC_tier3_max;    // e.g. 1000

  const r1 = p.optionC_tier1_rate;   // $24
  const r2 = p.optionC_tier2_rate;   // $20
  const r3 = p.optionC_tier3_rate;   // $16
  const r4 = p.optionC_tier4_rate;   // $14

  if (seats <= t1) {
    cost = seats * r1;
  } else if (seats <= t2) {
    cost = (t1 * r1) + ((seats - t1) * r2);
  } else if (seats <= t3) {
    cost = (t1 * r1) + ((t2 - t1) * r2) + ((seats - t2) * r3);
  } else {
    cost = (t1 * r1) + ((t2 - t1) * r2) + ((t3 - t2) * r3) + ((seats - t3) * r4);
  }

  if (cost > 9999) {
    cost = 9999;
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
