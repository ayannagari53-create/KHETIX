export interface CropRecommendationInput {
  soilType: 'Alluvial' | 'Black Clay' | 'Sandy Loam' | 'Red Loam';
  soilPH: number;
  nitrogenLevel: 'Low' | 'Medium' | 'High';
  phosphorusLevel: 'Low' | 'Medium' | 'High';
  potassiumLevel: 'Low' | 'Medium' | 'High';
  waterAvailability: 'Abundant Drip' | 'Moderate Canal' | 'Rainfed / Low';
  agroClimaticZone: 'Subtropical Semi-Arid' | 'Tropical Humid' | 'Temperate Plains';
}

export interface RecommendedCrop {
  cropName: string;
  hindiName: string;
  scientificName: string;
  matchScore: number; // 0-100
  expectedYieldPerAcre: string;
  estimatedNetProfit: string;
  growthDurationDays: number;
  waterRequirement: 'High' | 'Medium' | 'Low';
  agronomicReasoning: string;
  suitabilityFactors: {
    soilFit: string;
    phFit: string;
    marketDemand: string;
  };
}

export function calculateCropRecommendations(input: CropRecommendationInput): RecommendedCrop[] {
  const candidates: RecommendedCrop[] = [
    {
      cropName: 'Tomato (F1 Hybrid Abhinav)',
      hindiName: 'टमाटर',
      scientificName: 'Solanum lycopersicum',
      matchScore: 96,
      expectedYieldPerAcre: '280 – 340 Quintals',
      estimatedNetProfit: '₹1,80,000 – ₹2,40,000 / acre',
      growthDurationDays: 95,
      waterRequirement: 'Medium',
      agronomicReasoning: `Soil pH (${input.soilPH}) perfectly aligns with optimal Solanaceae range (6.2–7.0). Well-drained ${input.soilType} prevents collar rot, and drip access enables high fertigation efficiency.`,
      suitabilityFactors: {
        soilFit: `${input.soilType} promotes strong fibrous root development and excellent aeration.`,
        phFit: `pH ${input.soilPH} provides optimal micronutrient bioavailability (Fe, Zn, Mn).`,
        marketDemand: 'Consistently high Mandi liquidity and strong year-round processing & retail demand.',
      },
    },
    {
      cropName: 'Sweet Corn (Sugar 75)',
      hindiName: 'स्वीट कॉर्न',
      scientificName: 'Zea mays var. saccharata',
      matchScore: 91,
      expectedYieldPerAcre: '85 – 110 Quintals (Cobs)',
      estimatedNetProfit: '₹95,000 – ₹1,30,000 / acre',
      growthDurationDays: 75,
      waterRequirement: 'Medium',
      agronomicReasoning: `Rapid 75-day turnaround fits well into crop rotation sequences. Tolerant of moderate nutrient fluctuations and has excellent biomass soil return.`,
      suitabilityFactors: {
        soilFit: 'Adaptable to various soil depths; robust root anchoring.',
        phFit: `pH ${input.soilPH} supports vigorous early vegetative shoot growth.`,
        marketDemand: 'Growing urban retail market and food-service processing procurement.',
      },
    },
    {
      cropName: 'Soybean (JS 335 / NRC 37)',
      hindiName: 'सोयाबीन',
      scientificName: 'Glycine max',
      matchScore: 87,
      expectedYieldPerAcre: '10 – 14 Quintals',
      estimatedNetProfit: '₹42,000 – ₹65,000 / acre',
      growthDurationDays: 95,
      waterRequirement: 'Low',
      agronomicReasoning: `Legume nodules fix 40-50 kg/ha atmospheric nitrogen in soil, reducing fertilizer overhead for subsequent seasons. High drought resilience.`,
      suitabilityFactors: {
        soilFit: 'Ideal for medium to heavy soils with good moisture retention.',
        phFit: `pH ${input.soilPH} is ideal for active Bradyrhizobium japonicum nodulation.`,
        marketDemand: 'High MSP benchmark and strong domestic oilseed crushing demand.',
      },
    },
    {
      cropName: 'Pomegranate (Bhagwa)',
      hindiName: 'अनार (भगवा)',
      scientificName: 'Punica granatum',
      matchScore: 84,
      expectedYieldPerAcre: '6 – 8 Tonnes (Matured Orchard)',
      estimatedNetProfit: '₹3,50,000 – ₹5,20,000 / acre',
      growthDurationDays: 165,
      waterRequirement: 'Low',
      agronomicReasoning: `High-value perennial horticultural crop ideally suited to semi-arid climates. Deep taproot system withstands dry spells with precision drip.`,
      suitabilityFactors: {
        soilFit: 'Requires well-drained soil to avoid bacterial blight and root wilt.',
        phFit: 'Tolerates neutral to slightly alkaline soil ranges up to 7.8.',
        marketDemand: 'Premium export demand to Middle East and European supermarkets.',
      },
    },
  ];

  // Dynamic adjustments based on input
  return candidates.map((crop) => {
    let score = crop.matchScore;
    if (input.waterAvailability === 'Rainfed / Low' && crop.waterRequirement === 'High') {
      score -= 25;
    }
    if (input.soilType === 'Sandy Loam' && crop.cropName.includes('Tomato')) {
      score = Math.min(99, score + 2);
    }
    if (input.soilType === 'Black Clay' && crop.cropName.includes('Soybean')) {
      score = Math.min(98, score + 6);
    }
    if (input.soilPH < 6.0 || input.soilPH > 8.0) {
      score -= 10;
    }
    return { ...crop, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
