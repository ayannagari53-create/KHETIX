import React, { useState } from 'react';
import {
  Droplets,
  CloudRain,
  Timer,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Play,
  Pause,
  Power,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';
import { evaluateIrrigationDecision } from '../../lib/rules/irrigationEngine';

export const SmartIrrigation: React.FC = () => {
  const {
    activeFarm,
    soilMoistureOverride,
    setSoilMoistureOverride,
    rainProbabilityOverride,
    setRainProbabilityOverride,
    toggleFieldValve,
    t,
  } = useFarm();

  const [dripFlowRateLph, setDripFlowRateLph] = useState<number>(2.4); // liters per hour per emitter
  const [emitterSpacingCm, setEmitterSpacingCm] = useState<number>(40);
  const [activeRuntimeField, setActiveRuntimeField] = useState<string | null>(null);

  const activeCrop = activeFarm?.primaryCrops?.[0] || activeFarm?.primaryCrop || 'Tomato';

  const decision = evaluateIrrigationDecision(
    soilMoistureOverride,
    rainProbabilityOverride,
    18,
    activeCrop
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              {t('irrig_title', 'Smart Precision Irrigation Engine')}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
              {t('dash_rule_active', 'Autonomous Rule Engine')}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {t('irrig_subtitle', 'Real-time volumetric soil moisture coupled with meteorological precipitation forecasts and Penman-Monteith crop evapotranspiration.')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30">
            <span className="text-slate-400 block text-[10px]">Crop Evapotranspiration (ETc)</span>
            <span className="text-sky-400 font-extrabold text-sm">{decision.evapotranspirationMmPerDay} mm/day</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30">
            <span className="text-slate-400 block text-[10px]">Matric Potential</span>
            <span className="text-emerald-400 font-extrabold text-sm">{decision.matricPotentialKPa} kPa</span>
          </div>
        </div>
      </div>

      {/* Decision Banner from Rule Engine */}
      <div
        className={`p-6 rounded-2xl border transition shadow-2xl ${
          decision.badgeType === 'critical'
            ? 'bg-gradient-to-r from-red-950/70 to-[#0a2318] border-red-500/40'
            : decision.badgeType === 'warning'
            ? 'bg-gradient-to-r from-amber-950/70 to-[#0a2318] border-amber-500/40'
            : 'bg-gradient-to-r from-emerald-950/70 to-[#0a2318] border-emerald-500/40'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {t('dash_ai_advisory', 'Live Agronomic Decision Rule Output')}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  decision.badgeType === 'critical'
                    ? 'bg-red-500/20 text-red-300'
                    : decision.badgeType === 'warning'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {decision.recommendation}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white font-display">
              {decision.title}
            </h2>

            <ul className="space-y-1.5 text-xs text-slate-200">
              {decision.reasoning.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center lg:text-right p-4 rounded-xl bg-black/40 border border-white/10 shrink-0 space-y-1">
            <span className="text-[11px] text-slate-400 block">{t('dash_water_saved', 'Conserved Irrigation Water')}</span>
            <div className="text-3xl font-extrabold text-sky-400 font-display">
              {decision.waterSavingsLiters.toLocaleString()} L
            </div>
            <p className="text-[10px] text-emerald-400">Equivalent to 4.2 Acre-Inches</p>
          </div>
        </div>
      </div>

      {/* Simulator Sliders */}
      <div className="p-5 rounded-2xl bg-[#0a2318]/90 border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>{t('dash_3d_twin_title', 'Interactive Environmental Condition Simulator')}</span>
          </h3>
          <span className="text-xs text-slate-400">Slide values to observe autonomous rule changes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t('dash_kpi_soil_moisture', 'Soil Volumetric Moisture')}:</span>
              <strong className="text-emerald-400 font-mono text-sm">{soilMoistureOverride}%</strong>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              value={soilMoistureOverride}
              onChange={(e) => setSoilMoistureOverride(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Wilting Point (20%)</span>
              <span>Optimal (60-70%)</span>
              <span>Saturated (90%)</span>
            </div>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t('weather_rain_chance', 'Next 24-hr Rain Probability')}:</span>
              <strong className="text-sky-400 font-mono text-sm">{rainProbabilityOverride}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rainProbabilityOverride}
              onChange={(e) => setRainProbabilityOverride(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Dry / Sunny (0%)</span>
              <span>Scattered (40%)</span>
              <span>Heavy Rain (&gt;70%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Field Water Schedules & Solenoid Controls */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-white font-display">
          {t('irrig_valves_title', 'Field Water Scheduling & Solenoid Valves')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(activeFarm?.fields && activeFarm.fields.length > 0) ? (
            activeFarm.fields.map((field) => (
              <div
                key={field.id}
                className="p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4"
              >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{field.name}</h4>
                  <p className="text-xs text-emerald-400">{field.crop} • {field.acres} Acres</p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    field.valvesOpen ? 'bg-sky-400 animate-ping' : 'bg-slate-600'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Moisture</span>
                  <span className="font-bold text-white text-sm">{field.moisture}%</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Irrigation Type</span>
                  <span className="font-semibold text-slate-200 text-[11px] truncate block">
                    {field.irrigationType}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Calculated Run Time:</span>
                  <strong className="text-sky-300">
                    {decision.runDurationMinutes > 0 ? `${decision.runDurationMinutes} mins` : 'Standby (0m)'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Emitter Discharge:</span>
                  <span className="text-slate-400">{dripFlowRateLph} L/hr @ 40cm</span>
                </div>
              </div>

              <button
                onClick={() => toggleFieldValve(field.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border cursor-pointer ${
                  field.valvesOpen
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/20'
                    : 'bg-[#0d2e20] border-emerald-500/30 text-slate-300 hover:text-white'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{field.valvesOpen ? 'Solenoid Valve OPEN (Irrigating)' : 'Override & Open Valve'}</span>
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-slate-400 text-xs bg-[#0a2318] rounded-2xl border border-emerald-500/20">
            No field plots currently monitored for irrigation. Add fields in Farm Management.
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
