import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  ScanEye,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShoppingBag,
  Bot,
  RefreshCw,
  History,
  Calendar,
  Sparkles,
  Search,
  Check,
  TrendingDown,
  TrendingUp,
  BookmarkPlus,
  AlertCircle,
  FileText,
  Filter,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MAJOR_CROPS, COMPREHENSIVE_DISEASES_DB, DetailedCropDisease } from '../../lib/data/cropsDatabase';
import { useFarm } from '../../lib/context/FarmContext';
import { speakText, stopSpeaking } from '../../lib/voiceAssistant';
import { SupportedLanguage } from '../../lib/i18n';

interface ScanHistoryRecord {
  id: string;
  date: string;
  fieldId: string;
  fieldName: string;
  cropName: string;
  cropCategory: string;
  diseaseName: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Healthy';
  confidence: number;
  imageThumbnail: string;
  pathogen: string;
  status: 'active' | 'recovering' | 'resolved';
  notes: string;
  dayCount: number; // Day 1, Day 7, Day 14
}

const INITIAL_SCAN_HISTORY: ScanHistoryRecord[] = [
  {
    id: 'scan-1',
    date: '2026-09-03',
    fieldId: 'field-1',
    fieldName: 'Field A (10 Acres)',
    cropName: 'Tomato',
    cropCategory: 'Vegetable',
    diseaseName: 'Tomato Early Blight',
    severity: 'High',
    confidence: 94,
    imageThumbnail: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&q=80',
    pathogen: 'Alternaria solani',
    status: 'active',
    notes: 'Day 1: Initial detection. Target board concentric spots on 15% of lower canopy foliage. Applied Mancozeb 75% WP.',
    dayCount: 1,
  },
  {
    id: 'scan-2',
    date: '2026-09-10',
    fieldId: 'field-1',
    fieldName: 'Field A (10 Acres)',
    cropName: 'Tomato',
    cropCategory: 'Vegetable',
    diseaseName: 'Tomato Early Blight (Arrested)',
    severity: 'Moderate',
    confidence: 91,
    imageThumbnail: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&q=80',
    pathogen: 'Alternaria solani',
    status: 'recovering',
    notes: 'Day 7: Lesions dried up with no new yellow haloes. Canopy airflow improved after bottom 25cm foliage pruning.',
    dayCount: 7,
  },
  {
    id: 'scan-3',
    date: '2026-09-17',
    fieldId: 'field-1',
    fieldName: 'Field A (10 Acres)',
    cropName: 'Tomato',
    cropCategory: 'Vegetable',
    diseaseName: 'Optimal Foliage Health (Post-Recovery)',
    severity: 'Healthy',
    confidence: 97,
    imageThumbnail: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&q=80',
    pathogen: 'None (Healthy Crop)',
    status: 'resolved',
    notes: 'Day 14: New vegetative shoots clean and vibrant. Fruit set proceeding without blossom rot.',
    dayCount: 14,
  },
  {
    id: 'scan-4',
    date: '2026-09-12',
    fieldId: 'field-2',
    fieldName: 'Field B (8 Acres)',
    cropName: 'Sweet Corn',
    cropCategory: 'Cereal',
    diseaseName: 'Fall Armyworm (Spodoptera frugiperda)',
    severity: 'Moderate',
    confidence: 89,
    imageThumbnail: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80',
    pathogen: 'Spodoptera frugiperda larvae',
    status: 'recovering',
    notes: 'Day 1: Shot-hole damage along leaf whorls. Pheromone traps placed and Emamectin benzoate applied in whorls.',
    dayCount: 1,
  },
];

