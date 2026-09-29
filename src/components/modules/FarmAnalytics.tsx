import React, { useState } from 'react';
import {
  LineChart,
  DollarSign,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFarm } from '../../lib/context/FarmContext';

export const FarmAnalytics: React.FC = () => {
  const { activeFarm } = useFarm();

  const costBreakdownData = [
    { name: 'Labor & Weeding', value: 55000, color: '#10b981' },
    { name: 'Fertilizers & Nutrients', value: 41280, color: '#38bdf8' },
    { name: 'Hybrid Seeds & Nursery', value: 31000, color: '#f59e0b' },
    { name: 'Power & Drip Irrigation', value: 24100, color: '#a855f7' },
    { name: 'Cold Transport & Mandi', value: 20620, color: '#f97316' },
  ];

  const seasonalYieldHistory = [
    { season: '2024 Kharif', yieldMT: 28.5, revenue: 245000, profit: 122000 },
    { season: '2024 Rabi', yieldMT: 36.2, revenue: 318000, profit: 174000 },
    { season: '2025 Kharif', yieldMT: 32.0, revenue: 290000, profit: 148000 },
    { season: '2025 Rabi', yieldMT: 41.8, revenue: 385000, profit: 213000 },
  ];

  const totalCost = costBreakdownData.reduce((a, b) => a + b.value, 0);
  const grossRevenue = 385000;
  const netProfit = grossRevenue - totalCost;
  const profitMarginPercent = ((netProfit / grossRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Farm Profit & Loss Analytics
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Acre Net Margin
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Cost of cultivation audits, seasonal yield trends, input efficiency indices, and net harvest margins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs text-right">
            <span className="text-slate-400 block text-[10px]">Net Margin Rate</span>
            <span className="text-emerald-400 font-extrabold text-sm">{profitMarginPercent}%</span>
          </div>
        </div>
      </div>

      {/* 4 P&L Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Harvest Revenue</span>
          <div className="text-3xl font-extrabold text-white font-display mt-1">
            ₹{grossRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center mt-2">
            +21% vs previous Rabi <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Cultivation Cost</span>
          <div className="text-3xl font-extrabold text-slate-200 font-display mt-1">
            ₹{totalCost.toLocaleString()}
          </div>
          <span className="text-xs text-amber-400 font-medium block mt-2">
            ₹17,200 / Acre Cultivated
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">Net Farm Operating Profit</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-display mt-1">
            ₹{netProfit.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-300 font-bold block mt-2">
            {profitMarginPercent}% Net Operating Margin
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase">Yield Per Acre</span>
          <div className="text-3xl font-extrabold text-sky-400 font-display mt-1">
            17.4 MT
          </div>
          <span className="text-xs text-sky-300 font-medium block mt-2">
            +3.2 MT above state benchmark
          </span>
        </div>
      </div>

      {/* Two Columns: Seasonal Trend Chart & Cost Breakdown Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Seasonal Yield & Profit (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white">Seasonal Revenue vs Net Profit</h3>
              <p className="text-xs text-slate-400">Past 4 cycles in ₹</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalYieldHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3b26" vertical={false} />
                <XAxis dataKey="season" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a2318',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                />
                <Bar dataKey="revenue" name="Gross Revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Adoption of automated drip irrigation and precision spraying reduced input costs by 18.4% since 2024 Kharif.
            </span>
          </div>
        </div>

        {/* Cost Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">Cost of Cultivation Breakdown</h3>
            <PieIcon className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-3">
            {costBreakdownData.map((item, idx) => {
              const pct = ((item.value / totalCost) * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <strong className="text-white">₹{item.value.toLocaleString()} ({pct}%)</strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-[#0d2e20] border border-emerald-500/20 text-xs text-emerald-200">
            <strong>Key Insight:</strong> Labor accounts for 32% of costs. Transitioning to mechanical trellis weeding will unlock an additional ₹14,000/acre in profit.
          </div>
        </div>
      </div>
    </div>
  );
};
