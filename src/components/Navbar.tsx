import React from 'react';
import {
  Activity,
  Bug,
  Database,
  Code2,
  CheckSquare,
  Smartphone,
  FileText,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  onOpenDocs: () => void;
  onSimulateCrash: () => void;
  unresolvedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  onOpenDocs,
  onSimulateCrash,
  unresolvedCount
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'crashes', label: 'Crash Logs', icon: Activity, badge: unresolvedCount },
    { id: 'sql', label: 'SQL Workbench', icon: Database },
    { id: 'dsa', label: 'C++ DSA Engine', icon: Code2 },
    { id: 'testing', label: 'QA Testing', icon: CheckSquare },
    { id: 'bugs', label: 'Bug Tracker', icon: Bug },
    { id: 'devices', label: 'Hardware & Devices', icon: Smartphone },
  ];

  const roles: UserRole[] = ['QA Lead', 'SDE Developer', 'SQL Architect', 'Test Engineer'];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between h-16 border-b border-slate-800/60 py-2">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                  Crash<span className="text-amber-400">Lens</span>
                </span>
                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  v2.4 QA Suite
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block font-sans">
                Mobile Crash Analytics • SQL Testing • C++ DSA Engine • Gemini AI
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Quick Simulate Crash Button */}
            <button
              onClick={onSimulateCrash}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Simulate Crash</span>
            </button>

            {/* Persona Switcher */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none pr-1 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-slate-100">
                    Role: {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Documentation Button */}
            <button
              onClick={onOpenDocs}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 ring-1 ring-slate-700/80 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Project Docs</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-amber-500 text-slate-950' : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
