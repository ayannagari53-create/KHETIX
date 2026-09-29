import React, { useState } from 'react';
import { FarmProvider, useFarm } from './lib/context/FarmContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { NotificationDrawer } from './components/layout/NotificationDrawer';

// Module Components
import { LandingPage } from './components/modules/LandingPage';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { CropDiseaseDetector } from './components/modules/CropDiseaseDetector';
import { SmartIrrigation } from './components/modules/SmartIrrigation';
import { WeatherIntelligence } from './components/modules/WeatherIntelligence';
import { MarketIntelligence } from './components/modules/MarketIntelligence';
import { FarmManagement } from './components/modules/FarmManagement';
import { SupplyChainTracker } from './components/modules/SupplyChainTracker';
import { CropRecommendation } from './components/modules/CropRecommendation';
import { SoilHealthDiagnostics } from './components/modules/SoilHealthDiagnostics';
import { LivestockManagement } from './components/modules/LivestockManagement';
import { MarketplaceStore } from './components/modules/MarketplaceStore';
import { FarmAnalytics } from './components/modules/FarmAnalytics';
import { SatelliteNDVI } from './components/modules/SatelliteNDVI';
import { SustainabilityESG } from './components/modules/SustainabilityESG';
import { FinanceAndInsurance } from './components/modules/FinanceAndInsurance';
import { AgriAssistant } from './components/modules/AgriAssistant';
import { ReportGenerator } from './components/modules/ReportGenerator';
import { UniversalLocationSelector } from './components/modules/UniversalLocationSelector';

const MainLayout: React.FC = () => {
  const { activeModule, currentUser, authLoading } = useFarm();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Session verification loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#06150f] text-slate-100 flex flex-col items-center justify-center font-sans">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-emerald-500/20 animate-pulse mb-3">
          🌾
        </div>
        <h2 className="text-lg font-bold text-white tracking-wide">KHETIX</h2>
        <p className="text-xs text-emerald-400">Verifying secure agricultural session...</p>
      </div>
    );
  }

  // Route protection: Unauthenticated visitors view LandingPage, or can test Multilingual AI Assistant directly
  if ((!currentUser && activeModule !== 'assistant') || activeModule === 'landing') {
    return (
      <div className="min-h-screen bg-[#06150f] text-slate-100 flex flex-col font-sans">
        <Header onToggleNotifications={() => setNotificationsOpen(true)} />
        <main className="flex-1">
          <LandingPage />
        </main>
        <NotificationDrawer
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
        <MobileNav />
      </div>
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'crops-disease':
        return <CropDiseaseDetector />;
      case 'irrigation':
        return <SmartIrrigation />;
      case 'weather':
        return <WeatherIntelligence />;
      case 'market':
        return <MarketIntelligence />;
      case 'farms':
        return <FarmManagement />;
      case 'farmer-profile':
        return <UniversalLocationSelector />;
      case 'supply-chain':
        return <SupplyChainTracker />;
      case 'crops-recommend':
        return <CropRecommendation />;
      case 'soil':
        return <SoilHealthDiagnostics />;
      case 'livestock':
        return <LivestockManagement />;
      case 'marketplace':
        return <MarketplaceStore />;
      case 'analytics':
        return <FarmAnalytics />;
      case 'satellite':
        return <SatelliteNDVI />;
      case 'sustainability':
        return <SustainabilityESG />;
      case 'finance':
        return <FinanceAndInsurance />;
      case 'assistant':
        return <AgriAssistant />;
      case 'reports':
        return <ReportGenerator />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#06150f] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Header onToggleNotifications={() => setNotificationsOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Responsive Desktop Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-8 bg-[#06150f] scrollbar-thin scrollbar-thumb-emerald-900">
          <div className="max-w-7xl mx-auto">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Floating Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Bottom Navigation for Mobile Devices */}
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <MainLayout />
    </FarmProvider>
  );
}
