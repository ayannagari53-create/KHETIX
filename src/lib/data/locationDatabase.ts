export interface StateLocationInfo {
  stateCode: string;
  stateName: string;
  hindiName: string;
  agroZone: string;
  primarySoilType: string;
  soilPHRange: string;
  organicCarbonAvg: string;
  suitableCrops: string[];
  stateSchemes: { name: string; benefit: string; eligibleAcreage: string }[];
  districts: DistrictLocationInfo[];
}

export interface DistrictLocationInfo {
  districtName: string;
  hindiName: string;
  latitude: number;
  longitude: number;
  prominentMandis: { name: string; distanceKm: number; primaryCommodities: string[] }[];
  taluks: string[];
}

export interface LocationProfile {
  country: string;
  state: string;
  district: string;
  taluk: string;
  villageOrFarm: string;
  latitude: number;
  longitude: number;
  agroZone: string;
  regionalSoil: {
    soilType: string;
    phRange: string;
    organicCarbon: string;
    texture: string;
    drainage: string;
  };
  suitableCrops: string[];
  nearbyMandis: { name: string; distanceKm: number; primaryCommodities: string[] }[];
  governmentSchemes: { name: string; type: 'Central' | 'State'; benefit: string }[];
  localCropRisks: { crop: string; risk: string; season: string }[];
}

export const CENTRAL_SCHEMES = [
  {
    name: 'PM-KISAN Samman Nidhi',
    type: 'Central' as const,
    benefit: '₹6,000 per year direct income support paid in three equal instalments of ₹2,000',
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    type: 'Central' as const,
    benefit: 'Comprehensive crop insurance at low farmer premium: 2% for Kharif, 1.5% for Rabi, 5% for Horticulture',
  },
  {
    name: 'Kisan Credit Card (KCC) Interest Subvention',
    type: 'Central' as const,
    benefit: 'Institutional credit up to ₹3 Lakh at effective 4% interest rate upon prompt repayment',
  },
  {
    name: 'Per Drop More Crop (PMKSY)',
    type: 'Central' as const,
    benefit: 'Up to 55% subsidy for small & marginal farmers on drip & sprinkler micro-irrigation systems',
  },
  {
    name: 'Soil Health Card Scheme',
    type: 'Central' as const,
    benefit: 'Free geo-referenced soil testing across 12 chemical & physical parameters every 2 years',
  },
];

