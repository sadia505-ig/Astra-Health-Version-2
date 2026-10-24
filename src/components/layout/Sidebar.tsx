import React from 'react';
import { NavTab } from './Navigation';
import { HealthTabType } from '../modules/HealthView';
import { 
  Sparkles,
  LayoutDashboard, 
  HeartPulse, 
  TrendingUp, 
  ClipboardCheck, 
  Brain, 
  BellRing, 
  History, 
  Bot, 
  Rocket, 
  Users, 
  Settings as SettingsIcon,
  ShieldCheck,
  Activity,
  Heart,
  Smile,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNavigateToHealthDomain?: (domain: HealthTabType) => void;
  unacknowledgedAlertsCount?: number;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  healthDomain?: HealthTabType;
  badge?: number;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onNavigateToHealthDomain,
  unacknowledgedAlertsCount = 0,
}) => {
  // Navigation structure organized strictly per Section 18
  const groups: NavGroup[] = [
    {
      groupLabel: 'OVERVIEW',
      items: [
        { id: 'landing', label: 'Spatial Hub', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
        { id: 'overview', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4 text-sky-400" /> },
      ],
    },
    {
      groupLabel: 'HEALTH',
      items: [
        { id: 'physical', label: 'Bio Signal', icon: <Heart className="w-4 h-4 text-rose-400" /> },
        { id: 'mental', label: 'Neural Signal', icon: <Brain className="w-4 h-4 text-purple-400" /> },
      ],
    },
    {
      groupLabel: 'INSIGHTS',
      items: [
        { id: 'trends', label: 'Trends & Baselines', icon: <TrendingUp className="w-4 h-4 text-cyan-400" /> },
        { id: 'astra-ai', label: 'ASTRA AI', icon: <Bot className="w-4 h-4 text-emerald-400" /> },
        { id: 'alerts', label: 'Alerts', icon: <BellRing className="w-4 h-4 text-rose-400" /> },
      ],
    },
    {
      groupLabel: 'ACTIONS',
      items: [
        { id: 'check-in', label: 'Daily Check-in', icon: <ClipboardCheck className="w-4 h-4 text-amber-400" /> },
      ],
    },
    {
      groupLabel: 'MISSION',
      items: [
        { id: 'profile', label: 'Mission Profile', icon: <User className="w-4 h-4 text-cyan-400" /> },
        { id: 'timeline', label: 'Timeline', icon: <History className="w-4 h-4 text-sky-400" /> },
        { id: 'mission', label: 'Mission Data', icon: <Rocket className="w-4 h-4 text-purple-400" /> },
        { id: 'crew', label: 'Crew Telemetry', icon: <Users className="w-4 h-4 text-teal-400" /> },
      ],
    },
    {
      groupLabel: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4 text-amber-400" /> },
      ],
    },
  ];

  const handleItemClick = (item: NavItem) => {
    if (item.healthDomain && onNavigateToHealthDomain) {
      onNavigateToHealthDomain(item.healthDomain);
    } else {
      onSelectTab(item.id);
    }
  };

  // Mobile primary items for quick bottom navigation
  const mobileItems = [
    { id: 'landing' as NavTab, label: 'Hub', icon: <Sparkles className="w-5 h-5 text-cyan-400" /> },
    { id: 'overview' as NavTab, label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'health' as NavTab, label: 'Physical', icon: <Heart className="w-5 h-5" />, domain: 'PHYSICAL' as HealthTabType },
    { id: 'health' as NavTab, label: 'Mental', icon: <Brain className="w-5 h-5" />, domain: 'MENTAL' as HealthTabType },
    { id: 'astra-ai' as NavTab, label: 'AI', icon: <Bot className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Grouped Sidebar (2 Columns in 12-Column Grid) */}
      <aside 
        id="desktop-mission-sidebar"
        aria-label="Mission Navigation Sidebar"
        className="hidden md:flex flex-col w-full h-full liquid-glass-pastel-cyan p-3 shadow-2xl relative overflow-hidden transition-all duration-300"
      >
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
        />

        {/* Sidebar Brand Header */}
        <div className="px-3 py-2 mb-2 border-b border-cyan-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 shadow-inner">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <span className="text-base font-black font-mono tracking-widest text-slate-100">
              ASTRA
            </span>
          </div>
          <div className="text-[10px] font-mono text-cyan-400 font-bold mt-1 uppercase tracking-widest">
            MISSION FLIGHT DECK
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <div className="flex flex-col gap-3 flex-1">
          {groups.map((group) => (
            <div key={group.groupLabel} className="space-y-1">
              {/* Group Label */}
              <div className="px-3 text-[10px] font-mono font-bold tracking-widest text-cyan-300/70 uppercase">
                {group.groupLabel}
              </div>

              {/* Items in Group */}
              <div className="space-y-0.5">
                {group.items.map((item, idx) => {
                  const isCurrentActive = activeTab === item.id || 
                    (item.id === 'overview' && activeTab === 'what-changed');
                  
                  return (
                    <button
                      key={`${group.groupLabel}-${item.label}-${idx}`}
                      id={`sidebar-link-${group.groupLabel.toLowerCase()}-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${
                        isCurrentActive
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isCurrentActive ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-500'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Operational Footer */}
        <div className="mt-4 pt-3 border-t border-cyan-500/20 px-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">BIO-TELEMETRY BUS ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030519]/35 border-t border-white/20 px-2 py-1.5 shadow-2xl"
      >
        <div className="flex items-center justify-around">
          {mobileItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={`${item.id}-${item.label}`}
                onClick={() => {
                  if (item.domain && onNavigateToHealthDomain) {
                    onNavigateToHealthDomain(item.domain);
                  } else {
                    onSelectTab(item.id);
                  }
                }}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition cursor-pointer ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-mono mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
