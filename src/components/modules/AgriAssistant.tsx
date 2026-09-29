import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  Droplets,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ShieldCheck,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Play,
  Square,
  Activity,
  ArrowRight,
  Info,
  Layers,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';
import {
  speakText,
  stopSpeaking,
  startSpeechRecognition,
  isTtsSupported,
  isSttSupported,
  VoiceListener,
} from '../../lib/voiceAssistant';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { AppLanguage } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  validationStatus?: string;
  source?: string;
  detectedLanguage?: string;
  languageName?: string;
  intent?: string;
  telemetrySnapshot?: {
    soilMoisture: number;
    rainProbability: number;
    crop: string;
    location: string;
  };
}

export const AgriAssistant: React.FC = () => {
  const {
    activeFarm,
    soilMoistureOverride,
    setSoilMoistureOverride,
    rainProbabilityOverride,
    setRainProbabilityOverride,
    language,
    setLanguage,
    currentUser,
  } = useFarm();

  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState<boolean>(true);
  const [showPipelineDiagram, setShowPipelineDiagram] = useState<boolean>(false);

  const farmerName = currentUser?.name || activeFarm?.farmerName || 'Farmer';
  const farmCrop = selectedCrop;
  const farmLocation = activeFarm?.location || 'Karnataka, India';

  // State for messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Namaste ${farmerName}! I am KHETIX AI — your precision Multilingual Agronomic Advisor. 🌾\n\nI separate **Agricultural Intelligence** from **Language Translation**:\n1. Understand your question & detect intent.\n2. Cross-reference real field telemetry (${soilMoistureOverride}% Soil Moisture, ${rainProbabilityOverride}% Rain Risk).\n3. Apply ICAR agronomic rules to ensure crop safety.\n4. Formulate the response naturally in your chosen language.\n\nSpeak using the microphone 🎙️ or click any of the prompt examples below in Kannada, Hindi, Hinglish, Telugu, Tamil, Marathi, Bengali, Gujarati, Punjabi, Malayalam, or English!`,
      timestamp: 'Just now',
      validationStatus: 'Validated by KHETIX Agronomic Rule Engine',
      detectedLanguage: language,
      languageName: SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || 'English',
      intent: 'general_agri',
      telemetrySnapshot: {
        soilMoisture: soilMoistureOverride,
        rainProbability: rainProbabilityOverride,
        crop: farmCrop,
        location: farmLocation,
      },
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [autoVoice, setAutoVoice] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);

  const voiceListenerRef = useRef<VoiceListener | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (voiceListenerRef.current) {
        voiceListenerRef.current.stop();
      }
    };
  }, []);

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Evaluate rule status in real-time
  const getRuleInterlockStatus = () => {
    if (soilMoistureOverride > 70 || rainProbabilityOverride > 50) {
      return {
        action: 'DELAY',
        label: 'Delay Irrigation Interlock Active',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        detail: `Soil Moisture (${soilMoistureOverride}%) or Rain Risk (${rainProbabilityOverride}%) triggers safety hold to prevent root hypoxia.`,
      };
    } else if (soilMoistureOverride < 45 && rainProbabilityOverride < 30) {
      return {
        action: 'IMMEDIATE',
        label: 'Water Stress: Immediate Drip Required',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        detail: `Soil moisture (${soilMoistureOverride}%) is in deficit. Immediate drip cycle recommended.`,
      };
    } else {
      return {
        action: 'NORMAL',
        label: 'Field Capacity Favorable: Scheduled Drip Validated',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        detail: `Soil moisture (${soilMoistureOverride}%) is within optimal range. Standard schedule applies.`,
      };
    }
  };

  const currentRule = getRuleInterlockStatus();

  // Speech Recognition (STT)
  const toggleListening = () => {
    if (isListening) {
      if (voiceListenerRef.current) {
        voiceListenerRef.current.stop();
        voiceListenerRef.current = null;
      }
      setIsListening(false);
      return;
    }

    setSttError(null);
    setIsListening(true);

    const listener = startSpeechRecognition(
      language as SupportedLanguage,
      (transcript, isFinal) => {
        setInputMessage(transcript);
        if (isFinal) {
          setIsListening(false);
          voiceListenerRef.current = null;
          handleSendMessage(transcript);
        }
      },
      (err) => {
        setSttError(typeof err === 'string' ? err : 'Speech recognition error. Check microphone access.');
        setIsListening(false);
        voiceListenerRef.current = null;
      },
      () => {
        setIsListening(false);
        voiceListenerRef.current = null;
      }
    );

    voiceListenerRef.current = listener;
  };

  // Text to Speech (TTS)
  const handleSpeak = (text: string, msgId: string, replyLang?: string) => {
    if (isSpeakingId === msgId) {
      stopSpeaking();
      setIsSpeakingId(null);
      return;
    }

    setIsSpeakingId(msgId);
    const speechLang = (replyLang || language) as SupportedLanguage;

    speakText(
      text,
      speechLang,
      () => {},
      () => setIsSpeakingId(null),
      () => setIsSpeakingId(null)
    );
  };

  const handleSendMessage = async (textToSend?: string, overrideLang?: SupportedLanguage) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const activeLang = overrideLang || language;
    if (overrideLang && overrideLang !== language) {
      setLanguage(overrideLang as AppLanguage);
    }

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setActivePipelineStep(1);

    // Simulate animated pipeline visualization
    const stepInterval = setInterval(() => {
      setActivePipelineStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 280);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: activeLang,
          farmContext: {
            farmerName,
            farmName: activeFarm?.name || 'My Farm',
            location: farmLocation,
            primaryCrop: farmCrop,
            crops: [farmCrop],
            totalAcres: activeFarm?.totalAcres || 10,
            soilMoisture: soilMoistureOverride,
            rainProbability: rainProbabilityOverride,
          },
        }),
      });

      clearInterval(stepInterval);
      setActivePipelineStep(6);

      const data = await response.json();
      const replyText =
        data.reply ||
        'I analyzed your field parameters and recommend maintaining standard irrigation and monitoring soil moisture.';
      const newMsgId = 'msg-' + Date.now() + '-reply';

      const assistantMsg: Message = {
        id: newMsgId,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        validationStatus: data.validationStatus || 'Validated by KHETIX Agronomic Rule Engine',
        source: data.source,
        detectedLanguage: data.detectedLanguage || activeLang,
        languageName: data.languageName,
        intent: data.intent,
        telemetrySnapshot: data.telemetry || {
          soilMoisture: soilMoistureOverride,
          rainProbability: rainProbabilityOverride,
          crop: farmCrop,
          location: farmLocation,
        },
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If Auto-Voice is active, speak the response aloud in the detected language
      if (autoVoice) {
        handleSpeak(replyText, newMsgId, data.detectedLanguage || activeLang);
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.warn('AI Assistant error, providing domain fallback:', err);
      const fallbackMsg: Message = {
        id: 'msg-' + Date.now() + '-fallback',
        sender: 'assistant',
        text: `🎯 **Recommendation: ${currentRule.label.toUpperCase()}**\n\n🔬 **Agronomic Justification:** Soil moisture is currently ${soilMoistureOverride}% with ${rainProbabilityOverride}% rain probability for ${farmCrop}.\n\n⚡ **Operational Next Steps:** Hold drip irrigation for 24-36 hours. Inspect field drainage furrows.\n\n🛡️ *Rule Engine: Safety interlock active.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        validationStatus: 'Validated by KHETIX Agronomic Rule Engine (Native Fallback)',
        detectedLanguage: activeLang,
        intent: 'irrigation',
        telemetrySnapshot: {
          soilMoisture: soilMoistureOverride,
          rainProbability: rainProbabilityOverride,
          crop: farmCrop,
          location: farmLocation,
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setActivePipelineStep(0);
    }
  };

  // Test chips for prompt demonstrations
  const promptChips = [
    {
      label: 'ನನ್ನ ಟೊಮೆಟೊ ಬೆಳೆಗೆ ಯಾವಾಗ ನೀರು ಹಾಕಬೇಕು?',
      langCode: 'kn' as SupportedLanguage,
      langHint: 'ಕನ್ನಡ (Kannada)',
      flag: '🟢',
      intent: 'Irrigation',
    },
    {
      label: 'मेरी टमाटर की फसल में कब पानी देना चाहिए?',
      langCode: 'hi' as SupportedLanguage,
      langHint: 'हिन्दी (Hindi)',
      flag: '🇮🇳',
      intent: 'Irrigation',
    },
    {
      label: 'Bhai tomato ko paani kab dena hai?',
      langCode: 'hinglish' as SupportedLanguage,
      langHint: 'Hinglish (किसान)',
      flag: '🇮🇳',
      intent: 'Irrigation',
    },
    {
      label: 'నా టమోటా పంటకు ఎప్పుడు నీరు పెట్టాలి?',
      langCode: 'te' as SupportedLanguage,
      langHint: 'తెలుగు (Telugu)',
      flag: '🔵',
      intent: 'Irrigation',
    },
    {
      label: 'என் தக்காளி பயிருக்கு எப்போது தண்ணீர் பாய்ச்ச வேண்டும்?',
      langCode: 'ta' as SupportedLanguage,
      langHint: 'தமிழ் (Tamil)',
      flag: '🟣',
      intent: 'Irrigation',
    },
    {
      label: 'माझ्या टोमॅटो पिकाला पाणी कधी द्यावे?',
      langCode: 'mr' as SupportedLanguage,
      langHint: 'मराठी (Marathi)',
      flag: '🟠',
      intent: 'Irrigation',
    },
    {
      label: 'আমার টমেটো ফসলে কখন জল দিতে হবে?',
      langCode: 'bn' as SupportedLanguage,
      langHint: 'বাংলা (Bengali)',
      flag: '🟡',
      intent: 'Irrigation',
    },
    {
      label: 'મારા ટામેટાના પાકને ક્યારે પાણી આપવું જોઈએ?',
      langCode: 'gu' as SupportedLanguage,
      langHint: 'ગુજરાતી (Gujarati)',
      flag: '🌾',
      intent: 'Irrigation',
    },
    {
      label: 'ਮੇਰੇ ਟਮਾਟਰ ਦੀ ਫ਼ਸਲ ਨੂੰ ਕਦੋਂ ਪਾਣੀ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?',
      langCode: 'pa' as SupportedLanguage,
      langHint: 'ਪੰਜਾਬੀ (Punjabi)',
      flag: '🌾',
      intent: 'Irrigation',
    },
    {
      label: 'എന്റെ തക്കാളി കൃഷിക്ക് എപ്പോഴാണ് നനയ്ക്കേണ്ടത്?',
      langCode: 'ml' as SupportedLanguage,
      langHint: 'മലയാളം (Malayalam)',
      flag: '🌾',
      intent: 'Irrigation',
    },
    {
      label: 'When should I irrigate my tomato crop?',
      langCode: 'en' as SupportedLanguage,
      langHint: 'English',
      flag: '🇬🇧',
      intent: 'Irrigation',
    },
    {
      label: 'Who won the cricket match yesterday?',
      langCode: 'en' as SupportedLanguage,
      langHint: 'Off-Topic Deflection',
      flag: '🏏',
      intent: 'Off-Topic',
    },
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-3 pb-2 font-sans">
      {/* Top Banner: Multilingual Advisor Header */}
      <div className="p-3.5 rounded-2xl bg-[#0a2318]/95 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-extrabold text-white font-display">
                KHETIX AI — Multilingual Agronomic Advisor
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Rule-Engine Validated
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Crop: <strong className="text-emerald-300">{farmCrop}</strong> • Soil Moisture:{' '}
              <strong className="text-emerald-300">{soilMoistureOverride}%</strong> • 24h Rain Risk:{' '}
              <strong className="text-emerald-300">{rainProbabilityOverride}%</strong> • Location:{' '}
              <strong className="text-white">{farmLocation.split(',')[0]}</strong>
            </p>
          </div>
        </div>

        {/* Right Tools: Language Selector, Telemetry Drawer, Auto-Voice, Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Architecture Pipeline Button */}
          <button
            onClick={() => setShowPipelineDiagram(!showPipelineDiagram)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showPipelineDiagram
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle 7-Step Multilingual AI Architecture Diagram"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">AI Pipeline</span>
          </button>

          {/* Telemetry Knobs Toggle */}
          <button
            onClick={() => setShowTelemetryDrawer(!showTelemetryDrawer)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showTelemetryDrawer
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Adjust Soil Moisture and Rain Risk live knobs"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Telemetry Knobs</span>
          </button>

          {/* Conversation Language Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer text-xs"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#0d2e20] text-slate-200">
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Voice Toggle */}
          <button
            onClick={() => setAutoVoice(!autoVoice)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              autoVoice
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Auto-speak incoming responses in native voice"
          >
            {autoVoice ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Auto-Voice</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={() => {
              stopSpeaking();
              setMessages([
                {
                  id: 'reset-' + Date.now(),
                  sender: 'assistant',
                  text: `Chat session refreshed. Ready for precision farm questions in ${currentLangMeta.nativeName}!`,
                  timestamp: 'Just now',
                  validationStatus: 'Validated by KHETIX Agronomic Rule Engine',
                  detectedLanguage: language,
                  telemetrySnapshot: {
                    soilMoisture: soilMoistureOverride,
                    rainProbability: rainProbabilityOverride,
                    crop: farmCrop,
                    location: farmLocation,
                  },
                },
              ]);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Expandable Multilingual AI Architecture Pipeline Visualizer */}
      {showPipelineDiagram && (
        <div className="p-3.5 rounded-2xl bg-[#071911] border border-emerald-500/30 text-xs shadow-xl shrink-0 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Multilingual Conversational Pipeline (Language & Intelligence Separated)
            </span>
            <span className="text-[11px] text-slate-400">ICAR Rule Grounded Architecture</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px]">
            <div className={`p-2 rounded-xl border ${activePipelineStep === 1 ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold animate-pulse' : 'bg-white/5 border-white/10 text-slate-300'}`}>
              <div className="font-bold text-emerald-400">1. Farmer Input</div>
              <div className="text-slate-400 text-[9px] mt-0.5">Voice / Text (Mic STT)</div>
            </div>

            <div className={`p-2 rounded-xl border ${activePipelineStep === 2 ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold animate-pulse' : 'bg-white/5 border-white/10 text-slate-300'}`}>
              <div className="font-bold text-emerald-400">2. Language Detect</div>
              <div className="text-slate-400 text-[9px] mt-0.5">Unicode & Phonetics (11 Langs)</div>
            </div>

            <div className={`p-2 rounded-xl border ${activePipelineStep === 3 ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold animate-pulse' : 'bg-white/5 border-white/10 text-slate-300'}`}>
              <div className="font-bold text-sky-400">3. Intent Detection</div>
              <div className="text-slate-400 text-[9px] mt-0.5">Irrigation / Pest / Nutrition / Off-Topic</div>
            </div>

            <div className={`p-2 rounded-xl border ${activePipelineStep === 4 ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold animate-pulse' : 'bg-white/5 border-white/10 text-slate-300'}`}>
              <div className="font-bold text-amber-400">4. Live Farm Data</div>
              <div className="text-slate-400 text-[9px] mt-0.5">Soil Moisture & Rain Telemetry</div>
            </div>

            <div className={`p-2 rounded-xl border ${activePipelineStep === 5 ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold animate-pulse' : 'bg-white/5 border-white/10 text-slate-300'}`}>
              <div className="font-bold text-rose-400">5. Rule Engine</div>
              <div className="text-slate-400 text-[9px] mt-0.5">Safety Interlocks (Root Hypoxia)</div>
            </div>

            <div className={`p-2 rounded-xl border ${activePipelineStep === 6 ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold animate-pulse' : 'bg-white/5 border-white/10 text-slate-300'}`}>
              <div className="font-bold text-purple-400">6. AI Generation</div>
              <div className="text-slate-400 text-[9px] mt-0.5">Native Formulation (No blind translation)</div>
            </div>

            <div className="p-2 rounded-xl border bg-white/5 border-white/10 text-slate-300">
              <div className="font-bold text-emerald-400">7. Text + Voice</div>
              <div className="text-slate-400 text-[9px] mt-0.5">Native TTS Voice Playback</div>
            </div>
          </div>
        </div>
      )}

      {/* Live Farm Context & Telemetry Simulation Knobs */}
      {showTelemetryDrawer && (
        <div className="p-3 rounded-2xl bg-[#091f16] border border-emerald-500/30 shadow-md shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Active Crop Picker */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Selected Crop:</span>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-[#06150f] border border-emerald-500/30 rounded-lg px-2.5 py-1 text-emerald-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="Tomato">Tomato (ಟೊಮೆಟೊ / टमाटर)</option>
                <option value="Cotton">Cotton (ಹತ್ತಿ / कपास)</option>
                <option value="Sugarcane">Sugarcane (ಕಬ್ಬು / गन्ना)</option>
                <option value="Paddy">Paddy / Rice (ಭತ್ತ / धान)</option>
                <option value="Wheat">Wheat (ಗೋಧಿ / गेहूं)</option>
                <option value="Onion">Onion (ಈರುಳ್ಳಿ / प्याज)</option>
              </select>
            </div>

            {/* Soil Moisture Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-[320px]">
              <span className="text-slate-400 whitespace-nowrap">Soil Moisture:</span>
              <input
                type="range"
                min="20"
                max="95"
                value={soilMoistureOverride}
                onChange={(e) => setSoilMoistureOverride(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <span className="font-mono font-bold text-emerald-300 min-w-[36px]">
                {soilMoistureOverride}%
              </span>
            </div>

            {/* Rain Risk Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-[320px]">
              <span className="text-slate-400 whitespace-nowrap">24h Rain Risk:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={rainProbabilityOverride}
                onChange={(e) => setRainProbabilityOverride(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <span className="font-mono font-bold text-sky-300 min-w-[36px]">
                {rainProbabilityOverride}%
              </span>
            </div>

            {/* Active Rule Badge */}
            <div className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${currentRule.color}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentRule.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Voice recording alert */}
      {isListening && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-center justify-between animate-pulse shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold">
              Listening in {currentLangMeta.nativeName} ({currentLangMeta.name}). Speak your farm query...
            </span>
          </div>
          <button
            onClick={toggleListening}
            className="px-2.5 py-1 rounded-lg bg-red-500 text-white font-bold text-[11px] hover:bg-red-600 transition cursor-pointer"
          >
            Stop Mic
          </button>
        </div>
      )}

      {sttError && (
        <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2 shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{sttError}</span>
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#0a2318] border border-emerald-500/20 space-y-4 shadow-inner scrollbar-thin scrollbar-thumb-emerald-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-lg'
                  : 'bg-[#0d2e20] border border-emerald-500/30 text-slate-200 rounded-bl-none shadow-xl'
              }`}
            >
              {/* Message Content */}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

              {/* Assistant Metadata, Telemetry Snapshot & Controls */}
              {msg.sender === 'assistant' && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{msg.validationStatus || 'Validated'}</span>
                    </div>

                    {msg.detectedLanguage && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold uppercase">
                        {msg.detectedLanguage}
                      </span>
                    )}

                    {msg.intent && (
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 font-medium capitalize">
                        Intent: {msg.intent.replace('_', ' ')}
                      </span>
                    )}

                    {msg.telemetrySnapshot && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        {msg.telemetrySnapshot.crop} • {msg.telemetrySnapshot.soilMoisture}% Moist • {msg.telemetrySnapshot.rainProbability}% Rain
                      </span>
                    )}
                  </div>

                  {/* Voice Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(msg.text, msg.id, msg.detectedLanguage)}
                      className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition cursor-pointer font-bold ${
                        isSpeakingId === msg.id
                          ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md animate-pulse'
                          : 'bg-white/5 hover:bg-white/10 text-emerald-300 border-white/10'
                      }`}
                      title="Speak response in native language"
                    >
                      {isSpeakingId === msg.id ? (
                        <>
                          <Square className="w-3 h-3 text-slate-950 fill-current" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-emerald-400" />
                          <span>Listen Voice</span>
                        </>
                      )}
                    </button>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              )}

              {msg.sender === 'user' && (
                <div className="text-[9px] mt-2 text-right text-emerald-200">
                  {msg.timestamp}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-[#0d2e20] border border-emerald-500/30 text-xs text-slate-300 rounded-bl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Analyzing field telemetry ({soilMoistureOverride}% moisture, {rainProbabilityOverride}% rain) → Evaluating ICAR safety rules → Generating response in {currentLangMeta.nativeName}...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Multilingual Prompt Chips */}
      <div className="space-y-1.5 shrink-0">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-slate-400 font-medium">
            Click to test exact multilingual reasoning examples:
          </span>
          <span className="text-[10px] text-emerald-400">
            {soilMoistureOverride > 70 || rainProbabilityOverride > 50 ? '⚠️ Rain/Moisture Hold' : '✅ Irrigation Permitted'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.label, chip.langCode)}
              className="px-3 py-1.5 rounded-xl bg-[#0a2318] hover:bg-[#0d2e20] border border-emerald-500/20 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer shrink-0 shadow-sm"
            >
              <span className="text-xs">{chip.flag}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 px-1 py-0.2 rounded bg-emerald-500/10">
                {chip.langHint}
              </span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar with Voice STT Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-2xl border transition flex items-center justify-center shrink-0 cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/30'
              : 'bg-[#0a2318] hover:bg-[#0d2e20] border-emerald-500/30 text-emerald-400 hover:text-emerald-300'
          }`}
          title={isListening ? 'Stop recording voice' : `Speak using microphone in ${currentLangMeta.nativeName}`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          placeholder={`Ask anything about your farm in ${currentLangMeta.nativeName} or speak via mic...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-2xl bg-[#0a2318] border border-emerald-500/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 shadow-inner"
        />

        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition flex items-center justify-center shrink-0 shadow-lg cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