export const INDIAN_STATES_DB: StateLocationInfo[] = [
  {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    agroZone: 'Western Plateau & Hills / Konkan Coastal',
    primarySoilType: 'Black Cotton Soil (Regur Vertisol) & Red Sandy Loam',
    soilPHRange: '6.8 - 8.2',
    organicCarbonAvg: '0.65% (Medium)',
    suitableCrops: ['Soybean', 'Cotton', 'Sugarcane', 'Tomato', 'Grapes', 'Pomegranate', 'Onion', 'Chilli', 'Pigeon Pea'],
    stateSchemes: [
      {
        name: 'Namo Shetkari Mahasanman Nidhi Yojana',
        benefit: 'Additional ₹6,000 / year state cash assistance matching PM-Kisan (Total ₹12,000)',
        eligibleAcreage: 'All landholding farmers registered on MahaDBT',
      },
      {
        name: 'Mahatma Jyotirao Phule Shetkari Karjmukti Yojana',
        benefit: 'Crop loan debt waiver up to ₹2 Lakh for eligible institutional crop borrowings',
        eligibleAcreage: 'Small & Marginal farmers with eligible loans',
      },
      {
        name: 'Dr. Babasaheb Ambedkar Krushi Swavalamban Yojana',
        benefit: '100% subsidy for new borewells, farm ponds, and solar pump sets for SC/ST cultivators',
        eligibleAcreage: 'Up to 6 Acres',
      },
    ],
    districts: [
      {
        districtName: 'Nashik',
        hindiName: 'नासिक',
        latitude: 19.9975,
        longitude: 73.7898,
        prominentMandis: [
          { name: 'Nashik APMC (Panchavati)', distanceKm: 8, primaryCommodities: ['Tomato', 'Onion', 'Grapes', 'Vegetables'] },
          { name: 'Lasalgaon Mandi (Asia Largest Onion Market)', distanceKm: 58, primaryCommodities: ['Onion', 'Soybean', 'Wheat'] },
          { name: 'Pimpalgaon Baswant APMC', distanceKm: 32, primaryCommodities: ['Tomato', 'Grapes', 'Pomegranate'] },
        ],
        taluks: ['Nashik', 'Niphad', 'Sinnar', 'Dindori', 'Yeola', 'Kalwan', 'Chandwad', 'Malegaon', 'Baglan (Satana)', 'Trimbak', 'Igatpuri'],
      },
      {
        districtName: 'Pune',
        hindiName: 'पुणे',
        latitude: 18.5204,
        longitude: 73.8567,
        prominentMandis: [
          { name: 'Gultekdi Market Yard (Pune)', distanceKm: 12, primaryCommodities: ['Fruits', 'Vegetables', 'Flowers', 'Grains'] },
          { name: 'Narayangaon APMC', distanceKm: 74, primaryCommodities: ['Tomato', 'Pomegranate', 'Capsicum'] },
          { name: 'Baramati APMC', distanceKm: 98, primaryCommodities: ['Sugarcane', 'Soybean', 'Wheat'] },
        ],
        taluks: ['Haveli', 'Baramati', 'Junnar', 'Shirur', 'Khed', 'Indapur', 'Daund', 'Purandar', 'Bhor', 'Maval', 'Mulshi'],
      },
      {
        districtName: 'Ahmednagar',
        hindiName: 'अहमदनगर',
        latitude: 19.0948,
        longitude: 74.748,
        prominentMandis: [
          { name: 'Ahmednagar APMC', distanceKm: 10, primaryCommodities: ['Soybean', 'Bajra', 'Jowar', 'Onion'] },
          { name: 'Sangamner APMC', distanceKm: 65, primaryCommodities: ['Pomegranate', 'Milk/Dairy', 'Tomato'] },
          { name: 'Rahata (Shirdi) APMC', distanceKm: 82, primaryCommodities: ['Guava', 'Sugarcane', 'Vegetables'] },
        ],
        taluks: ['Nagar', 'Sangamner', 'Rahuri', 'Shrirampur', 'Kopargaon', 'Newasa', 'Parner', 'Pathardi', 'Shevgaon', 'Akole'],
      },
      {
        districtName: 'Nagpur',
        hindiName: 'नागपुर',
        latitude: 21.1458,
        longitude: 79.0882,
        prominentMandis: [
          { name: 'Nagpur Cotton & Orange Terminal APMC', distanceKm: 14, primaryCommodities: ['Orange (Santra)', 'Cotton', 'Soybean'] },
          { name: 'Kalmeshwar Mandi', distanceKm: 24, primaryCommodities: ['Orange', 'Vegetables', 'Wheat'] },
        ],
        taluks: ['Nagpur Urban', 'Nagpur Rural', 'Katol', 'Kalmeshwar', 'Savner', 'Ramtek', 'Umred', 'Narkhed', 'Hingna'],
      },
      {
        districtName: 'Kolhapur',
        hindiName: 'कोल्हापुर',
        latitude: 16.705,
        longitude: 74.2433,
        prominentMandis: [
          { name: 'Kolhapur APMC (Shahupuri)', distanceKm: 6, primaryCommodities: ['Jaggery (Gur)', 'Sugarcane', 'Soybean', 'Rice'] },
          { name: 'Gadhinglaj APMC', distanceKm: 65, primaryCommodities: ['Chillies', 'Groundnut'] },
        ],
        taluks: ['Karvir', 'Hatkanangle', 'Shirol', 'Panhala', 'Shahuwadi', 'Radhanagari', 'Kagal', 'Gadhinglaj', 'Bhudargad', 'Chandgad'],
      },
      {
        districtName: 'Latur',
        hindiName: 'लातूर',
        latitude: 18.4088,
        longitude: 76.5604,
        prominentMandis: [
          { name: 'Latur Pulse & Oilseed APMC (National Benchmark)', distanceKm: 8, primaryCommodities: ['Soybean', 'Pigeon Pea (Tur)', 'Gram (Chana)'] },
        ],
        taluks: ['Latur', 'Ausa', 'Nilanga', 'Udgir', 'Renapur', 'Chakur', 'Shirur Anantpal', 'Deoni', 'Jalkot'],
      },
    ],
  },
  {
    stateCode: 'KA',
    stateName: 'Karnataka',
    hindiName: 'कर्नाटक',
    agroZone: 'Southern Plateau & Hills / Coastal Plains',
    primarySoilType: 'Red Loam & Sandy Clay (Laterite in coastal belts)',
    soilPHRange: '5.8 - 7.2',
    organicCarbonAvg: '0.72% (Medium to High)',
    suitableCrops: ['Rice', 'Maize', 'Finger Millet (Ragi)', 'Sugarcane', 'Cotton', 'Coffee', 'Arecanut', 'Pomegranate', 'Tomato'],
    stateSchemes: [
      {
        name: 'Raitha Siri Scheme',
        benefit: '₹10,000 per hectare financial incentive for cultivating nutrient-rich millets (Ragi, Jowar, Bajra)',
        eligibleAcreage: 'Up to 2 Hectares per farmer',
      },
      {
        name: 'Ksheera Dhare Dairy Subsidy',
        benefit: '₹5 per liter direct bank transfer incentive for milk poured at KMF dairy cooperatives',
        eligibleAcreage: 'All registered dairy farmers',
      },
      {
        name: 'Krishi Bhagya Scheme',
        benefit: '80-90% subsidy for farm ponds with polythene lining and diesel/solar lift pumps',
        eligibleAcreage: 'Dryland rainfed farmers',
      },
    ],
    districts: [
      {
        districtName: 'Bengaluru Rural',
        hindiName: 'बेंगलुरु ग्रामीण',
        latitude: 13.2284,
        longitude: 77.5815,
        prominentMandis: [
          { name: 'Yeshwantpur APMC (Bengaluru)', distanceKm: 26, primaryCommodities: ['Tomato', 'Grapes', 'Vegetables', 'Flowers'] },
          { name: 'Doddaballapur APMC', distanceKm: 15, primaryCommodities: ['Maize', 'Ragi', 'Vegetables'] },
        ],
        taluks: ['Doddaballapur', 'Devanahalli', 'Nelamangala', 'Hosakote'],
      },
      {
        districtName: 'Kolar',
        hindiName: 'कोलार',
        latitude: 13.1367,
        longitude: 78.1291,
        prominentMandis: [
          { name: 'Kolar APMC (Asia 2nd Largest Tomato Market)', distanceKm: 6, primaryCommodities: ['Tomato', 'Mango', 'Chilli', 'Vegetables'] },
          { name: 'Malur Mandi', distanceKm: 28, primaryCommodities: ['Vegetables', 'Carrot', 'Cabbage'] },
        ],
        taluks: ['Kolar', 'Bangarapet', 'Malur', 'Mulbagal', 'Srinivaspur'],
      },
      {
        districtName: 'Belagavi',
        hindiName: 'बेलगावी',
        latitude: 15.8497,
        longitude: 74.4977,
        prominentMandis: [
          { name: 'Belagavi APMC', distanceKm: 7, primaryCommodities: ['Sugarcane', 'Soybean', 'Vegetables', 'Maize'] },
          { name: 'Athani APMC', distanceKm: 110, primaryCommodities: ['Grapes', 'Sugarcane', 'Cotton'] },
        ],
        taluks: ['Belagavi', 'Athani', 'Bailhongal', 'Chikkodi', 'Gokak', 'Hukkeri', 'Khanapur', 'Raybag', 'Ramdurg', 'Saundatti'],
      },
      {
        districtName: 'Shivamogga',
        hindiName: 'शिवमोग्गा',
        latitude: 13.9299,
        longitude: 75.5681,
        prominentMandis: [
          { name: 'Shivamogga APMC', distanceKm: 8, primaryCommodities: ['Arecanut (Supari)', 'Paddy', 'Ginger', 'Maize'] },
        ],
        taluks: ['Shivamogga', 'Bhadravati', 'Thirthahalli', 'Sagar', 'Shikaripura', 'Soraba', 'Hosanagara'],
      },
    ],
  },
  {
    stateCode: 'PB',
    stateName: 'Punjab',
    hindiName: 'पंजाब',
    agroZone: 'Trans-Gangetic Plain Region',
    primarySoilType: 'Deep Indo-Gangetic Alluvial Loam (High Fertility)',
    soilPHRange: '7.2 - 8.4',
    organicCarbonAvg: '0.45% (Low due to intensive cropping)',
    suitableCrops: ['Wheat', 'Rice (Basmati)', 'Cotton', 'Maize', 'Potato', 'Mustard', 'Sugarcane', 'Kinnow (Citrus)'],
    stateSchemes: [
      {
        name: 'Punjab Crop Diversification Mission',
        benefit: '₹7,000 per acre incentive to shift from water-guzzling Paddy to Maize, Cotton, or Pulses',
        eligibleAcreage: 'All irrigated farm holdings',
      },
      {
        name: 'Direct Seeding of Rice (DSR) Incentive',
        benefit: '₹1,500 per acre DBT assistance to farmers adopting water-conserving DSR methodology',
        eligibleAcreage: 'Paddy farmers verified via satellite',
      },
      {
        name: 'CRM Crop Residue Machinery Subsidy',
        benefit: '50% individual & 80% custom hiring center subsidy on Happy Seeder, Super Seeder, and Mulchers',
        eligibleAcreage: 'Farmers committed to zero stubble burning',
      },
    ],
    districts: [
      {
        districtName: 'Ludhiana',
        hindiName: 'लुधियाना',
        latitude: 30.901,
        longitude: 75.8573,
        prominentMandis: [
          { name: 'Khanna Grain Market (Asia Largest Grain Mandi)', distanceKm: 42, primaryCommodities: ['Wheat', 'Paddy', 'Basmati Rice', 'Maize'] },
          { name: 'Ludhiana Dana Mandi (Gill Road)', distanceKm: 8, primaryCommodities: ['Wheat', 'Potato', 'Vegetables'] },
          { name: 'Jagraon Mandi', distanceKm: 38, primaryCommodities: ['Paddy', 'Wheat', 'Mustard'] },
        ],
        taluks: ['Ludhiana East', 'Ludhiana West', 'Jagraon', 'Khanna', 'Samrala', 'Payal', 'Raikot'],
      },
      {
        districtName: 'Amritsar',
        hindiName: 'अमृतसर',
        latitude: 31.634,
        longitude: 74.8723,
        prominentMandis: [
          { name: 'Bhagtanwala Dana Mandi', distanceKm: 6, primaryCommodities: ['Basmati Rice (1121, 1509)', 'Wheat'] },
          { name: 'Rayya APMC', distanceKm: 35, primaryCommodities: ['Paddy', 'Wheat'] },
        ],
        taluks: ['Amritsar-I', 'Amritsar-II', 'Ajnala', 'Baba Bakrala', 'Majitha'],
      },
      {
        districtName: 'Bathinda',
        hindiName: 'बठिंडा',
        latitude: 30.211,
        longitude: 74.9455,
        prominentMandis: [
          { name: 'Bathinda Cotton & Grain Market', distanceKm: 5, primaryCommodities: ['Bt Cotton', 'Wheat', 'Mustard'] },
          { name: 'Rampura Phul APMC', distanceKm: 32, primaryCommodities: ['Wheat', 'Cotton', 'Paddy'] },
        ],
        taluks: ['Bathinda', 'Rampura Phul', 'Talwandi Sabo', 'Maur'],
      },
      {
        districtName: 'Jalandhar',
        hindiName: 'जालंधर',
        latitude: 31.326,
        longitude: 75.5762,
        prominentMandis: [
          { name: 'Jalandhar Cantt Vegetable & Potato Market', distanceKm: 9, primaryCommodities: ['Seed Potato', 'Vegetables', 'Wheat'] },
          { name: 'Shahkot APMC', distanceKm: 45, primaryCommodities: ['Paddy', 'Maize', 'Potato'] },
        ],
        taluks: ['Jalandhar-I', 'Jalandhar-II', 'Nakodar', 'Phillaur', 'Shahkot'],
      },
    ],
  },
  {
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    agroZone: 'Upper & Middle Gangetic Plain',
    primarySoilType: 'Rich Alluvial Silt Loam & Gangetic Sandy Loam',
    soilPHRange: '6.5 - 7.8',
    organicCarbonAvg: '0.55% (Moderate)',
    suitableCrops: ['Wheat', 'Rice', 'Sugarcane', 'Potato', 'Mustard', 'Mango', 'Chilli', 'Pigeon Pea', 'Maize'],
    stateSchemes: [
      {
        name: 'Mukhyamantri Krishak Durghatna Kalyan Yojana',
        benefit: '₹5 Lakh financial assistance to farmer families in event of accidental demise/disability during farm operations',
        eligibleAcreage: 'All farmers, sharecroppers, and farm labourers',
      },
      {
        name: 'UP Free Solar Tubewell Yojana (Kusum C)',
        benefit: '100% free electricity and solar pump conversion for agricultural tubewells',
        eligibleAcreage: 'Farmers with registered agricultural borewells',
      },
    ],
    districts: [
      {
        districtName: 'Agra',
        hindiName: 'आगरा',
        latitude: 27.1767,
        longitude: 78.0081,
        prominentMandis: [
          { name: 'Agra Wholesale Potato Mandi (Khandari)', distanceKm: 7, primaryCommodities: ['Potato', 'Mustard', 'Wheat'] },
          { name: 'Fatehabad APMC', distanceKm: 35, primaryCommodities: ['Bajra', 'Mustard', 'Potato'] },
        ],
        taluks: ['Agra', 'Fatehabad', 'Kheragarh', 'Etmadpur', 'Bah', 'Kiraoli'],
      },
      {
        districtName: 'Varanasi',
        hindiName: 'वाराणसी',
        latitude: 25.3176,
        longitude: 82.9739,
        prominentMandis: [
          { name: 'Panchkroshi Mandi (Varanasi)', distanceKm: 11, primaryCommodities: ['Rice', 'Vegetables', 'Mango (Langra)', 'Wheat'] },
        ],
        taluks: ['Varanasi', 'Pindra', 'Raja Talab'],
      },
      {
        districtName: 'Meerut',
        hindiName: 'मेरठ',
        latitude: 28.9845,
        longitude: 77.7064,
        prominentMandis: [
          { name: 'Meerut Mandi (Delhi Road)', distanceKm: 9, primaryCommodities: ['Sugarcane', 'Gur/Khandsari', 'Wheat', 'Vegetables'] },
          { name: 'Mawana APMC', distanceKm: 28, primaryCommodities: ['Sugarcane', 'Rice'] },
        ],
        taluks: ['Meerut', 'Mawana', 'Sardhana'],
      },
      {
        districtName: 'Bareilly',
        hindiName: 'बरेली',
        latitude: 28.367,
        longitude: 79.4304,
        prominentMandis: [
          { name: 'Bareilly Grain Mandi (Subhash Nagar)', distanceKm: 6, primaryCommodities: ['Wheat', 'Rice', 'Mentha Oil', 'Sugarcane'] },
        ],
        taluks: ['Bareilly', 'Aonla', 'Baheri', 'Faridpur', 'Meerganj', 'Nawabganj'],
      },
    ],
  },
  {
    stateCode: 'GJ',
    stateName: 'Gujarat',
    hindiName: 'गुजरात',
    agroZone: 'Gujarat Plains & Hills / Semi-Arid Saurashtra',
    primarySoilType: 'Black Cotton Soil & Alluvial Sandy Loam (Saline near coast)',
    soilPHRange: '7.2 - 8.5',
    organicCarbonAvg: '0.48% (Moderate)',
    suitableCrops: ['Cotton', 'Groundnut', 'Castor', 'Cumin (Jeera)', 'Fennel (Saunf)', 'Wheat', 'Onion', 'Mango (Kesar)'],
    stateSchemes: [
      {
        name: 'Kisan Suryodaya Yojana',
        benefit: 'Guaranteed 3-phase daytime electricity supply (5 AM to 9 PM) for farm irrigation',
        eligibleAcreage: 'All grid-connected farmers in Gujarat',
      },
      {
        name: 'Saat Pagla Khedut Kalyanna',
        benefit: 'Subsidies on cow maintenance (₹900/mo), drum sets for organic inputs, and tractor implements',
        eligibleAcreage: 'Small, marginal & natural farming practitioners',
      },
    ],
    districts: [
      {
        districtName: 'Rajkot',
        hindiName: 'राजकोट',
        latitude: 22.3039,
        longitude: 70.8022,
        prominentMandis: [
          { name: 'Rajkot APMC (Bedi Yard - National Groundnut Hub)', distanceKm: 12, primaryCommodities: ['Groundnut (Mungfali)', 'Cotton', 'Cumin (Jeera)', 'Wheat'] },
          { name: 'Gondal APMC (Major Spices & Chilli Yard)', distanceKm: 38, primaryCommodities: ['Red Chilli', 'Groundnut', 'Garlic', 'Coriander'] },
        ],
        taluks: ['Rajkot', 'Gondal', 'Jasdan', 'Jetpur', 'Dhoraji', 'Upleta', 'Kotda Sangani', 'Lodhika', 'Paddhari', 'Vinchhiya'],
      },
      {
        districtName: 'Surat',
        hindiName: 'सूरत',
        latitude: 21.1702,
        longitude: 72.8311,
        prominentMandis: [
          { name: 'Surat Agricultural Produce Market (Khatodara)', distanceKm: 8, primaryCommodities: ['Sugarcane', 'Banana', 'Paddy', 'Vegetables'] },
        ],
        taluks: ['Surat City', 'Choryasi', 'Bardoli', 'Kamrej', 'Mahuva', 'Mandvi', 'Mangrol', 'Olpad', 'Umarpada'],
      },
      {
        districtName: 'Unjha (Mehsana)',
        hindiName: 'ऊंझा / मेहसाणा',
        latitude: 23.8038,
        longitude: 72.3929,
        prominentMandis: [
          { name: 'Unjha APMC (World Largest Cumin & Isabgol Hub)', distanceKm: 4, primaryCommodities: ['Cumin (Jeera)', 'Fennel (Saunf)', 'Isabgol', 'Mustard', 'Sesame'] },
        ],
        taluks: ['Unjha', 'Mehsana', 'Kadi', 'Visnagar', 'Vadnagar', 'Kheralu', 'Satlasana', 'Vijapur', 'Becharaji'],
      },
    ],
  },
  {
    stateCode: 'AP',
    stateName: 'Andhra Pradesh',
    hindiName: 'आंध्र प्रदेश',
    agroZone: 'East Coast Plains & Hills / Southern Plateau',
    primarySoilType: 'Red Sandy Loam, Coastal Alluvial & Deep Black Vertisols',
    soilPHRange: '6.5 - 8.0',
    organicCarbonAvg: '0.62% (Moderate)',
    suitableCrops: ['Rice', 'Cotton', 'Chilli', 'Groundnut', 'Sugarcane', 'Mango (Banganapalli)', 'Tobacco', 'Sweet Orange'],
    stateSchemes: [
      {
        name: 'YSR Rythu Bharosa',
        benefit: '₹13,500 per year investment support per farmer family (including ₹6,000 PM-Kisan)',
        eligibleAcreage: 'All landowning farmers and tenant farmers (SC/ST/BC/Minority)',
      },
      {
        name: 'Free Crop Insurance Scheme',
        benefit: 'State government pays 100% of farmer share of premium for notified crops',
        eligibleAcreage: 'All farmers verified in e-Crop booking system',
      },
      {
        name: 'Dr. YSR Sunna Vaddi Panta Runalu (Zero-Interest Crop Loans)',
        benefit: '100% interest reimbursement for crop loans up to ₹1 Lakh repaid within 1 year',
        eligibleAcreage: 'Small & Marginal farmers',
      },
    ],
    districts: [
      {
        districtName: 'Guntur',
        hindiName: 'गुंटूर',
        latitude: 16.3067,
        longitude: 80.4365,
        prominentMandis: [
          { name: 'Guntur Mirchi Yard (Asia Largest Red Chilli Market)', distanceKm: 5, primaryCommodities: ['Red Chilli (Teja, Guntur Sanam)', 'Cotton', 'Tobacco'] },
          { name: 'Tenali APMC', distanceKm: 28, primaryCommodities: ['Paddy', 'Black Gram', 'Turmeric'] },
        ],
        taluks: ['Guntur East', 'Guntur West', 'Tenali', 'Mangalagiri', 'Tadikonda', 'Ponnur', 'Prathipadu'],
      },
      {
        districtName: 'Krishna (Vijayawada)',
        hindiName: 'कृष्णा / विजयवाड़ा',
        latitude: 16.5062,
        longitude: 80.648,
        prominentMandis: [
          { name: 'Vijayawada Market Yard', distanceKm: 8, primaryCommodities: ['Rice', 'Mango (Banganapalli)', 'Black Gram', 'Vegetables'] },
        ],
        taluks: ['Vijayawada Urban', 'Vijayawada Rural', 'Gannavaram', 'Gudivada', 'Machilipatnam', 'Nuzvid'],
      },
      {
        districtName: 'Anantapur',
        hindiName: 'अनंतपुर',
        latitude: 14.6819,
        longitude: 77.6006,
        prominentMandis: [
          { name: 'Anantapur APMC', distanceKm: 6, primaryCommodities: ['Groundnut (Rainfed Pods)', 'Sweet Orange (Mosambi)', 'Pomegranate'] },
        ],
        taluks: ['Anantapur', 'Dharmavaram', 'Hindupur', 'Kadiri', 'Guntakal', 'Tadipatri'],
      },
    ],
  },
  {
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    agroZone: 'Southern Plateau & Coastal Plains',
    primarySoilType: 'Red Loam, Black Clay & Coastal Alluvium',
    soilPHRange: '6.0 - 7.5',
    organicCarbonAvg: '0.68% (Moderate to High)',
    suitableCrops: ['Rice (Paddy)', 'Banana', 'Sugarcane', 'Coconut', 'Groundnut', 'Cotton', 'Turmeric', 'Tapioca'],
    stateSchemes: [
      {
        name: 'Kalaignar All Village Integrated Agriculture Development Programme',
        benefit: 'Holistic fallow land conversion, drip subsidy, community farm ponds, and coconut seedling supply',
        eligibleAcreage: 'Village panchayat clusters across Tamil Nadu',
      },
      {
        name: 'TN Free Electricity for Agriculture',
        benefit: '100% free unmetered electric power supply for registered agricultural pump sets',
        eligibleAcreage: 'All registered farmers holding farm electricity connections',
      },
    ],
    districts: [
      {
        districtName: 'Thanjavur (Rice Bowl of TN)',
        hindiName: 'तंजावुर',
        latitude: 10.787,
        longitude: 79.1378,
        prominentMandis: [
          { name: 'Thanjavur Direct Paddy Procurement Centre (DPC)', distanceKm: 8, primaryCommodities: ['Paddy (Kuruvai, Samba)', 'Banana', 'Black Gram'] },
        ],
        taluks: ['Thanjavur', 'Kumbakonam', 'Papanasam', 'Pattukkottai', 'Orathanadu', 'Peravurani'],
      },
      {
        districtName: 'Coimbatore',
        hindiName: 'कोयंबटूर',
        latitude: 11.0168,
        longitude: 76.9558,
        prominentMandis: [
          { name: 'Mettupalayam Vegetable Market (Potato & Hill Produce)', distanceKm: 34, primaryCommodities: ['Potato', 'Carrot', 'Garlic', 'Tomato'] },
          { name: 'Pollachi Coconut APMC', distanceKm: 42, primaryCommodities: ['Tender Coconut', 'Copra', 'Coir'] },
        ],
        taluks: ['Coimbatore North', 'Coimbatore South', 'Pollachi', 'Mettupalayam', 'Sulur', 'Annur'],
      },
      {
        districtName: 'Erode',
        hindiName: 'इरोड',
        latitude: 11.341,
        longitude: 77.7172,
        prominentMandis: [
          { name: 'Erode Turmeric Market (Yellow City of India)', distanceKm: 6, primaryCommodities: ['Turmeric (Curcuma longa)', 'Sugarcane', 'Tapioca', 'Paddy'] },
        ],
        taluks: ['Erode', 'Gobichettipalayam', 'Bhavani', 'Perundurai', 'Sathyamangalam', 'Anthiyur'],
      },
    ],
  },
  {
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    agroZone: 'Central Plateau & Hills / Malwa Agro-Climate',
    primarySoilType: 'Deep Black Cotton Vertisol & Mixed Red-Black Loam',
    soilPHRange: '6.8 - 8.0',
    organicCarbonAvg: '0.58% (Moderate)',
    suitableCrops: ['Soybean', 'Wheat (Sharbati)', 'Gram (Chana)', 'Mustard', 'Garlic', 'Onion', 'Cotton', 'Maize'],
    stateSchemes: [
      {
        name: 'Mukhyamantri Kisan Kalyan Yojana',
        benefit: '₹6,000 per year state cash benefit provided in 3 instalments matching PM-Kisan (Total ₹12,000)',
        eligibleAcreage: 'All landholding farmers registered on SAARA portal',
      },
      {
        name: 'Bhavantar Bhugtan Yojana',
        benefit: 'Direct compensation payment when market price falls below MSP for oilseeds and pulses',
        eligibleAcreage: 'Enrolled farmers during notified crop procurement windows',
      },
    ],
    districts: [
      {
        districtName: 'Indore',
        hindiName: 'इंदौर',
        latitude: 22.7196,
        longitude: 75.8577,
        prominentMandis: [
          { name: 'Indore Chhavani Mandi (Major Soybean & Wheat Terminal)', distanceKm: 7, primaryCommodities: ['Soybean', 'Sharbati Wheat', 'Gram', 'Maize'] },
          { name: 'Sanwer APMC', distanceKm: 34, primaryCommodities: ['Soybean', 'Potato', 'Onion'] },
        ],
        taluks: ['Indore', 'Sanwer', 'Depalpur', 'Mhow (Dr. Ambedkar Nagar)', 'Hatod'],
      },
      {
        districtName: 'Ujjain',
        hindiName: 'उज्जैन',
        latitude: 23.1765,
        longitude: 75.7885,
        prominentMandis: [
          { name: 'Ujjain Chimanganj Mandi', distanceKm: 6, primaryCommodities: ['Soybean', 'Wheat', 'Gram', 'Garlic'] },
          { name: 'Nagda APMC', distanceKm: 52, primaryCommodities: ['Wheat', 'Mustard'] },
        ],
        taluks: ['Ujjain', 'Badnagar', 'Khachrod', 'Mahidpur', 'Nagda', 'Tarana', 'Ghatiya'],
      },
      {
        districtName: 'Mandsaur',
        hindiName: 'मंदसौर',
        latitude: 24.0725,
        longitude: 75.0682,
        prominentMandis: [
          { name: 'Mandsaur Garlic & Spices APMC (Largest Garlic Market)', distanceKm: 5, primaryCommodities: ['Garlic (Lahsun)', 'Opium Poppy (Posta)', 'Soybean', 'Mustard', 'Fenugreek (Methi)'] },
        ],
        taluks: ['Mandsaur', 'Malhargarh', 'Garoth', 'Bhanpura', 'Sitamau', 'Suwasra', 'Daloda'],
      },
    ],
  },
  {
    stateCode: 'RJ',
    stateName: 'Rajasthan',
    hindiName: 'राजस्थान',
    agroZone: 'Western Dry Region / Semi-Arid Eastern Plains',
    primarySoilType: 'Desert Sandy Soils, Sandy Loam & Red-Yellow soils',
    soilPHRange: '7.5 - 8.8',
    organicCarbonAvg: '0.35% (Low)',
    suitableCrops: ['Pearl Millet (Bajra)', 'Mustard (Raya)', 'Cumin (Jeera)', 'Guar', 'Gram', 'Wheat', 'Barley', 'Isabgol'],
    stateSchemes: [
      {
        name: 'Mukhyamantri Kisan Mitra Urja Yojana',
        benefit: 'Subsidy of ₹1,000 per month (up to ₹12,000 / year) on agricultural electricity bills',
        eligibleAcreage: 'Metred agricultural connections',
      },
      {
        name: 'Rajasthan Drip & Solar Farm Pump Subsidy',
        benefit: 'Up to 70% capital subsidy on solar agricultural pumps under PM KUSUM component B',
        eligibleAcreage: 'All farmers without grid electricity',
      },
    ],
    districts: [
      {
        districtName: 'Jaipur',
        hindiName: 'जयपुर',
        latitude: 26.9124,
        longitude: 75.7873,
        prominentMandis: [
          { name: 'Muhana Mandi (Jaipur Terminal Terminal)', distanceKm: 16, primaryCommodities: ['Mustard', 'Bajra', 'Wheat', 'Vegetables'] },
          { name: 'Chomu APMC', distanceKm: 32, primaryCommodities: ['Vegetables', 'Groundnut', 'Onion'] },
        ],
        taluks: ['Jaipur', 'Chomu', 'Amer', 'Bassie', 'Chaksu', 'Dudu', 'Kotputli', 'Phulera', 'Sanganer', 'Shahpura', 'Viratnagar'],
      },
      {
        districtName: 'Kota',
        hindiName: 'कोटा',
        latitude: 25.2138,
        longitude: 75.8648,
        prominentMandis: [
          { name: 'Bhamashah Mandi Kota (Major Soybean & Mustard Yard)', distanceKm: 8, primaryCommodities: ['Soybean', 'Mustard', 'Wheat', 'Paddy', 'Coriander'] },
        ],
        taluks: ['Kota', 'Digod', 'Ladpura', 'Pipalda', 'Ramganj Mandi', 'Sangod'],
      },
      {
        districtName: 'Bikaner',
        hindiName: 'बीकानेर',
        latitude: 28.0229,
        longitude: 73.3119,
        prominentMandis: [
          { name: 'Bikaner Grain & Groundnut Yard', distanceKm: 6, primaryCommodities: ['Groundnut (Moth Bean)', 'Guar Seed', 'Gram', 'Mustard'] },
        ],
        taluks: ['Bikaner', 'Lunkaransar', 'Nokha', 'Kolayat', 'Khajuwala', 'Poogal', 'Chhatargarh'],
      },
    ],
  },
];

