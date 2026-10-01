import React, { useState } from 'react';
import {
  FlaskConical,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Leaf,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';

export const SoilHealthDiagnostics: React.FC = () => {
  const { activeFarm, setActiveModule, t } = useFarm();

  const [selectedField, setSelectedField] = useState(activeFarm?.fields?.[0]?.id || 'field-1');

  const soilMetrics = [
    { label: t('soil_nitrogen', 'Available Nitrogen (N)'), value: '235 kg/ha', status: 'Medium', benchmark: '280-560 kg/ha', color: 'text-amber-400', progress: 54 },
    { label: t('soil_phosphorus', 'Available Phosphorus (P)'), value: '44 kg/ha', status: 'Optimal', benchmark: '23-56 kg/ha', color: 'text-emerald-400', progress: 78 },
    { label: t('soil_potassium', 'Available Potassium (K)'), value: '310 kg/ha', status: 'High / Optimal', benchmark: '140-280 kg/ha', color: 'text-emerald-400', progress: 88 },
    { label: t('soil_ph', 'Soil Reaction (pH)'), value: '6.8 pH', status: 'Ideal Neutral', benchmark: '6.5-7.5 pH', color: 'text-emerald-400', progress: 85 },
    { label: 'Organic Carbon (OC)', value: '0.62%', status: 'Moderate', benchmark: '> 0.75%', color: 'text-amber-400', progress: 62 },
    { label: 'Electrical Conductivity (EC)', value: '0.42 dS/m', status: 'Normal Non-Saline', benchmark: '< 1.0 dS/m', color: 'text-emerald-400', progress: 92 },
    { label: 'Available Zinc (Zn)', value: '0.78 ppm', status: 'Deficient', benchmark: '> 1.0 ppm', color: 'text-red-400', progress: 38 },
    { label: 'Available Boron (B)', value: '0.54 ppm', status: 'Adequate', benchmark: '0.5-1.0 ppm', color: 'text-emerald-400', progress: 70 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-6 h-6 text-orange-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              {t('soil_title', 'Soil Health Diagnostics & Fertility Score')}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold">
              ICAR Standard
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {t('soil_subtitle', 'Comprehensive macro- and micronutrient soil testing parameters, organic matter index, and tailored restorative amendments.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(activeFarm?.fields && activeFarm.fields.length > 0) ? (
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none"
            >
              {activeFarm.fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.crop})
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs text-slate-400">
              {t('dash_no_fields', 'Default Field Plot')}
            </div>
          )}

          <button
            onClick={() => setActiveModule('reports')}
            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Soil Card</span>
          </button>
        </div>
      </div>

      {/* Overall Soil Health Score Banner */}
      <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/30 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="text-center md:border-r border-white/10 pr-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Soil Health Index (SHI)
          </span>
          <div className="text-5xl font-extrabold text-emerald-400 font-display">
            82<span className="text-2xl text-slate-400">/100</span>
          </div>
          <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">
            Grade A: Highly Fertile
          </span>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h3 className="font-extrabold text-base text-white">
            Field A North (Tomato Plot) Diagnostic Summary
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The soil presents optimal microbial activity, ideal pH (6.8), and adequate Phosphorus/Potassium reserves.
            However, slight Zinc deficiency (0.78 ppm) and sub-optimal Organic Carbon (0.62%) were detected.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 text-xs font-semibold border border-red-500/30">
              Zinc Deficient: Add 10 kg/acre ZnSO₄
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/30">
              Boost Organic Matter: +4 MT Farmyard Manure
            </span>
          </div>
        </div>
      </div>

      {/* 8 Macro & Micro-Nutrient Parameter Cards */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-white font-display">
          Nutrient Parameter Benchmarks
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {soilMetrics.map((met, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 truncate">{met.label}</span>
                <span className={`text-[10px] font-bold ${met.color}`}>{met.status}</span>
              </div>

              <div className="text-2xl font-extrabold text-white font-display">
                {met.value}
              </div>

              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      met.progress > 70 ? 'bg-emerald-400' : met.progress > 45 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${met.progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Target Range</span>
                  <span className="text-slate-300">{met.benchmark}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailored Correction Advisory */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0d2e20] to-[#0a2318] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Tailored Soil Fertility Correction Protocol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <h4 className="font-bold text-emerald-300 text-sm">1. Organic Matter Restoration</h4>
            <p className="text-slate-300 leading-relaxed">
              Broadcast 4 metric tonnes of well-decomposed Farm Yard Manure (FYM) or vermicompost prior to secondary tillage to raise Organic Carbon from 0.62% to 0.85%.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <h4 className="font-bold text-amber-300 text-sm">2. Micronutrient Zinc Supplement</h4>
            <p className="text-slate-300 leading-relaxed">
              Foliar spray with Chelated Zinc (Zn-EDTA 12%) @ 1.5 grams per liter during active vegetative growth, or soil application of 10 kg Zinc Sulfate Heptahydrate.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <h4 className="font-bold text-sky-300 text-sm">3. Nitrogen Fertigation Efficiency</h4>
            <p className="text-slate-300 leading-relaxed">
              Split Nitrogen into 4 drip fertigation intervals using Neem-coated urea or Calcium Nitrate to minimize nitrate leaching beyond the 40 cm root zone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
