import React, { useState } from 'react';
import {
  LayoutDashboard,
  Tractor,
  Truck,
  ScanEye,
  Droplets,
  CloudSun,
  Wheat,
  FlaskConical,
  TrendingUp,
  ShoppingBag,
  Milk,
  LineChart,
  Satellite,
  Leaf,
  Landmark,
  Bot,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useFarm, NavigationModule } from '../../lib/context/FarmContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeModule, setActiveModule, unreadCount } = useFarm();

  const navGroups: {
    title: string;
    items: {
      id: NavigationModule;
      label: string;
      icon: React.ElementType;
      badge?: string;
      color: string;
    }[];
  }[] = [
    {
      title: 'Core Management',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-emerald-400' },
        { id: 'farmer-profile', label: 'Farm Locations & GPS', icon: Compass, badge: 'All India', color: 'text-emerald-300' },
        { id: 'farms', label: 'Farms & Fields', icon: Tractor, color: 'text-amber-400' },
        { id: 'supply-chain', label: 'Supply Chain', icon: Truck, color: 'text-sky-400' },
      ],
    },
    {
      title: 'Agronomy & Sensors',
      items: [
        { id: 'crops-disease', label: 'Vision AI Diagnostics', icon: ScanEye, badge: 'AI', color: 'text-emerald-400' },
        { id: 'irrigation', label: 'Smart Irrigation', icon: Droplets, color: 'text-sky-400' },
        { id: 'weather', label: 'Weather Intel', icon: CloudSun, color: 'text-amber-400' },
        { id: 'crops-recommend', label: 'Crop Recommender', icon: Wheat, color: 'text-emerald-400' },
        { id: 'soil', label: 'Soil Health', icon: FlaskConical, color: 'text-orange-400' },
      ],
    },
    {
      title: 'Commerce & Cattle',
      items: [
        { id: 'market', label: 'Mandi Intelligence', icon: TrendingUp, color: 'text-amber-400' },
        { id: 'marketplace', label: 'Agri Store', icon: ShoppingBag, color: 'text-emerald-400' },
        { id: 'livestock', label: 'Livestock & Dairy', icon: Milk, color: 'text-sky-400' },
        { id: 'analytics', label: 'Farm Analytics', icon: LineChart, color: 'text-emerald-400' },
      ],
    },
    {
      title: 'Intelligence & ESG',
      items: [
        { id: 'satellite', label: 'Satellite NDVI', icon: Satellite, color: 'text-cyan-400' },
        { id: 'sustainability', label: 'Sustainability & ESG', icon: Leaf, color: 'text-emerald-400' },
        { id: 'finance', label: 'Finance & Schemes', icon: Landmark, color: 'text-amber-400' },
        { id: 'assistant', label: 'AI Farm Advisor', icon: Bot, badge: 'Live', color: 'text-emerald-300' },
        { id: 'reports', label: 'Audit Report', icon: FileCheck2, color: 'text-slate-300' },
      ],
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#071d14] border-r border-emerald-500/20 transition-all duration-300 relative z-20 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0d2e20] border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg hover:bg-emerald-600 hover:text-white transition z-30"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top action: Platform Landing Link */}
      <div className="p-3 border-b border-emerald-500/10">
        <button
          onClick={() => setActiveModule('landing')}
          className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition text-xs font-semibold ${
            activeModule === 'landing'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-[#0d2e20]/60 border-emerald-500/20 text-slate-300 hover:bg-[#0d2e20] hover:text-white'
          } ${collapsed ? 'justify-center' : ''}`}
          title="KHETIX Overview & Showcase"
        >
          <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>Platform Overview</span>}
        </button>
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6 scrollbar-thin scrollbar-thumb-emerald-900">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                {group.title}
              </h5>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/25 to-emerald-500/10 border-l-4 border-emerald-400 text-white font-bold shadow-md shadow-emerald-950/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.color} group-hover:scale-110 transition`} />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Promo Card */}
      {!collapsed && (
        <div className="p-3 border-t border-emerald-500/10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#0d2e20] to-[#082217] border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Rules Active</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Autonomous irrigation delay active for tomorrow's rain forecast.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
