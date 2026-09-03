import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { EXAM_PROFILES } from '../data/examProfiles';
export {
  ADMIN_EMAIL,
  getMathsPromptTemplate,
  getSciencePromptTemplate,
  getEnglishPromptTemplate,
  getVocabularyPromptTemplate,
  getLogicalReasoningPromptTemplate,
  getGenericSubjectPromptTemplate as getPremiumPromptTemplate,
  getNaplanNumeracyPromptTemplate,
  getNaplanReadingPromptTemplate,
  getNaplanLanguageConventionsPromptTemplate,
  getAmcPromptTemplate,
  getNswSelectiveReadingPromptTemplate,
  getNswSelectiveMathPromptTemplate,
  getNswSelectiveThinkingPromptTemplate,
  getIcasSciencePromptTemplate,
  getIcasEnglishPromptTemplate,
  getDigitalSatMathPromptTemplate,
  getDigitalSatRwPromptTemplate,
  getActMathPromptTemplate,
  getActSciencePromptTemplate,
  getSeamoPromptTemplate,
  MASTER_SUBJECT_REGISTRY,
  MASTER_EXAM_REGISTRY,
  getMasterPrompt,
  getEffectivePrompt,
  getPromptVisibilitySettings,
  savePromptVisibilitySettings
} from '../services/promptsMasterRegistry';

import {
  ADMIN_EMAIL,
  getMathsPromptTemplate,
  getSciencePromptTemplate,
  getEnglishPromptTemplate,
  getVocabularyPromptTemplate,
  getLogicalReasoningPromptTemplate,
  getGenericSubjectPromptTemplate,
  getNaplanNumeracyPromptTemplate,
  getNaplanReadingPromptTemplate,
  getNaplanLanguageConventionsPromptTemplate,
  getAmcPromptTemplate,
  getNswSelectiveReadingPromptTemplate,
  getNswSelectiveMathPromptTemplate,
  getNswSelectiveThinkingPromptTemplate,
  getIcasSciencePromptTemplate,
  getIcasEnglishPromptTemplate,
  getDigitalSatMathPromptTemplate,
  getDigitalSatRwPromptTemplate,
  getActMathPromptTemplate,
  getActSciencePromptTemplate,
  getSeamoPromptTemplate,
  getMasterPrompt
} from '../services/promptsMasterRegistry';

export const SUPER_USER_EMAILS = [
  'manoj.jose.au@gmail.com',
];

export const DEFAULT_SUBJECT_PROMPTS = {
  maths: getMathsPromptTemplate(),
  science: getSciencePromptTemplate(),
  english: getEnglishPromptTemplate(),
  vocabulary: getVocabularyPromptTemplate(),
  logical_reasoning: getLogicalReasoningPromptTemplate(),
  olympiad: getGenericSubjectPromptTemplate('Olympiad Maths'),
  hindi: getGenericSubjectPromptTemplate('Hindi'),
  // Standardized Exam Presets V2
  amc_math_comp: getAmcPromptTemplate(),
  amc: getAmcPromptTemplate(),
  amc_primary: getAmcPromptTemplate(),
  nsw_selective_reading: getNswSelectiveReadingPromptTemplate(),
  nsw_selective_math: getNswSelectiveMathPromptTemplate(),
  nsw_selective_thinking: getNswSelectiveThinkingPromptTemplate(),
  naplan_numeracy: getNaplanNumeracyPromptTemplate(),
  naplan_reading: getNaplanReadingPromptTemplate(),
  naplan_conventions: getNaplanLanguageConventionsPromptTemplate(),
  naplan_language_conventions: getNaplanLanguageConventionsPromptTemplate(),
  icas_math: getNaplanNumeracyPromptTemplate(),
  icas_mathematics: getNaplanNumeracyPromptTemplate(),
  au_icas_maths: getNaplanNumeracyPromptTemplate(),
  nz_icas_maths: getNaplanNumeracyPromptTemplate(),
  icas_science: getIcasSciencePromptTemplate(),
  icas_english: getIcasEnglishPromptTemplate(),
  vic_selective_entry: getNswSelectiveMathPromptTemplate(),
  vic_sehs_maths_reasoning: getNswSelectiveMathPromptTemplate(),
  vic_sehs_general_ability: getNswSelectiveThinkingPromptTemplate(),
  wa_gate_aset: getNswSelectiveThinkingPromptTemplate(),
  wa_gate_aasta: getNswSelectiveThinkingPromptTemplate(),
  digital_sat_math: getDigitalSatMathPromptTemplate(),
  digital_sat_rw: getDigitalSatRwPromptTemplate(),
  act_math: getActMathPromptTemplate(),
  act_math_enhanced: getActMathPromptTemplate(),
  act_science: getActSciencePromptTemplate(),
  seamo_mathematics: getSeamoPromptTemplate(),
  seamo_paper: getSeamoPromptTemplate()
};

