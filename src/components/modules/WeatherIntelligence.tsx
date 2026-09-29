import React from 'react';
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Thermometer,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_WEATHER_FORECAST } from '../../lib/data/mockData';
import { useFarm } from '../../lib/context/FarmContext';

export const WeatherIntelligence: React.FC = () => {
  const { setActiveModule, rainProbabilityOverride } = useFarm();

  const sprayIndexOptimal = rainProbabilityOverride < 30;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CloudSun className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Hyper-Local Weather Intelligence & Agro-Radar
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Meteorological Station
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Microclimate weather forecasts calibrated with local Doppler radars for spraying windows, heat stress, and storm defenses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="p-3 rounded-xl bg-[#0d2e20] border border-emerald-500/30">
            <span className="text-slate-400 block text-[10px]">Active Agro-Climatic Zone</span>
            <span className="text-white font-bold">Western Ghats Rainshadow (Nashik)</span>
          </div>
        </div>
      </div>

      {/* Critical Storm Alert Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/80 via-[#0a2318] to-[#0a2318] border border-sky-500/30 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sky-400 font-extrabold text-xs">
            <CloudRain className="w-4 h-4 animate-bounce" />
            <span>METEOROLOGICAL ADVISORY ALERT</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            Heavy Precipitation & Thunderstorm Expected Tomorrow (18–24 mm)
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Convective cloud bands approaching from South-West. High risk of chemical fungicide wash-off.
            Immediately verify Field B drainage furrows and secure trellis wires.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">Spray Window</span>
            <span className={`font-extrabold text-xs ${sprayIndexOptimal ? 'text-emerald-400' : 'text-red-400'}`}>
              {sprayIndexOptimal ? 'SUITABLE' : 'UNFAVORABLE'}
            </span>
          </div>
          <button
            onClick={() => setActiveModule('irrigation')}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs transition"
          >
            Adjust Irrigation
          </button>
        </div>
      </div>

      {/* 7-Day Agronomic Forecast Cards */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-white font-display">
          7-Day Agronomic Forecast & Daily Field Advisories
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3.5">
          {INITIAL_WEATHER_FORECAST.map((day, idx) => {
            const isRain = day.rainProbability > 50;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                  idx === 0
                    ? 'bg-[#0d2e20] border-emerald-500/50 shadow-lg ring-1 ring-emerald-500/30'
                    : 'bg-[#0a2318]/90 border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{day.day}</span>
                    <span className="text-[10px] text-slate-400">{day.date}</span>
                  </div>

                  <div className="my-2 flex items-center justify-between">
                    {isRain ? (
                      <CloudRain className="w-8 h-8 text-sky-400" />
                    ) : (
                      <Sun className="w-8 h-8 text-amber-400" />
                    )}
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-white block">{day.tempMax}°</span>
                      <span className="text-[11px] text-slate-400">{day.tempMin}° min</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Rain:</span>
                      <strong className={isRain ? 'text-sky-400' : 'text-slate-400'}>
                        {day.rainProbability}%
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Humidity:</span>
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wind:</span>
                      <span>{day.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[10px] text-slate-300 leading-snug">
                  {day.advisory}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Atmospheric Microclimate Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Thermometer className="w-4 h-4 text-emerald-400" />
            <span>Soil Temp (10 cm depth)</span>
          </div>
          <span className="text-2xl font-extrabold text-white font-display">23.4°C</span>
          <p className="text-[11px] text-emerald-400 mt-1">Ideal for root microbial activity</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Wind className="w-4 h-4 text-sky-400" />
            <span>Wind Speed & Gusts</span>
          </div>
          <span className="text-2xl font-extrabold text-white font-display">11 km/h</span>
          <p className="text-[11px] text-sky-400 mt-1">WSW Gusts up to 16 km/h</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Dew Point Depression</span>
          </div>
          <span className="text-2xl font-extrabold text-white font-display">19.2°C</span>
          <p className="text-[11px] text-slate-400 mt-1">Night dew formation likely at 04:30 AM</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Accumulated GDD (Season)</span>
          </div>
          <span className="text-2xl font-extrabold text-white font-display">842 GDD</span>
          <p className="text-[11px] text-amber-400 mt-1">Flowering to fruit set milestone on schedule</p>
        </div>
      </div>
    </div>
  );
};
