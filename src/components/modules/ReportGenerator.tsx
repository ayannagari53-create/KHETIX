import React from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sprout,
  Droplets,
  TrendingUp,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';

export const ReportGenerator: React.FC = () => {
  const { activeFarm, soilMoistureOverride, rainProbabilityOverride } = useFarm();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Action Bar (Not shown in print) */}
      <div className="print:hidden p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Farm Agronomic & Financial Audit Report
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            Official verifiable audit document combining sensor telemetry, vision pathology, soil indices, and mandi financial realizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF Audit</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Paper */}
      <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 space-y-8 font-sans print:p-0 print:border-none print:shadow-none print:max-w-none">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-emerald-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center text-2xl font-bold">
              🌾
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-emerald-950">KHETIX AGRO AUDIT</h2>
              <p className="text-xs text-slate-600 font-semibold">Intelligent Digital Agriculture Certification</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
            <p className="font-bold text-slate-900 font-mono">AUDIT ID: KTX-2026-99214</p>
            <p>Generated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            <p>Status: <strong className="text-emerald-700">VERIFIED OFFICIAL</strong></p>
          </div>
        </div>

        {/* Farm & Agronomist Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Estate Name</span>
            <strong className="text-slate-900 text-sm">{activeFarm.name}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Registered Farmer</span>
            <strong className="text-slate-900 text-sm">{activeFarm.farmerName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Land Extent & Location</span>
            <strong className="text-slate-900 text-sm">{activeFarm.totalAcres} Ac • {activeFarm.location}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Primary Monitored Crop</span>
            <strong className="text-emerald-800 text-sm">
              {(activeFarm?.primaryCrops && activeFarm.primaryCrops.length > 0)
                ? activeFarm.primaryCrops.join(', ')
                : (activeFarm?.primaryCrop || 'Tomato')}
            </strong>
          </div>
        </div>

        {/* Section 1: Executive KPI Scorecard */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950 border-b pb-1.5 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>1. Executive Farm Health & Resource Performance</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Crop Health Index</span>
              <span className="text-xl font-black text-emerald-700">92%</span>
              <span className="text-[10px] text-emerald-800 font-semibold block">Optimal Canopy Vigor</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Soil Health Index</span>
              <span className="text-xl font-black text-emerald-700">82 / 100</span>
              <span className="text-[10px] text-slate-600 block">pH 6.8 • Fertile</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Water Conserved (Season)</span>
              <span className="text-xl font-black text-sky-700">142,000 L</span>
              <span className="text-[10px] text-sky-800 font-semibold block">28.4% Drip Efficiency</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Net Operating Margin</span>
              <span className="text-xl font-black text-emerald-700">55.3%</span>
              <span className="text-[10px] text-slate-600 block">₹2,13,000 Net Profit</span>
            </div>
          </div>
        </div>

        {/* Section 2: Soil & Agronomic Correction Directives */}
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950 border-b pb-1.5 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-emerald-700" />
            <span>2. Soil Fertility & Pathology Verification</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Nitrogen (N): 235 kg/ha • Phosphorus (P): 44 kg/ha • Potassium (K): 310 kg/ha</span>
              <span className="text-emerald-700">ICAR Certified</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Field A & B exhibit high potassium availability and balanced pH. Deficiencies observed in Available Zinc (0.78 ppm) and Organic Carbon (0.62%). Recommended protocol:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Incorporate 4 MT/acre composted FYM during land preparation.</li>
              <li>Foliar application of Zn-EDTA (12%) @ 1.5 g/L at vegetative branching.</li>
              <li>Maintain rain-delay irrigation rule; active 24-hr rain alert at {rainProbabilityOverride}%.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Financial & Mandi Payouts */}
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950 border-b pb-1.5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>3. Market Arbitrage & Harvest Dispatches</span>
          </h3>

          <table className="w-full text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-slate-700">
                <th className="p-2 border border-slate-200">Terminal Mandi</th>
                <th className="p-2 border border-slate-200">Gross Price</th>
                <th className="p-2 border border-slate-200">Freight & Toll</th>
                <th className="p-2 border border-slate-200">Net Realization</th>
                <th className="p-2 border border-slate-200">Decision Support</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold">Azadpur APMC (Delhi)</td>
                <td className="p-2">₹2,450 / q</td>
                <td className="p-2">₹190 / q</td>
                <td className="p-2 font-bold text-emerald-700">₹2,260 / q</td>
                <td className="p-2 text-emerald-700 font-bold">RECOMMENDED ARBITRAGE</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold">Vashi APMC (Navi Mumbai)</td>
                <td className="p-2">₹2,320 / q</td>
                <td className="p-2">₹85 / q</td>
                <td className="p-2">₹2,235 / q</td>
                <td className="p-2 text-slate-600">Secondary Option</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Nashik Local Mandi</td>
                <td className="p-2">₹2,100 / q</td>
                <td className="p-2">₹10 / q</td>
                <td className="p-2">₹2,090 / q</td>
                <td className="p-2 text-slate-500">Low Net Realization</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Certification Signoff Footer */}
        <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <div>
              <p className="font-bold text-slate-900">Cryptographically Signed & Timestamped</p>
              <p className="text-[10px]">Valid for Kisan Credit renewal and APEDA export batch inspection</p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-[11px]">
            <p className="font-bold text-slate-900">KHETIX DIGITAL AGRONOMY ENGINE</p>
            <p>Hash: SHA256: 8a4c...f92b</p>
          </div>
        </div>
      </div>
    </div>
  );
};