/**
 * Helper to build a comprehensive location profile given state, district, and optional coordinates.
 */
export function buildLocationProfile(
  stateName: string,
  districtName: string,
  talukName?: string,
  villageName?: string,
  customLat?: number,
  customLon?: number
): LocationProfile {
  const state =
    INDIAN_STATES_DB.find((s) => s.stateName.toLowerCase() === stateName.toLowerCase()) ||
    INDIAN_STATES_DB[0];

  const district =
    state.districts.find((d) => d.districtName.toLowerCase() === districtName.toLowerCase()) ||
    state.districts[0];

  const lat = customLat || district.latitude;
  const lon = customLon || district.longitude;
  const taluk = talukName || district.taluks[0] || district.districtName;
  const village = villageName || 'Main Farm Field';

  const localCropRisks = state.suitableCrops.slice(0, 3).map((crop) => ({
    crop,
    risk:
      crop === 'Tomato'
        ? 'Early Blight during humid mornings'
        : crop === 'Cotton'
        ? 'Whitefly & CLCuV vector transmission'
        : crop === 'Soybean'
        ? 'Girdle beetle and pod borer risk'
        : crop === 'Rice'
        ? 'Stem borer & Blast in cloudy humidity'
        : 'Fungal leaf spots during unseasonal showers',
    season: 'Current Kharif/Rabi cycle',
  }));

  const allSchemes = [
    ...CENTRAL_SCHEMES.map((s) => ({ name: s.name, type: s.type, benefit: s.benefit })),
    ...state.stateSchemes.map((s) => ({
      name: s.name,
      type: 'State' as const,
      benefit: s.benefit,
    })),
  ];

  return {
    country: 'India',
    state: state.stateName,
    district: district.districtName,
    taluk,
    villageOrFarm: village,
    latitude: lat,
    longitude: lon,
    agroZone: state.agroZone,
    regionalSoil: {
      soilType: state.primarySoilType,
      phRange: state.soilPHRange,
      organicCarbon: state.organicCarbonAvg,
      texture: state.primarySoilType.includes('Sandy') ? 'Coarse Sandy Loam' : 'Medium Heavy Clay',
      drainage: state.primarySoilType.includes('Black') ? 'Moderate to Poor (Requires ridge furrows)' : 'Good to High',
    },
    suitableCrops: state.suitableCrops,
    nearbyMandis: district.prominentMandis,
    governmentSchemes: allSchemes,
    localCropRisks,
  };
}

/**
 * Fuzzy search across all Indian states, districts, and taluks
 */
export function searchLocations(query: string) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();

  const results: {
    title: string;
    subtitle: string;
    state: string;
    district: string;
    taluk?: string;
    latitude: number;
    longitude: number;
  }[] = [];

  for (const s of INDIAN_STATES_DB) {
    for (const d of s.districts) {
      if (d.districtName.toLowerCase().includes(q) || d.hindiName.includes(q)) {
        results.push({
          title: `${d.districtName}, ${s.stateName}`,
          subtitle: `District • ${s.agroZone}`,
          state: s.stateName,
          district: d.districtName,
          taluk: d.taluks[0],
          latitude: d.latitude,
          longitude: d.longitude,
        });
      }

      for (const taluk of d.taluks) {
        if (taluk.toLowerCase().includes(q)) {
          results.push({
            title: `${taluk}, ${d.districtName}`,
            subtitle: `Taluk / Block in ${s.stateName}`,
            state: s.stateName,
            district: d.districtName,
            taluk,
            latitude: d.latitude,
            longitude: d.longitude,
          });
        }
      }
    }
  }

  return results.slice(0, 10);
}
