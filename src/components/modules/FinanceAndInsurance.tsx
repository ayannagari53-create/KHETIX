import React from 'react';
import {
  Landmark,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Download,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';

export const FinanceAndInsurance: React.FC = () => {
  const { activeFarm } = useFarm();

  const schemes = [
    {
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      category: 'Crop Insurance',
      status: 'Active / Covered',
      coverage: '₹4,80,000 Total Sum Insured',
      premiumPaid: '₹9,600 (Farmer share @ 2%)',
      claimStatus: 'No active claims (Policy #PMFBY-MH-2026-8812)',
    },
    {
      name: 'PM Kisan Samman Nidhi (PM-KISAN)',
      category: 'Direct Income Support',
      status: 'Enrolled / Active',
      coverage: '₹6,000 / Year in 3 Tranches',
      premiumPaid: 'Aadhaar / eKYC Verified',
      claimStatus: '17th Installment (₹2,000) Credited to SBI A/c ...4810',
    },
    {
      name: 'PM Krishi Sinchayee Yojana (PMKSY)',
      category: 'Micro-Irrigation Subsidy',
      status: 'Approved (55% Subsidy)',
      coverage: 'Drip System Subsidy for 12 Acres',
      premiumPaid: 'Subsidy Amount: ₹1,42,000',
      claimStatus: 'Inspection Verified by Taluka Agronomy Officer',
    },
  ];

  const documents = [
    { title: 'Digital 7/12 Land Record Extract (Nashik Gat #142)', size: '1.2 MB', date: 'Verified 2026-06' },
    { title: 'ICAR Soil Health Card Certificate (Field A & B)', size: '840 KB', date: 'Tested 2026-08' },
    { title: 'PMFBY Kharif Crop Insurance Policy Bond', size: '2.1 MB', date: 'Valid till 2026-11' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Landmark className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Agri-Finance, Schemes & Digital Vault
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Kisan Credit
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Kisan Credit Card (KCC) limit monitoring, government subsidy schemes, and institutional crop insurance records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs text-right">
            <span className="text-slate-400 block text-[10px]">KCC Limit</span>
            <span className="text-emerald-400 font-extrabold text-sm">₹3,00,000 @ 4% p.a.</span>
          </div>
        </div>
      </div>

      {/* 3 Government Subsidy Schemes */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-white font-display">
          Enrolled Government Agri Schemes & Policies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schemes.map((sc, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{sc.category}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {sc.status}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm leading-snug mb-2">
                  {sc.name}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Coverage / Benefit</span>
                    <strong className="text-emerald-400">{sc.coverage}</strong>
                  </div>
                  <div className="text-[11px] text-slate-300 pt-1">
                    {sc.claimStatus}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400 font-semibold cursor-pointer">
                <span>View Policy Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Vault */}
      <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-white">Digital Document & Land Vault</h3>
            <p className="text-xs text-slate-400">Encrypted records stored with Digilocker linkage</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0d2e20] border border-emerald-500/20 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-white leading-snug">{doc.title}</h5>
                  <span className="text-[10px] text-slate-400">{doc.date} • {doc.size}</span>
                </div>
              </div>
              <button
                onClick={() => alert(`Downloading ${doc.title}`)}
                className="p-2 rounded-lg bg-black/40 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
