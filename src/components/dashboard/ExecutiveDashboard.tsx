import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  Sprout,
  TrendingUp,
  ScanEye,
  ArrowUpRight,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Zap,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';
import { FarmScene3D } from '../3d/FarmScene3D';
import { evaluateIrrigationDecision } from '../../lib/rules/irrigationEngine';

export const ExecutiveDashboard: React.FC = () => {
  const {
    activeFarm,
    hasFarms,
    soilMoistureOverride,
    setSoilMoistureOverride,
    rainProbabilityOverride,
    setRainProbabilityOverride,
    setActiveModule,
    toggleFieldValve,
    t,
  } = useFarm();

  const [activeTab, setActiveTab] = useState<'3d' | 'fields'>('3d');

  const activeCrop = activeFarm?.primaryCrops?.[0] || activeFarm?.primaryCrop || 'Tomato';

  const irrigationDecision = evaluateIrrigationDecision(
    soilMoistureOverride,
    rainProbabilityOverride,
    18,
    activeCrop
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌾</span>
            <h1 className="text-2xl font-extrabold text-white font-display">
              {t('good_morning', 'Good Morning')}, {activeFarm?.farmerName || 'Farmer'}!
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              {t('active_telemetry', 'Active Telemetry')}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300">
            <span>{activeFarm?.name || t('header_my_farm', 'My Farm')} • {activeFarm?.totalAcres || 0} {t('common_acres', 'Total Acres')} • {t('primary_crops', 'Primary')}:</span>
            <span className="text-emerald-400 font-semibold">
              {(activeFarm?.primaryCrops && activeFarm.primaryCrops.length > 0)
                ? activeFarm.primaryCrops.join(', ')
                : (activeFarm?.primaryCrop || 'Tomato')}
            </span>
            <button
              onClick={() => setActiveModule('farmer-profile')}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition"
              title={t('header_change_location', 'Change Farm Location & GPS')}
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{activeFarm?.district || 'Nashik'}, {activeFarm?.state || 'Maharashtra'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Action Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveModule('crops-disease')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm hover:scale-[1.02]"
          >
            <ScanEye className="w-4 h-4" />
            <span>{t('dash_scan_leaf_quick', 'Scan Leaf AI')}</span>
          </button>

          <button
            onClick={() => setActiveModule('irrigation')}
            className="px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm hover:scale-[1.02]"
          >
            <Droplets className="w-4 h-4" />
            <span>{t('dash_log_irrigation_quick', 'Log Irrigation')}</span>
          </button>

          <button
            onClick={() => setActiveModule('market')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm hover:scale-[1.02]"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('dash_check_mandi_quick', 'Check Mandi')}</span>
          </button>

          <button
            onClick={() => setActiveModule('assistant')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition shadow-md hover:scale-[1.02]"
          >
            <Bot className="w-4 h-4" />
            <span>{t('dash_ask_ai_quick', 'Ask AI Advisory')}</span>
          </button>
        </div>
      </div>

      {/* Empty State Banner if no farm registered yet */}
      {(!hasFarms || !activeFarm?.name) && (
        <div className="p-5 rounded-2xl bg-[#0a2318] border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <span className="text-3xl">🌱</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {t('dash_no_farm_notice', 'No farm registered yet.')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('dash_no_farm_desc', 'Set up your farm location, acreage, and crops to enable real-time telemetry and advisory.')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModule('farmer-profile')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition shadow-md hover:scale-[1.02] shrink-0 cursor-pointer"
          >
            <span>{t('dash_add_farm_btn', 'Add Farm')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Live KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Weather Radar */}
        <div
          onClick={() => setActiveModule('weather')}
          className="p-5 rounded-2xl bg-[#0a2318]/80 hover:bg-[#0d2e20] border border-emerald-500/20 hover:border-emerald-500/40 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash_kpi_weather', 'Weather Radar')}</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-display">28°C</span>
            <span className="text-xs font-semibold text-sky-400">78% {t('weather_humidity', 'Humidity')}</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{rainProbabilityOverride}% {t('rain_alert', 'Rain Alert')}</span>
          </div>
        </div>

        {/* KPI 2: Soil Moisture */}
        <div
          onClick={() => setActiveModule('irrigation')}
          className="p-5 rounded-2xl bg-[#0a2318]/80 hover:bg-[#0d2e20] border border-emerald-500/20 hover:border-emerald-500/40 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash_kpi_soil_moisture', 'Soil Moisture')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-display">{soilMoistureOverride}%</span>
            <span className="text-xs font-semibold text-emerald-400">{t('dash_field_capacity', 'Field Capacity')}</span>
          </div>
          <div className="mt-3 text-xs text-slate-300 flex items-center justify-between">
            <span>{t('dash_valves_standby', 'Valves Standby')}</span>
            <span className="text-emerald-400 font-bold">{t('dash_rule_active', 'Rule Engine Active')}</span>
          </div>
        </div>

        {/* KPI 3: Crop Health & NDVI */}
        <div
          onClick={() => setActiveModule('crops-disease')}
          className="p-5 rounded-2xl bg-[#0a2318]/80 hover:bg-[#0d2e20] border border-emerald-500/20 hover:border-emerald-500/40 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash_kpi_crop_health', 'Crop Health Score')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-display">92%</span>
            <span className="text-xs font-semibold text-emerald-400">{t('common_healthy', 'Healthy')}</span>
          </div>
          <div className="mt-3 text-xs text-slate-300 flex items-center justify-between">
            <span>NDVI: 0.84</span>
            <span className="text-emerald-400 font-semibold">{t('common_vigorous', 'Vigorous')}</span>
          </div>
        </div>

        {/* KPI 4: Mandi Index */}
        <div
          onClick={() => setActiveModule('market')}
          className="p-5 rounded-2xl bg-[#0a2318]/80 hover:bg-[#0d2e20] border border-emerald-500/20 hover:border-emerald-500/40 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('dash_kpi_mandi_index', 'Mandi Index')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-display">₹2,450</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              +6.2% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 text-xs text-amber-300 font-medium">
            Azadpur APMC Arbitrage: +₹170/q
          </div>
        </div>
      </div>

      {/* Main Section: 3D Twin & Field Control + AI Farm Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3D Digital Twin / Field Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0a2318]/90 border border-emerald-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white font-display">{t('dash_3d_twin_title', 'Interactive Farm Field Telemetry')}</span>
                <span className="text-xs text-slate-400">• {t('dash_3d_click_hint', 'Click markers for field stats')}</span>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/5 text-xs">
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    activeTab === '3d' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('dash_view_3d', '3D View')}
                </button>
                <button
                  onClick={() => setActiveTab('fields')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    activeTab === 'fields' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('dash_view_fields', 'Field Cards')}
                </button>
              </div>
            </div>

            {activeTab === '3d' ? (
              <FarmScene3D className="w-full h-[400px]" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1">
                {(activeFarm?.fields && activeFarm.fields.length > 0) ? (
                  activeFarm.fields.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-xl bg-[#0d2e20] border border-emerald-500/30 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-xs truncate">
                          {f.name ? f.name.split('—')[0] : t('nav_farms', 'Field Plot')}
                        </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          f.status === 'Healthy'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {f.status === 'Healthy' ? t('common_healthy', 'Healthy') : t('common_warning', f.status)}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium">{f.crop}</p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                      <div>{t('dash_kpi_soil_moisture', 'Moisture')}: <strong className="text-white">{f.moisture}%</strong></div>
                      <div>NDVI: <strong className="text-sky-400">{f.ndvi}</strong></div>
                    </div>
                    <button
                      onClick={() => toggleFieldValve(f.id)}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition border ${
                        f.valvesOpen
                          ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                          : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {f.valvesOpen ? `💧 ${t('dash_valve_open', 'Drip Valve Open')}` : `⭕ ${t('dash_valves_standby', 'Valve Standby')}`}
                    </button>
                  </div>
                ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-slate-400 text-xs bg-[#071f15] rounded-xl border border-emerald-500/20 space-y-2">
                    <p className="font-semibold text-slate-300">{t('dash_no_fields_title', 'No field added yet.')}</p>
                    <p className="text-[11px] text-slate-400">{t('dash_no_fields', 'Open Farm Management to register your field plots and telemetry.')}</p>
                    <button
                      onClick={() => setActiveModule('farms')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
                    >
                      + {t('dash_add_field_plot', 'Add Field Plot')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick telemetry sliders simulator */}
            <div className="mt-4 pt-3 border-t border-emerald-500/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">{t('dash_simulate_moisture', 'Simulate Soil Moisture')}</span>
                  <span className="font-bold text-emerald-400">{soilMoistureOverride}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={soilMoistureOverride}
                  onChange={(e) => setSoilMoistureOverride(Number(e.target.value))}
                  className="w-32 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">{t('dash_simulate_rain', 'Simulate Rain Forecast')}</span>
                  <span className="font-bold text-sky-400">{rainProbabilityOverride}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={rainProbabilityOverride}
                  onChange={(e) => setRainProbabilityOverride(Number(e.target.value))}
                  className="w-32 accent-sky-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Farm Intelligence Feed & Active Advisory */}
        <div className="space-y-4">
          {/* Active Advisory Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0d2e20] to-[#071f15] border border-emerald-500/30 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>{t('dash_ai_advisory', 'AI Advisory & Decision Rule')}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                irrigationDecision.badgeType === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {irrigationDecision.recommendation.replace('_', ' ')}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-white leading-snug">
              {irrigationDecision?.title || 'Irrigation Optimization Active'}
            </h3>

            <ul className="space-y-2 text-xs text-slate-300">
              {(irrigationDecision?.reasoning || []).map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex items-center justify-between border-t border-emerald-500/20 text-xs">
              <span className="text-slate-400">{t('dash_water_saved', 'Est. Water Saved')}</span>
              <strong className="text-sky-400">{(irrigationDecision?.waterSavingsLiters || 0).toLocaleString()} Liters</strong>
            </div>

            <button
              onClick={() => setActiveModule('assistant')}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{t('dash_spray_protocol_btn', 'Ask KHETIX for Detailed Spray Protocol')}</span>
            </button>
          </div>

          {/* Quick Module Jump Links */}
          <div className="p-4 rounded-2xl bg-[#0a2318]/90 border border-emerald-500/20 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('dash_next_tasks_title', 'Recommended Next Tasks')}</h4>
            
            <button
              onClick={() => setActiveModule('crops-disease')}
              className="w-full p-2.5 rounded-xl bg-black/40 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/30 flex items-center justify-between text-xs text-left text-slate-200 transition"
            >
              <div className="flex items-center gap-2.5">
                <ScanEye className="w-4 h-4 text-emerald-400" />
                <span>{t('nav_disease', 'Vision AI Crop Disease')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveModule('satellite')}
              className="w-full p-2.5 rounded-xl bg-black/40 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/30 flex items-center justify-between text-xs text-left text-slate-200 transition"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{t('nav_satellite', 'Satellite NDVI Heatmap')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveModule('market')}
              className="w-full p-2.5 rounded-xl bg-black/40 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/30 flex items-center justify-between text-xs text-left text-slate-200 transition"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>{t('nav_market', 'Mandi Intelligence & Arbitrage')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
