import React from 'react';
import {
  Leaf,
  Droplets,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Award,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';

export const SustainabilityESG: React.FC = () => {
  const { activeFarm } = useFarm();

  const esgPillars = [
    {
      title: 'Water Efficiency & Conservation',
      score: 82,
      impact: '28.4% groundwater conserved via drip & rain-delay engine',
      color: 'text-sky-400',
      barColor: 'bg-sky-400',
    },
    {
      title: 'Soil Organic Carbon Sequestration',
      score: 76,
      impact: '0.62% to 0.78% projected through vermicompost & mulch',
      color: 'text-emerald-400',
      barColor: 'bg-emerald-400',
    },
    {
      title: 'Agro-Biodiversity & Cover Cropping',
      score: 71,
      impact: 'Inter-cropping marigold border traps for nematode biocontrol',
      color: 'text-amber-400',
      barColor: 'bg-amber-400',
    },
    {
      title: 'Chemical Reduction & Biocontrols',
      score: 74,
      impact: '38% synthetic pesticide replacement with Trichoderma bio-agent',
      color: 'text-emerald-300',
      barColor: 'bg-emerald-300',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Sustainability & Farm ESG Carbon Score
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Carbon Verified
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Measurement of regenerative agriculture practices, carbon sequestration tonnage, and global voluntary carbon credit eligibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs">
            <span className="text-slate-400 block text-[10px]">Verification Standard</span>
            <span className="font-bold text-white">Verra VCS / Gold Standard</span>
          </div>
        </div>
      </div>

      {/* Hero Score Banner with Carbon Monetization */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0a2318] to-[#0d2e20] border border-emerald-500/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 text-center lg:border-r border-emerald-500/20 pr-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Overall Farm Sustainability Index
          </span>
          <div className="text-6xl font-extrabold text-emerald-400 font-display">
            78<span className="text-2xl text-slate-400">/100</span>
          </div>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
            Tier-1 Regenerative Estate
          </span>
        </div>

        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Voluntary Carbon Market (VCM) Credit Projection</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display">
            Estimated Carbon Credits: 28.5 MT CO₂e / Year
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            By avoiding flood irrigation, adopting solar water pumping, and utilizing zero-tillage residue retention, {activeFarm.name} sequesters verified soil organic carbon eligible for direct monetization.
          </p>
          <div className="flex items-center gap-4 pt-1 text-xs">
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Annual Carbon Revenue</span>
              <strong className="text-emerald-400 text-sm">₹46,800 / yr</strong>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Credit Price</span>
              <strong className="text-white text-sm">$20 / MT (₹1,640)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 ESG Pillars Grid */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-white font-display">
          Regenerative Agriculture ESG Performance Pillars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {esgPillars.map((pil, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">{pil.title}</h4>
                <span className={`text-base font-extrabold ${pil.color}`}>
                  {pil.score}/100
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                <div
                  className={`h-full rounded-full ${pil.barColor}`}
                  style={{ width: `${pil.score}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-snug">
                {pil.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
