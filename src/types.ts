export interface FieldActivity {
  id: string;
  date: string;
  activityType: 'Sowing' | 'Fertilizer' | 'Irrigation' | 'Spraying' | 'Weeding' | 'Harvest' | 'Scouting';
  notes: string;
  performedBy: string;
  cost?: number;
}

export interface Field {
  id: string;
  name: string;
  acres: number;
  crop: string;
  variety?: string;
  sowingDate: string;
  harvestExpected?: string;
  status?: 'Healthy' | 'Moisture Low' | 'Disease Risk' | 'Harvest Ready' | 'Fallow';
  moisture?: number;
  ndvi?: number; // 0.0 to 1.0
  irrigationType?: 'Drip System' | 'Sprinkler' | 'Canal Furrow';
  valvesOpen?: boolean;
  stage?: string;
  soilMoisture?: number;
  nitrogenLevel?: string;
  phosphorusLevel?: string;
  potassiumLevel?: string;
  ph?: number;
  organicCarbon?: string;
  healthIndex?: number;
  boundaries?: [number, number][];
  previousCrops?: string[];
  activities?: FieldActivity[];
}

export interface FarmDocument {
  id: string;
  title: string;
  category: 'Land Record' | 'Soil Health Card' | 'Kisan Credit' | 'Crop Insurance' | 'Govt Subsidy' | 'Invoice';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  verified: boolean;
  fileUrl?: string;
}

export interface Farm {
  id: string;
  name: string;
  farmerName: string;
  phone?: string;
  kisanId?: string;
  aadhaarHash?: string;
  location: string;
  state: string;
  district?: string;
  taluk?: string;
  village?: string;
  totalAcres: number;
  cultivableAcres?: number;
  irrigatedAcres?: number;
  primaryCrops?: string[];
  primaryCrop?: string;
  soilType: string;
  soilPH?: number;
  soilMoisture: number; // percentage
  rainProbability?: number;
  soilHealthIndex?: number; // 0-100
  cropHealthScore?: number; // 0-100
  sustainabilityIndex?: number; // 0-100
  irrigationType?: 'Drip System' | 'Sprinkler' | 'Canal Furrow' | 'Submersible Borewell';
  fields: Field[];
  documents?: FarmDocument[];
}

export interface WeatherDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain Showers' | 'Heavy Thunderstorm' | 'Overcast';
  rainProbability: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  advisory: string;
}

export interface MandiCommodity {
  id: string;
  name: string;
  hindiName: string;
  variety: string;
  currentPrice: number; // per quintal
  unit: string;
  change24h: number; // percentage
  trend: 'up' | 'down' | 'stable';
  markets: {
    name: string;
    distanceKm: number;
    price: number;
    freightCost: number;
    netRealization: number;
    isBestChoice?: boolean;
  }[];
  history7d: { day: string; price: number }[];
}

export interface CropDisease {
  id: string;
  name: string;
  pathogen: string;
  confidence: number;
  severity: 'High' | 'Moderate' | 'Low' | 'Healthy';
  crop: string;
  imageThumbnail: string;
  symptoms: string[];
  biologicalCause: string;
  nonChemicalPreventative: string[];
  chemicalTreatment: string[];
}

export interface SoilTestResult {
  nitrogen: { value: number; unit: string; optimal: string; status: 'Low' | 'Optimal' | 'High' };
  phosphorus: { value: number; unit: string; optimal: string; status: 'Low' | 'Optimal' | 'High' };
  potassium: { value: number; unit: string; optimal: string; status: 'Low' | 'Optimal' | 'High' };
  organicCarbon: { value: number; unit: string; optimal: string; status: 'Low' | 'Optimal' | 'High' };
  ph: { value: number; optimal: string; status: 'Slightly Acidic' | 'Neutral' | 'Alkaline' };
  ec: { value: number; unit: string; status: 'Normal' };
  micronutrients: {
    zinc: string;
    boron: string;
    iron: string;
    sulfur: string;
  };
  recommendations: string[];
}

export interface LivestockAnimal {
  tagId: string;
  type: 'Cow' | 'Buffalo' | 'Goat';
  breed: string;
  ageYears: number;
  lactationStage: 'Early' | 'Mid' | 'Late' | 'Dry';
  dailyYieldLiters: number;
  lastVaccination: string;
  healthStatus: 'Excellent' | 'Under Monitoring' | 'Needs Checkup';
  milkFatPct: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: 'Seeds' | 'Bio-Fertilizer' | 'Pest Control' | 'Irrigation' | 'Cattle Feed';
  brand: string;
  price: number;
  originalPrice: number;
  mrp?: number;
  unit?: string;
  subsidyEligible: boolean;
  subsidyDiscount: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  image: string;
  description: string;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

export interface SupplyChainBatch {
  id: string;
  batchNumber: string;
  commodity: string;
  grade: 'Grade A Export' | 'Grade B Domestic' | 'Grade C Processing';
  weightQuintals: number;
  harvestDate: string;
  currentStage: 'Harvested' | 'Quality Graded' | 'Order Confirmed' | 'In Cold Transit' | 'Delivered';
  destinationMandi: string;
  buyer: string;
  driverName: string;
  temperatureCelsius: number;
  qrPayload: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  actionModule?: string;
  actionLabel?: string;
  fieldId?: string;
}

export type AppLanguage =
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

export interface UserAccount {
  id: string;
  name: string;
  emailOrPhone: string;
  email?: string;
  phone?: string;
  avatar?: string;
  authProvider?: 'google' | 'local';
  preferredLanguage?: AppLanguage;
  state: string;
  district?: string;
  taluk?: string;
  village?: string;
  kisanId?: string;
  totalAcres?: number;
  primaryCrop?: string;
  createdAt: string;
}

export interface StructuredCropDiagnosis {
  crop: string;
  condition: string;
  confidence: number;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Healthy';
  detectedSymptoms: string[];
  possibleFactors: string[];
  recommendedActions: string[];
  prevention: string[];
  confidenceNotice: string;
  qualityStatus: 'good' | 'blurry' | 'non_plant' | 'low_confidence';
  qualityWarning?: string;
}

export interface TodayFarmPlanItem {
  id: string;
  priority: number;
  category: 'irrigation' | 'scout' | 'fertilizer' | 'market' | 'harvest' | 'weather';
  icon: string;
  title: string;
  description: string;
  actionText: string;
  actionModule: string;
  status: 'pending' | 'completed';
  urgency: 'high' | 'medium' | 'low';
}

export interface FarmCalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  fieldId: string;
  fieldName: string;
  type: 'Sowing' | 'Fertilizer' | 'Irrigation' | 'Spraying' | 'Weeding' | 'Harvest' | 'Alert';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  autoScheduled: boolean;
  notes?: string;
  assignedTo?: string;
}

