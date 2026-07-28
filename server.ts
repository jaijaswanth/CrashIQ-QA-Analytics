import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_DEVICES,
  INITIAL_USERS,
  INITIAL_APPLICATIONS,
  INITIAL_CRASH_LOGS,
  INITIAL_TEST_CASES,
  INITIAL_BUG_REPORTS,
  INITIAL_PERFORMANCE
} from './src/data/mockData';
import { CrashLog, BugReport, TestCase, Device } from './src/types';

// Initialize in-memory mutable database state
let devicesStore: Device[] = [...INITIAL_DEVICES];
let usersStore = [...INITIAL_USERS];
let appsStore = [...INITIAL_APPLICATIONS];
let crashLogsStore: CrashLog[] = [...INITIAL_CRASH_LOGS];
let testCasesStore: TestCase[] = [...INITIAL_TEST_CASES];
let bugReportsStore: BugReport[] = [...INITIAL_BUG_REPORTS];
let performanceStore = [...INITIAL_PERFORMANCE];

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- HEALTH CHECK ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CrashLens Analytics Engine',
      crashes_count: crashLogsStore.length,
      bugs_count: bugReportsStore.length,
      gemini_enabled: !!process.env.GEMINI_API_KEY
    });
  });

  // --- CRASH LOGS ENDPOINTS ---
  app.get('/api/crashes', (req, res) => {
    const { severity, status, search, module } = req.query;
    let filtered = [...crashLogsStore];

    if (severity && severity !== 'All') {
      filtered = filtered.filter(c => c.severity.toLowerCase() === String(severity).toLowerCase());
    }
    if (status && status !== 'All') {
      filtered = filtered.filter(c => c.status.toLowerCase() === String(status).toLowerCase());
    }
    if (module && module !== 'All') {
      filtered = filtered.filter(c => c.module_name.toLowerCase() === String(module).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(c =>
        c.crash_id.toLowerCase().includes(q) ||
        c.exception_type.toLowerCase().includes(q) ||
        c.stack_trace.toLowerCase().includes(q) ||
        c.module_name.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  });

  app.post('/api/crashes', (req, res) => {
    const newLog: CrashLog = {
      crash_id: `CRASH-${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: req.body.user_id || 'USR-801',
      app_id: req.body.app_id || 'APP-01',
      crash_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      exception_type: req.body.exception_type || 'java.lang.NullPointerException',
      stack_trace: req.body.stack_trace || 'at com.crashlens.app.MainActivity.onCreate(MainActivity.java:42)',
      module_name: req.body.module_name || 'General App',
      severity: req.body.severity || 'Medium',
      status: 'New',
      device_model: req.body.device_model || 'Pixel 8 Pro',
      android_version: req.body.android_version || 'Android 14',
      app_name: req.body.app_name || 'CrashLens Mobile',
      app_version: req.body.app_version || '2.4.1'
    };

    crashLogsStore.unshift(newLog);

    // AUTO TRIGGER SIMULATION: If Critical, automatically insert linked Bug Report
    let createdBug: BugReport | null = null;
    if (newLog.severity === 'Critical') {
      createdBug = {
        bug_id: `BUG-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
        crash_id: newLog.crash_id,
        title: `Auto-Triggered Bug: ${newLog.exception_type} in ${newLog.module_name}`,
        priority: 'P0 - Immediate',
        assigned_to: 'Priya Sharma (Auto-Assigned)',
        bug_status: 'Open',
        created_date: newLog.crash_time,
        module_name: newLog.module_name,
        exception_type: newLog.exception_type
      };
      bugReportsStore.unshift(createdBug);
    }

    res.status(201).json({
      message: 'Crash log recorded successfully',
      crash: newLog,
      auto_triggered_bug: createdBug
    });
  });

  app.patch('/api/crashes/:id', (req, res) => {
    const { id } = req.params;
    const { status, severity } = req.body;
    const crash = crashLogsStore.find(c => c.crash_id === id);

    if (!crash) {
      return res.status(404).json({ error: 'Crash log not found' });
    }

    if (status) crash.status = status;
    if (severity) crash.severity = severity;

    res.json(crash);
  });

  app.delete('/api/crashes/:id', (req, res) => {
    const { id } = req.params;
    crashLogsStore = crashLogsStore.filter(c => c.crash_id !== id);
    res.json({ message: 'Crash log deleted successfully', id });
  });

  // --- DEVICES, USERS, APPS ENDPOINTS ---
  app.get('/api/devices', (req, res) => res.json(devicesStore));
  app.get('/api/users', (req, res) => res.json(usersStore));
  app.get('/api/apps', (req, res) => res.json(appsStore));

  // --- BUG REPORTS ENDPOINTS ---
  app.get('/api/bugs', (req, res) => res.json(bugReportsStore));

  app.post('/api/bugs', (req, res) => {
    const newBug: BugReport = {
      bug_id: `BUG-${Math.floor(7000 + Math.random() * 2000)}`,
      crash_id: req.body.crash_id || 'CRASH-9001',
      title: req.body.title || 'New Bug Report',
      priority: req.body.priority || 'P1 - High',
      assigned_to: req.body.assigned_to || 'Alex Rivera',
      bug_status: 'Open',
      created_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      module_name: req.body.module_name || 'General',
      exception_type: req.body.exception_type || 'Unknown'
    };
    bugReportsStore.unshift(newBug);
    res.status(201).json(newBug);
  });

  app.patch('/api/bugs/:id', (req, res) => {
    const { id } = req.params;
    const bug = bugReportsStore.find(b => b.bug_id === id);
    if (!bug) return res.status(404).json({ error: 'Bug report not found' });

    if (req.body.bug_status) {
      bug.bug_status = req.body.bug_status;
      if (req.body.bug_status === 'Resolved' || req.body.bug_status === 'Closed') {
        bug.fixed_date = new Date().toISOString().replace('T', ' ').substring(0, 19);
      }
    }
    if (req.body.priority) bug.priority = req.body.priority;
    if (req.body.assigned_to) bug.assigned_to = req.body.assigned_to;

    res.json(bug);
  });

  // --- TEST CASES ENDPOINTS ---
  app.get('/api/testcases', (req, res) => res.json(testCasesStore));

  app.patch('/api/testcases/:id', (req, res) => {
    const { id } = req.params;
    const tc = testCasesStore.find(t => t.testcase_id === id);
    if (!tc) return res.status(404).json({ error: 'Test case not found' });

    if (req.body.status) tc.status = req.body.status;
    if (req.body.actual) tc.actual = req.body.actual;
    if (req.body.execution_time_ms) tc.execution_time_ms = req.body.execution_time_ms;

    res.json(tc);
  });

  // --- PERFORMANCE METRICS ---
  app.get('/api/performance', (req, res) => res.json(performanceStore));

  // --- SQL INTERACTIVE EXECUTION ROUTE ---
  app.post('/api/sql/execute', (req, res) => {
    const { query } = req.body;
    const sql = (query || '').trim();
    const startTime = Date.now();

    try {
      const lowerSql = sql.toLowerCase();

      // Simulated SQL Query Router
      if (lowerSql.includes('rank() over') || lowerSql.includes('group by model')) {
        // Window Function Query: Top crash devices
        const deviceCounts: Record<string, number> = {};
        crashLogsStore.forEach(c => {
          const m = c.device_model || 'Unknown';
          deviceCounts[m] = (deviceCounts[m] || 0) + 1;
        });

        const sorted = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]);
        const rows = sorted.map(([model, count], idx) => ({
          model,
          crashes: count,
          rank: idx + 1
        }));

        return res.json({
          query: sql,
          columns: ['model', 'crashes', 'rank'],
          rows,
          rowCount: rows.length,
          executionTimeMs: Date.now() - startTime + Math.floor(Math.random() * 4 + 2),
          description: 'Window Function RANK() OVER (ORDER BY COUNT(*) DESC) executed successfully.'
        });
      }

      if (lowerSql.includes('criticalcrashview') || lowerSql.includes('severity = \'critical\'')) {
        // View / Filter Critical Crashes
        const criticals = crashLogsStore.filter(c => c.severity === 'Critical');
        const rows = criticals.map(c => ({
          crash_id: c.crash_id,
          crash_time: c.crash_time,
          exception_type: c.exception_type,
          module_name: c.module_name,
          severity: c.severity,
          device_model: c.device_model,
          status: c.status
        }));

        return res.json({
          query: sql,
          columns: ['crash_id', 'crash_time', 'exception_type', 'module_name', 'severity', 'device_model', 'status'],
          rows,
          rowCount: rows.length,
          executionTimeMs: Date.now() - startTime + Math.floor(Math.random() * 3 + 1),
          description: 'Executed view CriticalCrashView query.'
        });
      }

      if (lowerSql.includes('generatedailycrashreport()') || lowerSql.includes('call generate')) {
        // Stored Procedure Call
        const dailySummary = [
          { crash_date: '2026-07-27', total_crashes: 6, critical_crashes: 3, high_crashes: 2, impacted_users: 6, impacted_apps: 4 },
          { crash_date: '2026-07-26', total_crashes: 2, critical_crashes: 0, high_crashes: 2, impacted_users: 2, impacted_apps: 2 }
        ];

        return res.json({
          query: sql,
          columns: ['crash_date', 'total_crashes', 'critical_crashes', 'high_crashes', 'impacted_users', 'impacted_apps'],
          rows: dailySummary,
          rowCount: dailySummary.length,
          executionTimeMs: Date.now() - startTime + Math.floor(Math.random() * 5 + 3),
          description: 'Stored Procedure GenerateDailyCrashReport() executed successfully.'
        });
      }

      if (lowerSql.includes('devices')) {
        const rows = devicesStore.map(d => ({
          device_id: d.device_id,
          brand: d.brand,
          model: d.model,
          ram: d.ram,
          processor: d.processor,
          android_version: d.android_version,
          total_crashes: d.total_crashes || 0
        }));

        return res.json({
          query: sql,
          columns: ['device_id', 'brand', 'model', 'ram', 'processor', 'android_version', 'total_crashes'],
          rows,
          rowCount: rows.length,
          executionTimeMs: Date.now() - startTime + Math.floor(Math.random() * 4 + 1)
        });
      }

      // Default fallback join query
      const rows = crashLogsStore.map(c => ({
        crash_id: c.crash_id,
        exception_type: c.exception_type,
        module_name: c.module_name,
        severity: c.severity,
        status: c.status,
        device_model: c.device_model,
        app_name: c.app_name
      }));

      return res.json({
        query: sql,
        columns: ['crash_id', 'exception_type', 'module_name', 'severity', 'status', 'device_model', 'app_name'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Date.now() - startTime + Math.floor(Math.random() * 3 + 1)
      });

    } catch (err: any) {
      res.status(400).json({
        error: 'SQL Execution Error',
        message: err.message
      });
    }
  });

  // --- GEMINI AI CRASH DIAGNOSIS ROUTE ---
  app.post('/api/gemini/analyze', async (req, res) => {
    const { exception_type, stack_trace, module_name, device_model, android_version } = req.body;

    if (!ai && !process.env.GEMINI_API_KEY) {
      // Fallback response if GEMINI_API_KEY environment variable is missing
      return res.json({
        summary: `AI Diagnostic (Rule-based Fallback): ${exception_type} detected in ${module_name}.`,
        root_cause: `Null reference or missing boundary check triggered on ${device_model} running ${android_version}.`,
        suggested_fix: `Wrap access call in null check and ensure asynchronous initialization completes before UI binding.`,
        c_plus_plus_fix: `if (ptr == nullptr) { std::cerr << "Null error in ${module_name}"; return false; }`,
        impact_score: 88,
        is_fallback: true
      });
    }

    try {
      const client = ai || new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Analyze this mobile application crash log and provide a concise JSON object:
Exception Type: ${exception_type}
Module: ${module_name}
Device: ${device_model} (${android_version})
Stack Trace:
${stack_trace}

Return JSON with keys:
- "summary": 1-2 sentence executive summary of the crash
- "root_cause": Exact technical root cause explanation
- "suggested_fix": Actionable Java/Kotlin fix recommendation
- "c_plus_plus_fix": Corresponding C++ or Native C code snippet fix
- "impact_score": Integer 1-100 representing risk impact score`;

      const response = await client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);

    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.json({
        summary: `AI Analysis for ${exception_type}: Crash in ${module_name}.`,
        root_cause: `Uncaught exception thrown during invocation of native or network method.`,
        suggested_fix: `Verify object lifecycle and handle exceptions with try-catch block.`,
        c_plus_plus_fix: `try { execute(); } catch (const std::exception& e) { std::cerr << e.what(); }`,
        impact_score: 82,
        error: err.message
      });
    }
  });

  // --- QA BENCHMARK & BULK TEST ROUTE ---
  app.post('/api/testing/benchmark', (req, res) => {
    const { count = 10000 } = req.body;
    const startTime = Date.now();

    // Benchmark simulation
    let processed = 0;
    const sampleExceptions = ['NullPointerException', 'OutOfMemoryError', 'ANR', 'SQLiteConstraintException', 'IndexOutOfBoundsException'];
    
    for (let i = 0; i < count; i++) {
      const ex = sampleExceptions[i % sampleExceptions.length];
      processed++;
    }

    const durationMs = Date.now() - startTime + Math.floor(Math.random() * 8 + 12);
    const logsPerSec = Math.round((count / (durationMs / 1000)));

    res.json({
      total_logs_processed: count,
      execution_time_ms: durationMs,
      throughput_logs_per_sec: logsPerSec,
      memory_allocated_mb: 14.8,
      status: 'PASSED',
      message: `Successfully processed ${count.toLocaleString()} crash logs in ${durationMs}ms.`
    });
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CrashLens Analytics Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
