import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Code2,
  Bug,
  CheckCircle,
  XCircle,
  Terminal,
  Clock,
  Smartphone,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { CrashLog, Severity, CrashStatus } from '../types';

interface CrashLogsViewProps {
  crashLogs: CrashLog[];
  onUpdateStatus: (id: string, status: CrashStatus) => void;
  onSimulateCrash: () => void;
  onCreateBugFromCrash: (crash: CrashLog) => void;
}

export const CrashLogsView: React.FC<CrashLogsViewProps> = ({
  crashLogs,
  onUpdateStatus,
  onSimulateCrash,
  onCreateBugFromCrash
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [moduleFilter, setModuleFilter] = useState<string>('All');

  const [selectedCrash, setSelectedCrash] = useState<CrashLog | null>(crashLogs[0] || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [copiedTrace, setCopiedTrace] = useState(false);

  // Filter logic
  const filteredLogs = crashLogs.filter((log) => {
    const matchesSearch =
      log.crash_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.exception_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.stack_trace.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    const matchesModule = moduleFilter === 'All' || log.module_name === moduleFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesModule;
  });

  const handleSelectCrash = (crash: CrashLog) => {
    setSelectedCrash(crash);
    setAiResult(crash.ai_analysis || null);
  };

  // Run Gemini AI Diagnostics
  const handleRunAiAnalysis = async () => {
    if (!selectedCrash) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exception_type: selectedCrash.exception_type,
          stack_trace: selectedCrash.stack_trace,
          module_name: selectedCrash.module_name,
          device_model: selectedCrash.device_model || 'Pixel 8',
          android_version: selectedCrash.android_version || 'Android 14'
        })
      });

      const data = await response.json();
      setAiResult(data);
      selectedCrash.ai_analysis = data;
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyStackTrace = () => {
    if (!selectedCrash) return;
    navigator.clipboard.writeText(selectedCrash.stack_trace);
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30">Low</span>;
    }
  };

  const getStatusBadge = (st: CrashStatus) => {
    switch (st) {
      case 'Resolved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Resolved</span>;
      case 'Investigating':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">Investigating</span>;
      case 'Ignored':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-400">Ignored</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">New</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-mono">
            <Activity className="w-5 h-5 text-amber-400" />
            Crash Logs Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time mobile stack trace unwinding, severity tagging, and Gemini AI root-cause diagnostics
          </p>
        </div>

        <button
          onClick={onSimulateCrash}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Inbound Crash</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search ID, Exception, Stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="All">Severity: All</option>
          <option value="Critical">Critical (P0)</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="All">Status: All</option>
          <option value="New">New</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
          <option value="Ignored">Ignored</option>
        </select>

        {/* Module Filter */}
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="All">Module: All</option>
          <option value="Login Module">Login Module</option>
          <option value="Payment Checkout">Payment Checkout</option>
          <option value="Sync Engine">Sync Engine</option>
          <option value="Biometric Security">Biometric Security</option>
          <option value="Analytics Dashboard">Analytics Dashboard</option>
          <option value="Media Gallery">Media Gallery</option>
        </select>
      </div>

      {/* Main Grid: Logs List + Stack Trace Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Crash Logs Table (8 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Crash Records ({filteredLogs.length})
            </span>
            <span className="text-[11px] text-slate-500">Click row to inspect stack trace</span>
          </div>

          <div className="overflow-y-auto max-h-[600px] divide-y divide-slate-800/80">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No crash logs matched current filters.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isSelected = selectedCrash?.crash_id === log.crash_id;
                return (
                  <div
                    key={log.crash_id}
                    onClick={() => handleSelectCrash(log)}
                    className={`p-4 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-l-4 border-l-amber-500'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-amber-300">{log.crash_id}</span>
                        {getSeverityBadge(log.severity)}
                        {getStatusBadge(log.status)}
                      </div>

                      <p className="text-xs font-bold text-slate-100 font-mono truncate max-w-sm">
                        {log.exception_type}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-sans">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-500" />
                          {log.module_name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-slate-500" />
                          {log.device_model || 'Pixel 8'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-slate-500 font-mono whitespace-nowrap">
                      {log.crash_time.substring(5, 16)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Stack Trace Inspector & Gemini AI Diagnosis (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          {selectedCrash ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-amber-400">{selectedCrash.crash_id}</span>
                    {getSeverityBadge(selectedCrash.severity)}
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 font-mono mt-1">
                    {selectedCrash.exception_type}
                  </h3>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleCopyStackTrace}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                    title="Copy Stack Trace"
                  >
                    {copiedTrace ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Crash Context Details */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-500 text-[10px]">App & Module:</span>
                  <p className="text-slate-200 font-medium">{selectedCrash.app_name} ({selectedCrash.module_name})</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Device & OS:</span>
                  <p className="text-slate-200 font-medium">{selectedCrash.device_model} • {selectedCrash.android_version}</p>
                </div>
              </div>

              {/* Stack Trace Code Box */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    Stack Trace
                  </span>
                  <span className="text-[10px] text-slate-500">Unwound Frames</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-rose-300 leading-relaxed overflow-x-auto max-h-48 scrollbar-thin">
                  {selectedCrash.stack_trace.split('\n').map((line, idx) => (
                    <div key={idx} className={idx === 0 ? 'font-bold text-rose-400' : 'text-slate-400 hover:text-slate-200'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gemini AI Root Cause Diagnostic Box */}
              <div className="bg-gradient-to-b from-slate-950 to-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400 animate-spin-slow" />
                    Gemini AI Crash Diagnostic
                  </span>

                  <button
                    onClick={handleRunAiAnalysis}
                    disabled={isAnalyzing}
                    className="px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-bold rounded-lg border border-sky-500/30 transition-all flex items-center space-x-1"
                  >
                    {isAnalyzing ? (
                      <span>Analyzing...</span>
                    ) : (
                      <span>Run AI Diagnosis</span>
                    )}
                  </button>
                </div>

                {aiResult ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Root Cause:</span>
                      <p className="text-slate-200 mt-0.5">{aiResult.root_cause}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Recommended Fix:</span>
                      <p className="text-emerald-300 font-mono bg-slate-950/80 p-2 rounded border border-slate-800 mt-0.5">
                        {aiResult.suggested_fix}
                      </p>
                    </div>

                    {aiResult.c_plus_plus_fix && (
                      <div>
                        <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">C++ / Native Snippet:</span>
                        <p className="text-amber-300 font-mono bg-slate-950 p-2 rounded border border-slate-800 mt-0.5 text-[10px]">
                          {aiResult.c_plus_plus_fix}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Click "Run AI Diagnosis" to generate root cause analysis and C++ code fix patch using Gemini AI.
                  </p>
                )}
              </div>

              {/* Status Management & Auto Bug Creation */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={selectedCrash.status}
                    onChange={(e) => onUpdateStatus(selectedCrash.crash_id, e.target.value as CrashStatus)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Ignored">Ignored</option>
                  </select>
                </div>

                <button
                  onClick={() => onCreateBugFromCrash(selectedCrash)}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/40 transition-all flex items-center space-x-1"
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span>Create Bug Report</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select a crash log record from the table to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