export interface CropStageInfo {
  id: string;
  stageName: 'Seed' | 'Sowing' | 'Growing' | 'Flowering' | 'Fruit' | 'Harvest';
  durationDays: number;
  currentDay: number;
  status: 'completed' | 'active' | 'upcoming';
  requiredNutrients: { name: string; dosage: string; frequency: string }[];
  irrigationGuidance: string;
  diseaseRisks: { name: string; severity: 'High' | 'Medium' | 'Low'; precaution: string }[];
  expectedYieldProgress: string;
  stageTasks: { id: string; title: string; completed: boolean }[];
}

export interface FertilizerCalculation {
  crop: string;
  acres: number;
  soilNPK: { n: number; p: number; k: number };
  targetNPK: { n: number; p: number; k: number };
  deficitNPK: { n: number; p: number; k: number };
  recommendedBags: {
    fertilizerName: string;
    bags: number;
    bagWeightKg: number;
    estimatedCost: number;
    applicationStage: 'Basal (Sowing)' | 'Vegetative Top-dress' | 'Flowering Top-dress';
  }[];
  totalEstimatedCost: number;
  applicationSchedule: { stage: string; instruction: string; daysFromSowing: number }[];
}

export interface PestRiskAssessment {
  id: string;
  crop: string;
  stage: string;
  pestOrDisease: string;
  riskLevel: 'High' | 'Moderate' | 'Low';
  weatherTriggers: string;
  symptoms: string[];
  preventativeActions: string[];
  organicRemedy: string;
  chemicalRemedy: string;
}

export interface IrrigationCalculation {
  crop: string;
  areaAcres: number;
  soilMoisturePct: number;
  irrigationType: 'Drip System' | 'Sprinkler' | 'Canal Furrow';
  recommendedWaterLitres: number;
  runTimeMinutes: number;
  nextIrrigationDateTime: string;
  rainInterlockActive: boolean;
  notes: string;
}

export interface HarvestPlan {
  crop: string;
  fieldId: string;
  fieldName: string;
  expectedYieldQuintals: number;
  estimatedHarvestDate: string;
  targetMandis: {
    mandiName: string;
    distanceKm: number;
    pricePerQuintal: number;
    freightCost: number;
    cessCost: number;
    netRealization: number;
    isBestOption?: boolean;
  }[];
  sellingChannels: {
    channel: 'Direct Mandi Auction' | 'FPO Collective Pool' | 'Direct Food Processor Contract';
    expectedRate: number;
    paymentCycleDays: number;
    recommended: boolean;
  }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizer' | 'Pesticides' | 'Feed' | 'Equipment';
  quantity: number;
  unit: string;
  minThreshold: number;
  unitCost: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  batchNumber?: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'Seeds' | 'Fertilizer' | 'Labour' | 'Transport' | 'Irrigation/Power' | 'Pesticides' | 'Equipment Rent' | 'Seeds & Chemicals' | 'Other';
  amount: number;
  fieldId?: string;
  fieldName?: string;
  note?: string;
  description?: string;
  paidTo?: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'KCC Card' | string;
}

export interface LabourWorker {
  id: string;
  name: string;
  role: 'General Farmhand' | 'Tractor Operator' | 'Drip Specialist' | 'Harvester' | 'Pruning Expert';
  dailyWage: number;
  phone: string;
  attendanceStatus: 'Present' | 'Absent' | 'Half Day';
  assignedField: string;
  assignedTask: string;
  wagesPending: number;
  wagesPaidThisMonth: number;
}

export interface FarmJournalEntry {
  id: string;
  date: string;
  fieldId: string;
  fieldName: string;
  crop: string;
  note: string;
  imageUrl?: string;
  tag: 'Health Observation' | 'Pest Spotted' | 'Fertilizer Note' | 'Harvest Log' | 'General';
  sentiment: 'good' | 'warning' | 'critical';
  loggedBy: string;
}

export interface YieldPrediction {
  crop: string;
  variety: string;
  acres: number;
  soilType: string;
  healthScore: number;
  predictedQuintalsPerAcre: number;
  totalPredictedQuintals: number;
  estimatedGrossRevenue: number;
  pastHistoricalAverageQuintals: number;
  actualHarvestQuintals?: number;
  accuracyRate?: number;
}
