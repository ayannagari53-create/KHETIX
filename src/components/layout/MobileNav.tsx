import React, { useState } from 'react';
import {
  LayoutDashboard,
  Tractor,
  Bot,
  TrendingUp,
  Menu,
  X,
  Droplets,
  ScanEye,
  Wheat,
  FlaskConical,
  Satellite,
  ShoppingBag,
  Milk,
  FileCheck2,
  Landmark,
} from 'lucide-react';
import { useFarm, NavigationModule } from '../../lib/context/FarmContext';

export const MobileNav: React.FC = () => {
  const { activeModule, setActiveModule, t } = useFarm();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs: { id: NavigationModule; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t('nav_dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'farms', label: t('nav_farms', 'Fields'), icon: Tractor },
    { id: 'assistant', label: t('nav_assistant', 'AI Farm'), icon: Bot },
    { id: 'market', label: t('nav_market', 'Mandi'), icon: TrendingUp },
  ];

  const moreModules: { id: NavigationModule; label: string; icon: React.ElementType }[] = [
    { id: 'crops-disease', label: t('nav_disease', 'Vision AI Diagnostics'), icon: ScanEye },
    { id: 'irrigation', label: t('nav_irrigation', 'Smart Irrigation'), icon: Droplets },
    { id: 'crops-recommend', label: t('nav_crops_recommend', 'Crop Recommender'), icon: Wheat },
    { id: 'soil', label: t('nav_soil', 'Soil Health'), icon: FlaskConical },
    { id: 'satellite', label: t('nav_satellite', 'Satellite NDVI'), icon: Satellite },
    { id: 'marketplace', label: t('nav_marketplace', 'Agri Marketplace'), icon: ShoppingBag },
    { id: 'livestock', label: t('nav_livestock', 'Livestock & Dairy'), icon: Milk },
    { id: 'finance', label: t('nav_finance', 'Finance & Schemes'), icon: Landmark },
    { id: 'reports', label: t('nav_reports', 'Audit Report'), icon: FileCheck2 },
  ];

  return (
    <>
      {/* Floating Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071d14]/95 backdrop-blur-xl border-t border-emerald-500/30 px-3 py-2 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        {/* More Drawer Trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">{t('nav_more', 'More')}</span>
        </button>
      </nav>

      {/* Full-Screen Mobile Drawer for Other Modules */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in">
          <div className="bg-[#0a2318] border-t border-emerald-500/30 rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌾</span>
                <h3 className="font-bold text-white text-base">{t('nav_all_modules', 'All Intelligence Modules')}</h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreModules.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setActiveModule(mod.id);
                      setDrawerOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-[#0d2e20] border-emerald-500/20 text-slate-200 hover:bg-emerald-950'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{mod.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveModule('landing');
                  setDrawerOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Go to Landing & Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
