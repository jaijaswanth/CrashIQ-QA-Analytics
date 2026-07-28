import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Play,
  ShieldAlert,
  Zap,
  Download,
  FileSpreadsheet,
  FileText,
  Clock,
  Layers,
  Database
} from 'lucide-react';
import { TestCase, TestCategory, TestStatus } from '../types';

interface QaTestingViewProps {
  testCases: TestCase[];
  onUpdateTestCase: (id: string, status: TestStatus, actual: string) => void;
}

export const QaTestingView: React.FC<QaTestingViewProps> = ({
  testCases,
  onUpdateTestCase
}) => {
  const [activeCategory, setActiveCategory] = useState<TestCategory | 'All'>('All');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);

  const categories: (TestCategory | 'All')[] = ['All', 'Functional', 'Database', 'Performance', 'Security'];

  const filteredTests = testCases.filter(t => activeCategory === 'All' || t.category === activeCategory);

  const handleRunStressTest = async () => {
    setIsBenchmarking(true);
    try {
      const response = await fetch('/api/testing/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 10000 })
      });
      const data = await response.json();
      setBenchmarkResult(data);
    } catch (err) {
      console.error('Benchmark error:', err);
    } finally {
      setIsBenchmarking(false);
    }
  };

  const handleExportTestCasesXlsx = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "TestID,Category,Module,Title,Status,Tester,TimeMs\n"
      + testCases.map(t => `${t.testcase_id},${t.category},${t.module},"${t.title}",${t.status},${t.tester},${t.execution_time_ms}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TestCases.xlsx.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-mono">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            Software Testing & QA Validation Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Functional, Database, Performance Stress Benchmark (10,000 logs), and Security Vulnerability Testing
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportTestCasesXlsx}
            className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export TestCases.xlsx</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {cat} Tests
          </button>
        ))}
      </div>

      {/* Performance Stress Test Card (Shows when Performance or All selected) */}
      {(activeCategory === 'Performance' || activeCategory === 'All') && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-indigo-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
                Performance Benchmark Engine
              </span>
              <h2 className="text-lg font-bold text-white font-mono mt-1">
                Ingest 10,000 Crash Logs Stress Test
              </h2>
            </div>

            <button
              onClick={handleRunStressTest}
              disabled={isBenchmarking}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isBenchmarking ? 'Ingesting 10k Logs...' : 'Run 10,000 Ingestion Test'}</span>
            </button>
          </div>

          {benchmarkResult && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px]">Processed:</span>
                <p className="text-amber-400 font-bold text-sm">{benchmarkResult.total_logs_processed.toLocaleString()} logs</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Execution Time:</span>
                <p className="text-emerald-400 font-bold text-sm">{benchmarkResult.execution_time_ms} ms</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Throughput:</span>
                <p className="text-sky-400 font-bold text-sm">{benchmarkResult.throughput_logs_per_sec.toLocaleString()} logs/sec</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Memory Spike:</span>
                <p className="text-rose-400 font-bold text-sm">{benchmarkResult.memory_allocated_mb} MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Cases Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          QA Test Suite Execution Grid ({filteredTests.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Test ID</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Test Title</th>
                <th className="py-2.5 px-3">Expected vs Actual</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Tester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTests.map((tc) => (
                <tr key={tc.testcase_id} className="hover:bg-slate-800/40 font-mono">
                  <td className="py-3 px-3 font-bold text-amber-300">{tc.testcase_id}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {tc.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{tc.module}</td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-100 max-w-xs">{tc.title}</td>
                  <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs font-sans">
                    <div><span className="text-slate-500">Exp:</span> {tc.expected}</div>
                    <div className="text-emerald-400"><span className="text-slate-500">Act:</span> {tc.actual}</div>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={tc.status}
                      onChange={(e) => onUpdateTestCase(tc.testcase_id, e.target.value as TestStatus, tc.actual)}
                      className={`px-2 py-1 rounded text-[10px] font-bold focus:outline-none cursor-pointer ${
                        tc.status === 'Passed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      <option value="Passed" className="bg-slate-900 text-emerald-300">Passed</option>
                      <option value="Failed" className="bg-slate-900 text-rose-300">Failed</option>
                      <option value="Pending" className="bg-slate-900 text-slate-300">Pending</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{tc.tester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
