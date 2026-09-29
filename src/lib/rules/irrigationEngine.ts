export interface IrrigationDecision {
  recommendation: 'DELAY_IRRIGATION' | 'RUN_DRIP_NOW' | 'OPTIMAL_MOISTURE' | 'AERATION_REQUIRED';
  title: string;
  badgeType: 'critical' | 'warning' | 'success' | 'info';
  delayHours: number;
  reasoning: string[];
  runDurationMinutes: number;
  waterSavingsLiters: number;
  matricPotentialKPa: number;
  evapotranspirationMmPerDay: number;
}

export function evaluateIrrigationDecision(
  currentMoisture: number, // 0-100%
  rainProbabilityNext24h: number, // 0-100%
  forecastRainMm: number = 0,
  cropType: string = 'Tomato'
): IrrigationDecision {
  // Evapotranspiration estimation (Penman-Monteith proxy)
  const et0 = 4.8; // mm/day baseline for warm season
  const kc = cropType.toLowerCase().includes('tomato') ? 1.15 : cropType.toLowerCase().includes('corn') ? 1.05 : 0.9;
  const cropEt = Number((et0 * kc).toFixed(2));

  // Matric potential calculation based on sandy loam soil curve
  // Optimal range for tomato is -30 to -50 kPa
  const matricPotential = Math.round(-10 - (100 - currentMoisture) * 0.95);

  // RULE 1: If rain probability > 60% or forecast rain > 8mm
  if (rainProbabilityNext24h >= 60 || forecastRainMm >= 8) {
    return {
      recommendation: 'DELAY_IRRIGATION',
      title: 'Delay Irrigation by 24–48 Hours',
      badgeType: 'critical',
      delayHours: 36,
      reasoning: [
        `High meteorological rain probability (${rainProbabilityNext24h}%) will replenish root moisture naturally.`,
        `Running irrigation now will induce soil waterlogging and root hypoxia (oxygen depletion).`,
        `Excess canopy and soil moisture creates microclimate favoring Phytophthora & Pythium damping off.`,
      ],
      runDurationMinutes: 0,
      waterSavingsLiters: 42000,
      matricPotentialKPa: matricPotential,
      evapotranspirationMmPerDay: cropEt,
    };
  }

  // RULE 2: If soil moisture is below 50% (under threshold)
  if (currentMoisture < 50) {
    const deficitMm = ((65 - currentMoisture) * 0.4).toFixed(1);
    const suggestedMinutes = Math.min(90, Math.max(30, Math.round((65 - currentMoisture) * 2.2)));
    return {
      recommendation: 'RUN_DRIP_NOW',
      title: `Run Drip Irrigation for ${suggestedMinutes} Minutes`,
      badgeType: 'warning',
      delayHours: 0,
      reasoning: [
        `Soil moisture is at ${currentMoisture}%, which is below the critical threshold (55%) for ${cropType}.`,
        `Soil matric potential is ${matricPotential} kPa, approaching the plant stress threshold.`,
        `Low rain probability (${rainProbabilityNext24h}%). Morning run will restore field capacity without evaporation loss.`,
      ],
      runDurationMinutes: suggestedMinutes,
      waterSavingsLiters: 12000,
      matricPotentialKPa: matricPotential,
      evapotranspirationMmPerDay: cropEt,
    };
  }

  // RULE 3: Optimal moisture between 50% and 75%
  if (currentMoisture <= 75) {
    return {
      recommendation: 'OPTIMAL_MOISTURE',
      title: 'Soil Moisture in Optimal Field Capacity Zone',
      badgeType: 'success',
      delayHours: 12,
      reasoning: [
        `Soil moisture of ${currentMoisture}% matches optimal physiological transpiration requirements.`,
        `Nutrient uptake via active root hairs is functioning at peak efficiency.`,
        `Next automated moisture sensor assessment in 6 hours.`,
      ],
      runDurationMinutes: 0,
      waterSavingsLiters: 18000,
      matricPotentialKPa: matricPotential,
      evapotranspirationMmPerDay: cropEt,
    };
  }

  // RULE 4: Over-saturated (> 75%)
  return {
    recommendation: 'AERATION_REQUIRED',
    title: 'High Moisture: Allow Soil Drainage & Aeration',
    badgeType: 'info',
    delayHours: 48,
    reasoning: [
      `Moisture level (${currentMoisture}%) exceeds field capacity. Avoid additional irrigation.`,
      `Ensure drainage trenches at perimeter of field are free of debris.`,
    ],
    runDurationMinutes: 0,
    waterSavingsLiters: 25000,
    matricPotentialKPa: matricPotential,
    evapotranspirationMmPerDay: cropEt,
  };
}
