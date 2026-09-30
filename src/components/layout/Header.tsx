import React, { useState } from 'react';
import {
  Bell,
  CloudRain,
  ChevronDown,
  Globe,
  FileText,
  ShoppingBag,
  CheckCircle2,
  LogOut,
  User,
  LogIn,
  UserPlus,
  Plus,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onToggleNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleNotifications }) => {
  const {
    farms,
    activeFarm,
    setActiveFarmId,
    unreadCount,
    language,
    setLanguage,
    setActiveModule,
    cart,
    rainProbabilityOverride,
    currentUser,
    logout,
    t,
  } = useFarm();

  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const farmerName = currentUser?.name || activeFarm?.farmerName || 'Farmer';
  const farmerInitials =
    farmerName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'KH';

  const kisanId = currentUser?.kisanId || 'KISAN-IN-2026';

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#0a2318]/90 backdrop-blur-xl border-b border-emerald-500/20 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Brand Logo & Farm Switcher */}
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={() => setActiveModule(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white font-display">KHETIX</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Intelligent Agri-Platform</p>
          </div>
        </button>

        {/* Farm Switcher Dropdown (Shown only when logged in) */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d2e20] hover:bg-[#123828] border border-emerald-500/30 text-xs font-medium text-slate-200 transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <span className="font-bold text-white block max-w-[120px] sm:max-w-[160px] truncate">
                  {activeFarm?.name || 'My Farm'}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {activeFarm?.totalAcres || 0} Acres • {activeFarm?.location?.split(',')[0] || 'India'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
            </button>

          {farmDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-64 p-2 rounded-xl bg-[#0d2e20] border border-emerald-500/30 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                {t('header_registered_farms', 'Your Registered Farms')}
              </div>
              {farms.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFarmId(f.id);
                    setFarmDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg transition flex items-center justify-between text-xs ${
                    f.id === activeFarm?.id
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-white'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-bold text-white">{f.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {f.totalAcres} {t('common_acres', 'Acres')} • {f.state}
                    </p>
                  </div>
                  {f.id === activeFarm?.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}

              <div className="pt-2 border-t border-white/5 mt-1">
                <button
                  onClick={() => {
                    setActiveModule('farmer-profile');
                    setFarmDropdownOpen(false);
                  }}
                  className="w-full text-center py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>🌍 {t('header_change_location', 'Change Location & GPS Coordinates')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

      {/* Right: Actions, Weather Widget, Cart, Notification Bell, Profile */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Weather alert capsule */}
        <button
          onClick={() => setActiveModule('weather')}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/30 text-xs text-sky-200 transition"
        >
          <CloudRain className="w-4 h-4 text-sky-400 animate-bounce" />
          <span>
            {activeFarm?.district || 'Regional'} 28°C • <strong>{rainProbabilityOverride}% {t('rain_alert', 'Rain Alert')}</strong>
          </span>
        </button>

        {/* Audit Report Button */}
        <button
          onClick={() => setActiveModule('reports')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
          title={t('header_audit_report', 'Generate Farm Audit Report')}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('header_audit_report', 'Audit Report')}</span>
        </button>

        {/* Marketplace Cart */}
        <button
          onClick={() => setActiveModule('marketplace')}
          className="relative p-2 rounded-lg bg-[#0d2e20] hover:bg-[#123828] border border-emerald-500/20 text-slate-300 hover:text-white transition"
          title="Agri Marketplace Cart"
        >
          <ShoppingBag className="w-4 h-4" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-lg bg-[#0d2e20] hover:bg-[#123828] border border-emerald-500/20 text-slate-300 hover:text-white transition"
          title="Farm Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Multilingual selector (11 Indian languages) */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d2e20] hover:bg-[#123828] border border-emerald-500/20 text-xs text-slate-300"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase font-semibold">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 max-h-80 overflow-y-auto rounded-xl bg-[#0d2e20] border border-emerald-500/30 p-1.5 shadow-2xl z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Language
              </div>
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition flex items-center justify-between ${
                    language === item.code
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{item.flag}</span>
                    <span>{item.nativeName}</span>
                  </span>
                  {language === item.code && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Farmer Profile / Authentication */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-emerald-500/20">
          {currentUser ? (
            <>
              <button
                onClick={() => setActiveModule('farmer-profile')}
                className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer text-left"
                title="View Farmer Profile"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                  {farmerInitials}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <span className="font-bold text-white block leading-tight">{farmerName}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">{kisanId}</span>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                title={t('header_sign_out', 'Sign Out')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#0d2e20] hover:bg-[#123828] border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-1 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('header_sign_in', 'Sign In')}</span>
              </button>

              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition shadow-md shadow-emerald-500/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('header_register', 'Register')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};

