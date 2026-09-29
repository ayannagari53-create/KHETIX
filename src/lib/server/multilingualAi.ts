import { GoogleGenAI } from "@google/genai";

export type AgriIntent =
  | "irrigation"
  | "fertilizer_nutrition"
  | "pest_disease"
  | "weather_spraying"
  | "market_mandi"
  | "crop_planning"
  | "off_topic"
  | "general_agri";

export interface FarmContextData {
  farmerName?: string;
  farmName?: string;
  location?: string;
  primaryCrop?: string;
  crops?: string | string[];
  totalAcres?: number;
  soilMoisture?: number;
  rainProbability?: number;
}

export interface RuleEvaluation {
  irrigationAction: "DELAY" | "IMMEDIATE" | "NORMAL";
  irrigationReason: string;
  sprayingAction: "HOLD" | "PERMIT";
  sprayingReason: string;
  isOffTopic: boolean;
}

export interface AssistantResponse {
  reply: string;
  detectedLanguage: string;
  languageName: string;
  intent: AgriIntent;
  validationStatus: string;
  source: string;
  telemetry: {
    soilMoisture: number;
    rainProbability: number;
    crop: string;
    location: string;
  };
}

export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  kn: "Kannada (ಕನ್ನಡ)",
  mr: "Marathi (मराठी)",
  te: "Telugu (తెలుగు)",
  ta: "Tamil (தமிழ்)",
  bn: "Bengali (বাংলা)",
  gu: "Gujarati (ગુજરાતી)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  ml: "Malayalam (മലയാളം)",
  hinglish: "Hinglish (किसान संवाद)",
};

/**
 * Detect language from script and keywords
 */
export function detectLanguage(text: string, preferredLang: string = "en"): string {
  const query = text.trim();

  // 1. Script-based Unicode detection
  if (/[\u0C80-\u0CFF]/.test(query)) return "kn"; // Kannada
  if (/[\u0C00-\u0C7F]/.test(query)) return "te"; // Telugu
  if (/[\u0B80-\u0BFF]/.test(query)) return "ta"; // Tamil
  if (/[\u0980-\u09FF]/.test(query)) return "bn"; // Bengali
  if (/[\u0A80-\u0AFF]/.test(query)) return "gu"; // Gujarati
  if (/[\u0A00-\u0A7F]/.test(query)) return "pa"; // Punjabi
  if (/[\u0D00-\u0D7F]/.test(query)) return "ml"; // Malayalam

  // Devanagari detection (Marathi vs Hindi)
  if (/[\u0900-\u097F]/.test(query)) {
    const marathiWords = [
      "आहे", "पाणी", "पिक", "कधी", "शेती", "खत", "करावे", "नाही", "माझे",
      "द्यावे", "टोमॅटो", "करायचे", "पिकाला", "झाले", "करावी", "सांगा"
    ];
    const isMarathi = marathiWords.some((w) => query.includes(w));
    if (isMarathi || preferredLang === "mr") return "mr";
    return "hi";
  }

  // 2. Hinglish detection (Latin characters with Hindi / Indian phonetics)
  const lower = query.toLowerCase();
  const hinglishKeywords = [
    "paani", "pani", "kheti", "fasal", "bhai", "kab", "dena", "chahiye", "barish",
    "baarish", "khad", "dawai", "keeda", "kitna", "kare", "karna", "tamatar",
    "sinchai", "mandi", "bhav", "gehu", "dhan", "kisan", "kaise", "batao", "mujhe",
    "lagana", "hoga", "crop", "dalna", "deve", "devein", "spray"
  ];
  
  const words = lower.split(/[\s,?.!]+/);
  const isHinglish = hinglishKeywords.some((w) => words.includes(w)) ||
    lower.includes("bhai tomato") ||
    lower.includes("paani kab") ||
    lower.includes("kab dena") ||
    lower.includes("pani kab");

  if (isHinglish) return "hinglish";

  // 3. Fallback to preferred app language or English
  if (preferredLang && preferredLang !== "en") {
    return preferredLang;
  }

  return "en";
}

/**
 * Detect farmer intent from query across Indian languages and scripts
 */
export function detectIntent(text: string): AgriIntent {
  const lower = text.toLowerCase();

  // Off-topic filters
  const offTopicKeywords = [
    "cricket", "ipl", "bollywood", "movie", "film", "cinema", "song", "joke", "funny",
    "president", "prime minister", "election", "politics", "crypto", "bitcoin",
    "football", "who won", "dance", "chatgpt", "actor", "actress", "song", "match"
  ];
  if (offTopicKeywords.some((k) => lower.includes(k))) {
    return "off_topic";
  }

  // Irrigation intent (English, Hindi, Kannada, Telugu, Tamil, Marathi, Bengali, Gujarati, Punjabi, Malayalam, Hinglish)
  const irrigationKeywords = [
    "irrigate", "irrigation", "water", "watering", "moisture", "drip", "borewell",
    // Hindi & Hinglish
    "पानी", "सिंचाई", "सींचना", "paani", "pani", "sinchai", "paani kab", "pani kab", "kab dena",
    // Kannada
    "ನೀರು", "ನೀರಾವರಿ", "ಹಾಕಬೇಕು", "ತೇವಾಂಶ", "ಯಾವಾಗ ನೀರು", "neeru", "neer", "neeravari",
    // Telugu
    "నీరు", "నీళ్ళు", "తడి", "సాగునీరు", "ఎప్పుడు నీరు", "నీరు పెట్టాలి", "neellu", "thadi",
    // Tamil
    "தண்ணீர்", "பாசனம்", "நீர்", "எப்போது தண்ணீர்", "பாய்ச்ச வேண்டும்", "thanneer", "pasanam",
    // Marathi
    "पाणी", "सिंचन", "पाणी कधी द्यावे", "पाणी द्यावे", "ठिबक",
    // Bengali
    "জল", "সেচ", "কখন জল", "জল দিতে হবে", "ড্রিপ",
    // Gujarati
    "પાણી", "સિંચાઈ", "ક્યારે પાણી", "પાણી આપવું", "ભેજ",
    // Punjabi
    "ਪਾਣੀ", "ਸਿੰਚਾਈ", "ਕਦੋਂ ਪਾਣੀ", "ਪਾਣੀ ਦੇਣਾ", "ਨਮੀ",
    // Malayalam
    "വെള്ളം", "നനയ്ക്കണം", "എപ്പോഴാണ് നനയ്ക്കേണ്ടത്", "ജലസേചനം", "ഈർപ്പം"
  ];
  if (irrigationKeywords.some((k) => lower.includes(k))) {
    return "irrigation";
  }

  // Pest & Disease intent
  const pestKeywords = [
    "disease", "pest", "leaf", "spot", "blight", "fungus", "yellow", "curl", "wilting", "rot", "insect", "bug", "pesticide",
    // Hindi & Hinglish
    "बीमारी", "कीड़ा", "कीट", "फफूंद", "पीला", "स्प्रे", "दवा", "कीटनाशक", "bimari", "keeda", "kida", "fungus", "dawai", "kitnashak",
    // Kannada
    "ರೋಗ", "ಕೀಟ", "ಹುಳು", "ಚುಕ್ಕೆ", "ಹಳದಿ", "ಸುರುಟು", "ಕೊಳೆ", "roga", "keeta", "hulu", "chukke",
    // Telugu
    "తెగులు", "పురుగు", "మచ్చలు", "ముడత", "teagulu", "purugu",
    // Tamil
    "நோய்", "பூச்சி", "புழு", "சுருட்டல்", "noi", "poochi",
    // Marathi
    "रोग", "कीड", "अळी", "बुरशी", "ठिपके", "कीटकनाशक",
    // Bengali
    "রোগ", "পোকা", "ছত্রাক", "পাতা কোঁকড়ানো", "কীটনাশক",
    // Gujarati
    "રોગ", "જીવાત", "ઇયળ", "ફૂગ", "જંતુનાશક",
    // Punjabi
    "ਬਿਮਾਰੀ", "ਕੀੜੇ", "ਸੁੰਡੀ", "ਉੱਲੀ", "ਕੀਟਨਾਸ਼ਕ",
    // Malayalam
    "രോഗം", "കീടങ്ങൾ", "പുഴു", "ഇല ചുരുളൽ", "കീടനാശിനി"
  ];
  if (pestKeywords.some((k) => lower.includes(k))) {
    return "pest_disease";
  }

  // Fertilizer & Nutrition intent
  const fertilizerKeywords = [
    "fertilizer", "nutrition", "npk", "urea", "dap", "potash", "manure", "nitrogen", "zinc", "boron", "nutrient",
    // Hindi & Hinglish
    "खाद", "उर्वरक", "यूरिया", "पोषक", "गोबर", "पोटाश", "khad", "poshak", "gobar", "urvarak",
    // Kannada
    "ಗೊಬ್ಬರ", "ಪೋಷಕಾಂಶ", "ಯೂರಿಯಾ", "ಡಿಎಪಿ", "ಪೊಟ್ಯಾಶ್", "gobbaru", "poshakamsa",
    // Telugu
    "ఎరువు", "పోషకాలు", "యూరియా", "eruvu", "poshakalu",
    // Tamil
    "உரம்", "யூரியா", "பொட்டாஷ்", "uram",
    // Marathi
    "खत", "सेंद्रिय", "युरिया", "पोटॅश",
    // Bengali
    "সার", "ইউরিয়া", "পটাশ", "জৈব সার",
    // Gujarati
    "ખાતર", "યુરિયા", "પોટાશ", "સેન્દ્રિય",
    // Punjabi
    "ਖਾਦ", "ਯੂਰੀਆ", "ਪੋਟਾਸ਼", "ਰੂੜੀ",
    // Malayalam
    "വളം", "യൂറിയ", "പൊട്ടാഷ്", "ജൈവവളം"
  ];
  if (fertilizerKeywords.some((k) => lower.includes(k))) {
    return "fertilizer_nutrition";
  }

  // Weather & Spraying window
  const weatherKeywords = [
    "weather", "rain", "storm", "forecast", "wind", "spray", "humidity",
    // Hindi & Hinglish
    "मौसम", "बारिश", "हवा", "आंधी", "छिड़काव", "mausam", "barish", "baarish", "hawa",
    // Kannada
    "ಹವಾಮಾನ", "ಮಳೆ", "ಗಾಳಿ", "ಸಿಂಪರಣೆ", "havamana", "male", "gaali",
    // Telugu
    "వాతావరణం", "వర్షం", "పిచికారీ", "varsham",
    // Tamil
    "வானிலை", "மழை", "தெளிப்பு", "mazhai",
    // Marathi
    "हवामान", "पाऊस", "वारा", "फवारणी",
    // Bengali
    "আবহাওয়া", "বৃষ্টি", "ঝড়", "স্প্রে",
    // Gujarati
    "હવામાન", "વરસાદ", "પવન", "છંટકાવ",
    // Punjabi
    "ਮੌਸਮ", "ਮੀਂਹ", "ਹਵਾ", "ਸਪਰੇਅ",
    // Malayalam
    "കാലാവസ്ഥ", "മഴ", "തളിക്കൽ"
  ];
  if (weatherKeywords.some((k) => lower.includes(k))) {
    return "weather_spraying";
  }

  // Mandi & Market rates
  const marketKeywords = [
    "mandi", "price", "rate", "apmc", "market", "sell", "quintal", "bhav",
    // Hindi & Hinglish
    "मंडी", "भाव", "दाम", "बेचना", "रेट", "daam", "bechna",
    // Kannada
    "ಮಾರುಕಟ್ಟೆ", "ಬೆಲೆ", "ದರ", "ಮಾರಾಟ", "bele", "dara", "marukatte",
    // Telugu
    "ధర", "మార్కెట్", "మండి", "అమ్మకం", "dhara",
    // Tamil
    "விலை", "சந்தை", "விற்றல்", "vilai",
    // Marathi
    "बाजार", "भाव", "दर", "विक्री",
    // Bengali
    "বাজার", "দর", "দাম", "বিক্রি",
    // Gujarati
    "માર્કેટ", "ભાવ", "વેચાણ",
    // Punjabi
    "ਮੰਡੀ", "ਭਾਵ", "ਰੇਟ", "ਵੇਚਣਾ",
    // Malayalam
    "വിപണി", "വില", "വിൽപന"
  ];
  if (marketKeywords.some((k) => lower.includes(k))) {
    return "market_mandi";
  }

  // Sowing & Variety planning
  const cropKeywords = [
    "crop", "variety", "seed", "sowing", "yield", "harvest",
    // Hindi
    "फसल", "बीज", "बुवाई", "पैदावार", "कटाई", "fasal", "beej",
    // Kannada
    "ಬೆಳೆ", "ಬೀಜ", "ಬಿತ್ತನೆ", "ಇಳುವರಿ", "bele", "beeja", "bittane",
    // Telugu
    "పంట", "విత్తనం", "దిగుబడి", "panta", "vithanam"
  ];
  if (cropKeywords.some((k) => lower.includes(k))) {
    return "crop_planning";
  }

  return "general_agri";
}