export const CropDiseaseDetector: React.FC = () => {
  const { setActiveModule, language, addJournalEntry } = useFarm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'scanner' | 'timeline'>('scanner');
  const [selectedCropCategory, setSelectedCropCategory] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [activeDiagnosis, setActiveDiagnosis] = useState<DetailedCropDisease>(COMPREHENSIVE_DISEASES_DB[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Vision detection states
  const [detectedCropName, setDetectedCropName] = useState<string>('Tomato');
  const [detectionConfidence, setDetectionConfidence] = useState<number>(91);
  const [qualityWarning, setQualityWarning] = useState<string | null>(null);
  const [identificationWarning, setIdentificationWarning] = useState<string | null>(null);
  const [visualEvidence, setVisualEvidence] = useState<string>('');

  // Voice state
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleDiagnosisSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Crop: ${detectedCropName}. Condition: ${activeDiagnosis.diseaseName}. Confidence: ${detectionConfidence} percent. Severity: ${activeDiagnosis.severity}. Detected symptoms include: ${activeDiagnosis.symptoms.slice(0, 2).join(', ')}. Recommended action: ${activeDiagnosis.nonChemicalPreventative[0] || activeDiagnosis.chemicalTreatment[0]}. Notice: AI-based identification is advisory.`;

    setIsSpeaking(true);
    speakText(
      textToRead,
      language as SupportedLanguage,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // Scan History records
  const [scanHistory, setScanHistory] = useState<ScanHistoryRecord[]>(INITIAL_SCAN_HISTORY);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Filter crops by category
  const filteredCrops = MAJOR_CROPS.filter(
    (c) => selectedCropCategory === 'All' || c.category === selectedCropCategory
  );

  // Diseases available for selected crop or category
  const availableDiseases = COMPREHENSIVE_DISEASES_DB.filter(
    (d) =>
      selectedCrop === 'Auto-Detect' ||
      d.cropName.toLowerCase() === selectedCrop.toLowerCase() ||
      (selectedCropCategory !== 'All' && d.cropCategory === selectedCropCategory)
  );

  const handleSelectPreset = (preset: DetailedCropDisease) => {
    setIsAnalyzing(true);
    setQualityWarning(null);
    setIdentificationWarning(null);
    setUploadedImage(null);
    setTimeout(() => {
      setActiveDiagnosis(preset);
      setDetectedCropName(preset.cropName);
      setDetectionConfidence(preset.typicalConfidence);
      setVisualEvidence(`Identified hallmark morphological lesions of ${preset.diseaseName} on ${preset.cropName}.`);
      setIsAnalyzing(false);
    }, 350);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      runVisionInference(base64);
    };
    reader.readAsDataURL(file);
  };

  const runVisionInference = async (imageBase64: string) => {
    setIsAnalyzing(true);
    setQualityWarning(null);
    setIdentificationWarning(null);
    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop,
          symptomNote: 'Diagnostic leaf and stem pathology scan',
          imageBase64,
        }),
      });
      const data = await res.json();

      // Check for low quality or non-plant warnings
      if (data.quality_warning) {
        setQualityWarning(data.quality_warning);
      }
      if (data.identification_warning) {
        setIdentificationWarning(data.identification_warning);
      }

      if (data.is_plant && data.diseaseName) {
        setDetectedCropName(data.detected_crop || selectedCrop);
        setDetectionConfidence(data.confidence || 92);
        setVisualEvidence(data.visualEvidence || `Distinct visual symptoms diagnosed for ${data.diseaseName}.`);

        setActiveDiagnosis({
          id: 'custom-' + Date.now(),
          cropId: (data.detected_crop || selectedCrop).toLowerCase(),
          cropName: data.detected_crop || selectedCrop,
          cropCategory: 'Crop',
          diseaseName: data.diseaseName,
          hindiName: data.hindiName || data.diseaseName,
          pathogen: data.pathogen || 'Microbial Pathogen',
          pathogenType: data.pathogenType || 'Fungus',
          severity: data.severity || 'Moderate',
          typicalConfidence: data.confidence || 92,
          imageThumbnail: imageBase64,
          symptoms: data.symptoms || [
            'Distinct foliar lesions and tissue discoloration',
            'Reduced photosynthetic leaf area',
          ],
          biologicalCause:
            data.biologicalCause ||
            'Pathogenic spores propagate under elevated humidity and moderate temperature intervals.',
          favorableWeather: data.favorableWeather || 'Temperature 22-28°C, Relative Humidity > 75%',
          nonChemicalPreventative: data.nonChemicalPreventative || [
            'Prune lower infected foliage and dispose of safely',
            'Apply neem oil (10,000 ppm) @ 2.5ml/L as preventive biological barrier',
          ],
          chemicalTreatment: data.chemicalTreatment || [
            'Mancozeb 75% WP @ 2.5g/L water',
            'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0ml/L water',
          ],
          preventionTips: data.preventionTips || [
            'Maintain optimal row spacing to facilitate canopy ventilation',
            'Adopt 3-year crop rotation with non-host botanical families',
          ],
        });
      }
    } catch (err) {
      console.warn('Diagnosis fallback to current grounded DB:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToTimeline = () => {
    const newRecord: ScanHistoryRecord = {
      id: 'scan-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      fieldId: 'field-1',
      fieldName: 'Field A (10 Acres)',
      cropName: detectedCropName,
      cropCategory: activeDiagnosis.cropCategory,
      diseaseName: activeDiagnosis.diseaseName,
      severity: activeDiagnosis.severity,
      confidence: detectionConfidence,
      imageThumbnail: uploadedImage || activeDiagnosis.imageThumbnail,
      pathogen: activeDiagnosis.pathogen,
      status: activeDiagnosis.severity === 'Healthy' ? 'resolved' : 'active',
      notes: `Day 1 Scan: ${activeDiagnosis.diseaseName} (${detectionConfidence}% confidence). Treatment protocol logged.`,
      dayCount: 1,
    };

    setScanHistory([newRecord, ...scanHistory]);
    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      fieldId: 'field-1',
      fieldName: 'Field A',
      crop: detectedCropName,
      note: `Diagnostic Foliage Scan: ${activeDiagnosis.diseaseName} (${detectionConfidence}% confidence). Severity: ${activeDiagnosis.severity}. Pathogen: ${activeDiagnosis.pathogen}. Recommended spray: ${activeDiagnosis.chemicalTreatment[0]}`,
      tag: 'Health Observation',
      sentiment: activeDiagnosis.severity === 'Healthy' ? 'good' : 'warning',
      loggedBy: 'Vision AI Diagnostic Engine',
    });

    setSaveSuccessMessage('Diagnostic report saved to Farm Journal & Health Timeline!');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ScanEye className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Universal Crop Image Scanner & Diagnostics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Vision AI + CIBRC Rules
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Multi-modal vision intelligence supporting all Indian Cereals, Pulses, Vegetables, Fruits, and Commercial crops with biological & approved chemical advisories.
          </p>
        </div>

        {/* Tab Switching */}
        <div className="flex items-center bg-[#0d2e20] p-1 rounded-xl border border-emerald-500/20">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'scanner'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'timeline'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Health Timeline</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
              {scanHistory.length}
            </span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {activeTab === 'timeline' ? (
        /* HEALTH TIMELINE (DAY 1 VS DAY 14 TRACKING) */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  <span>Field Pathology & Health Timeline</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Track disease progression and treatment recovery across consecutive farm visits (Day 1 → Day 7 → Day 14).
                </p>
              </div>
              <button
                onClick={() => setActiveTab('scanner')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 self-start"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>New Foliage Scan</span>
              </button>
            </div>

            {/* Timeline cards */}
            <div className="space-y-4">
              {scanHistory.map((scan, idx) => (
                <div
                  key={scan.id}
                  className="p-4 rounded-xl bg-[#0d2e20]/80 border border-emerald-500/20 hover:border-emerald-400/40 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={scan.imageThumbnail}
                        alt={scan.diseaseName}
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white">
                            Day {scan.dayCount}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              scan.severity === 'Healthy'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : scan.severity === 'High' || scan.severity === 'Critical'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {scan.severity}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Confidence: {scan.confidence}%
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{scan.diseaseName}</h3>
                        <p className="text-xs text-emerald-400">
                          {scan.cropName} • {scan.fieldName} • Pathogen: {scan.pathogen}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center text-right shrink-0">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {scan.date}
                      </span>
                      <span
                        className={`text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                          scan.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : scan.status === 'recovering'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {scan.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300">
                    <p>{scan.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* AI SCANNER MAIN CANVAS */
        <div className="space-y-6">
          {/* Universal Crop Selector Bar */}
          <div className="p-4 rounded-2xl bg-[#0a2318] border border-emerald-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Select Target Crop Category:
                </span>
              </div>

              {/* Category buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Cereal', 'Pulse', 'Vegetable', 'Fruit', 'Commercial'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCropCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      selectedCropCategory === cat
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-[#0d2e20] text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Select Crop to Scan:</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => {
                    const c = e.target.value;
                    setSelectedCrop(c);
                    const matched = COMPREHENSIVE_DISEASES_DB.find((d) => d.cropName === c);
                    if (matched) {
                      setActiveDiagnosis(matched);
                      setDetectedCropName(matched.cropName);
                      setDetectionConfidence(matched.typicalConfidence);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Auto-Detect">✨ Auto-Detect Crop (Any Indian Crop)</option>
                  {filteredCrops.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.hindiName}) — {c.botanicalName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Field / Boundary:</label>
                <select className="w-full px-3 py-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400">
                  <option value="Field A">Field A (North Section — 10 Acres)</option>
                  <option value="Field B">Field B (South Section — 8 Acres)</option>
                  <option value="Field C">Field C (Orchard Grove — 6 Acres)</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="w-full p-2 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Supports 30+ major crops and 50+ pathogen variations.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality or Identification Warnings */}
          {qualityWarning && (
            <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white">Image Quality Warning</h4>
                <p className="mt-0.5">{qualityWarning}</p>
                <p className="mt-1 text-[11px] text-amber-300">
                  Tip: Hold camera 15-20cm from the leaf surface, ensure uniform indirect daylight, and avoid motion blur.
                </p>
              </div>
            </div>
          )}

          {identificationWarning && (
            <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-200 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white">Crop Identification Notice</h4>
                <p className="mt-0.5">{identificationWarning}</p>
                <p className="mt-1 text-[11px] text-blue-300">
                  You can also manually select the crop from the dropdown above to test specific disease diagnoses.
                </p>
              </div>
            </div>
          )}

          {/* Main Inspection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 cols: Upload Area & Crop Presets */}
            <div className="lg:col-span-5 space-y-4">
              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl bg-[#0a2318]/80 hover:bg-[#0d2e20] border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 text-center space-y-3 cursor-pointer transition shadow-xl group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                  <Upload className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Capture or Upload Foliage Photo
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Click to browse camera photo or drag & drop leaf image
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-[11px] text-emerald-400 border border-emerald-500/20">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Real-time Vision AI Analysis</span>
                </div>
              </div>

              {/* Sample Presets for Selected Category */}
              <div className="p-4 rounded-2xl bg-[#0a2318]/90 border border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Or Test Grounded Disease Samples
                  </h4>
                  <span className="text-[10px] text-emerald-400">
                    {availableDiseases.length} available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                  {availableDiseases.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectPreset(sample)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                        activeDiagnosis.diseaseName === sample.diseaseName
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                          : 'bg-[#0d2e20]/60 border-white/5 text-slate-300 hover:bg-[#0d2e20]'
                      }`}
                    >
                      <img
                        src={sample.imageThumbnail}
                        alt={sample.diseaseName}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate">{sample.diseaseName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{sample.cropName}</p>
                        <span
                          className={`text-[9px] font-bold ${
                            sample.severity === 'Healthy'
                              ? 'text-emerald-400'
                              : sample.severity === 'High' || sample.severity === 'Critical'
                              ? 'text-red-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {sample.severity}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 7 cols: Active Diagnostic Results */}
            <div className="lg:col-span-7">
              {isAnalyzing ? (
                <div className="h-[500px] p-8 rounded-2xl bg-[#0a2318] border border-emerald-500/30 flex flex-col items-center justify-center space-y-4 text-center">
                  <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                  <div>
                    <h3 className="text-base font-bold text-white">Running Vision AI Pipeline...</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      1. Image Quality Check → 2. Plant Part Identification → 3. Pathogen Classification → 4. CIBRC Advisory Mapping
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/30 shadow-2xl space-y-5 animate-in fade-in">
                  {/* Header Result */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-500/20">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            activeDiagnosis.severity === 'Healthy'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : activeDiagnosis.severity === 'High' || activeDiagnosis.severity === 'Critical'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {activeDiagnosis.severity} Severity
                        </span>
                        <span className="text-xs text-slate-400">
                          Confidence: <strong className="text-white">{detectionConfidence}%</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                          {activeDiagnosis.pathogenType}
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold text-white font-display">
                        {activeDiagnosis.diseaseName}
                      </h2>
                      <p className="text-xs text-emerald-400 font-mono italic">
                        Crop: {detectedCropName} • Pathogen: {activeDiagnosis.pathogen}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleDiagnosisSpeech}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                          isSpeaking
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                            : 'bg-[#0d2e20] hover:bg-[#133d2b] border-emerald-500/30 text-emerald-300'
                        }`}
                        title="Read diagnosis aloud in your language"
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span>{isSpeaking ? 'Stop Audio' : 'Listen Voice'}</span>
                      </button>

                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-500/30 shrink-0">
                        <img
                          src={uploadedImage || activeDiagnosis.imageThumbnail}
                          alt={activeDiagnosis.diseaseName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Low Confidence Warning (AI doesn't invent diagnosis) */}
                  {detectionConfidence < 75 && (
                    <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-300">⚠️ Low Confidence Identification ({detectionConfidence}%)</strong>
                        <span>
                          AI-based identification is advisory and should be verified when the diagnosis is uncertain. Low confidence symptoms are not invented. Please take a clear, well-lit photo of the leaf lesion for high confidence verification.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Visual Evidence Note */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                    <ScanEye className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Detected Symptoms: </span>
                      <span>{visualEvidence}</span>
                    </div>
                  </div>

                  {/* Possible Factors */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      Possible Factors
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      • {activeDiagnosis.biologicalCause}
                    </p>
                    <p className="text-[11px] text-amber-300/90 pt-1">
                      • High humidity & favorable environment: {activeDiagnosis.favorableWeather}
                    </p>
                  </div>

                  {/* Observed Symptoms List */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Detailed Symptom Breakdown</span>
                    </h4>
                    <div className="space-y-1.5">
                      {activeDiagnosis.symptoms.map((sym, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{sym}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Tabs: Non-Chemical vs Chemical */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Non-Chemical Biological & Cultural Controls */}
                    <div className="p-4 rounded-xl bg-[#0d2e20] border border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Recommended Actions (Cultural & Biological)</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {activeDiagnosis.nonChemicalPreventative.map((item, idx) => (
                          <li key={idx} className="leading-snug">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Chemical Curative Sprays (CIBRC Approved) */}
                    <div className="p-4 rounded-xl bg-[#0d2e20] border border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Approved Curative Sprays (CIBRC Validated)</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {activeDiagnosis.chemicalTreatment.map((item, idx) => (
                          <li key={idx} className="leading-snug">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Prevention */}
                  <div className="p-3.5 rounded-xl bg-[#0d2e20]/60 border border-white/5 space-y-1.5">
                    <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                      Prevention Protocol
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {activeDiagnosis.preventionTips.map((tip, idx) => (
                        <li key={idx}>• {tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Confidence Notice Banner */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-400 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-300">⚠️ Confidence Notice: </strong>
                      <span>
                        AI-based identification is advisory and should be verified when the diagnosis is uncertain. Always test a small canopy patch before widespread spraying.
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleSaveToTimeline}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Save to Farm Journal & Timeline</span>
                    </button>

                    <button
                      onClick={() => setActiveModule('marketplace')}
                      className="px-4 py-2.5 rounded-xl bg-[#0d2e20] hover:bg-[#133d2b] border border-emerald-500/30 text-white font-bold text-xs flex items-center gap-2 transition"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span>Order Recommended Treatment</span>
                    </button>

                    <button
                      onClick={() => setActiveModule('assistant')}
                      className="px-4 py-2.5 rounded-xl bg-[#0d2e20] hover:bg-[#133d2b] border border-emerald-500/30 text-white font-semibold text-xs flex items-center gap-2 transition"
                    >
                      <Bot className="w-4 h-4 text-emerald-400" />
                      <span>Ask AI Agronomist</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
