export interface TranslationSet {
  welcome: string;
  goodMorning: string;
  activeTelemetry: string;
  totalAcres: string;
  primaryCrops: string;
  todayFarmStatus: string;
  cropHealthy: string;
  irrigationWait: string;
  rainTomorrow: string;
  tomatoRate: string;
  todayFarmPlan: string;
  todayFarmPlanSubtitle: string;
  todayTasks: string;
  scanLeaf: string;
  logIrrigation: string;
  checkMandi: string;
  askAi: string;
  markDone: string;
  completed: string;
  pending: string;
  urgent: string;
  navDashboard: string;
  navFarmerProfile: string;
  navFarmManagement: string;
  navCalendar: string;
  navCropLifecycle: string;
  navFertilizerCalc: string;
  navPestAlerts: string;
  navIrrigationCalc: string;
  navHarvestPlanner: string;
  navInventory: string;
  navExpenses: string;
  navLabour: string;
  navJournal: string;
  navYieldPrediction: string;
  navDocuments: string;
  navAiAdvisor: string;
}

export const TRANSLATIONS: Record<string, TranslationSet> = {
  en: {
    welcome: 'Welcome',
    goodMorning: 'Good Morning',
    activeTelemetry: 'Active Telemetry',
    totalAcres: 'Total Acres',
    primaryCrops: 'Primary Crops',
    todayFarmStatus: "Today's Farm Status",
    cropHealthy: 'Crop Healthy (92%)',
    irrigationWait: 'Irrigation: Wait',
    rainTomorrow: 'Rain: Tomorrow (72%)',
    tomatoRate: 'Tomato: ₹2,450/q',
    todayFarmPlan: "WHAT SHOULD I DO TODAY? (TODAY'S FARM PLAN)",
    todayFarmPlanSubtitle: 'KHETIX agronomic engine analyzed your soil, weather forecast, and market rates to generate 4 priority actions.',
    todayTasks: "Today's Farm Tasks",
    scanLeaf: 'Scan Leaf AI',
    logIrrigation: 'Smart Irrigation',
    checkMandi: 'Mandi Rates',
    askAi: 'Ask AI Advisor',
    markDone: 'Mark Done',
    completed: 'Completed',
    pending: 'Pending',
    urgent: 'Urgent',
    navDashboard: 'Dashboard',
    navFarmerProfile: 'Farmer Profile',
    navFarmManagement: 'Farms & Fields',
    navCalendar: 'Farm Calendar',
    navCropLifecycle: 'Crop Lifecycle',
    navFertilizerCalc: 'Fertilizer Calculator',
    navPestAlerts: 'Pest & Disease Alerts',
    navIrrigationCalc: 'Irrigation Calculator',
    navHarvestPlanner: 'Harvest & Selling Planner',
    navInventory: 'Farm Inventory',
    navExpenses: 'Expense & P&L',
    navLabour: 'Labour Management',
    navJournal: 'Farm Journal',
    navYieldPrediction: 'Yield Prediction',
    navDocuments: 'Document Vault',
    navAiAdvisor: 'AI Farm Advisor',
  },
  hi: {
    welcome: 'स्वागत है',
    goodMorning: 'शुभ प्रभात',
    activeTelemetry: 'सक्रिय टेलीमेट्री',
    totalAcres: 'कुल एकड़',
    primaryCrops: 'मुख्य फसलें',
    todayFarmStatus: 'आज का खेत समाचार (Today’s Farm Status)',
    cropHealthy: 'फसल स्वस्थ (92%)',
    irrigationWait: 'सिंचाई: रुकें',
    rainTomorrow: 'बारिश: कल (72%)',
    tomatoRate: 'टमाटर: ₹2,450/क्विंटल',
    todayFarmPlan: 'आज मुझे क्या करना चाहिए? (TODAY’S FARM PLAN)',
    todayFarmPlanSubtitle: 'KHETIX कृषि इंजन ने आपकी मिट्टी, मौसम पूर्वानुमान और मंडी भाव का विश्लेषण करके 4 प्राथमिकता वाले कार्य तैयार किए हैं।',
    todayTasks: 'आज के कृषि कार्य (Tasks)',
    scanLeaf: 'पत्ती रोग स्कैन करें',
    logIrrigation: 'स्मार्ट सिंचाई',
    checkMandi: 'मंडी भाव',
    askAi: 'AI कृषि सलाहकार से पूछें',
    markDone: 'पूर्ण करें',
    completed: 'संपन्न',
    pending: 'बाकी',
    urgent: 'अति आवश्यक',
    navDashboard: 'डैशबोर्ड',
    navFarmerProfile: 'किसान प्रोफाइल',
    navFarmManagement: 'खेत और प्लॉट प्रबंधन',
    navCalendar: 'कृषि कैलेंडर',
    navCropLifecycle: 'फसल जीवनचक्र ट्रैकिंग',
    navFertilizerCalc: 'खाद कैलकुलेटर',
    navPestAlerts: 'कीट एवं रोग अलर्ट',
    navIrrigationCalc: 'सिंचाई कैलकुलेटर',
    navHarvestPlanner: 'कटाई एवं बिक्री प्लानर',
    navInventory: 'स्टॉक / इन्वेंटरी',
    navExpenses: 'खर्च एवं मुनाफा ट्रैकिंग',
    navLabour: 'मजदूर प्रबंधन व हाजिरी',
    navJournal: 'खेत डायरी (जर्नल)',
    navYieldPrediction: 'उपज पूर्व-अनुमान',
    navDocuments: 'दस्तावेज़ वॉल्ट (7/12, पर्चे)',
    navAiAdvisor: 'AI कृषि मित्र',
  },
  kn: {
    welcome: 'ಸ್ವಾಗತ',
    goodMorning: 'ಶುಭೋದಯ',
    activeTelemetry: 'ಸಕ್ರಿಯ ಟೆಲಿಮೆಟ್ರಿ',
    totalAcres: 'ಒಟ್ಟು ಎಕರೆ',
    primaryCrops: 'ಪ್ರಮುಖ ಬೆಳೆಗಳು',
    todayFarmStatus: 'ಇಂದಿನ ಕೃಷಿ ಸ್ಥಿತಿ (Today’s Farm Status)',
    cropHealthy: 'ಬೆಳೆ ಆರೋಗ್ಯಕರ (92%)',
    irrigationWait: 'ನೀರಾವರಿ: ನಿಲ್ಲಿಸಿ',
    rainTomorrow: 'ಮಳೆ: ನಾಳೆ (72%)',
    tomatoRate: 'ಟೊಮೆಟೊ: ₹2,450/ಕ್ವಿಂಟಾಲ್',
    todayFarmPlan: 'ಇಂದು ನಾನು ಏನು ಮಾಡಬೇಕು? (TODAY’S FARM PLAN)',
    todayFarmPlanSubtitle: 'KHETIX ಇಂಜಿನ್ ಮಣ್ಣು, ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ 4 ಪ್ರಮುಖ ಕ್ರಮಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿದೆ.',
    todayTasks: 'ಇಂದಿನ ಕೃಷಿ ಕೆಲಸಗಳು',
    scanLeaf: 'ಎಲೆ ರೋಗ ಪರೀಕ್ಷೆ',
    logIrrigation: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ',
    checkMandi: 'ಮಾರುಕಟ್ಟೆ ದರಗಳು',
    askAi: 'AI ಸಲಹೆಗಾರರನ್ನು ಕೇಳಿ',
    markDone: 'ಪೂರ್ಣಗೊಳಿಸಿ',
    completed: 'ಮುಕ್ತಾಯ',
    pending: 'ಬಾಕಿ',
    urgent: 'ತುರ್ತು',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navFarmerProfile: 'ರೈತ ಪ್ರೊಫೈಲ್',
    navFarmManagement: 'ಹೊಲಗಳು ಮತ್ತು ಕ್ಷೇತ್ರಗಳು',
    navCalendar: 'ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್',
    navCropLifecycle: 'ಬೆಳೆ ಜೀವನಚಕ್ರ',
    navFertilizerCalc: 'ಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    navPestAlerts: 'ಕೀಟ ಮತ್ತು ರೋಗ ಎಚ್ಚರಿಕೆ',
    navIrrigationCalc: 'ನೀರಾವರಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    navHarvestPlanner: 'ಸುಗ್ಗಿ & ಮಾರಾಟ ಯೋಜನೆ',
    navInventory: 'ದಾಸ್ತಾನು ನಿರ್ವಹಣೆ',
    navExpenses: 'ವೆಚ್ಚ & ಲಾಭ ಟ್ರ್ಯಾಕಿಂಗ್',
    navLabour: 'ಕಾರ್ಮಿಕರ ನಿರ್ವಹಣೆ',
    navJournal: 'ಕೃಷಿ ಡೈರಿ (ಜರ್ನಲ್)',
    navYieldPrediction: 'ಇಳುವರಿ ಅಂದಾಜು',
    navDocuments: 'ದಾಖಲೆಗಳ ವಾಲ್ಟ್',
    navAiAdvisor: 'AI ಕೃಷಿ ಸಲಹೆಗಾರ',
  },
  hinglish: {
    welcome: 'Swagat Hai',
    goodMorning: 'Good Morning',
    activeTelemetry: 'Active Live Data',
    totalAcres: 'Total Zameen (Acres)',
    primaryCrops: 'Main Phaslein',
    todayFarmStatus: "Aaj Ka Farm Status (Today's Status)",
    cropHealthy: 'Fasal Healthy (92%)',
    irrigationWait: 'Sinchai: Ruko (Wait)',
    rainTomorrow: 'Baarish: Kal (72%)',
    tomatoRate: 'Tamatar: ₹2,450/q',
    todayFarmPlan: 'AAJ MUJHE KYA KARNA CHAHIYE? (TODAY’S FARM PLAN)',
    todayFarmPlanSubtitle: 'KHETIX Engine ne live mitti, weather forecast aur mandi bhav analyze karke 4 priority actions tay kiye hain.',
    todayTasks: 'Aaj Ke Farm Tasks',
    scanLeaf: 'Patti Scan Karein (AI)',
    logIrrigation: 'Smart Sinchai',
    checkMandi: 'Mandi Bhav',
    askAi: 'AI Salahkar Se Poochein',
    markDone: 'Done Karein',
    completed: 'Complete Hua',
    pending: 'Pending Hai',
    urgent: 'Zaroori (Urgent)',
    navDashboard: 'Dashboard',
    navFarmerProfile: 'Farmer Profile',
    navFarmManagement: 'Farms & Fields',
    navCalendar: 'Farm Calendar',
    navCropLifecycle: 'Crop Lifecycle Tracker',
    navFertilizerCalc: 'Fertilizer Calculator (Khad)',
    navPestAlerts: 'Keede Aur Bimari Alerts',
    navIrrigationCalc: 'Sinchai Calculator',
    navHarvestPlanner: 'Harvest & Mandi Planner',
    navInventory: 'Inventory (Stock)',
    navExpenses: 'Kharcha & Munafa (P&L)',
    navLabour: 'Labour & Majdoor Attendance',
    navJournal: 'Farm Photo Journal',
    navYieldPrediction: 'Yield Prediction (Upaj)',
    navDocuments: 'Document Vault (7/12 & Bills)',
    navAiAdvisor: 'AI Agri Advisor',
  },
};
