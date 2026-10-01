import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  MapPin,
  Sparkles,
  ChevronRight,
  BadgePercent,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MANDI_COMMODITIES } from '../../lib/data/mockData';
import { MandiCommodity } from '../../types';
import { useFarm } from '../../lib/context/FarmContext';

export const MarketIntelligence: React.FC = () => {
  const { setActiveModule, t } = useFarm();
  const [selectedCommodity, setSelectedCommodity] = useState<MandiCommodity>(MANDI_COMMODITIES[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              {t('market_title', 'Mandi Price Intelligence & Arbitrage')}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Live APMC Feeds
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {t('market_subtitle', 'Real-time terminal mandi price benchmarks, freight-adjusted net realization, and predictive arrival volume forecasting.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('supply-chain')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>{t('nav_supply_chain', 'Book Cold-Chain Transport')}</span>
          </button>
        </div>
      </div>

      {/* Commodity Selector Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {MANDI_COMMODITIES.map((comm) => (
          <button
            key={comm.id}
            onClick={() => setSelectedCommodity(comm)}
            className={`px-4 py-3 rounded-xl border transition flex items-center gap-3 shrink-0 ${
              selectedCommodity.id === comm.id
                ? 'bg-gradient-to-r from-emerald-500/25 to-emerald-500/10 border-emerald-400 text-white shadow-lg'
                : 'bg-[#0a2318] border-emerald-500/20 text-slate-300 hover:bg-[#0d2e20]'
            }`}
          >
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white">{comm.name}</span>
                <span className="text-[11px] text-slate-400">({comm.hindiName})</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{comm.variety}</span>
            </div>

            <div className="text-right">
              <span className="font-extrabold text-xs text-white block">₹{comm.currentPrice}</span>
              <span
                className={`text-[10px] font-bold flex items-center justify-end ${
                  comm.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {comm.change24h >= 0 ? `+${comm.change24h}%` : `${comm.change24h}%`}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Grid: 7-Day Trend Chart + Nearby APMC Arbitrage Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                7-Day Price Volatility & Trend (₹ / Quintal)
              </span>
              <h3 className="text-lg font-extrabold text-white">
                {selectedCommodity.name} — Current: ₹{selectedCommodity.currentPrice}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                +6.2% 7D Gain
              </span>
            </div>
          </div>

          {/* Recharts Line Chart */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedCommodity.history7d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3b26" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  domain={['dataMin - 100', 'dataMax + 100']}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a2318',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`₹${value} / Quintal`, 'Mandi Price']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981', stroke: '#06150f', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#34d399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Arrivals at Azadpur APMC dropped by 14% this morning. Price premium expected to hold strong for next 48 hours.
            </span>
          </div>
        </div>

        {/* Nearby Mandis & Arbitrage Table (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">
              Nearby Mandi Arbitrage Matrix
            </h3>
            <span className="text-[10px] text-slate-400">Price minus Freight</span>
          </div>

          <div className="space-y-2.5">
            {selectedCommodity.markets.map((mkt, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition ${
                  mkt.isBestChoice
                    ? 'bg-gradient-to-r from-emerald-950/70 to-[#0d2e20] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-[#0d2e20]/60 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <h4 className="font-bold text-white text-xs">{mkt.name}</h4>
                  </div>
                  {mkt.isBestChoice && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Best Net Profit
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-300 my-1.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gross Rate</span>
                    <strong className="text-white">₹{mkt.price}/q</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Freight (km)</span>
                    <span className="text-slate-400">₹{mkt.freightCost} ({mkt.distanceKm}km)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Net Realization</span>
                    <strong className="text-emerald-400 font-bold">₹{mkt.netRealization}/q</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <strong>Arbitrage Recommendation:</strong> Dispatching 40 quintals to Azadpur Mandi rather than local APMC generates an estimated{' '}
            <strong className="text-amber-400">+₹6,800 net surplus</strong> after diesel and toll expenses.
          </div>
        </div>
      </div>
    </div>
  );
};