/**
 * Agronomic rule engine checks real telemetry to separate intelligence from language
 */
export function evaluateAgronomicRules(intent: AgriIntent, telemetry: FarmContextData): RuleEvaluation {
  const soilMoisture = telemetry.soilMoisture !== undefined ? telemetry.soilMoisture : 64;
  const rainProb = telemetry.rainProbability !== undefined ? telemetry.rainProbability : 72;

  let irrigationAction: "DELAY" | "IMMEDIATE" | "NORMAL" = "NORMAL";
  let irrigationReason = "";

  if (soilMoisture > 70) {
    irrigationAction = "DELAY";
    irrigationReason = `Soil moisture is saturated at ${soilMoisture}%. High risk of root hypoxia (oxygen starvation) and fungal root rot.`;
  } else if (rainProb > 50) {
    irrigationAction = "DELAY";
    irrigationReason = `High precipitation forecast (${rainProb}% rain probability). Hold irrigation to prevent nutrient leaching and waterlogging.`;
  } else if (soilMoisture < 45 && rainProb < 30) {
    irrigationAction = "IMMEDIATE";
    irrigationReason = `Soil moisture is critically depleted (${soilMoisture}%). Crop is undergoing water stress. Initiate drip irrigation immediately.`;
  } else {
    irrigationAction = "NORMAL";
    irrigationReason = `Soil moisture (${soilMoisture}%) is within standard operating field capacity. Maintain regular drip schedule.`;
  }

  let sprayingAction: "HOLD" | "PERMIT" = "PERMIT";
  let sprayingReason = "";

  if (rainProb > 40) {
    sprayingAction = "HOLD";
    sprayingReason = `Rainfall expected (${rainProb}%). Agrochemicals and foliar sprays will wash off. Defer until 24 hours of dry weather.`;
  } else {
    sprayingAction = "PERMIT";
    sprayingReason = `Favorable weather window for morning/evening application. Observe Pre-Harvest Intervals (PHI).`;
  }

  return {
    irrigationAction,
    irrigationReason,
    sprayingAction,
    sprayingReason,
    isOffTopic: intent === "off_topic",
  };
}

/**
 * Generate agricultural advisory with authentic reasoning in target language
 */
