import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  CloudRain,
  TrendingUp,
  ScanEye,
  Tractor,
  Truck,
  FlaskConical,
  Wheat,
  Milk,
  ShoppingBag,
  LineChart,
  Satellite,
  Leaf,
  Landmark,
  Bot,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Lock,
  UserPlus,
} from 'lucide-react';
import { useFarm, NavigationModule } from '../../lib/context/FarmContext';
import { FarmScene3D } from '../3d/FarmScene3D';
import { AuthModal } from '../layout/AuthModal';

export const LandingPage: React.FC = () => {
  const { setActiveModule, currentUser, activeFarm, t } = useFarm();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const moduleShowcase: {
    id: NavigationModule;
    title: string;
    description: string;
    icon: React.ElementType;
    tag: string;
    accent: string;
  }[] = [
    {
      id: 'dashboard',
      title: t('nav_dashboard', 'Executive Farm Dashboard'),
      description: t('dash_ai_advisory', 'Unified telemetry cockpit monitoring live weather, soil moisture, NDVI, and APMC Mandi trends.'),
      icon: Sprout,
      tag: t('nav_core_management', 'Core Platform'),
      accent: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'crops-disease',
      title: t('nav_disease', 'Vision AI Crop Disease Diagnostics'),
      description: t('crop_detector_subtitle', 'Instant multi-model leaf and stem inspection with pathogen identification and chemical & organic treatments.'),
      icon: ScanEye,
      tag: 'Vision AI',
      accent: 'border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'irrigation',
      title: t('nav_irrigation', 'Smart Precision Irrigation Engine'),
      description: t('irrig_subtitle', 'Dynamic soil moisture vs. evapotranspiration calculator with automated rainfall delay rules.'),
      icon: Droplets,
      tag: 'Water Tech',
      accent: 'border-sky-500/40 text-sky-400',
    },
    {
      id: 'weather',
      title: t('nav_weather', 'Hyper-Local Weather Intelligence'),
      description: t('weather_subtitle', '7-day agronomic forecasts, spraying condition index, and precipitation storm alerts.'),
      icon: CloudRain,
      tag: 'Meteorology',
      accent: 'border-amber-500/40 text-amber-400',
    },
    {
      id: 'market',
      title: t('nav_market', 'Mandi Price & Arbitrage Intelligence'),
      description: t('market_subtitle', 'Live APMC market prices, 7D/30D price trends, and transport-adjusted arbitrage opportunities.'),
      icon: TrendingUp,
      tag: 'Fintech & APMC',
      accent: 'border-amber-500/40 text-amber-400',
    },
    {
      id: 'farms',
      title: t('nav_farms', 'Hierarchical Farm & Field Manager'),
      description: t('farm_mgmt_subtitle', 'Plot-level crop telemetry, IoT valve automation, and task scheduling checklists.'),
      icon: Tractor,
      tag: 'Agronomy ERP',
      accent: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'supply-chain',
      title: t('nav_supply_chain', 'Farm-to-Market Supply Chain Tracker'),
      description: t('supply_subtitle', 'Cold-chain dispatch monitoring, QR batch traceability, and digital quality certification.'),
      icon: Truck,
      tag: 'Logistics',
      accent: 'border-sky-500/40 text-sky-400',
    },
    {
      id: 'crops-recommend',
      title: 'Agronomic Crop Recommendation Engine',
      description: 'Soil type, pH, NPK, and water-availability matching algorithm for maximal acre profitability.',
      icon: Wheat,
      tag: 'Decision Engine',
      accent: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'soil',
      title: 'Soil Health & NPK Diagnostics',
      description: 'Soil Health Index scoring, macro & micronutrient gauges, and targeted organic correction advisories.',
      icon: FlaskConical,
      tag: 'Soil Chemistry',
      accent: 'border-orange-500/40 text-orange-400',
    },
    {
      id: 'livestock',
      title: 'Livestock & Dairy Analytics',
      description: 'Tag ID registry, lactation cycle monitoring, daily milk yield analytics, and vaccination tracking.',
      icon: Milk,
      tag: 'Animal Husbandry',
      accent: 'border-sky-500/40 text-sky-400',
    },
    {
      id: 'marketplace',
      title: 'Verified Agricultural Marketplace',
      description: 'Direct procurement of certified seeds, bio-fertilizers, and drip lines with Kisan subsidy discounts.',
      icon: ShoppingBag,
      tag: 'Commerce',
      accent: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'analytics',
      title: 'Farm Analytics & Net Margin Calculator',
      description: 'Cost of cultivation breakdown (seeds, labor, fertilizer, diesel) vs. gross harvest revenue.',
      icon: LineChart,
      tag: 'Profit & Loss',
      accent: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'satellite',
      title: 'Satellite NDVI & Drone Imagery',
      description: 'False-color vegetation index heatmaps, moisture stress zones, and drone flight waypoints.',
      icon: Satellite,
      tag: 'Remote Sensing',
      accent: 'border-cyan-500/40 text-cyan-400',
    },
    {
      id: 'sustainability',
      title: 'Sustainability & ESG Carbon Index',
      description: 'Farm sustainability scoring, carbon credit estimation (₹46,000+), and regenerative roadmap.',
      icon: Leaf,
      tag: 'Regenerative',
      accent: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'finance',
      title: 'Agri-Finance, Schemes & Insurance',
      description: 'PM-Kisan, PMFBY, PMKSY government subsidy navigator and digital 7/12 land document vault.',
      icon: Landmark,
      tag: 'Govt Schemes',
      accent: 'border-amber-500/40 text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06150f] text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-emerald-600/15 via-emerald-800/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="text-center space-y-6 max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('landing_hero_badge', 'Intelligent Digital Agriculture Platform')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.15]">
            {t('landing_hero_title_1', 'Empowering Farmers with')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              {t('landing_hero_title_2', 'Precision AI & Telemetry')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {t('landing_hero_subtitle', 'KHETIX connects real-time soil telemetry, hyper-local weather radar, satellite NDVI, and APMC Mandi feeds with agronomic rule engines and Vision AI to maximize farm yields and net profits.')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {currentUser ? (
              <button
                onClick={() => setActiveModule('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition cursor-pointer"
              >
                <span>{t('landing_cta_launch', 'Open Executive Dashboard')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth('signup')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('header_register', 'Register Farm & Location')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openAuth('login')}
                  className="px-6 py-3.5 rounded-xl bg-[#0d2e20] hover:bg-[#123828] border border-emerald-500/30 text-slate-200 hover:text-white font-bold text-sm flex items-center gap-2 transition"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>{t('header_sign_in', 'Farmer Sign In')}</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveModule('assistant')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>🗣️ {t('nav_assistant', 'AI Farm Advisor')}</span>
            </button>
          </div>
        </div>

        {/* Interactive 3D Farm Digital Twin Hero Component */}
        <div className="space-y-3 mb-14">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">{t('dash_3d_twin_title', 'Live 3D Digital Twin')}</span>
              <span className="text-xs text-slate-400 hidden sm:inline">• {activeFarm?.name || t('header_my_farm', 'My Farm')} ({activeFarm?.totalAcres || 12} {t('common_acres', 'Acres')})</span>
            </div>
            <div className="text-xs text-slate-400">
              {t('dash_view_3d', 'Interactive WebGL Twin')}
            </div>
          </div>
          <FarmScene3D className="w-full h-[460px]" />
        </div>

        {/* Trust Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-2xl">
          <div className="text-center md:border-r border-emerald-500/10">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">94,000+</div>
            <p className="text-xs text-slate-400 mt-1">Acres Monitored Daily</p>
          </div>
          <div className="text-center md:border-r border-emerald-500/10">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-display">28.4%</div>
            <p className="text-xs text-slate-400 mt-1">Water Saved via Drip AI</p>
          </div>
          <div className="text-center md:border-r border-emerald-500/10">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">₹4.8 Cr+</div>
            <p className="text-xs text-slate-400 mt-1">Farmer Mandi Value Unlocked</p>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">96.8%</div>
            <p className="text-xs text-slate-400 mt-1">Vision AI Accuracy</p>
          </div>
        </div>
      </section>

      {/* 15 Modules Showcase Grid */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Complete Agricultural Suite</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            15 Integrated Modules Built for Real Agronomy
          </h2>
          <p className="text-sm text-slate-300">
            Every module is engineered to operate seamlessly as an integrated system—from field sensors and vision diagnostics to APMC selling decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {moduleShowcase.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => {
                  if (currentUser) {
                    setActiveModule(mod.id);
                  } else {
                    openAuth('login');
                  }
                }}
                className="group p-5 rounded-2xl bg-[#0a2318]/80 hover:bg-[#0d2e20] border border-emerald-500/20 hover:border-emerald-500/50 transition duration-300 shadow-xl flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                  <span>{t('common_details', 'Explore Module')}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-[#0d2e20] via-[#09291b] to-[#0d2e20] border border-emerald-500/30 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {t('landing_hero_title_1', 'Ready to empower your farm with intelligence?')}
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {t('landing_hero_subtitle', 'Connect your field location, run AI vision leaf scans, monitor hyper-local radar forecasts, and track nearby APMC mandi arbitrage.')}
          </p>
          <button
            onClick={() => {
              if (currentUser) {
                setActiveModule('dashboard');
              } else {
                openAuth('signup');
              }
            }}
            className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm inline-flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition cursor-pointer"
          >
            <span>{currentUser ? t('landing_cta_launch', 'Enter Executive Dashboard') : t('header_register', 'Register Your Farm Now')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Real Farmer Auth & Onboarding Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
