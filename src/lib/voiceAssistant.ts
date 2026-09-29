// KHETIX Multilingual Voice AI Engine (STT & TTS)
import { SupportedLanguage } from './i18n';

// BCP-47 locale tags for Indian languages
export const BCP47_MAP: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  ml: 'ml-IN',
  hinglish: 'hi-IN',
};

// Check if speech synthesis is available
export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Check if speech recognition is available
export function isSttSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  );
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function speakText(
  text: string,
  lang: SupportedLanguage = 'en',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): void {
  if (!isTtsSupported()) {
    if (onError) onError(new Error('Speech synthesis not supported in this browser.'));
    return;
  }

  // Stop any active speech
  stopSpeaking();

  // Strip markdown symbols, asterisks, hash headers, and emojis for natural verbal synthesis
  const cleanText = text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '') // Emojis
    .replace(/[#*_`~>-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/•/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  const bcp47 = BCP47_MAP[lang] || 'en-IN';
  utterance.lang = bcp47;
  utterance.rate = 0.95; // Slightly measured rate for farmer comprehension
  utterance.pitch = 1.0;

  // Find best matching voice
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const voice =
    voices.find((v) => v.lang === bcp47) ||
    voices.find((v) => v.lang.startsWith(bcp47.slice(0, 2))) ||
    voices.find((v) => v.lang.startsWith('hi') || v.lang === 'en-IN');

  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (onError) onError(e);
  };

  window.speechSynthesis.speak(utterance);
}

export interface VoiceListener {
  stop: () => void;
}

export function startSpeechRecognition(
  lang: SupportedLanguage,
  onTranscript: (text: string, isFinal: boolean) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): VoiceListener | null {
  if (!isSttSupported()) {
    if (onError) onError('Microphone speech recognition is not supported in this browser.');
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = BCP47_MAP[lang] || 'en-IN';

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        onTranscript(final, true);
      } else if (interim) {
        onTranscript(interim, false);
      }
    };

    recognition.onerror = (event: any) => {
      if (onError) onError(event.error || 'Speech recognition error');
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {
          // Ignore if already stopped
        }
      },
    };
  } catch (err: any) {
    if (onError) onError(err.message || 'Failed to initialize speech recognition');
    return null;
  }
}