/**
 * Fetches default subject prompts merged with any custom prompts added by admin (shilpeshpillai81@gmail.com)
 */
export const getMasterDefaultPrompts = async (db) => {
  let masterPrompts = { ...DEFAULT_SUBJECT_PROMPTS };
  masterPrompts.vocabulary = getVocabularyPromptTemplate();
  if (!db) return masterPrompts;

  try {
    const sysDoc = await getDoc(doc(db, 'system', 'default_subject_prompts'));
    if (sysDoc.exists() && sysDoc.data().subjectPrompts) {
      let adminPrompts = sysDoc.data().subjectPrompts;
      const deletedSubjects = Array.isArray(sysDoc.data().deletedSubjects) ? sysDoc.data().deletedSubjects : [];
      
      Object.keys(adminPrompts).forEach(k => { 
        if (adminPrompts[k] === null || adminPrompts[k] === undefined) delete adminPrompts[k]; 
      });
      
      if (!adminPrompts.vocabulary || adminPrompts.vocabulary.includes('Vocabulary & Word Power')) {
        adminPrompts.vocabulary = getVocabularyPromptTemplate();
      }

      const merged = { ...masterPrompts, ...adminPrompts };
      // Explicitly delete any subjects marked as deleted by admin
      deletedSubjects.forEach(dKey => {
        delete merged[dKey];
      });

      return merged;
    }

    // Legacy fallback to admin teacher doc
    const q = query(collection(db, 'teachers'), where('email', '==', ADMIN_EMAIL));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const adminData = snap.docs[0].data();
      if (adminData.subjectPrompts) {
        let adminPrompts = adminData.subjectPrompts;
        Object.keys(adminPrompts).forEach(k => { if (adminPrompts[k] === null || adminPrompts[k] === undefined) delete adminPrompts[k]; });
        return { ...masterPrompts, ...adminPrompts };
      }
    }
  } catch (err) {
    console.warn("Failed to fetch master default prompts from Firestore:", err);
  }

  return masterPrompts;
};

/**
 * Saves prompts to system default if user is shilpeshpillai81@gmail.com
 */
export const saveMasterDefaultPromptsIfAdmin = async (db, user, prompts, deletedSubjectKey = null) => {
  if (!db || !user?.email || !prompts) return;
  if (user.email.toLowerCase().trim() === ADMIN_EMAIL) {
    try {
      const cleanPrompts = {};
      Object.keys(prompts).forEach(k => {
        if (prompts[k] !== null && prompts[k] !== undefined) {
          cleanPrompts[k] = prompts[k];
        }
      });
      
      const docRef = doc(db, 'system', 'default_subject_prompts');
      const snap = await getDoc(docRef);
      let deletedList = (snap.exists() && Array.isArray(snap.data().deletedSubjects)) ? snap.data().deletedSubjects : [];
      if (deletedSubjectKey && !deletedList.includes(deletedSubjectKey)) {
        deletedList.push(deletedSubjectKey);
      }
      // If a subject was re-added, remove it from deletedList
      Object.keys(cleanPrompts).forEach(k => {
        deletedList = deletedList.filter(d => d !== k);
      });

      await setDoc(docRef, {
        subjectPrompts: cleanPrompts,
        deletedSubjects: deletedList,
        updatedAt: new Date().toISOString(),
        updatedBy: user.email
      });
    } catch (err) {
      console.error("Failed to save admin default prompts to system doc:", err);
    }
  }
};
