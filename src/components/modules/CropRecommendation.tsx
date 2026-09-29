import React, { useState, useMemo } from 'react';
import {
  Wheat,
  Sliders,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRight,
  Droplets,
  Layers,
} from 'lucide-react';
import { calculateCropRecommendations, RecommendedCrop } from '../../lib/rules/cropRecommendation';
import { useFarm } from '../../lib/context/FarmContext';

export const CropRecommendation: React.FC = () => {
  const { setActiveModule } = useFarm();

  const [soilType, setSoilType] = useState<'Alluvial' | 'Black Clay' | 'Sandy Loam' | 'Red Loam'>('Black Clay');
  const [ph, setPh] = useState<number>(6.8);
  const [nitrogenLevel, setNitrogenLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [phosphorusLevel, setPhosphorusLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [potassiumLevel, setPotassiumLevel] = useState<'Low' | 'Medium' | 'High'>('High');
  const [waterAvailability, setWaterAvailability] = useState<'Abundant Drip' | 'Moderate Canal' | 'Rainfed / Low'>('Abundant Drip');
  const [agroClimaticZone, setAgroClimaticZone] = useState<'Subtropical Semi-Arid' | 'Tropical Humid' | 'Temperate Plains'>('Subtropical Semi-Arid');

  const recommendations = useMemo(() => {
    return calculateCropRecommendations({
      soilType,
      soilPH: ph,
      nitrogenLevel,
      phosphorusLevel,
      potassiumLevel,
      waterAvailability,
      agroClimaticZone,
    });
  }, [soilType, ph, nitrogenLevel, phosphorusLevel, potassiumLevel, waterAvailability, agroClimaticZone]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wheat className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Agronomic Crop Recommendation Engine
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Multi-Factor Matching
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Algorithmic crop suitability evaluation scoring soil physical chemistry, seasonal rainfall, and local APMC market profitability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('soil')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition"
          >
            Import Soil Test Report
          </button>
        </div>
      </div>

      {/* Two Columns: Input Filters & Ranked Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 cols: Parameter Controls */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Soil & Climatic Parameters</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Soil Texture Classification</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-white font-medium focus:outline-none"
              >
                <option value="Black Clay">Black Clay (Vertisol)</option>
                <option value="Alluvial">Alluvial Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Red Loam">Red Loam</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Soil pH Level:</span>
                <strong className="text-emerald-400">{ph}</strong>
              </div>
              <input
                type="range"
                min="5.0"
                max="8.5"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Acidic (5.0)</span>
                <span>Neutral (7.0)</span>
                <span>Alkaline (8.5)</span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Available Nitrogen (N)</label>
              <select
                value={nitrogenLevel}
                onChange={(e) => setNitrogenLevel(e.target.value as any)}
                className="w-full p-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-white font-medium"
              >
                <option value="Low">Low (&lt; 200 kg/ha)</option>
                <option value="Medium">Medium (200 - 350 kg/ha)</option>
                <option value="High">High (&gt; 350 kg/ha)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Available Phosphorus (P)</label>
              <select
                value={phosphorusLevel}
                onChange={(e) => setPhosphorusLevel(e.target.value as any)}
                className="w-full p-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-white font-medium"
              >
                <option value="Low">Low (&lt; 20 kg/ha)</option>
                <option value="Medium">Medium (20 - 45 kg/ha)</option>
                <option value="High">High (&gt; 45 kg/ha)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Available Potassium (K)</label>
              <select
                value={potassiumLevel}
                onChange={(e) => setPotassiumLevel(e.target.value as any)}
                className="w-full p-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-white font-medium"
              >
                <option value="Low">Low (&lt; 150 kg/ha)</option>
                <option value="Medium">Medium (150 - 280 kg/ha)</option>
                <option value="High">High (&gt; 280 kg/ha)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-slate-400 block mb-1">Water Source</label>
                <select
                  value={waterAvailability}
                  onChange={(e) => setWaterAvailability(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-white font-medium text-[11px]"
                >
                  <option value="Abundant Drip">Abundant Drip</option>
                  <option value="Moderate Canal">Canal System</option>
                  <option value="Rainfed / Low">Rainfed Only</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Agro Zone</label>
                <select
                  value={agroClimaticZone}
                  onChange={(e) => setAgroClimaticZone(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-white font-medium text-[11px]"
                >
                  <option value="Subtropical Semi-Arid">Semi-Arid</option>
                  <option value="Tropical Humid">Tropical Humid</option>
                  <option value="Temperate Plains">Temperate Plains</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right 8 cols: Ranked Crop Recommendations */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white font-display">
                Top Algorithmic Matches for Upcoming Cycle
              </h3>
              <p className="text-xs text-slate-400">
                Sorted by agronomic compatibility & anticipated net farm return
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              {recommendations.length} Crops Evaluated
            </span>
          </div>

          <div className="space-y-3.5">
            {recommendations.map((rec, idx) => (
              <div
                key={rec.cropName}
                className={`p-5 rounded-2xl border transition ${
                  idx === 0
                    ? 'bg-gradient-to-r from-emerald-950/80 to-[#0a2318] border-emerald-400 shadow-xl ring-1 ring-emerald-400/30'
                    : 'bg-[#0a2318] border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      #{idx + 1}
                    </span>
                    <h4 className="text-lg font-extrabold text-white font-display">
                      {rec.cropName}
                    </h4>
                    <span className="text-xs text-slate-400">({rec.hindiName})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                      {rec.matchScore}% Match
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      High Demand
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs my-3">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Est. Yield</span>
                    <strong className="text-white">{rec.expectedYieldPerAcre}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <strong className="text-white">{rec.growthDurationDays} Days</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Water Need</span>
                    <strong className="text-sky-400">{rec.waterRequirement}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Net Profit Est.</span>
                    <strong className="text-emerald-400 font-bold">{rec.estimatedNetProfit}</strong>
                  </div>
                </div>

                <div className="space-y-1 bg-[#0d2e20]/60 p-3 rounded-xl border border-white/5 text-xs text-slate-300">
                  <p className="leading-relaxed">
                    <strong className="text-emerald-400">Agronomic Rationale:</strong> {rec.agronomicReasoning}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong>Market Fit:</strong> {rec.suitabilityFactors.marketDemand}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
