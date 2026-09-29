import React, { useState } from 'react';
import {
  Truck,
  QrCode,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Thermometer,
  MapPin,
  FileCheck,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';

export const SupplyChainTracker: React.FC = () => {
  const { activeFarm } = useFarm();

  const [activeBatch, setActiveBatch] = useState({
    batchId: 'BATCH-TM-2026-0914',
    crop: 'Hybrid Tomato (Abhinav F1)',
    grade: 'Grade A Export Quality',
    quantityQuintals: 42,
    harvestDate: '2026-09-16 06:30 AM',
    packhouse: 'Nashik Agro Cold Storage Cluster 3',
    currentStage: 3, // 0: Harvested, 1: Quality Graded, 2: Cold Packaged, 3: In Transit, 4: Delivered
    carrier: 'Kisan Cold Logistics (Vehicle MH-15-EG-4821)',
    currentLocation: 'Passing Ghoti Toll Plaza, Mumbai-Agra Highway',
    destination: 'Azadpur APMC Mandi, Delhi (Shed 14)',
    temperature: '11.4°C (Target: 10-12°C)',
    relativeHumidity: '88%',
    compliance: 'Zero Residue Certified (FSSAI / APEDA standard)',
  });

  const stages = [
    { title: 'Field Harvested', desc: 'Handpicked at 70% pink break stage' },
    { title: 'Optical Sorting & Grading', desc: 'Sorted into Grade A (75-85mm)' },
    { title: 'Pre-Cooling & Packhouse', desc: 'Core temp dropped to 11°C' },
    { title: 'Reefer Truck In-Transit', desc: 'Real-time GPS & IoT temp logs' },
    { title: 'Terminal Mandi Arrival', desc: 'Buyer inspection & digital payout' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Farm-to-Market Supply Chain & Traceability
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
              Cold-Chain IoT
            </span>
          </div>
          <p className="text-xs text-slate-300">
            End-to-end dispatch telemetry, Reefer vehicle temperature tracking, and tamper-proof digital batch certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs">
            <span className="text-slate-400 block text-[10px]">Active Dispatch</span>
            <span className="font-bold text-white">{activeBatch.batchId}</span>
          </div>
        </div>
      </div>

      {/* Progress Stepper for Active Dispatch */}
      <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Live Transit Telemetry
            </span>
            <h3 className="text-lg font-extrabold text-white">
              {activeBatch.crop} • {activeBatch.quantityQuintals} Quintals
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs border border-sky-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>On Schedule • ETA: 14h 20m</span>
          </span>
        </div>

        {/* 5-Step Horizontal Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {stages.map((stg, idx) => {
            const isDone = idx < activeBatch.currentStage;
            const isCurrent = idx === activeBatch.currentStage;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs transition space-y-1.5 ${
                  isCurrent
                    ? 'bg-gradient-to-b from-sky-950/80 to-[#0d2e20] border-sky-400 shadow-lg'
                    : isDone
                    ? 'bg-[#0d2e20]/80 border-emerald-500/40 text-slate-200'
                    : 'bg-black/30 border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase">Step 0{idx + 1}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 text-sky-400 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
                <h4 className="font-bold text-white text-xs leading-snug">{stg.title}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{stg.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Live Vehicle IoT & Digital QR Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: In-Transit Vehicle Telematics */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <h3 className="font-extrabold text-base text-white">Reefer Truck IoT Telematics</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                <span>Cargo Temp</span>
              </div>
              <span className="text-base font-extrabold text-emerald-400">{activeBatch.temperature}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Humidity</span>
              </div>
              <span className="text-base font-extrabold text-white">{activeBatch.relativeHumidity}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Speed</span>
              </div>
              <span className="text-base font-extrabold text-white">62 km/h</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d2e20] border border-emerald-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Carrier Logistics:</span>
              <strong className="text-white">{activeBatch.carrier}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Position:</span>
              <span className="text-emerald-300 font-medium">{activeBatch.currentLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Destination:</span>
              <strong className="text-amber-300">{activeBatch.destination}</strong>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Digital QR Traceability Certificate */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">Digital Traceability Certificate</h3>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-4 rounded-xl bg-white text-slate-900 flex items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="font-black text-sm tracking-wide text-slate-950">KHETIX VERIFIED</div>
              <p className="text-[11px] font-mono text-slate-700 font-bold">{activeBatch.batchId}</p>
              <p className="text-[11px] text-emerald-800 font-semibold">Farmer: {activeFarm.farmerName}</p>
              <p className="text-[10px] text-slate-600">Geo: 20.0059° N, 73.7898° E</p>
            </div>

            {/* Visual QR Code Representation */}
            <div className="w-20 h-20 bg-slate-100 border border-slate-300 p-1.5 rounded-lg flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Certified APEDA Global GAP Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>MRL Laboratory Tested: Zero Detectable Organophosphates</span>
            </div>
          </div>

          <button
            onClick={() => alert(`Certificate ${activeBatch.batchId} shared to buyer terminal.`)}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Export & Share Buyer QR Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