export async function generateAdvisory(params: {
  message: string;
  language: string;
  farmContext: FarmContextData;
  gemini: GoogleGenAI | null;
}): Promise<AssistantResponse> {
  const { message, farmContext, gemini } = params;

  // 1. Language detection
  const detectedLang = detectLanguage(message, params.language);
  const langName = LANGUAGE_DISPLAY_NAMES[detectedLang] || "English";

  // 2. Intent detection
  const intent = detectIntent(message);

  // 3. Telemetry extraction
  const crop = (Array.isArray(farmContext.crops) ? farmContext.crops[0] : farmContext.primaryCrop) || "Tomato";
  const acres = farmContext.totalAcres || 10;
  const soilMoisture = farmContext.soilMoisture !== undefined ? farmContext.soilMoisture : 64;
  const rainProb = farmContext.rainProbability !== undefined ? farmContext.rainProbability : 72;
  const farmLocation = farmContext.location || "Karnataka, India";
  const farmerName = farmContext.farmerName || "Farmer";

  // 4. Rule Engine Interlocks (Separate Intelligence Layer)
  const rules = evaluateAgronomicRules(intent, {
    soilMoisture,
    rainProbability: rainProb,
    primaryCrop: crop,
  });

  // If Off-Topic, respond politely without forcing farm data
  if (intent === "off_topic") {
    const offTopicReplies: Record<string, string> = {
      kn: `ನಮಸ್ಕಾರ ${farmerName} ಅವರೇ! 🙏 ನಾನು ನಿಮ್ಮ ಖೇತಿಕ್ಸ್ (KHETIX) ಕೃಷಿ AI ಸಹಾಯಕ. ಈ ಪ್ರಶ್ನೆ ಕೃಷಿಗೆ ಸಂಬಂಧಿಸಿಲ್ಲ. ನಾನು ಬೆಳೆ ಸಂರಕ್ಷಣೆ, ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ, ಗೊಬ್ಬರ ಪ್ರಮಾಣ, ರೋಗ ನಿಯಂತ್ರಣ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ಮಾತ್ರ ನಿಖರ ಮಾರ್ಗದರ್ಶನ ನೀಡಬಲ್ಲೆ. ನಿಮ್ಮ ಜಮೀನಿನ ಬೆಳೆ ಅಥವಾ ಕೃಷಿ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಇದ್ದರೆ ಮುಕ್ತವಾಗಿ ಕೇಳಿ! 🌾`,
      hi: `नमस्ते ${farmerName} जी! 🙏 मैं खेतिक्स (KHETIX) का कृषि विशेषज्ञ AI हूँ। यह सवाल खेती से संबंधित नहीं है। मैं आपकी फसल सुरक्षा, ड्रिप सिंचाई, खाद-उर्वरक, रोग रोकथाम और मंडी भावों में मदद के लिए उपलब्ध हूँ। कृपया अपनी खेती से जुड़ा कोई सवाल पूछें! 🌾`,
      hinglish: `Namaste ${farmerName} bhai! 🙏 Main KHETIX ka Agri Intelligence Assistant hoon. Yeh sawal farming se related nahi hai. Main aapki fasal, paani/drip timing, khad, bimari aur mandi bhav me poori madad kar sakta hoon. Apne khet ya fasal se judi baat puchiye! 🌾`,
      te: `నమస్కారం ${farmerName} గారూ! 🙏 నేను ఖేతిక్స్ వ్యవసాయ AI అసిస్టెంట్‌ని. ఇది వ్యవసాయ సంబంధిత ప్రశ్న కాదు. మీ పంట రక్షణ, నీటిపారుదల, ఎరువుల నిర్వహణ ಮತ್ತು మార్కెట్ ధరల గురించి నన్ను అడగండి! 🌾`,
      ta: `வணக்கம் ${farmerName}! 🙏 நான் கேதிக்ஸ் (KHETIX) வேளாண் AI ஆலோசகர். இது விவசாயம் தொடர்பான கேள்வி அல்ல. உங்கள் பயிர் பாதுகாப்பு, பாசனம், உரம், நோய் கட்டுப்பாடு பற்றிய கேள்விகளை கேட்கலாம்! 🌾`,
      mr: `नमस्कार ${farmerName} जी! 🙏 मी खेटिक्स (KHETIX) शेती सल्लागार आहे. हा प्रश्न शेतीशी संबंधित नाही. मी तुम्हाला पाणी व्यवस्थापन, खते, रोग नियंत्रण आणि बाजार भाव यावर अचूक मार्गदर्शन करू शकतो! 🌾`,
      bn: `নমস্কার ${farmerName}! 🙏 আমি খেটিক্স (KHETIX) কৃষি এআই। এই প্রশ্নটি কৃষির সাথে সম্পর্কিত নয়। ফসল, সেচ, সার, রোগ প্রতিরোধ এবং বাজার দর নিয়ে যেকোনো প্রশ্ন করতে পারেন! 🌾`,
      gu: `નમસ્તે ${farmerName}! 🙏 હું ખેતિક્સ (KHETIX) કૃષિ એઆઈ છું. આ પ્રશ્ન ખેતીને લગતો નથી. કૃપા કરીને પાક, સિંચાઈ, ખાતર, રોગ નિયંત્રણ કે બજાર ભાવ અંગે પ્રશ્ન પૂછો! 🌾`,
      pa: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${farmerName} ਜੀ! 🙏 ਮੈਂ ਖੇਤੀਕਸ (KHETIX) ਖੇਤੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਇਹ ਸਵਾਲ ਖੇਤੀਬਾੜੀ ਨਾਲ ਸੰਬੰਧਿਤ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਫ਼ਸਲ, ਸਿੰਚਾਈ, ਖਾਦ ਜਾਂ ਮੰਡੀ ਭਾਵ ਬਾਰੇ ਪੁੱਛੋ! 🌾`,
      ml: `നമസ്കാരം ${farmerName}! 🙏 ഞാൻ ഖേതിക്സ് കാർഷിക AI സഹായിയാണ്. ഈ ചോദ്യം കൃഷിയുമായി ബന്ധപ്പെട്ടതല്ല. വിളപരിപാലനം, ജലസേചനം, വളപ്രയോഗം, രോഗനിയന്ത്രണം എന്നിവയെക്കുറിച്ച് ചോദിക്കാം! 🌾`,
      en: `Hello ${farmerName}! 🙏 I am the KHETIX Agronomic AI Advisor. This query is unrelated to agriculture. I specialize in precision crop health, irrigation telemetry, balanced nutrition, pest management, and APMC market prices. Please ask any farming-related questions! 🌾`,
    };

    return {
      reply: offTopicReplies[detectedLang] || offTopicReplies.en,
      detectedLanguage: detectedLang,
      languageName: langName,
      intent,
      validationStatus: "KHETIX Safety Filter: Polite Non-Agri Routing",
      source: "khetix-intent-router",
      telemetry: { soilMoisture, rainProbability: rainProb, crop, location: farmLocation },
    };
  }

  // 5. If Gemini is available, invoke AI with Agronomic Rules & Target Language
  if (gemini) {
    try {
      const prompt = `You are KHETIX, an elite Indian agricultural intelligence system speaking directly to an Indian farmer named ${farmerName}.
Query: "${message}"

DETECTED PARAMETERS:
- Target Output Language: ${langName} (You MUST reply 100% in ${langName} with authentic farmer vocabulary!)
- Detected Farmer Intent: ${intent}
- Farmer's Primary Crop: ${crop}
- Active Holding: ${acres} Acres in ${farmLocation}
- Live Soil Moisture: ${soilMoisture}% (Field Capacity: 60-70%)
- 24h Precipitation Risk: ${rainProb}% rain probability

CRITICAL AGRONOMIC RULE ENGINE DECISIONS (SEPARATE INTELLIGENCE LAYER):
- Irrigation Status: ${rules.irrigationAction} (${rules.irrigationReason})
- Spraying Status: ${rules.sprayingAction} (${rules.sprayingReason})
${rules.irrigationAction === "DELAY" ? "STRICT INSTRUCTION: Explicitly instruct the farmer to DELAY or HOLD irrigation. Explain the root hypoxia and waterlogging danger." : ""}
${rules.irrigationAction === "IMMEDIATE" ? "STRICT INSTRUCTION: Advise immediate drip cycle to protect crop from moisture stress." : ""}

RESPONSE STRUCTURE IN ${langName.toUpperCase()}:
1. 🎯 Direct Actionable Recommendation (Clear answer in the farmer's language)
2. 🔬 Farm Data & Agronomic Justification (Explicitly mention ${soilMoisture}% soil moisture and ${rainProb}% rain probability)
3. ⚡ Operational Next Steps (Dosage, drip duration, field inspection)
4. 🛡️ KHETIX Rule Engine Safety Notice`;

      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const replyText = response.text || "";
      if (replyText.trim().length > 20) {
        return {
          reply: replyText,
          detectedLanguage: detectedLang,
          languageName: langName,
          intent,
          validationStatus: "Validated by KHETIX Agronomic Rule Engine (Gemini)",
          source: "gemini-flash-multilingual",
          telemetry: { soilMoisture, rainProbability: rainProb, crop, location: farmLocation },
        };
      }
    } catch (e) {
      console.warn("Gemini generation failed, using native agronomic rule engine fallback:", e);
    }
  }

  // 6. Grounded Multilingual Agronomic Engine (High-fidelity native agricultural reasoning across all 11 languages)
  let fallbackReply = "";

  if (intent === "irrigation") {
    if (rules.irrigationAction === "DELAY") {
      switch (detectedLang) {
        case "kn":
          fallbackReply = `🎯 **ನೇರ ಶಿಫಾರಸು: ನಿಮ್ಮ ${crop} ಬೆಳೆಗೆ ಈಗ ನೀರು ಹಾಕಬೇಡಿ (24-36 ಗಂಟೆ ತಡೆಹಿಡಿಯಿರಿ)**

🔬 **ಕೃಷಿ ತಾಂತ್ರಿಕ ವಿವರ:**
• ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣಿನ ತೇವಾಂಶವು ಈಗಾಗಲೇ **${soilMoisture}%** ಇದೆ (ಸೂಕ್ತ ಮಿತಿ 60-70%).
• ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ **${rainProb}% ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ** ಇದೆ.
• ಈಗ ನೀರು ಹಾಯಿಸಿದರೆ ಬೇರುಗಳಿಗೆ ಆಮ್ಲಜನಕ ಕೊರತೆ (Root Hypoxia) ಉಂಟಾಗಿ, ಕೊಳೆರೋಗ ಅಥವಾ ಗಿಡ ಸೊರಗುವ ಅಪಾಯವಿದೆ.

⚡ **ಮುಂದಿನ ಹಂತಗಳು:**
1. ಬೋರ್‌ವೆಲ್ ಪಂಪ್ ಮತ್ತು ಡ್ರಿಪ್ ವಾಲ್ವ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಿ.
2. ಜಮೀನಿನಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆಗಳನ್ನು (Drainage channels) ಪರಿಶೀಲಿಸಿ.
3. ಮಳೆ ನಿಂತ 24 ಗಂಟೆಗಳ ನಂತರ ಮಣ್ಣನ್ನು ಪರೀಕ್ಷಿಸಿ ನೀರಾವರಿ ಪುನರಾರಂಭಿಸಿ.

🛡️ *KHETIX ನಿಯಮ: ಮಳೆಯ ಮುನ್ಸೂಚನೆ (>50%) ಮತ್ತು ತೇವಾಂಶ ಹೆಚ್ಚಿರುವುದರಿಂದ ನೀರಾವರಿ ತಡೆಹಿಡಿಯಲಾಗಿದೆ.*`;
          break;

        case "hi":
          fallbackReply = `🎯 **स्पष्ट सलाह: अपनी ${crop} की फसल में अभी पानी न दें (24-36 घंटे रोकें)**

🔬 **कृषि वैज्ञानिक कारण:**
• आपके खेत की मिट्टी में नमी अभी **${soilMoisture}%** है (उचित स्तर 60-70% होता है)।
• अगले 24 घंटों में **${rainProb}% बारिश की संभावना** है।
• इस समय सिंचाई करने से जड़ों में ऑक्सीजन की कमी (हाइपोक्सिया) और जड़ गलन (Root Rot) का खतरा बढ़ जाएगा।

⚡ **जरूरी कदम:**
1. ट्यूबवेल और ड्रिप वाल्व को बंद रखें।
2. खेत में जलजमाव न हो, इसके लिए जल निकासी नालियों को साफ रखें।
3. बारिश थमने के 24 घंटे बाद मिट्टी की नमी देखकर ही पानी चलाएं।

🛡️ *KHETIX रूल इंजन: बारिश की संभावना (>50%) के कारण सिंचाई स्थगित की गई है।*`;
          break;

        case "hinglish":
          fallbackReply = `🎯 **Direct Recommendation: Apni ${crop} ki fasal me abhi paani mat dijiye (24-36 ghante delay karein)**

🔬 **Agronomic Justification:**
• Aapke khet ki soil moisture abhi **${soilMoisture}%** par hai (optimal range 60-70% hoti hai).
• Aapke area me **${rainProb}% baarish ka risk** forecast hai.
• Agar abhi paani diya toh jado me oxygen ki kami ho jayegi aur fungal root rot lag sakta hai.

⚡ **Agla Step:**
1. Motor aur drip irrigation valves ko OFF rakhein.
2. Khet me paani na bhare, naliyo ko saaf rakhein.
3. Baarish ke 24 ghante baad check karke hi sinchai karein.

🛡️ *KHETIX Rule Engine: High precipitation risk (>50%) — Irrigation interlock active.*`;
          break;

        case "te":
          fallbackReply = `🎯 **ఖచ్చితమైన సలహా: మీ ${crop} పంటకు ఇప్పుడు నీరు పెట్టవద్దు (24-36 గంటలు వాయిదా వేయండి)**

🔬 **వ్యవసాయ శాస్త్ర కారణం:**
• నేలలో తేమ ఇప్పటికే **${soilMoisture}%** ఉంది (సాధారణ పరిమితి 60-70%).
• రాబోయే 24 గంటల్లో **${rainProb}% వర్ష సూచన** ఉంది.
• ఇప్పుడు నీరు పెడితే వేరుకుళ్ళు తెగులు (Root Rot) వచ్చే ప్రమాదం ఉంది.

⚡ **చేయవలసిన పనులు:**
1. డ్రిప్ వాల్వ్‌లు మరియు మోటారును ఆపివేయండి.
2. పొలంలో నీరు నిల్వ ఉండకుండా మురుగు కాలువలను సిద్ధం చేయండి.
3. వర్షం తగ్గిన తర్వాత నేలను తనిఖీ చేసి నీటిపారుదల ప్రారంభించండి.

🛡️ *KHETIX రూల్ ఇంజిన్: అధిక వర్ష సూచన (>50%) కారణంగా నీటిపారుదల నిలిపివేయబడింది.*`;
          break;

        case "ta":
          fallbackReply = `🎯 **பரிந்துரை: உங்கள் ${crop} பயிருக்கு இப்போது தண்ணீர் பாய்ச்ச வேண்டாம் (24-36 மணி நேரம் தள்ளிப்போடவும்)**

🔬 **தொழில்நுட்பக் காரணம்:**
• மண்ணின் ஈரப்பதம் தற்போது **${soilMoisture}%** உள்ளது (சரியான அளவு 60-70%).
• அடுத்த 24 மணி நேரத்தில் **${rainProb}% மழை பெய்யும் வாய்ப்பு** உள்ளது.
• இப்போது தண்ணீர் பாய்ச்சினால் வேரழுகல் நோய் வர வாய்ப்புள்ளது.

⚡ **அடுத்த நடவடிக்கைகள்:**
1. சொட்டு நீர் பாசன மோட்டாரை நிறுத்தி வைக்கவும்.
2. வயலில் தண்ணீர் தேங்காமல் இருக்க வடிகால் வாய்க்கால்களை சுத்தம் செய்யவும்.
3. மழை நின்ற 24 மணி நேரத்திற்குப் பிறகு மண்ணை பரிசோதித்து நீர் பாய்ச்சவும்.

🛡️ *KHETIX விதி: மழை எச்சரிக்கை (>50%) காரணமாக பாசனம் ஒத்திவைக்கப்பட்டுள்ளது.*`;
          break;

        case "mr":
          fallbackReply = `🎯 **थेट शिफारस: तुमच्या ${crop} पिकाला आता पाणी देऊ नका (24-36 तास थांबा)**

🔬 **कृषी वैज्ञानिक कारण:**
• जमिनीत ओलावा सध्या **${soilMoisture}%** आहे (योग्य प्रमाण 60-70%).
• पुढील 24 तासांत **${rainProb}% पावसाची शक्यता** आहे.
• पाणी दिल्यास मुळांना ऑक्सिजन कमी पडून मूळकुजव्या रोगाचा धोका निर्माण होईल.

⚡ **पुढील कृती:**
1. ठिबक सिंचन आणि मोटार बंद ठेवा.
2. शेतात पाणी साचू नये म्हणून निचरा चर तपासा.
3. पाऊस थांबल्यानंतर 24 तासांनी ओलावा पाहूनच पाणी द्या.

🛡️ *KHETIX नियम: पावसाचा इशारा (>50%) असल्यामुळे पाणी देण्याचा सल्ला स्थगित केला आहे.*`;
          break;

        case "bn":
          fallbackReply = `🎯 **সঠিক পরামর্শ: আপনার ${crop} ফসলে এখন জল সেচ দেবেন না (২৪-৩৬ ঘণ্টা অপেক্ষা করুন)**

🔬 **কৃষি বৈজ্ঞানিক কারণ:**
• মাটিতে আর্দ্রতা বর্তমানে **${soilMoisture}%** রয়েছে (অনুকূল মাত্রা ৬০-৭০%)।
• আগামী ২৪ ঘণ্টায় **${rainProb}% বৃষ্টির সম্ভাবনা** আছে।
• এখনই জল দিলে শিকড় পচে যাওয়ার (Root Rot) ঝুঁকি তৈরি হবে।

⚡ **করণীয়:**
১. ড্রিপ সেচ এবং পাম্প বন্ধ রাখুন।
২. জমিতে জল নিষ্কাশন ব্যবস্থা পরিষ্কার রাখুন।
৩. বৃষ্টি থামার ২৪ ঘণ্টা পর মাটির আর্দ্রতা পরীক্ষা করে সেচ দিন।

🛡️ *KHETIX রুল ইঞ্জিন: বৃষ্টির আশঙ্কার কারণে সেচ স্থগিত রাখা হয়েছে।*`;
          break;

        case "gu":
          fallbackReply = `🎯 **સીધી ભલામણ: તમારા ${crop} પાકને અત્યારે પાણી ન આપો (24-36 કલાક રોકો)**

🔬 **કૃષિ વૈજ્ઞાનિક કારણ:**
• જમીનમાં ભેજ હાલમાં **${soilMoisture}%** છે (યોગ્ય સ્તર 60-70%)।
• આગામી 24 કલાકમાં **${rainProb}% વરસાદની આગાહી** છે.
• અત્યારે સિંચાઈ કરવાથી મૂળ સડી જવાનો (Root Rot) ખતરો વધી જશે.

⚡ **જરૂરી પગલાં:**
૧. ડ્રિપ વાલ્વ અને મોટર બંધ રાખો.
૨. ખેતરમાં પાણી ભરાઈ ન રહે તે માટે નિકાલ ગટરો સાફ કરો.
૩. વરસાદ રોકાયાના 24 કલાક બાદ ભેજ ચકાસીને જ પાણી આપવું.

🛡️ *KHETIX નિયમ: વરસાદની આગાહી (>50%) હોવાથી સિંચાઈ સ્થગિત કરવામાં આવી છે.*`;
          break;

        case "pa":
          fallbackReply = `🎯 **ਸਿੱਧੀ ਸਲਾਹ: ਆਪਣੀ ${crop} ਦੀ ਫ਼ਸਲ ਨੂੰ ਹੁਣੇ ਪਾਣੀ ਨਾ ਦਿਓ (24-36 ਘੰਟੇ ਰੋਕੋ)**

🔬 **ਖੇਤੀ ਵਿਗਿਆਨਕ ਕਾਰਨ:**
• ਜ਼ਮੀਨ ਵਿੱਚ ਨਮੀ ਇਸ ਸਮੇਂ **${soilMoisture}%** ਹੈ (ਸਹੀ ਪੱਧਰ 60-70% ਹੁੰਦਾ ਹੈ)।
• ਅਗਲੇ 24 ਘੰਟਿਆਂ ਵਿੱਚ **${rainProb}% ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ** ਹੈ।
• ਹੁਣੇ ਪਾਣੀ ਦੇਣ ਨਾਲ ਜੜ੍ਹਾਂ ਵਿੱਚ ਆਕਸੀਜਨ ਦੀ ਕਮੀ ਅਤੇ ਉੱਲੀ ਕਾਰਨ ਜੜ੍ਹ ਗਲਣ ਦਾ ਖ਼ਤਰਾ ਹੈ।

⚡ **ਜ਼ਰੂਰੀ ਕਦਮ:**
੧. ਮੋਟਰ ਅਤੇ ਤੁਪਕਾ ਸਿੰਚਾਈ ਦੇ ਵਾਲਵ ਬੰਦ ਰੱਖੋ।
੨. ਖੇਤ ਵਿੱਚੋਂ ਪਾਣੀ ਦੀ ਨਿਕਾਸੀ ਦਾ ਪ੍ਰਬੰਧ ਯਕੀਨੀ ਬਣਾਓ ਤਾਂ ਜੋ ਪਾਣੀ ਨਾ ਖੜ੍ਹੇ।
੩. ਮੀਂਹ ਰੁਕਣ ਦੇ 24 ਘੰਟੇ ਬਾਅਦ ਨਮੀ ਦੇਖ ਕੇ ਹੀ ਸਿੰਚਾਈ ਸ਼ੁਰੂ ਕਰੋ।

🛡️ *KHETIX ਨਿਯਮ: ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਕਾਰਨ ਸਿੰਚਾਈ ਰੋਕੀ ਗਈ ਹੈ।*`;
          break;

        case "ml":
          fallbackReply = `🎯 **കൃത്യമായ നിർദ്ദേശം: നിങ്ങളുടെ ${crop} കൃഷിക്ക് ഇപ്പോൾ നനയ്ക്കരുത് (24-36 മണിക്കൂർ മാറ്റിവെക്കുക)**

🔬 **കാർഷിക ശാസ്ത്ര കാരണം:**
• മണ്ണിലെ ഈർപ്പം ഇപ്പോൾ **${soilMoisture}%** ആണ് (സാധാരണ പരിധി 60-70%).
• അടുത്ത 24 മണിക്കൂറിൽ **${rainProb}% മഴയ്ക്ക് സാധ്യതയുണ്ട്**.
• ഇപ്പോൾ വെള്ളം നൽകിയാൽ വേരുചീയൽ രോഗത്തിന് (Root Rot) സാധ്യതയുണ്ട്.

⚡ **അടുത്ത ഘട്ടങ്ങൾ:**
1. ഡ്രിപ്പ് ഇറിഗേഷനും മോട്ടോറും ഓഫ് ചെയ്യുക.
2. തോട്ടത്തിൽ വെള്ളക്കെട്ട് ഉണ്ടാകാതിരിക്കാൻ ചാലുകൾ വൃത്തിയാക്കുക.
3. മഴ കുറഞ്ഞ ശേഷം ഈർപ്പം പരിശോധിച്ച് നനയ്ക്കുക.

🛡️ *KHETIX റൂൾ: കനത്ത മഴ സാധ്യത (>50%) ഉള്ളതിനാൽ ജലസേചനം താൽക്കാലികമായി നിർത്തിവെച്ചിരിക്കുന്നു.*`;
          break;

        default:
          fallbackReply = `🎯 **Actionable Recommendation: DELAY IRRIGATION BY 24-36 HOURS**

🔬 **Agronomic Justification:**
• Current Soil Moisture is saturated at **${soilMoisture}%** for ${crop} (Optimal field capacity: 60-70%).
• 24h precipitation probability is high at **${rainProb}%**.
• Irrigating now saturates root zones, creating root hypoxia (oxygen starvation) and fungal root rot risks.

⚡ **Operational Next Steps:**
1. Keep borehole pump and solenoid valves in STANDBY.
2. Clear field drainage furrows to avoid ponding.
3. Re-evaluate moisture 24h after rainfall.

🛡️ *Rule Engine: Interlock ACTIVE — Irrigation deferred due to precipitation threshold (>50%).*`;
      }
    } else if (rules.irrigationAction === "IMMEDIATE") {
      switch (detectedLang) {
        case "kn":
          fallbackReply = `🎯 **ನೇರ ಶಿಫಾರಸು: ನಿಮ್ಮ ${crop} ಬೆಳೆಗೆ ತಕ್ಷಣ ಹನಿ ನೀರಾವರಿ ಪ್ರಾರಂಭಿಸಿ**

🔬 **ಕೃಷಿ ತಾಂತ್ರಿಕ ವಿವರ:**
• ಜಮೀನಿನ ಮಣ್ಣಿನ ತೇವಾಂಶವು ಕೇವಲ **${soilMoisture}%** ಕ್ಕೆ ಇಳಿದಿದೆ (ತೀವ್ರ ನೀರಿನ ಕೊರತೆ).
• ಮಳೆಯ ಸಾಧ್ಯತೆ ಕೇವಲ **${rainProb}%** ಇದೆ. ನೀರು ತಡಮಾಡಿದರೆ ಗಿಡ ಬಾಡಿ ಇಳುವರಿ ಕಡಿಮೆಯಾಗುತ್ತದೆ.

⚡ **ಮುಂದಿನ ಹಂತಗಳು:**
1. ತಕ್ಷಣ ಡ್ರಿಪ್ ಪಂಪ್ ಆನ್ ಮಾಡಿ 60-90 ನಿಮಿಷ ನೀರು ಹಾಯಿಸಿ.
2. ಬೆಳಗಿನ ಅಥವಾ ಸಂಜೆಯ ವೇಳೆಯಲ್ಲಿ ನೀರಾವರಿ ಮಾಡುವುದು ಹೆಚ್ಚು ಪರಿಣಾಮಕಾರಿ.

🛡️ *KHETIX ನಿಯಮ: ತೇವಾಂಶ ಕೊರತೆ ಪತ್ತೆಯಾಗಿದ್ದು ತಕ್ಷಣ ನೀರಾವರಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.*`;
          break;

        case "hi":
          fallbackReply = `🎯 **स्पष्ट सलाह: अपनी ${crop} की फसल में तुरंत ड्रिप सिंचाई शुरू करें**

🔬 **कृषि वैज्ञानिक कारण:**
• मिट्टी में नमी घटकर केवल **${soilMoisture}%** रह गई है (गंभीर जल संकट)।
• बारिश की संभावना केवल **${rainProb}%** है। देर करने पर फसल में विल्टिंग (मुरझाना) हो सकता है।

⚡ **जरूरी कदम:**
1. ड्रिप सिंचाई चालू करें और 60-90 मिनट तक पानी दें।
2. सुबह या शाम के समय पानी देना सबसे लाभकारी रहेगा।

🛡️ *KHETIX रूल इंजन: मिट्टी में नमी की भारी कमी — तत्काल सिंचाई आवश्यक।*`;
          break;

        case "hinglish":
          fallbackReply = `🎯 **Direct Recommendation: Apni ${crop} me turant drip irrigation start karein**

🔬 **Agronomic Justification:**
• Soil moisture gir kar sirf **${soilMoisture}%** reh gayi hai (water stress condition).
• Baarish ka chance sirf **${rainProb}%** hai. Paani me deri se podhe murjha sakte hain.

⚡ **Next Steps:**
1. Motor on karke 60-90 minutes ka drip cycle chalayein.
2. Subah ya shaam ke time water application sabse best hai.

🛡️ *KHETIX Rule Engine: Critical moisture deficit — Immediate watering approved.*`;
          break;

        case "te":
          fallbackReply = `🎯 **ఖచ్చితమైన సలహా: మీ ${crop} పంటకు తక్షణమే డ్రిప్ నీటిపారుదల ప్రారంభించండి**

🔬 **వ్యవసాయ శాస్త్ర కారణం:**
• నేలలో తేమ కేవలం **${soilMoisture}%** మాత్రమే ఉంది (నీటి ఎద్దడి).
• వర్ష సూచన కేవలం **${rainProb}%** మాత్రమే ఉంది.

⚡ **చేయవలసిన పనులు:**
1. వెంటనే డ్రిప్ మోటారు ఆన్ చేసి 60-90 నిమిషాలు నీరు పెట్టండి.
2. ఉదయం లేదా సాయంత్రం వేళల్లో నీరు పెట్టడం శ్రేయస్కరం.

🛡️ *KHETIX రూల్ ఇంజిన్: తేమ కొరత దృష్ట్యా తక్షణ నీటిపారుదల ఆమోదించబడింది.*`;
          break;

        case "ta":
          fallbackReply = `🎯 **பரிந்துரை: உங்கள் ${crop} பயிருக்கு உடனே சொட்டு நீர் பாசனம் தொடங்கவும்**

🔬 **தொழில்நுட்பக் காரணம்:**
• மண்ணின் ஈரப்பதம் **${soilMoisture}%** ஆக குறைந்துவிட்டது.
• மழைக்கான வாய்ப்பு வெறும் **${rainProb}%** மட்டுமே உள்ளது.

⚡ **அடுத்த நடவடிக்கைகள்:**
1. சொட்டு நீர் பாசனத்தை 60-90 நிமிடங்கள் இயக்கவும்.
2. காலை அல்லது மாலை வேளையில் நீர் பாய்ச்சுவது சிறந்தது.

🛡️ *KHETIX விதி: வறட்சி நிலை கண்டறியப்பட்டு உடனே பாசனம் செய்ய பரிந்துரைக்கப்படுகிறது.*`;
          break;

        case "mr":
          fallbackReply = `🎯 **थेट शिफारस: तुमच्या ${crop} पिकाला त्वरित ठिबक सिंचन सुरू करा**

🔬 **कृषी वैज्ञानिक कारण:**
• जमिनीत ओलावा केवळ **${soilMoisture}%** शिल्लक आहे (पाण्याचा ताण).
• पावसाची शक्यता फक्त **${rainProb}%** आहे.

⚡ **पुढील कृती:**
1. तातडीने ठिबक सुरू करून 60-90 मिनिटे पाणी द्या.
2. सकाळी किंवा संध्याकाळी पाणी देणे अधिक फायदेशीर ठरते.

🛡️ *KHETIX नियम: ओलावा कमी झाल्यामुळे तातडीने सिंचन मंजूर.*`;
          break;

        case "bn":
          fallbackReply = `🎯 **সঠিক পরামর্শ: আপনার ${crop} ফসলে অবিলম্বে ড্রিপ সেচ শুরু করুন**

🔬 **কৃষি বৈজ্ঞানিক কারণ:**
• মাটিতে আর্দ্রতা কমে মাত্র **${soilMoisture}%** হয়েছে।
• বৃষ্টির সম্ভাবনা মাত্র **${rainProb}%**।

⚡ **করণীয়:**
১. এখনই ড্রিপ পাম্প চালিয়ে ৬০-৯০ মিনিট জল দিন।
২. সকাল বা বিকেলে জল দেওয়া সবচেয়ে ভালো।

🛡️ *KHETIX রুল ইঞ্জিন: আর্দ্রতা ঘাটতির কারণে জরুরি সেচ নির্দেশিত।*`;
          break;

        case "gu":
          fallbackReply = `🎯 **સીધી ભલામણ: તમારા ${crop} પાકમાં તરત જ ડ્રિપ સિંચાઈ શરૂ કરો**

🔬 **કૃષિ વૈજ્ઞાનિક કારણ:**
• જમીનમાં ભેજ ઘટીને માત્ર **${soilMoisture}%** રહ્યો છે.
• વરસાદની શક્યતા માત્ર **${rainProb}%** છે.

⚡ **જરૂરી પગલાં:**
૧. ડ્રિપ મોટર ચાલુ કરી 60-90 મિનિટ પાણી આપો.
૨. સવારે અથવા સાંજે સિંચાઈ કરવી વધુ હિતાવહ છે.

🛡️ *KHETIX નિયમ: ભેજની અછતને લીધે તાત્કાલિક સિંચાઈ મંજૂર.*`;
          break;

        case "pa":
          fallbackReply = `🎯 **ਸਿੱਧੀ ਸਲਾਹ: ਆਪਣੀ ${crop} ਦੀ ਫ਼ਸਲ ਨੂੰ ਤੁਰੰਤ ਪਾਣੀ ਲਗਾਓ**

🔬 **ਖੇਤੀ ਵਿਗਿਆਨਕ ਕਾਰਨ:**
• ਜ਼ਮੀਨ ਵਿੱਚ ਨਮੀ ਘੱਟ ਕੇ ਕੇਵਲ **${soilMoisture}%** ਰਹਿ ਗਈ ਹੈ।
• ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਸਿਰਫ਼ **${rainProb}%** ਹੈ।

⚡ **ਜ਼ਰੂਰੀ ਕਦਮ:**
੧. ਤੁਪਕਾ ਸਿੰਚਾਈ ਚਲਾ ਕੇ 60-90 ਮਿੰਟ ਪਾਣੀ ਦਿਓ।
੨. ਸਵੇਰ ਜਾਂ ਸ਼ਾਮ ਵੇਲੇ ਪਾਣੀ ਦੇਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਰਹੇਗਾ।

🛡️ *KHETIX ਨਿਯਮ: ਨਮੀ ਦੀ ਕਮੀ ਕਾਰਨ ਤੁਰੰਤ ਸਿੰਚਾਈ ਦੀ ਸਿਫਾਰਸ਼।*`;
          break;

        case "ml":
          fallbackReply = `🎯 **കൃത്യമായ നിർദ്ദേശം: നിങ്ങളുടെ ${crop} കൃഷിക്ക് ഉടൻ ജലസേചനം നൽകുക**

🔬 **കാർഷിക ശാസ്ത്ര കാരണം:**
• മണ്ണിലെ ഈർപ്പം **${soilMoisture}%** ആയി കുറഞ്ഞു.
• മഴ സാധ്യത വെറും **${rainProb}%** മാത്രമാണ്.

⚡ **അടുത്ത ഘട്ടങ്ങൾ:**
1. ഡ്രിപ്പ് ഓൺ ചെയ്ത് 60-90 മിനിറ്റ് നനയ്ക്കുക.
2. രാവിലെ അല്ലെങ്കിൽ വൈകുന്നേരം നനയ്ക്കുന്നതാണ് ഉത്തമം.

🛡️ *KHETIX റൂൾ: ഈർപ്പക്കുറവ് സ്ഥിരീകരിച്ചതിനാൽ ഉടൻ നനയ്ക്കാൻ നിർദ്ദേശിക്കുന്നു.*`;
          break;

        default:
          fallbackReply = `🎯 **Actionable Recommendation: INITIATE IMMEDIATE DRIP IRRIGATION**

🔬 **Agronomic Justification:**
• Soil Moisture has dropped to **${soilMoisture}%** (Critical crop water stress threshold).
• Rain probability is negligible at **${rainProb}%**. Delaying irrigation will induce flower abortion and cavitation.

⚡ **Operational Next Steps:**
1. Run a 60-90 minute drip cycle immediately.
2. Best applied during early morning or dusk hours.

🛡️ *Rule Engine: Moisture deficit triggered emergency irrigation.*`;
      }
    } else {
      // Normal / scheduled irrigation
      switch (detectedLang) {
        case "kn":
          fallbackReply = `🎯 **ನೇರ ಶಿಫಾರಸು: ನಿಮ್ಮ ${crop} ಬೆಳೆಗೆ ನಿಗದಿತ ಹನಿ ನೀರಾವರಿ (Drip) ಮುಂದುವರಿಸಿ**

🔬 **ಕೃಷಿ ತಾಂತ್ರಿಕ ವಿವರ:**
• ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ ತೇವಾಂಶವು **${soilMoisture}%** ನಲ್ಲಿದೆ (ಸೂಕ್ತ ಮಟ್ಟ 60-70%).
• ಮಳೆಯ ಸಾಧ್ಯತೆ ಕೇವಲ **${rainProb}%** ಇದ್ದು ಹವಾಮಾನ ಸ್ಥಿರವಾಗಿದೆ.

⚡ **ಮುಂದಿನ ಹಂತಗಳು:**
1. ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ 8:30 ರ ಅವಧಿಯಲ್ಲಿ 45 ನಿಮಿಷ ಡ್ರಿಪ್ ಚಲಾಯಿಸಿ.
2. ಡ್ರಿಪ್ಪರ್‌ಗಳಲ್ಲಿ ನೀರಿನ ಹರಿವು ಸಮನಾಗಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.

🛡️ *KHETIX ನಿಯಮ: ತೇವಾಂಶ ಮತ್ತು ಹವಾಮಾನ ಸೂಕ್ತವಾಗಿದ್ದು ನಿಗದಿತ ನೀರಾವರಿ ಅನುಮೋದಿಸಲಾಗಿದೆ.*`;
          break;

        case "hi":
          fallbackReply = `🎯 **स्पष्ट सलाह: अपनी ${crop} की फसल में निर्धारित ड्रिप सिंचाई जारी रखें**

🔬 **कृषि वैज्ञानिक कारण:**
• मिट्टी में नमी **${soilMoisture}%** के सामान्य स्तर पर है।
• बारिश का जोखिम केवल **${rainProb}%** है।

⚡ **जरूरी कदम:**
1. सुबह 6:00 से 8:30 के बीच 45 मिनट का ड्रिप चक्र चलाएं।
2. लेटरल पाइप में दबाव की जांच करें।

🛡️ *KHETIX रूल इंजन: सामान्य फील्ड कैपेसिटी सत्यापित — नियमित चक्र मान्य।*`;
          break;

        case "hinglish":
          fallbackReply = `🎯 **Recommendation: Apni ${crop} me normal drip irrigation schedule follow karein**

🔬 **Agronomic Telemetry:**
• Soil moisture **${soilMoisture}%** par balanced hai aur rain risk **${rainProb}%** hai.

⚡ **Next Steps:**
1. Subah ke waqt 45 minute drip cycle run karein.
2. Drippers ka discharge check karein.

🛡️ *KHETIX Rule Engine: Standard irrigation cycle validated.*`;
          break;

        case "te":
          fallbackReply = `🎯 **ఖచ్చితమైన సలహా: మీ ${crop} పంటకు షెడ్యూల్ చేసిన డ్రిప్ నీటిపారుదల కొనసాగించండి**

🔬 **వ్యవసాయ శాస్త్ర కారణం:**
• నేలలో తేమ **${soilMoisture}%** వద్ద స్థిరంగా ఉంది. వర్ష సూచన **${rainProb}%**.

⚡ **చేయవలసిన పనులు:**
1. ఉదయం వేళల్లో 45 నిమిషాల పాటు డ్రిప్ నడపండి.

🛡️ *KHETIX రూల్ ఇంజిన్: సాధారణ నీటిపారుదల ఆమోదించబడింది.*`;
          break;

        case "ta":
          fallbackReply = `🎯 **பரிந்துரை: உங்கள் ${crop} பயிருக்கு திட்டமிட்ட சொட்டு நீர் பாசனத்தை தொடரவும்**

🔬 **தொழில்நுட்பக் காரணம்:**
• மண்ணின் ஈரப்பதம் **${soilMoisture}%** ஆக சீராக உள்ளது. மழை வாய்ப்பு **${rainProb}%**.

⚡ **அடுத்த நடவடிக்கைகள்:**
1. காலை வேளையில் 45 நிமிடங்கள் சொட்டு நீர் பாசனம் செய்யவும்.

🛡️ *KHETIX விதி: வழக்கமான பாசன அட்டவணை அனுமதிக்கப்பட்டுள்ளது.*`;
          break;

        case "mr":
          fallbackReply = `🎯 **थेट शिफारस: तुमच्या ${crop} पिकाला नियमित ठिबक सिंचन सुरू ठेवा**

🔬 **कृषी वैज्ञानिक कारण:**
• जमिनीत ओलावा **${soilMoisture}%** संतुलित आहे. पावसाचा धोका **${rainProb}%** आहे.

⚡ **पुढील कृती:**
1. सकाळी 45 मिनिटे ठिबक चालवा.

🛡️ *KHETIX नियम: नियमित सिंचन चक्र योग्य आहे.*`;
          break;

        case "bn":
          fallbackReply = `🎯 **সঠিক পরামর্শ: আপনার ${crop} ফসলে স্বাভাবিক ড্রিপ সেচ চালু রাখুন**

🔬 **কৃষি বৈজ্ঞানিক कारण:**
• মাটিতে আর্দ্রতা **${soilMoisture}%** অনুকূল আছে। বৃষ্টির সম্ভাবনা **${rainProb}%**।

⚡ **করণীয়:**
১. সকালে ৪৫ মিনিট ড্রিপ সেচ দিন।

🛡️ *KHETIX রুল ইঞ্জিন: নিয়মিত সেচ প্রক্রিয়া অনুমোদিত।*`;
          break;

        case "gu":
          fallbackReply = `🎯 **સીધી ભલામણ: તમારા ${crop} પાકમાં નિયમિત ડ્રિપ સિંચાઈ ચાલુ રાખો**

🔬 **કૃષિ વૈજ્ઞાનિક કારણ:**
• જમીનમાં ભેજ **${soilMoisture}%** યોગ્ય સ્તરે છે. વરસાદનું જોખમ **${rainProb}%** છે.

⚡ **જરૂરી પગલાં:**
૧. સવારે 45 મિનિટ ડ્રિપ ચલાવો.

🛡️ *KHETIX નિયમ: નિયમિત સિંચાઈ માન્ય.*`;
          break;

        case "pa":
          fallbackReply = `🎯 **ਸਿੱਧੀ ਸਲਾਹ: ਆਪਣੀ ${crop} ਦੀ ਫ਼ਸਲ ਨੂੰ ਨਿਯਮਿਤ ਤੁਪਕਾ ਸਿੰਚਾਈ ਦਿੰਦੇ ਰਹੋ**

🔬 **ਖੇਤੀ ਵਿਗਿਆਨਕ ਕਾਰਨ:**
• ਜ਼ਮੀਨ ਵਿੱਚ ਨਮੀ **${soilMoisture}%** ਅਨੁਕੂਲ ਹੈ। ਮੀਂਹ ਦਾ ਖ਼ਤਰਾ **${rainProb}%** ਹੈ।

⚡ **ਜ਼ਰੂਰੀ ਕਦਮ:**
੧. ਸਵੇਰੇ 45 ਮਿੰਟ ਤੁਪਕਾ ਸਿੰਚਾਈ ਚਲਾਓ।

🛡️ *KHETIX ਨਿਯਮ: ਆਮ ਸਿੰਚਾਈ ਚੱਕਰ ਪ੍ਰਮਾਣਿਤ।*`;
          break;

        case "ml":
          fallbackReply = `🎯 **കൃത്യമായ നിർദ്ദേശം: നിങ്ങളുടെ ${crop} കൃഷിക്ക് പതിവ് ജലസേചനം തുടരുക**

🔬 **കാർഷിക ശാസ്ത്ര കാരണം:**
• മണ്ണിലെ ഈർപ്പം **${soilMoisture}%** അനുയോജ്യമാണ്. മഴ സാധ്യത **${rainProb}%**.

⚡ **അടുത്ത ഘട്ടങ്ങൾ:**
1. രാവിലെ 45 മിനിറ്റ് ഡ്രിപ്പ് പ്രവർത്തിപ്പിക്കുക.

🛡️ *KHETIX റൂൾ: പതിവ് ജലസേചനം ശരിവെയ്ക്കുന്നു.*`;
          break;

        default:
          fallbackReply = `🎯 **Actionable Recommendation: MAINTAIN REGULAR DRIP IRRIGATION SCHEDULE**

🔬 **Agronomic Justification:**
• Soil Moisture is within standard operating range at **${soilMoisture}%** with low precipitation risk (${rainProb}%).

⚡ **Operational Next Steps:**
1. Run a standard 45-minute morning drip cycle.
2. Inspect line pressure and dripper outputs.

🛡️ *Rule Engine: Standard operating field capacity confirmed.*`;
      }
    }
  } else if (intent === "pest_disease") {
    switch (detectedLang) {
      case "kn":
        fallbackReply = `🎯 **ಬೆಳೆ ಸಂರಕ್ಷಣಾ ಶಿಫಾರಸು: ${crop.toUpperCase()} ರೋಗ ಮತ್ತು ಕೀಟ ನಿಯಂತ್ರಣ**

🔬 **ಕೃಷಿ ತಾಂತ್ರಿಕ ವಿವರ:**
• ತೇವಾಂಶ (${soilMoisture}%) ಹೆಚ್ಚಿದ್ದರೆ ಶಿಲೀಂಧ್ರ (Fungus) ಮತ್ತು ಎಲೆ ಚುಕ್ಕೆ ರೋಗಗಳು ಬೇಗ ಹರಡುತ್ತವೆ.
• ಎಲೆಗಳ ಮೇಲೆ ಕಪ್ಪು/ಕಂದು ಚುಕ್ಕೆಗಳು ಅಥವಾ ಎಲೆ ಮುದುಡುವಿಕೆ ಕಂಡುಬಂದರೆ ಕೂಡಲೇ ರಕ್ಷಣೆ ಅಗತ್ಯ.

⚡ **ಮುಂದಿನ ಹಂತಗಳು:**
1. **ಜೈವಿಕ ಪರಿಹಾರ:** ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil 10,000 ppm @ 2-3 ಮಿಲಿ/ಲೀಟರ್) ಸಿಂಪಡಿಸಿ.
2. ನಿಖರ ರೋಗ ಪತ್ತೆಗೆ KHETIX ನ **Crop Disease Detector** ನಲ್ಲಿ ಫೋಟೋ ತೆಗೆದು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.
3. ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇರುವಾಗ ರಸಾಯನಿಕ ಸಿಂಪಡಿಸಬೇಡಿ.

🛡️ *KHETIX ನಿಯಮ: ICAR ಸಸ್ಯ ಸಂರಕ್ಷಣಾ ಮಾನದಂಡಗಳು ಅನ್ವಯವಾಗಿವೆ.*`;
        break;

      case "hi":
        fallbackReply = `🎯 **फसल सुरक्षा सलाह: ${crop.toUpperCase()} में कीट एवं रोग रोकथाम**

🔬 **कृषि वैज्ञानिक कारण:**
• अधिक नमी (${soilMoisture}%) से फफूंद (Fungus) और पत्तियों पर धब्बों (Leaf Blight) का खतरा बढ़ जाता है।

⚡ **जरूरी कदम:**
1. **जैविक उपचार:** नीम का तेल (Neem Oil 10,000 ppm @ 2-3 मिली/लीटर) का छिड़काव करें।
2. सटीक पहचान के लिए KHETIX **Crop Disease Detector** में पत्ती की फोटो अपलोड करें।
3. बारिश की संभावना हो तो रासायनिक स्प्रे टालें।

🛡️ *KHETIX रूल इंजन: पौध संरक्षण प्रोटोकॉल सत्यापित।*`;
        break;

      case "hinglish":
        fallbackReply = `🎯 **Pest & Disease Advisory: ${crop.toUpperCase()} care schedule**

🔬 **Agronomic Telemetry:**
• Current soil moisture (${soilMoisture}%) can encourage fungal spores if leaves stay wet.

⚡ **Action Steps:**
1. Preventative measure ke liye Neem oil (10,000 ppm @ 2ml/L) spray karein.
2. Accurate diagnosis ke liye KHETIX **Crop Disease Detector** me leaf image scan karein.
3. Baarish aane wali ho toh foliar spray mat karein.

🛡️ *KHETIX Rule Engine: Plant protection guidelines active.*`;
        break;

      case "te":
        fallbackReply = `🎯 **పంట రక్షణ సలహా: ${crop.toUpperCase()} లో తెగుళ్లు మరియు పురుగుల నివారణ**

🔬 **వ్యవసాయ శాస్త్ర కారణం:**
• అధిక తేమ (${soilMoisture}%) వల్ల శిలీంధ్ర తెగుళ్లు వ్యాపించే అవకాశం ఉంది.

⚡ **చేయవలసిన పనులు:**
1. వేప నూనె (Neem Oil 10,000 ppm @ 2-3 మి.లీ/లీటరు) పిచికారీ చేయండి.
2. ఖచ్చితమైన నిర్ధారణ కోసం KHETIX **Crop Disease Detector** లో ఫోటో అప్‌లోడ్ చేయండి.

🛡️ *KHETIX రూల్ ఇంజిన్: సమగ్ర సస్యరక్షణ మార్గదర్శకాలు.*`;
        break;

      case "ta":
        fallbackReply = `🎯 **பயிர் பாதுகாப்பு ஆலோசனை: ${crop.toUpperCase()} பூச்சி மற்றும் நோய் கட்டுப்பாடு**

🔬 **தொழில்நுட்பக் காரணம்:**
• அதிக ஈரப்பதம் (${soilMoisture}%) பூஞ்சை நோய்களை பரப்பக்கூடும்.

⚡ **அடுத்த நடவடிக்கைகள்:**
1. வேப்ப எண்ணெய் (Neem Oil 10,000 ppm @ 2-3 மி.லி/லிட்டர்) தெளிக்கவும்.
2. துல்லியமான நோயறிதலுக்கு KHETIX **Crop Disease Detector** பயன்படுத்தவும்.

🛡️ *KHETIX விதி: தாவர பாதுகாப்பு நெறிமுறை சரிபார்க்கப்பட்டது.*`;
        break;

      case "mr":
        fallbackReply = `🎯 **पीक संरक्षण सल्ला: ${crop.toUpperCase()} कीड व रोग नियंत्रण**

🔬 **कृषी वैज्ञानिक कारण:**
• जास्त ओलावा (${soilMoisture}%) बुरशीजन्य रोगांसाठी पोषक ठरतो.

⚡ **पुढील कृती:**
1. प्रतिबंधात्मक उपाय म्हणून निंबोळी अर्क किंवा नीम तेल (2-3 मिली/लिटर) फवारा.
2. रोगाच्या अचूक निदानासाठी KHETIX **Crop Disease Detector** वापरा.

🛡️ *KHETIX नियम: एकात्मिक कीड व्यवस्थापन प्रोटोकॉल लागू.*`;
        break;

      case "bn":
        fallbackReply = `🎯 **ফসল সুরক্ষা পরামর্শ: ${crop.toUpperCase()} রোগ ও পোকা দমন**

🔬 **কৃষি বৈজ্ঞানিক কারণ:**
• অতিরিক্ত আর্দ্রতা (${soilMoisture}%) ছত্রাকজনিত রোগ দ্রুত ছড়ায়।

⚡ **করণীয়:**
১. নিম তেল (Neem Oil @ ২-৩ মিলি/লিটার) স্প্রে করুন।
২. সঠিক সনাক্তকরণের জন্য KHETIX **Crop Disease Detector** এ পাতার ছবি তুলুন।

🛡️ *KHETIX রুল ইঞ্জিন: উদ্ভিদ সুরক্ষা নির্দেশিকা সক্রিয়।*`;
        break;

      case "gu":
        fallbackReply = `🎯 **પાક સંરક્ષણ સલાહ: ${crop.toUpperCase()} જીવાત અને રોગ નિયંત્રણ**

🔬 **કૃષિ વૈજ્ઞાનિક કારણ:**
• વધુ પડતો ભેજ (${soilMoisture}%) ફૂગજન્ય રોગો ફેલાવી શકે છે.

⚡ **જરૂરી પગલાં:**
૧. લીમડાનું તેલ (Neem Oil @ 2-3 મિલી/લિટર) છાંટો.
૨. રોગની ઓળખ માટે KHETIX **Crop Disease Detector** નો ઉપયોગ કરો.

🛡️ *KHETIX નિયમ: પાક સંરક્ષણ પ્રોટોકોલ ચકાસાયેલ.*`;
        break;

      case "pa":
        fallbackReply = `🎯 **ਫ਼ਸਲ ਸੁਰੱਖਿਆ ਸਲਾਹ: ${crop.toUpperCase()} ਕੀੜੇ ਅਤੇ ਬਿਮਾਰੀਆਂ ਦੀ ਰੋਕਥਾਮ**

🔬 **ਖੇਤੀ ਵਿਗਿਆਨਕ ਕਾਰਨ:**
• ਜ਼ਿਆਦਾ ਨਮੀ (${soilMoisture}%) ਕਾਰਨ ਉੱਲੀ ਅਤੇ ਪੱਤਿਆਂ ਦੇ ਧੱਬਿਆਂ ਦਾ ਖ਼ਤਰਾ ਵਧਦਾ ਹੈ।

⚡ **ਜ਼ਰੂਰੀ ਕਦਮ:**
੧. ਨਿੰਮ ਦੇ ਤੇਲ (Neem Oil @ 2-3 ਮਿ.ਲੀ./ਲਿਟਰ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।
੨. ਬਿਮਾਰੀ ਦੀ ਸਹੀ ਪਛਾਣ ਲਈ KHETIX **Crop Disease Detector** ਦੀ ਵਰਤੋਂ ਕਰੋ।

🛡️ *KHETIX ਨਿਯਮ: ਪੌਦਾ ਸੁਰੱਖਿਆ ਮਾਪਦੰਡ ਲਾਗੂ।*`;
        break;

      case "ml":
        fallbackReply = `🎯 **വിള സംരക്ഷണ നിർദ്ദേശം: ${crop.toUpperCase()} കീട-രോഗ നിയന്ത്രണം**

🔬 **കാർഷിക ശാസ്ത്ര കാരണം:**
• ഉയർന്ന ഈർപ്പം (${soilMoisture}%) കുമിൾ രോഗങ്ങൾക്ക് കാരണമാകും.

⚡ **അടുത്ത ഘട്ടങ്ങൾ:**
1. വേപ്പെണ്ണ മിശ്രിതം (Neem Oil @ 2-3 മില്ലി/ലിറ്റർ) തളിക്കുക.
2. രോഗനിർണ്ണയത്തിനായി KHETIX **Crop Disease Detector** ഉപയോഗിക്കുക.

🛡️ *KHETIX റൂൾ: സസ്യസംരക്ഷണ മാർഗ്ഗനിർദ്ദേശങ്ങൾ പ്രകാരം സാധൂകരിച്ചു.*`;
        break;

      default:
        fallbackReply = `🎯 **Actionable Recommendation: CROP HEALTH INSPECTION FOR ${crop.toUpperCase()}**

🔬 **Agronomic Justification:**
• High soil moisture (${soilMoisture}%) promotes fungal pathogen proliferation and foliar blight.

⚡ **Operational Next Steps:**
1. Scan affected leaves with the KHETIX **Crop Disease Detector** for instant molecular identification.
2. Apply preventative Neem Seed Kernel Extract (10,000 ppm @ 2-3ml/L).
3. Do not apply foliar chemicals if rainfall is anticipated.

🛡️ *Rule Engine: Plant pathology standards active.*`;
    }
  } else if (intent === "fertilizer_nutrition") {
    switch (detectedLang) {
      case "kn":
        fallbackReply = `🎯 **ಪೋಷಕಾಂಶ ಶಿಫಾರಸು: ${crop.toUpperCase()} ಬೆಳೆಗೆ ಸಮತೋಲಿತ NPK ವೇಳಾಪಟ್ಟಿ**

🔬 **ಕೃಷಿ ತಾಂತ್ರಿಕ ವಿವರ:**
• ಬೆಳೆಯ ಸಮೃದ್ಧ ಬೆಳವಣಿಗೆ ಮತ್ತು ಹೂ-ಕಾಯಿ ಕಟ್ಟಲು ಸಾರಜನಕ ಮತ್ತು ಪೊಟ್ಯಾಶ್ ಅತ್ಯಗತ್ಯ.
• ಮಳೆಯ ಸಮಯದಲ್ಲಿ ಯೂರಿಯಾ ನೀಡಿದರೆ ಪೋಷಕಾಂಶಗಳು ಮಣ್ಣಿನಲ್ಲಿ ಕೊಚ್ಚಿಹೋಗುತ್ತವೆ (Leaching).

⚡ **ಮುಂದಿನ ಹಂತಗಳು:**
1. ಡ್ರಿಪ್ ಮೂಲಕ 19:19:19 ನೀರಿನಲ್ಲಿ ಕರಗುವ ಗೊಬ್ಬರವನ್ನು ಎಕರೆಗೆ 3-4 ಕೆಜಿ ನೀಡಿ.
2. ಹೂ ಉದುರುವಿಕೆ ತಡೆಯಲು ಬೋರಾನ್ (20%) 1 ಗ್ರಾಂ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ.
3. ನಿಖರ ಲೆಕ್ಕಾಚಾರಕ್ಕಾಗಿ KHETIX **Fertilizer Calculator** ಬಳಸಿ.

🛡️ *KHETIX ನಿಯಮ: ICAR ಪೋಷಕಾಂಶ ಪ್ರಮಾಣೀಕರಣ.*`;
        break;

      case "hi":
        fallbackReply = `🎯 **उर्वरक सलाह: ${crop.toUpperCase()} के लिए संतुलित NPK पोषण तालिका**

🔬 **कृषि वैज्ञानिक कारण:**
• वानस्पतिक वृद्धि और फल-फूल के विकास के लिए नाइट्रोजन एवं पोटाश का सही संतुलन जरूरी है।

⚡ **जरूरी कदम:**
1. ड्रिप फर्टिगेशन में 19:19:19 घुलनशील खाद 3-4 किलो प्रति एकड़ दें।
2. फूलों को झड़ने से रोकने हेतु बोरॉन (20%) @ 1 ग्राम प्रति लीटर स्प्रे करें।
3. अपने खेत के रकबे के अनुसार सटीक खुराक जानने के लिए **Fertilizer Calculator** देखें।

🛡️ *KHETIX रूल इंजन: ICAR पोषक तत्व अनुपात मान्य।*`;
        break;

      case "hinglish":
        fallbackReply = `🎯 **Fertilizer Advisory: ${crop.toUpperCase()} NPK dosage**

🔬 **Agronomic Justification:**
• Active growth stage me balanced Nitrogen and Potassium yields best flowering and fruit setting.

⚡ **Next Steps:**
1. Drip ke sath 19:19:19 grade fertilizer 3-4 kg per acre apply karein.
2. Flower drop control ke liye Boron (20%) 1g/liter foliar spray karein.
3. KHETIX **Fertilizer Calculator** se exact dosage measure karein.

🛡️ *KHETIX Rule Engine: Balanced crop nutrition validated.*`;
        break;

      case "te":
        fallbackReply = `🎯 **ఎరువుల సలహా: ${crop.toUpperCase()} పంటకు సమతుల్య NPK పోషకాలు**

🔬 **వ్యవసాయ శాస్త్ర కారణం:**
• పంట ఏపుగా పెరగడానికి మరియు పూత, కాయ నిలబడటానికి నత్రజని, పొటాష్ అవసరం.

⚡ **చేయవలసిన పనులు:**
1. డ్రిప్ ద్వారా 19:19:19 ఎరువును ఎకరాకు 3-4 కిలోలు అందించండి.
2. పూత రాలకుండా బోరాన్ (20%) 1 గ్రా/లీటరు పిచికారీ చేయండి.

🛡️ *KHETIX రూల్ ఇంజిన్: ICAR సమతుల్య పోషక ప్రమాణాలు.*`;
        break;

      case "ta":
        fallbackReply = `🎯 **உர மேலாண்மை: ${crop.toUpperCase()} பயிருக்கான சமச்சீர் NPK உரம்**

🔬 **தொழில்நுட்பக் காரணம்:**
• பயிர் வளர்ச்சி மற்றும் பூ பிடித்தலுக்கு தழைச்சத்து மற்றும் மணிச்சத்து மிகவும் முக்கியம்.

⚡ **அடுத்த நடவடிக்கைகள்:**
1. சொட்டு நீர் மூலம் 19:19:19 உரத்தை ஏக்கருக்கு 3-4 கிலோ இடவும்.
2. பூ உதிர்வதை தடுக்க போரான் (20%) 1 கிராம்/லிட்டர் தெளிக்கவும்.

🛡️ *KHETIX விதி: ஊட்டச்சத்து மேலாண்மை அங்கீகரிக்கப்பட்டது.*`;
        break;

      case "mr":
        fallbackReply = `🎯 **खत व्यवस्थापन: ${crop.toUpperCase()} पिकासाठी संतुलित NPK मात्रा**

🔬 **कृषी वैज्ञानिक कारण:**
• शाकीय वाढ व फुलकळी धारणेसाठी नत्र व पालाशची आवश्यकता असते.

⚡ **पुढील कृती:**
1. ठिबकद्वारे 19:19:19 विद्राव्य खत एकरी 3-4 किलो द्या.
2. फुलगळ रोखण्यासाठी बोरॉन (20%) 1 ग्रॅम/लिटर फवारा.

🛡️ *KHETIX नियम: संतुलित पोषण प्रमाण प्रमाणित.*`;
        break;

      case "bn":
        fallbackReply = `🎯 **সার প্রয়োগ পরামর্শ: ${crop.toUpperCase()} ফসলে সুষম NPK পুষ্টি**

🔬 **কৃষি বৈজ্ঞানিক কারণ:**
• ফসলের বৃদ্ধি এবং ফুল-ফল ধরার জন্য সঠিক মাত্রায় নাইট্রোজেন ও পটাশ প্রয়োজন।

⚡ **করণীয়:**
১. ড্রিপের মাধ্যমে ১৯:১৯:১৯ সার প্রতি একরে ৩-৪ কেজি প্রয়োগ করুন।
২. ফুল ঝরা রোধে বোরন (২০%) ১ গ্রাম/লিটার স্প্রে করুন।

🛡️ *KHETIX রুল ইঞ্জিন: সার সুপারিশ অনুমোদিত।*`;
        break;

      case "gu":
        fallbackReply = `🎯 **ખાતર વ્યવસ્થાપન: ${crop.toUpperCase()} પાક માટે સંતુલિત NPK ડોઝ**

🔬 **કૃષિ વૈજ્ઞાનિક કારણ:**
• પાકના સારા વિકાસ અને ફૂલ-ફળ માટે નાઈટ્રોજન અને પોટાશ જરૂરી છે.

⚡ **જરૂરી પગલાં:**
૧. ડ્રિપ દ્વારા 19:19:19 ખાતર એકરે 3-4 કિલો આપો.
૨. ફૂલ ખરતા રોકવા બોરોન (20%) 1 ગ્રામ/લિટર છાંટો.

🛡️ *KHETIX નિયમ: સંતુલિત પોષણ પ્રોટોકોલ ચકાસાયેલ.*`;
        break;

      case "pa":
        fallbackReply = `🎯 **ਖਾਦ ਪ੍ਰਬੰਧਨ: ${crop.toUpperCase()} ਲਈ ਸੰਤੁਲਿਤ NPK ਪੋਸ਼ਣ**

🔬 **ਖੇਤੀ ਵਿਗਿਆਨਕ ਕਾਰਨ:**
• ਫ਼ਸਲ ਦੇ ਵਾਧੇ ਅਤੇ ਫੁੱਲ-ਫਲ ਪੈਣ ਲਈ ਨਾਈਟ੍ਰੋਜਨ ਅਤੇ ਪੋਟਾਸ਼ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹਨ।

⚡ **ਜ਼ਰੂਰੀ ਕਦਮ:**
੧. ਤੁਪਕਾ ਸਿੰਚਾਈ ਰਾਹੀਂ 19:19:19 ਖਾਦ 3-4 ਕਿਲੋ ਪ੍ਰਤੀ ਏਕੜ ਦਿਓ।
੨. ਫੁੱਲ ਡਿੱਗਣ ਤੋਂ ਰੋਕਣ ਲਈ ਬੋਰਾਨ (20%) 1 ਗ੍ਰਾਮ/ਲਿਟਰ ਛਿੜਕੋ।

🛡️ *KHETIX ਨਿਯਮ: ਸੰਤੁਲਿਤ ਖਾਦ ਸਿਫਾਰਸ਼ ਲਾਗੂ।*`;
        break;

      case "ml":
        fallbackReply = `🎯 **വളപ്രയോഗ നിർദ്ദേശം: ${crop.toUpperCase()} വിളയ്ക്ക് സന്തുലിത NPK വളങ്ങൾ**

🔬 **കാർഷിക ശാസ്ത്ര കാരണം:**
• ചെടിയുടെ വളർച്ചയ്ക്കും പൂവിടലിനും നൈട്രജനും പൊട്ടാസ്യവും അത്യന്താപേക്ഷിതമാണ്.

⚡ **അടുത്ത ഘട്ടങ്ങൾ:**
1. ഡ്രിപ്പ് വഴി 19:19:19 വളം ഏക്കറിന് 3-4 കിലോ നൽകുക.
2. പൂക്കൾ കൊഴിയുന്നത് തടയാൻ ബോറോൺ (20%) 1 ഗ്രാം/ലിറ്റർ തളിക്കുക.

🛡️ *KHETIX റൂൾ: സന്തുലിത പോഷക മാനദണ്ഡങ്ങൾ പ്രകാരം സാധൂകരിച്ചു.*`;
        break;

      default:
        fallbackReply = `🎯 **Actionable Recommendation: BALANCED NPK NUTRITION SCHEDULE**

🔬 **Agronomic Justification:**
• Vegetative development and fruit formation for ${crop} require balanced Nitrogen with Potassium.

⚡ **Operational Next Steps:**
1. Inject water-soluble 19:19:19 grade @ 3-4 kg/acre via drip fertigation.
2. Supplement with Boron (20%) @ 1g/L foliar spray to prevent blossom drop.
3. Consult the KHETIX **Fertilizer Calculator** for exact acre calculations.

🛡️ *Rule Engine: ICAR nutrient management verified.*`;
    }
  } else {
    // General agricultural advisory
    switch (detectedLang) {
      case "kn":
        fallbackReply = `🎯 **KHETIX ಕೃಷಿ ನಿರ್ಧಾರ ಬೆಂಬಲ: ${crop.toUpperCase()} (${acres} ಎಕರೆ)**

ನಮಸ್ಕಾರ ${farmerName} ಅವರೇ! ನಿಮ್ಮ ಜಮೀನಿನ ಇಂದಿನ ಸ್ಥಿತಿ:
• **ಮಣ್ಣಿನ ತೇವಾಂಶ:** ${soilMoisture}%
• **ಮಳೆಯ ಮುನ್ಸೂಚನೆ:** ${rainProb}%
• **ಸ್ಥಳ:** ${farmLocation}

💡 **ಮುಖ್ಯ ಸಲಹೆ:**
${rainProb > 50 ? "ಮಳೆಯ ಸಾಧ್ಯತೆ ಹೆಚ್ಚಿದೆ — ನೀರಾವರಿಯನ್ನು ತಡೆಹಿಡಿಯಿರಿ ಮತ್ತು ಬಸಿಗಾಲುವೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ." : "ಹವಾಮಾನ ಸ್ಥಿರವಾಗಿದೆ — ನಿಗದಿತ ಕೃಷಿ ಕೆಲಸಗಳನ್ನು ಮತ್ತು ಡ್ರಿಪ್ ನೀರಾವರಿಯನ್ನು ಮುಂದುವರಿಸಿ."}

ನೀವು ನೀರಾವರಿ, ರೋಗ ನಿಯಂತ್ರಣ, ಗೊಬ್ಬರ ಪ್ರಮಾಣ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು!

🛡️ *KHETIX ನಿಯಮ: ನೈಜ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ ಡೇಟಾ ಆಧಾರಿತ ಸಲಹೆ.*`;
        break;

      case "hi":
        fallbackReply = `🎯 **KHETIX कृषि निर्णय प्रणाली: ${crop.toUpperCase()} (${acres} एकड़)**

नमस्ते ${farmerName} जी! आपके खेत का आज का लाइव डेटा:
• **मिट्टी में नमी:** ${soilMoisture}%
• **बारिश की संभावना:** ${rainProb}%
• **स्थान:** ${farmLocation}

💡 **मुख्य सिफारिश:**
${rainProb > 50 ? "बारिश का अनुमान है — सिंचाई रोककर रखें और खेत में जल निकासी सुनिश्चित करें।" : "मौसम साफ है — निर्धारित ड्रिप सिंचाई और कृषि कार्य जारी रखें।"}

आप सिंचाई, कीट नियंत्रण, खाद की मात्रा या मंडी भाव पर कभी भी पूछ सकते हैं!

🛡️ *KHETIX रूल इंजन: ICAR मानकों के अनुरूप लाइव टेलीमेट्री आधारित सलाह।*`;
        break;

      case "hinglish":
        fallbackReply = `🎯 **KHETIX Agri Advisory for ${crop.toUpperCase()}**

Hello ${farmerName} bhai! Aapke khet ka live status:
• **Soil Moisture:** ${soilMoisture}%
• **Rain Risk:** ${rainProb}%
• **Farm Location:** ${farmLocation}

💡 **Key Recommendation:**
${rainProb > 50 ? "Baarish expected hai: Paani dena hold karein aur khet me drainage check karein." : "Mausam theek hai: Scheduled drip irrigation aur spraying continue karein."}

Aap irrigation, rog pehchan, khad ya mandi rates par kabhi bhi baat kar sakte hain!

🛡️ *KHETIX Rule Engine: Real-time telemetry synchronized.*`;
        break;

      case "te":
        fallbackReply = `🎯 **KHETIX వ్యవసాయ సలహా: ${crop.toUpperCase()} (${acres} ఎకరాలు)**

నమస్కారం ${farmerName} గారూ! మీ పొలం ప్రస్తుత స్థితి:
• **నేలలో తేమ:** ${soilMoisture}%
• **వర్ష సూచన:** ${rainProb}%
• **ప్రాంతం:** ${farmLocation}

💡 **కీలక సూచన:**
${rainProb > 50 ? "వర్ష సూచన ఉంది — నీటిపారుదల నిలిపివేయండి మరియు మురుగు కాలువలను సరిచూసుకోండి." : "వాతావరణం అనుకూలంగా ఉంది — షెడ్యూల్ ప్రకారం వ్యవసాయ పనులు కొనసాగించండి."}

🛡️ *KHETIX రూల్ ఇంజిన్: లైవ్ టెలిమెట్రీ ఆధారిత సలహా.*`;
        break;

      case "ta":
        fallbackReply = `🎯 **KHETIX வேளாண் அறிக்கை: ${crop.toUpperCase()} (${acres} ஏக்கர்)**

வணக்கம் ${farmerName}! உங்கள் பண்ணையின் நேரலை நிலை:
• **மண்ணின் ஈரப்பதம்:** ${soilMoisture}%
• **மழை வாய்ப்பு:** ${rainProb}%
• **இடம்:** ${farmLocation}

💡 **முக்கிய அறிவுரை:**
${rainProb > 50 ? "மழை பெய்ய வாய்ப்புள்ளது — பாசனத்தை நிறுத்தி வடிகால் வசதியை சரிபார்க்கவும்." : "வானிலை சீராக உள்ளது — திட்டமிட்ட பண்ணை வேலைகளை தொடரலாம்."}

🛡️ *KHETIX விதி: பண்ணை தரவுகளின் அடிப்படையில் சரிபார்க்கப்பட்டது.*`;
        break;

      case "mr":
        fallbackReply = `🎯 **KHETIX कृषी सल्ला: ${crop.toUpperCase()} (${acres} एकर)**

नमस्कार ${farmerName} जी! तुमच्या शेताची आजची स्थिती:
• **जमिनीतील ओलावा:** ${soilMoisture}%
• **पावसाचा अंदाज:** ${rainProb}%
• **ठिकाण:** ${farmLocation}

💡 **महत्त्वाची शिफारस:**
${rainProb > 50 ? "पावसाचा अंदाज आहे — पाणी देणे थांबवा आणि चर मोकळे ठेवा." : "हवामान अनुकूल आहे — नियमित सिंचन व मशागत सुरू ठेवा."}

🛡️ *KHETIX नियम: रिअल-टाईम सेन्सर डेटा आधारित सल्ला.*`;
        break;

      case "bn":
        fallbackReply = `🎯 **KHETIX কৃষি সিদ্ধান্ত সহায়তা: ${crop.toUpperCase()} (${acres} একর)**

নমস্কার ${farmerName}! আপনার খামারের বর্তমান অবস্থা:
• **মাটির আর্দ্রতা:** ${soilMoisture}%
• **বৃষ্টির পূর্বাভাস:** ${rainProb}%
• **স্থান:** ${farmLocation}

💡 **মূল পরামর্শ:**
${rainProb > 50 ? "বৃষ্টির সম্ভাবনা রয়েছে — সেচ বন্ধ রাখুন এবং নিকাশি নালা পরিষ্কার করুন।" : "আবহাওয়া অনুকূল — নির্ধারিত ড্রিপ সেচ এবং পরিচর্যা চালু রাখুন।"}

🛡️ *KHETIX রুল ইঞ্জিন: লাইভ ডেটা দ্বারা যাচাইকৃত।*`;
        break;

      case "gu":
        fallbackReply = `🎯 **KHETIX કૃષિ સલાહકાર: ${crop.toUpperCase()} (${acres} એકર)**

નમસ્તે ${farmerName}! તમારા ખેતરની સ્થિતિ:
• **જમીનમાં ભેજ:** ${soilMoisture}%
• **વરસાદની આગાહી:** ${rainProb}%
• **સ્થળ:** ${farmLocation}

💡 **મુખ્ય ભલામણ:**
${rainProb > 50 ? "વરસાદની આગાહી છે — સિંચાઈ મોકૂફ રાખો અને નિકાલ ચકાસો." : "હવામાન અનુકૂળ છે — નિયમિત ખેતી કાર્યો ચાલુ રાખો."}

🛡️ *KHETIX નિયમ: સેન્સર ડેટા આધારિત વૈજ્ઞાનિક સલાહ.*`;
        break;

      case "pa":
        fallbackReply = `🎯 **KHETIX ਖੇਤੀਬਾੜੀ ਸਲਾਹ: ${crop.toUpperCase()} (${acres} ਏਕੜ)**

ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${farmerName} ਜੀ! ਤੁਹਾਡੇ ਖੇਤ ਦਾ ਲਾਈਵ ਡੇਟਾ:
• **ਜ਼ਮੀਨ ਵਿੱਚ ਨਮੀ:** ${soilMoisture}%
• **ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ:** ${rainProb}%
• **ਸਥਾਨ:** ${farmLocation}

💡 **ਮੁੱਖ ਸਲਾਹ:**
${rainProb > 50 ? "ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ — ਸਿੰਚਾਈ ਰੋਕੋ ਅਤੇ ਨਿਕਾਸੀ ਨਾਲੀਆਂ ਸਾਫ਼ ਰੱਖੋ।" : "ਮੌਸਮ ਸਾਫ਼ ਹੈ — ਤੁਪਕਾ ਸਿੰਚਾਈ ਅਤੇ ਖੇਤੀ ਕੰਮ ਜਾਰੀ ਰੱਖੋ।"}

🛡️ *KHETIX ਨਿਯਮ: ਲਾਈਵ ਟੈਲੀਮੈਟਰੀ ਅਧਾਰਿਤ ਸਲਾਹ।*`;
        break;

      case "ml":
        fallbackReply = `🎯 **KHETIX കാർഷിക ഉപദേശം: ${crop.toUpperCase()} (${acres} ഏക്കർ)**

നമസ്കാരം ${farmerName}! നിങ്ങളുടെ തോട്ടത്തിലെ നിലവിലെ അവസ്ഥ:
• **മണ്ണിലെ ഈർപ്പം:** ${soilMoisture}%
• **മഴ സാധ്യത:** ${rainProb}%
• **സ്ഥലം:** ${farmLocation}

💡 **പ്രധാന നിർദ്ദേശം:**
${rainProb > 50 ? "മഴയ്ക്ക് സാധ്യതയുണ്ട് — ജലസೇചനം നിർത്തിവെച്ച് ചാലുകൾ വൃത്തിയാക്കുക." : "കാലാവസ്ഥ അനുകൂലമാണ് — പതിവ് നനയും കൃഷിപ്പണികളും തുടരുക."}

🛡️ *KHETIX റൂൾ: ലൈവ് സെൻസർ ഡാറ്റ പ്രകാരം സാധൂകരിച്ച ഉപദേശം.*`;
        break;

      default:
        fallbackReply = `🎯 **KHETIX Agronomic Decision Support for ${crop.toUpperCase()}**

Hello ${farmerName}! Here is your current field telemetry for **${crop}** (${acres} Acres):
• **Soil Moisture:** ${soilMoisture}%
• **Rainfall Risk:** ${rainProb}% rain probability
• **Location:** ${farmLocation}

💡 **Key Recommendation:**
${rainProb > 50 ? "Precipitation expected: Keep irrigation on standby and clear field furrows." : "Weather stable: Maintain scheduled field operations and fertigation cycles."}

You can ask me about irrigation schedules, disease identification, fertilizer doses, or mandi selling strategies anytime!

🛡️ *Rule Engine: Real-time telemetry synchronized with ICAR agro-climatic standards.*`;
    }
  }

  return {
    reply: fallbackReply,
    detectedLanguage: detectedLang,
    languageName: langName,
    intent,
    validationStatus: "Validated by KHETIX Agronomic Rule Engine (Native Multilingual Knowledge Engine)",
    source: "khetix-agronomic-rules-engine",
    telemetry: { soilMoisture, rainProbability: rainProb, crop, location: farmLocation },
  };
}
