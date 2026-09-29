import React, { useState } from 'react';
import {
  Milk,
  HeartPulse,
  Syringe,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface Animal {
  id: string;
  tagId: string;
  name: string;
  species: 'Cow' | 'Buffalo' | 'Goat';
  breed: string;
  lactationStage: string;
  dailyYieldLiters: number;
  healthStatus: 'Healthy' | 'Needs Attention' | 'In Heat';
  lastVaccination: string;
}

export const LivestockManagement: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([
    {
      id: 'ls-1',
      tagId: 'IND-MH-4921',
      name: 'Ganga (Gir)',
      species: 'Cow',
      breed: 'Gir Indigenous',
      lactationStage: 'Peak Lactation (Month 3)',
      dailyYieldLiters: 16.4,
      healthStatus: 'Healthy',
      lastVaccination: 'FMD Booster (2026-08-10)',
    },
    {
      id: 'ls-2',
      tagId: 'IND-MH-4922',
      name: 'Yamuna (Murrah)',
      species: 'Buffalo',
      breed: 'Murrah Buffalo',
      lactationStage: 'Early Lactation (Month 2)',
      dailyYieldLiters: 14.8,
      healthStatus: 'Healthy',
      lastVaccination: 'Brucellosis (2026-07-20)',
    },
    {
      id: 'ls-3',
      tagId: 'IND-MH-4925',
      name: 'Radha (Sahiwal)',
      species: 'Cow',
      breed: 'Sahiwal Dairy',
      lactationStage: 'Mid Lactation (Month 5)',
      dailyYieldLiters: 13.2,
      healthStatus: 'Healthy',
      lastVaccination: 'Black Quarter (BQ)',
    },
    {
      id: 'ls-4',
      tagId: 'IND-MH-4928',
      name: 'Kaali (Murrah)',
      species: 'Buffalo',
      breed: 'Murrah Buffalo',
      lactationStage: 'Dry / Pregnant (Month 8)',
      dailyYieldLiters: 0,
      healthStatus: 'Needs Attention',
      lastVaccination: 'Deworming Due',
    },
  ]);

  const milkProductionTrend = [
    { day: 'Mon', yieldLiters: 42.5 },
    { day: 'Tue', yieldLiters: 44.1 },
    { day: 'Wed', yieldLiters: 43.8 },
    { day: 'Thu', yieldLiters: 45.2 },
    { day: 'Fri', yieldLiters: 44.4 },
    { day: 'Sat', yieldLiters: 46.0 },
    { day: 'Sun', yieldLiters: 45.8 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Milk className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Livestock & Dairy Management
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
              Animal Husbandry
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Digital Tag ID livestock records, daily milk yield analytics, lactation stages, and veterinary vaccination reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs text-right">
            <span className="text-slate-400 block text-[10px]">Today's Herd Total</span>
            <span className="text-sky-300 font-extrabold text-sm">45.8 Liters</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Total Herd Size</span>
          <div className="text-2xl font-extrabold text-white font-display mt-1">12 Cattle</div>
          <span className="text-[10px] text-emerald-400">8 Lactating • 2 Dry • 2 Calves</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Avg Yield / Animal</span>
          <div className="text-2xl font-extrabold text-sky-400 font-display mt-1">14.8 L/day</div>
          <span className="text-[10px] text-sky-300">+1.2 L vs Regional Avg</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Daily Milk Revenue</span>
          <div className="text-2xl font-extrabold text-amber-400 font-display mt-1">₹2,840</div>
          <span className="text-[10px] text-amber-300">₹62/L Pure A2 Cow Milk</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0a2318] border border-emerald-500/20">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Feed Efficiency</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-display mt-1">1.34 FCR</div>
          <span className="text-[10px] text-emerald-400">Optimum Nutrition Ratio</span>
        </div>
      </div>

      {/* Two Columns: Milk Yield Chart & Animal Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Yield Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white">7-Day Herd Milk Yield</h3>
              <p className="text-xs text-slate-400">Daily morning + evening collection</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={milkProductionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3b26" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  domain={[35, 50]}
                  tickFormatter={(val) => `${val}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a2318',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`${value} Liters`, 'Total Yield']}
                />
                <Bar dataKey="yieldLiters" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nutrition Ration Recommendation</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Maintain 22 kg green Napier grass + 6 kg dry jowar straw + 3.5 kg balanced cattle feed concentrate with 50g mineral mixture per cow to support current lactation peak.
            </p>
          </div>
        </div>

        {/* Animal Tag Registry (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white">Animal Digital Tag Registry</h3>
              <p className="text-xs text-slate-400">Vaccinations & individual performance</p>
            </div>
          </div>

          <div className="space-y-3">
            {animals.map((an) => (
              <div
                key={an.id}
                className="p-4 rounded-xl bg-[#0d2e20] border border-emerald-500/20 space-y-2 text-xs transition hover:border-emerald-500/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{an.name}</span>
                    <span className="px-2 py-0.5 rounded bg-black/40 font-mono text-[10px] text-slate-400 border border-white/5">
                      {an.tagId}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      an.healthStatus === 'Healthy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {an.healthStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Breed</span>
                    <strong className="text-white">{an.breed}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lactation Phase</span>
                    <span className="text-emerald-300">{an.lactationStage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Daily Yield</span>
                    <strong className="text-sky-300 font-extrabold">{an.dailyYieldLiters} L/day</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Syringe className="w-3 h-3 text-emerald-400" />
                    <span>{an.lastVaccination}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">
                    View Health Card
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
