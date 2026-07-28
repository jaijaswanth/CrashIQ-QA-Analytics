import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CrashLogsView } from './components/CrashLogsView';
import { SqlWorkbenchView } from './components/SqlWorkbenchView';
import { DsaPlaygroundView } from './components/DsaPlaygroundView';
import { QaTestingView } from './components/QaTestingView';
import { BugTrackerView } from './components/BugTrackerView';
import { DevicesView } from './components/DevicesView';
import { ProjectDocsModal } from './components/ProjectDocsModal';

import { CrashLog, BugReport, TestCase, Device, UserRole, CrashStatus, BugStatus, TestStatus } from './types';
import {
  INITIAL_CRASH_LOGS,
  INITIAL_BUG_REPORTS,
  INITIAL_TEST_CASES,
  INITIAL_DEVICES
} from './data/mockData';
import { Activity, Zap, Plus, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeRole, setActiveRole] = useState<UserRole>('QA Lead');

  const [crashLogs, setCrashLogs] = useState<CrashLog[]>(INITIAL_CRASH_LOGS);
  const [bugReports, setBugReports] = useState<BugReport[]>(INITIAL_BUG_REPORTS);
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);

  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Inbound crash simulation modal form inputs
  const [simApp, setSimApp] = useState('CrashLens Mobile');
  const [simModule, setSimModule] = useState('Login Module');
  const [simException, setSimException] = useState('java.lang.NullPointerException');
  const [simSeverity, setSimSeverity] = useState<CrashLog['severity']>('Critical');
  const [simDevice, setSimDevice] = useState('Pixel 8 Pro');
  const [simAndroid, setSimAndroid] = useState('Android 14');
  const [simTrace, setSimTrace] = useState(
    `java.lang.NullPointerException: Attempt to invoke virtual method 'String getAuthToken()' on a null object reference\n    at com.crashlens.login.LoginRepository.verifyUserToken(LoginRepository.java:65)\n    at com.crashlens.network.ApiClient.attachHeaders(ApiClient.java:142)`
  );

  // Fetch initial data from server API endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crashesRes, bugsRes, testRes, devRes] = await Promise.all([
          fetch('/api/crashes'),
          fetch('/api/bugs'),
          fetch('/api/testcases'),
          fetch('/api/devices')
        ]);

        if (crashesRes.ok) setCrashLogs(await crashesRes.json());
        if (bugsRes.ok) setBugReports(await bugsRes.json());
        if (testRes.ok) setTestCases(await testRes.json());
        if (devRes.ok) setDevices(await devRes.json());
      } catch (err) {
        console.log('Using initial client datasets fallback:', err);
      }
    };
    fetchData();
  }, []);

  // Update Crash Status
  const handleUpdateCrashStatus = async (id: string, status: CrashStatus) => {
    setCrashLogs(prev => prev.map(c => c.crash_id === id ? { ...c, status } : c));
    try {
      await fetch(`/api/crashes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Update Bug Status
  const handleUpdateBugStatus = async (id: string, bug_status: BugStatus) => {
    setBugReports(prev => prev.map(b => b.bug_id === id ? { ...b, bug_status } : b));
    try {
      await fetch(`/api/bugs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bug_status })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Update Test Case Status
  const handleUpdateTestCase = async (id: string, status: TestStatus, actual: string) => {
    setTestCases(prev => prev.map(t => t.testcase_id === id ? { ...t, status, actual } : t));
    try {
      await fetch(`/api/testcases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actual })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Inbound Crash Simulation
  const handleSimulateCrashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/crashes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_name: simApp,
          module_name: simModule,
          exception_type: simException,
          severity: simSeverity,
          device_model: simDevice,
          android_version: simAndroid,
          stack_trace: simTrace
        })
      });

      const data = await response.json();
      if (data.crash) {
        setCrashLogs(prev => [data.crash, ...prev]);
        if (data.auto_triggered_bug) {
          setBugReports(prev => [data.auto_triggered_bug, ...prev]);
        }
      }
    } catch (err) {
      console.error('Failed to simulate crash:', err);
    } finally {
      setIsSimulateModalOpen(false);
    }
  };

  // Create Bug from Crash Log
  const handleCreateBugFromCrash = (crash: CrashLog) => {
    const newBug: BugReport = {
      bug_id: `BUG-${Math.floor(7000 + Math.random() * 2000)}`,
      crash_id: crash.crash_id,
      title: `Issue: ${crash.exception_type} in ${crash.module_name}`,
      priority: crash.severity === 'Critical' ? 'P0 - Immediate' : 'P1 - High',
      assigned_to: 'Alex Rivera (QA Lead)',
      bug_status: 'Open',
      created_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      module_name: crash.module_name,
      exception_type: crash.exception_type
    };

    setBugReports(prev => [newBug, ...prev]);
    setActiveTab('bugs');
  };

  const unresolvedCount = crashLogs.filter(c => c.status === 'New' || c.status === 'Investigating').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onOpenDocs={() => setIsDocsOpen(true)}
        onSimulateCrash={() => setIsSimulateModalOpen(true)}
        unresolvedCount={unresolvedCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            crashLogs={crashLogs}
            bugReports={bugReports}
            testCases={testCases}
            devices={devices}
            onNavigateTab={setActiveTab}
            onSelectCrash={() => setActiveTab('crashes')}
          />
        )}

        {activeTab === 'crashes' && (
          <CrashLogsView
            crashLogs={crashLogs}
            onUpdateStatus={handleUpdateCrashStatus}
            onSimulateCrash={() => setIsSimulateModalOpen(true)}
            onCreateBugFromCrash={handleCreateBugFromCrash}
          />
        )}

        {activeTab === 'sql' && <SqlWorkbenchView />}

        {activeTab === 'dsa' && <DsaPlaygroundView />}

        {activeTab === 'testing' && (
          <QaTestingView
            testCases={testCases}
            onUpdateTestCase={handleUpdateTestCase}
          />
        )}

        {activeTab === 'bugs' && (
          <BugTrackerView
            bugReports={bugReports}
            onUpdateBugStatus={handleUpdateBugStatus}
            onCreateNewBug={(b) => setBugReports(prev => [{ ...b, bug_id: `BUG-${Math.floor(7000 + Math.random() * 2000)}`, created_date: new Date().toISOString() } as any, ...prev])}
          />
        )}

        {activeTab === 'devices' && <DevicesView devices={devices} />}
      </main>

      {/* Project Documentation Modal */}
      <ProjectDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Inbound Crash Simulator Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Inbound Crash Log Simulator
              </h3>
              <button
                onClick={() => setIsSimulateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateCrashSubmit} className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">Application:</label>
                  <select
                    value={simApp}
                    onChange={(e) => setSimApp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 mt-1 focus:outline-none"
                  >
                    <option value="CrashLens Mobile">CrashLens Mobile</option>
                    <option value="PayQuick Wallet">PayQuick Wallet</option>
                    <option value="FitTrack Pro">FitTrack Pro</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Module:</label>
                  <select
                    value={simModule}
                    onChange={(e) => setSimModule(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 mt-1 focus:outline-none"
                  >
                    <option value="Login Module">Login Module</option>
                    <option value="Payment Checkout">Payment Checkout</option>
                    <option value="Sync Engine">Sync Engine</option>
                    <option value="Biometric Security">Biometric Security</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">Exception Type:</label>
                  <select
                    value={simException}
                    onChange={(e) => setSimException(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 mt-1 focus:outline-none font-mono text-[11px]"
                  >
                    <option value="java.lang.NullPointerException">NullPointerException</option>
                    <option value="java.lang.OutOfMemoryError">OutOfMemoryError</option>
                    <option value="android.os.ANR">ANR (Application Not Responding)</option>
                    <option value="android.database.sqlite.SQLiteConstraintException">SQLiteConstraintException</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Severity:</label>
                  <select
                    value={simSeverity}
                    onChange={(e) => setSimSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 mt-1 focus:outline-none"
                  >
                    <option value="Critical">Critical (P0 - Auto Trigger)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Stack Trace:</label>
                <textarea
                  rows={4}
                  value={simTrace}
                  onChange={(e) => setSimTrace(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-rose-300 mt-1 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl"
                >
                  Inject Crash Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
