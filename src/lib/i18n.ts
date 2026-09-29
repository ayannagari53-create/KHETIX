import en from '../locales/en.json';
import hi from '../locales/hi.json';
import kn from '../locales/kn.json';
import mr from '../locales/mr.json';
import te from '../locales/te.json';
import ta from '../locales/ta.json';
import bn from '../locales/bn.json';
import gu from '../locales/gu.json';
import pa from '../locales/pa.json';
import ml from '../locales/ml.json';
import hinglish from '../locales/hinglish.json';

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'kn'
  | 'mr'
  | 'te'
  | 'ta'
  | 'bn'
  | 'gu'
  | 'pa'
  | 'ml'
  | 'hinglish';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  bcp47: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', bcp47: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', bcp47: 'hi-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', bcp47: 'kn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', bcp47: 'mr-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', bcp47: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', bcp47: 'ta-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', bcp47: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', bcp47: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', bcp47: 'pa-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', bcp47: 'ml-IN' },
  { code: 'hinglish', name: 'Hinglish', nativeName: 'Hinglish (किसान)', flag: '🇮🇳', bcp47: 'hi-IN' },
];

export const ALL_LOCALES: Record<SupportedLanguage, Record<string, string>> = {
  en,
  hi,
  kn,
  mr,
  te,
  ta,
  bn,
  gu,
  pa,
  ml,
  hinglish,
};

export function getTranslation(lang: SupportedLanguage, key: string, fallback?: string): string {
  const dictionary = ALL_LOCALES[lang] || ALL_LOCALES.en;
  if (dictionary[key]) return dictionary[key];
  if (ALL_LOCALES.en[key]) return ALL_LOCALES.en[key];
  return fallback || key;
}
