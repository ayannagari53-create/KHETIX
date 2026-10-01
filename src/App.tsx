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

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-[#0a2318] border border-red-500/30 text-white max-w-lg mx-auto my-12 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-xl mx-auto">
            ⚠️
          </div>
          <h3 className="text-lg font-bold">
            {this.props.fallbackTitle || 'Unable to load module'}
          </h3>
          <p className="text-xs text-slate-300">
            {this.state.error?.message || 'An unexpected error occurred while rendering this section.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Retry Loading
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#0d2e20] hover:bg-[#123828] border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainLayout: React.FC = () => {
  const { activeModule, setActiveModule, currentUser, authLoading } = useFarm();
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
            <ErrorBoundary onReset={() => setActiveModule('dashboard')}>
              {renderActiveModule()}
            </ErrorBoundary>
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
    <ErrorBoundary>
      <FarmProvider>
        <MainLayout />
      </FarmProvider>
    </ErrorBoundary>
  );
}
