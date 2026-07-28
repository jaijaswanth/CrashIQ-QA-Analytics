import React from 'react';
import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Smartphone,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from 'recharts';
import { CrashLog, BugReport, TestCase, Device } from '../types';

interface DashboardViewProps {
  crashLogs: CrashLog[];
  bugReports: BugReport[];
  testCases: TestCase[];
  devices: Device[];
  onNavigateTab: (tab: string) => void;
  onSelectCrash: (crash: CrashLog) => void;
}

const SEVERITY_COLORS = {
  Critical: '#f43f5e', // rose-500
  High: '#f97316',     // orange-500
  Medium: '#eab308',   // yellow-500
  Low: '#3b82f6',      // blue-500
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  crashLogs,
  bugReports,
  testCases,
  devices,
  onNavigateTab,
  onSelectCrash
}) => {
  // 1. Calculate Metrics
  const totalCrashes = crashLogs.length;
  const criticalCount = crashLogs.filter(c => c.severity === 'Critical' && c.status !== 'Resolved').length;
  const openBugsCount = bugReports.filter(b => b.bug_status !== 'Resolved' && b.bug_status !== 'Closed').length;

  const passedTests = testCases.filter(t => t.status === 'Passed').length;
  const testPassRate = testCases.length > 0 ? Math.round((passedTests / testCases.length) * 100) : 100;

  // 2. Chart Data: Severity Breakdown
  const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  crashLogs.forEach(c => {
    if (severityCounts[c.severity] !== undefined) {
      severityCounts[c.severity]++;
    }
  });

  const severityChartData = Object.entries(severityCounts).map(([name, value]) => ({
    name,
    value,
    color: SEVERITY_COLORS[name as keyof typeof SEVERITY_COLORS]
  }));

  // 3. Chart Data: Exception Type Aggregation
  const exceptionMap: Record<string, number> = {};
  crashLogs.forEach(c => {
    const shortName = c.exception_type.split('.').pop() || c.exception_type;
    exceptionMap[shortName] = (exceptionMap[shortName] || 0) + 1;
  });

  const exceptionChartData = Object.entries(exceptionMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 4. Chart Data: Crashes by Android OS Version
  const osMap: Record<string, number> = {};
  crashLogs.forEach(c => {
    const ver = c.android_version || 'Android 13';
    osMap[ver] = (osMap[ver] || 0) + 1;
  });

  const osChartData = Object.entries(osMap).map(([version, crashes]) => ({
    version,
    crashes
  }));

  // 5. Timeline Chart Mock Trend
  const timelineData = [
    { time: '08:00', crashes: 12, critical: 2 },
    { time: '10:00', crashes: 28, critical: 5 },
    { time: '12:00', crashes: 45, critical: 8 },
    { time: '14:00', crashes: 82, critical: 18 },
    { time: '16:00', crashes: 64, critical: 11 },
    { time: '18:00', crashes: 38, critical: 4 },
    { time: '20:00', crashes: 51, critical: 9 },
    { time: '22:00', crashes: 22, critical: 3 },
  ];

  // 6. Module Vulnerability Matrix
  const modules = ['Login Module', 'Payment Checkout', 'Sync Engine', 'Biometric Security', 'Analytics Dashboard'];
  const moduleRiskMatrix = modules.map(m => {
    const logs = crashLogs.filter(c => c.module_name === m);
    const criticals = logs.filter(c => c.severity === 'Critical').length;
    const topException = logs[0]?.exception_type.split('.').pop() || 'None';
    const riskScore = Math.min(100, logs.length * 15 + criticals * 25);
    return {
      module: m,
      total: logs.length,
      criticals,
      topException,
      riskScore
    };
  });

  return (
    <div className="space-[#111827] text-slate-100 min-h-screen pb-12 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>QA Intelligence & Testing Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              CrashLens Analytics Hub
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Collecting, analyzing, and predicting mobile application crashes using <span className="text-amber-300 font-medium">SQL Analytics</span>, <span className="text-emerald-300 font-medium font-mono">C++ DSA Log Processing</span>, and <span className="text-sky-300 font-medium">Gemini AI Diagnostics</span>.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateTab('sql')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20"
            >
              Run SQL Analytics
            </button>
            <button
              onClick={() => onNavigateTab('dsa')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              Open C++ DSA Engine
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Crashes */}
        <div
          onClick={() => onNavigateTab('crashes')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Crash Logs</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center ring-1 ring-amber-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{totalCrashes}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +14% vs avg
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Tracked across 4 mobile apps</p>
        </div>

        {/* Card 2: Unresolved Criticals */}
        <div
          onClick={() => onNavigateTab('crashes')}
          className="bg-slate-900/90 border border-rose-500/30 hover:border-rose-500/50 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Critical Crashes (P0)</span>
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center ring-1 ring-rose-500/30 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-rose-400 font-mono">{criticalCount}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
              Immediate Fix Required
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Auto-trigger linked to Bug Tracker</p>
        </div>

        {/* Card 3: QA Test Pass Rate */}
        <div
          onClick={() => onNavigateTab('testing')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">QA Test Suite Pass Rate</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{testPassRate}%</span>
            <span className="text-xs text-slate-400 font-medium">{passedTests} / {testCases.length} Passed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Functional, DB & Security tests</p>
        </div>

        {/* Card 4: Open Bug Reports */}
        <div
          onClick={() => onNavigateTab('bugs')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Bug Reports</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/20 group-hover:scale-110 transition-transform">
              <Bug className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{openBugsCount}</span>
            <span className="text-xs text-indigo-400 font-medium">Assigned to Devs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Linked to stack traces</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Hourly Crash Volume & Critical Spike Index
              </h2>
              <p className="text-xs text-slate-400">Real-time crash ingestion monitoring across all client devices</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded">
              Segment Tree Range Engine
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="crashes" name="Total Crashes" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="critical" name="Critical Crashes" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Donut Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Crash Severity Breakdown
            </h2>
            <p className="text-xs text-slate-400">Proportional classification of log items</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {severityChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between bg-slate-800/40 p-1.5 rounded">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Exception Types & Android Versions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Exception Types Bar Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-sky-400" />
            Top 5 Exception Types
          </h2>
          <p className="text-xs text-slate-400 mb-4">Aggregated using C++ Hash Map engine</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exceptionChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="type" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Bar dataKey="count" name="Crash Count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Android Version Vulnerability */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Crashes by Android OS Version
          </h2>
          <p className="text-xs text-slate-400 mb-4">SQL Window Function RANK() OVER analysis</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={osChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="version" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Bar dataKey="crashes" name="Crashes" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Module Risk Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Module Risk Assessment Matrix
            </h2>
            <p className="text-xs text-slate-400">High-risk mobile application modules requiring QA refactoring</p>
          </div>

          <button
            onClick={() => onNavigateTab('crashes')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center space-x-1"
          >
            <span>View All Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Module Name</th>
                <th className="py-2.5 px-3">Total Logs</th>
                <th className="py-2.5 px-3">Critical (P0)</th>
                <th className="py-2.5 px-3">Primary Exception</th>
                <th className="py-2.5 px-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {moduleRiskMatrix.map((item) => (
                <tr key={item.module} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-sans font-medium text-slate-100 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{item.module}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{item.total}</td>
                  <td className="py-3 px-3">
                    <span className={item.criticals > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {item.criticals}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{item.topException}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.riskScore > 70 ? 'bg-rose-500' : item.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${item.riskScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">{item.riskScore}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
