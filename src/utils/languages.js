// Supported Regional and International Languages configuration for HomeworkZone

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', ttsLang: 'en-US', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', ttsLang: 'hi-IN', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', ttsLang: 'ta-IN', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', ttsLang: 'te-IN', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'கன்னட / ಕನ್ನಡ', ttsLang: 'kn-IN', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', ttsLang: 'mr-IN', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', ttsLang: 'bn-IN', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', ttsLang: 'gu-IN', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'மலையாளம் / മലയാളം', ttsLang: 'ml-IN', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', ttsLang: 'pa-IN', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', ttsLang: 'ur-PK', flag: '🇵🇰' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', ttsLang: 'es-ES', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', ttsLang: 'fr-FR', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', ttsLang: 'de-DE', flag: '🇩🇪' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', ttsLang: 'id-ID', flag: '🇮🇩' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', ttsLang: 'vi-VN', flag: '🇻🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', ttsLang: 'ar-SA', flag: '🇸🇦' }
];

export const getLanguageObj = (code) => {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
};
