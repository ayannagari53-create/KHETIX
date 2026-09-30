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

export function getTranslation(
  lang: SupportedLanguage,
  key: string,
  paramsOrFallback?: Record<string, string | number> | string,
  fallback?: string
): string {
  const dictionary = ALL_LOCALES[lang] || ALL_LOCALES.en;
  const enDict = ALL_LOCALES.en;
  const normDotToUnder = key.includes('.') ? key.replace(/\./g, '_') : key;
  const normUnderToDot = key.includes('_') ? key.replace(/_/g, '.') : key;

  // 1. Direct and normalized lookup in target language dictionary
  let text =
    dictionary?.[key] ||
    dictionary?.[normDotToUnder] ||
    dictionary?.[normUnderToDot];

  // 2. Common suffix/alias matching (e.g. 'farm.save' -> 'common_save', 'cancel' -> 'common_cancel')
  if (!text) {
    const lastPart = key.split(/[._]/).pop();
    if (lastPart) {
      const commonKey = `common_${lastPart}`;
      if (dictionary?.[commonKey]) {
        text = dictionary[commonKey];
      }
    }
  }

  // 3. Fallback to English dictionary with same rules
  if (!text) {
    text =
      enDict?.[key] ||
      enDict?.[normDotToUnder] ||
      enDict?.[normUnderToDot];

    if (!text) {
      const lastPart = key.split(/[._]/).pop();
      if (lastPart && enDict?.[`common_${lastPart}`]) {
        text = enDict[`common_${lastPart}`];
      }
    }
  }

  let actualFallback: string | undefined = fallback;
  let params: Record<string, string | number> | undefined;

  if (typeof paramsOrFallback === 'string') {
    actualFallback = paramsOrFallback;
  } else if (paramsOrFallback && typeof paramsOrFallback === 'object') {
    params = paramsOrFallback;
  }

  if (!text) {
    text = actualFallback || key;
  }

  if (params && typeof text === 'string') {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    }
  }

  return text;
}
