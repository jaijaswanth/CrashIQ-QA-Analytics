import React, { useState } from 'react';
import {
  Database,
  Play,
  Copy,
  Check,
  Download,
  Table as TableIcon,
  Code,
  FileCode,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  Key
} from 'lucide-react';
import { SqlQueryResult } from '../types';
import {
  SQL_SCHEMA,
  SQL_SAMPLE_DATA,
  SQL_PROCEDURES,
  SQL_TRIGGERS,
  SQL_VALIDATION
} from '../data/sqlFiles';

export const SqlWorkbenchView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'schema' | 'artifacts'>('editor');
  const [queryInput, setQueryInput] = useState<string>(
    `SELECT model, COUNT(*) AS crashes, RANK() OVER(ORDER BY COUNT(*) DESC) AS crash_rank
FROM CrashLogs
JOIN Devices USING(device_id)
GROUP BY model;`
  );

  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>({
    query: `SELECT model, COUNT(*) AS crashes, RANK() OVER(ORDER BY COUNT(*) DESC) AS crash_rank FROM CrashLogs JOIN Devices USING(device_id) GROUP BY model;`,
    columns: ['model', 'crashes', 'crash_rank'],
    rows: [
      { model: 'Redmi Note 12', crashes: 112, crash_rank: 1 },
      { model: 'Galaxy A54', crashes: 84, crash_rank: 2 },
      { model: 'Pixel 6a', crashes: 71, crash_rank: 3 },
      { model: 'Realme 11 Pro', crashes: 63, crash_rank: 4 },
      { model: 'Pixel 8 Pro', crashes: 42, crash_rank: 5 },
    ],
    rowCount: 5,
    executionTimeMs: 4,
    description: 'Window Function RANK() OVER (ORDER BY COUNT(*) DESC) executed successfully.'
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<'schema' | 'sample' | 'procedures' | 'triggers' | 'validation'>('schema');
  const [copiedCode, setCopiedCode] = useState(false);

  // Preset SQL Queries
  const presets = [
    {
      name: '1. Window Function: Top Crash Devices (RANK() OVER)',
      query: `SELECT model, COUNT(*) AS crashes, RANK() OVER(ORDER BY COUNT(*) DESC) AS crash_rank
FROM CrashLogs
JOIN Devices USING(device_id)
GROUP BY model;`
    },
    {
      name: '2. View Selection: CriticalCrashView',
      query: `SELECT crash_id, crash_time, exception_type, module_name, severity, device_model
FROM CriticalCrashView;`
    },
    {
      name: '3. Stored Procedure: CALL GenerateDailyCrashReport()',
      query: `CALL GenerateDailyCrashReport();`
    },
    {
      name: '4. Foreign Key Integrity Validation',
      query: `SELECT u.user_id, u.name, u.device_id
FROM Users u
LEFT JOIN Devices d ON u.device_id = d.device_id
WHERE d.device_id IS NULL;`
    },
    {
      name: '5. Devices Table Inspection',
      query: `SELECT device_id, brand, model, ram, processor, android_version, total_crashes
FROM Devices;`
    }
  ];

  const handleExecuteQuery = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch('/api/sql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryInput })
      });
      const data = await response.json();
      setQueryResult(data);
    } catch (err) {
      console.error('SQL Execution failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const getArtifactContent = () => {
    switch (activeArtifact) {
      case 'schema': return SQL_SCHEMA;
      case 'sample': return SQL_SAMPLE_DATA;
      case 'procedures': return SQL_PROCEDURES;
      case 'triggers': return SQL_TRIGGERS;
      case 'validation': return SQL_VALIDATION;
    }
  };

  const getArtifactFileName = () => {
    switch (activeArtifact) {
      case 'schema': return 'schema.sql';
      case 'sample': return 'sample_data.sql';
      case 'procedures': return 'procedures.sql';
      case 'triggers': return 'triggers.sql';
      case 'validation': return 'SQLValidation.sql';
    }
  };

  const handleCopyArtifact = () => {
    navigator.clipboard.writeText(getArtifactContent());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadArtifact = () => {
    const blob = new Blob([getArtifactContent()], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getArtifactFileName();
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-mono">
            <Database className="w-5 h-5 text-amber-400" />
            SQL Analytics & Database Workbench
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive MySQL/SQLite query engine with Stored Procedures, Triggers, Views, and Window Functions
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-medium">
          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeSubTab === 'editor' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Query Workbench
          </button>
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeSubTab === 'schema' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ER Diagram & Schema
          </button>
          <button
            onClick={() => setActiveSubTab('artifacts')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeSubTab === 'artifacts' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Database Artifacts (.sql)
          </button>
        </div>
      </div>

      {/* VIEW 1: QUERY WORKBENCH */}
      {activeSubTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Editor Box (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-amber-400" />
                  SQL Query Editor
                </span>

                <button
                  onClick={handleExecuteQuery}
                  disabled={isExecuting}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
                </button>
              </div>

              {/* Preset Query Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Select Preset Portfolio Query:</label>
                <select
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {presets.map((p) => (
                    <option key={p.name} value={p.query} className="bg-slate-900 text-slate-200 font-mono">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Editor TextArea */}
              <textarea
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-300 leading-relaxed focus:outline-none focus:border-amber-500/80 shadow-inner"
              />
            </div>

            {/* Execution Results Table */}
            {queryResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white font-mono">Query Execution Results</span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                    <span>Rows: {queryResult.rowCount}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-3 h-3" />
                      {queryResult.executionTimeMs} ms
                    </span>
                  </div>
                </div>

                {queryResult.description && (
                  <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    {queryResult.description}
                  </p>
                )}

                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-amber-400 uppercase tracking-wider bg-slate-950/60">
                        {queryResult.columns.map((col) => (
                          <th key={col} className="py-2 px-3">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {queryResult.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          {queryResult.columns.map((col) => (
                            <td key={col} className="py-2.5 px-3 text-slate-200">
                              {String(row[col] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Quick Schema Reference (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <TableIcon className="w-4 h-4 text-amber-400" />
              Database Tables & Schema Rules
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200 font-mono">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Key className="w-3 h-3 text-amber-400" /> Devices
                  </span>
                  <span className="text-[10px] text-slate-500">PK: device_id</span>
                </div>
                <p className="text-slate-400 text-[11px]">device_id, brand, model, ram, processor, android_version</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200 font-mono">
                  <span className="flex items-center gap-1 text-sky-300">
                    <Key className="w-3 h-3 text-sky-400" /> Users
                  </span>
                  <span className="text-[10px] text-slate-500">PK: user_id | FK: device_id</span>
                </div>
                <p className="text-slate-400 text-[11px]">user_id, name, email, device_id, country, city, experience_level</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200 font-mono">
                  <span className="flex items-center gap-1 text-rose-300">
                    <Key className="w-3 h-3 text-rose-400" /> CrashLogs
                  </span>
                  <span className="text-[10px] text-slate-500">PK: crash_id | FK: user_id, app_id</span>
                </div>
                <p className="text-slate-400 text-[11px]">crash_id, user_id, app_id, crash_time, exception_type, stack_trace, module_name, severity, status</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200 font-mono">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <Key className="w-3 h-3 text-emerald-400" /> BugReports
                  </span>
                  <span className="text-[10px] text-slate-500">PK: bug_id | FK: crash_id</span>
                </div>
                <p className="text-slate-400 text-[11px]">bug_id, crash_id, priority, assigned_to, bug_status, created_date, fixed_date</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ER DIAGRAM & SCHEMA ARCHITECTURE */}
      {activeSubTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Relational Entity-Relationship (ER) Architecture
          </h2>

          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-xl">
                <span className="font-bold text-amber-400 text-sm">Devices</span>
                <p className="text-[11px] text-slate-400 mt-1">device_id (PK)</p>
                <div className="mt-3 text-amber-400/80 text-sm">1 : N</div>
                <p className="text-[10px] text-slate-500">One device model used by many users</p>
              </div>

              <div className="p-4 bg-slate-900 border border-sky-500/30 rounded-xl">
                <span className="font-bold text-sky-400 text-sm">Users</span>
                <p className="text-[11px] text-slate-400 mt-1">user_id (PK) • device_id (FK)</p>
                <div className="mt-3 text-sky-400/80 text-sm">1 : N</div>
                <p className="text-[10px] text-slate-500">User triggers multiple crash events</p>
              </div>

              <div className="p-4 bg-slate-900 border border-rose-500/30 rounded-xl">
                <span className="font-bold text-rose-400 text-sm">CrashLogs</span>
                <p className="text-[11px] text-slate-400 mt-1">crash_id (PK) • user_id (FK) • app_id (FK)</p>
                <div className="mt-3 text-rose-400/80 text-sm">1 : 1 (Auto Trigger)</div>
                <p className="text-[10px] text-slate-500">Critical crash auto-creates BugReport</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DOWNLOADABLE DATABASE ARTIFACTS (.SQL) */}
      {activeSubTab === 'artifacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Database Files (.sql)
            </h3>

            <div className="space-y-2">
              {[
                { id: 'schema', name: 'schema.sql', label: 'Database Schema & Tables' },
                { id: 'sample', name: 'sample_data.sql', label: 'Sample Seed Data' },
                { id: 'procedures', name: 'procedures.sql', label: 'Stored Procedures' },
                { id: 'triggers', name: 'triggers.sql', label: 'Critical Crash Triggers' },
                { id: 'validation', name: 'SQLValidation.sql', label: 'QA Validation & Window Queries' },
              ].map((art) => (
                <button
                  key={art.id}
                  onClick={() => setActiveArtifact(art.id as any)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    activeArtifact === art.id
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-mono">{art.name}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{art.label}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                {getArtifactFileName()}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyArtifact}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all flex items-center space-x-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy SQL</span>
                </button>

                <button
                  onClick={handleDownloadArtifact}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql</span>
                </button>
              </div>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-amber-200 leading-relaxed overflow-x-auto max-h-96 scrollbar-thin">
              {getArtifactContent()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
