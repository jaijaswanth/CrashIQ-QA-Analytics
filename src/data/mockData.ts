import { Device, User, Application, CrashLog, TestCase, BugReport, PerformanceMetric } from '../types';

export const INITIAL_DEVICES: Device[] = [
  { device_id: 'DEV-101', brand: 'Google', model: 'Pixel 8 Pro', ram: '12 GB', processor: 'Tensor G3', android_version: 'Android 14', total_crashes: 42 },
  { device_id: 'DEV-102', brand: 'Samsung', model: 'Galaxy S24 Ultra', ram: '12 GB', processor: 'Snapdragon 8 Gen 3', android_version: 'Android 14', total_crashes: 28 },
  { device_id: 'DEV-103', brand: 'Samsung', model: 'Galaxy A54', ram: '6 GB', processor: 'Exynos 1380', android_version: 'Android 13', total_crashes: 84 },
  { device_id: 'DEV-104', brand: 'Xiaomi', model: 'Redmi Note 12', ram: '4 GB', processor: 'Snapdragon 685', android_version: 'Android 12', total_crashes: 112 },
  { device_id: 'DEV-105', brand: 'OnePlus', model: 'OnePlus 12', ram: '16 GB', processor: 'Snapdragon 8 Gen 3', android_version: 'Android 14', total_crashes: 15 },
  { device_id: 'DEV-106', brand: 'Realme', model: 'Realme 11 Pro', ram: '8 GB', processor: 'Dimensity 7050', android_version: 'Android 13', total_crashes: 63 },
  { device_id: 'DEV-107', brand: 'Motorola', model: 'Edge 40', ram: '8 GB', processor: 'Dimensity 8020', android_version: 'Android 13', total_crashes: 39 },
  { device_id: 'DEV-108', brand: 'Google', model: 'Pixel 6a', ram: '6 GB', processor: 'Tensor G1', android_version: 'Android 12', total_crashes: 71 },
];

export const INITIAL_USERS: User[] = [
  { user_id: 'USR-801', name: 'Alex Rivera', email: 'alex.r@qa.crashlens.io', device_id: 'DEV-103', country: 'United States', city: 'Seattle', experience_level: 'Power User', role: 'QA Lead' },
  { user_id: 'USR-802', name: 'Priya Sharma', email: 'priya.s@dev.crashlens.io', device_id: 'DEV-104', country: 'India', city: 'Bengaluru', experience_level: 'Intermediate', role: 'SDE Developer' },
  { user_id: 'USR-803', name: 'Marcus Chen', email: 'marcus.c@tester.io', device_id: 'DEV-101', country: 'Canada', city: 'Toronto', experience_level: 'Power User', role: 'Test Engineer' },
  { user_id: 'USR-804', name: 'Elena Rostova', email: 'elena.r@sql.crashlens.io', device_id: 'DEV-108', country: 'Germany', city: 'Berlin', experience_level: 'Intermediate', role: 'SQL Architect' },
  { user_id: 'USR-805', name: 'Kenji Sato', email: 'kenji.s@test.com', device_id: 'DEV-102', country: 'Japan', city: 'Tokyo', experience_level: 'Novice' },
  { user_id: 'USR-806', name: 'Sarah Jenkins', email: 'sarah.j@test.com', device_id: 'DEV-106', country: 'United Kingdom', city: 'London', experience_level: 'Intermediate' },
  { user_id: 'USR-807', name: 'Mateo Garcia', email: 'mateo.g@test.com', device_id: 'DEV-107', country: 'Spain', city: 'Madrid', experience_level: 'Novice' },
  { user_id: 'USR-808', name: 'David Kim', email: 'david.k@test.com', device_id: 'DEV-105', country: 'South Korea', city: 'Seoul', experience_level: 'Power User' },
];

export const INITIAL_APPLICATIONS: Application[] = [
  { app_id: 'APP-01', app_name: 'CrashLens Mobile', version: '2.4.1', release_date: '2026-06-15', platform: 'Android', status: 'Active' },
  { app_id: 'APP-02', app_name: 'PayQuick Wallet', version: '1.9.0', release_date: '2026-07-01', platform: 'Android', status: 'Active' },
  { app_id: 'APP-03', app_name: 'FitTrack Pro', version: '3.2.0', release_date: '2026-05-20', platform: 'Android', status: 'Active' },
  { app_id: 'APP-04', app_name: 'StreamSync Video', version: '1.1.0', release_date: '2026-07-10', platform: 'Cross-Platform', status: 'Beta' },
];

export const INITIAL_CRASH_LOGS: CrashLog[] = [
  {
    crash_id: 'CRASH-9001',
    user_id: 'USR-801',
    app_id: 'APP-01',
    device_id: 'DEV-104',
    crash_time: '2026-07-27 21:14:02',
    exception_type: 'java.lang.NullPointerException',
    stack_trace: `java.lang.NullPointerException: Attempt to invoke virtual method 'java.lang.String com.crashlens.user.UserProfile.getAuthToken()' on a null object reference
    at com.crashlens.network.ApiClient.attachHeaders(ApiClient.java:142)
    at com.crashlens.network.ApiClient.executeRequest(ApiClient.java:88)
    at com.crashlens.login.LoginRepository.verifyUserToken(LoginRepository.java:65)
    at com.crashlens.login.LoginViewModel$1.run(LoginViewModel.java:34)`,
    module_name: 'Login Module',
    severity: 'Critical',
    status: 'New',
    device_model: 'Redmi Note 12',
    android_version: 'Android 12',
    app_name: 'CrashLens Mobile',
    app_version: '2.4.1',
    ai_analysis: {
      summary: 'Uncaught NullPointerException during token verification in LoginRepository.',
      root_cause: 'UserProfile object was referenced before initialization complete during background network retry.',
      suggested_fix: 'Add null-check check for UserProfile or initialize with optional empty object prior to API execution.',
      c_plus_plus_fix: 'if (userProfile == nullptr) { throw std::runtime_error("UserProfile not initialized"); }',
      impact_score: 95
    }
  },
  {
    crash_id: 'CRASH-9002',
    user_id: 'USR-802',
    app_id: 'APP-02',
    device_id: 'DEV-103',
    crash_time: '2026-07-27 19:42:10',
    exception_type: 'java.lang.OutOfMemoryError',
    stack_trace: `java.lang.OutOfMemoryError: Failed to allocate a 48318384 byte allocation with 16777216 free bytes and 16MB until OOM
    at android.graphics.Bitmap.nativeCreate(Native Method)
    at android.graphics.Bitmap.createBitmap(Bitmap.java:1120)
    at com.payquick.checkout.QrScannerRenderer.renderFrameBuffer(QrScannerRenderer.java:210)
    at com.payquick.checkout.PaymentCameraActivity.onFrameAvailable(PaymentCameraActivity.java:98)`,
    module_name: 'Payment Checkout',
    severity: 'Critical',
    status: 'Investigating',
    device_model: 'Galaxy A54',
    android_version: 'Android 13',
    app_name: 'PayQuick Wallet',
    app_version: '1.9.0'
  },
  {
    crash_id: 'CRASH-9003',
    user_id: 'USR-803',
    app_id: 'APP-01',
    device_id: 'DEV-108',
    crash_time: '2026-07-27 18:05:44',
    exception_type: 'android.database.sqlite.SQLiteConstraintException',
    stack_trace: `android.database.sqlite.SQLiteConstraintException: UNIQUE constraint failed: crash_logs.crash_id (code 2067)
    at android.database.sqlite.SQLiteConnection.nativeExecuteForChangedRowCount(Native Method)
    at android.database.sqlite.SQLiteSession.executeForChangedRowCount(SQLiteSession.java:756)
    at com.crashlens.db.DatabaseHelper.insertCrashRecord(DatabaseHelper.java:189)
    at com.crashlens.sync.CrashSyncWorker.doWork(CrashSyncWorker.java:77)`,
    module_name: 'Sync Engine',
    severity: 'High',
    status: 'New',
    device_model: 'Pixel 6a',
    android_version: 'Android 12',
    app_name: 'CrashLens Mobile',
    app_version: '2.4.1'
  },
  {
    crash_id: 'CRASH-9004',
    user_id: 'USR-804',
    app_id: 'APP-03',
    device_id: 'DEV-106',
    crash_time: '2026-07-27 16:30:12',
    exception_type: 'java.lang.IndexOutOfBoundsException',
    stack_trace: `java.lang.IndexOutOfBoundsException: Index 12 out of bounds for length 12
    at java.util.ArrayList.get(ArrayList.java:437)
    at com.fittrack.analytics.StepChartAdapter.onBindViewHolder(StepChartAdapter.java:82)
    at androidx.recyclerview.widget.RecyclerView$Adapter.bindViewHolder(RecyclerView.java:7107)
    at com.fittrack.analytics.AnalyticsFragment.updateUi(AnalyticsFragment.java:140)`,
    module_name: 'Analytics Dashboard',
    severity: 'Medium',
    status: 'Resolved',
    device_model: 'Realme 11 Pro',
    android_version: 'Android 13',
    app_name: 'FitTrack Pro',
    app_version: '3.2.0'
  },
  {
    crash_id: 'CRASH-9005',
    user_id: 'USR-805',
    app_id: 'APP-02',
    device_id: 'DEV-104',
    crash_time: '2026-07-27 14:15:33',
    exception_type: 'android.os.ANR',
    stack_trace: `android.os.ANR: Application Not Responding in com.payquick.app
    Reason: Input dispatching timed out (Waiting to send key event to com.payquick.checkout.BiometricAuthActivity)
    at com.payquick.checkout.BiometricAuthActivity.verifyFingerprint(BiometricAuthActivity.java:115)
    at com.payquick.checkout.BiometricAuthActivity.access$000(BiometricAuthActivity.java:24)`,
    module_name: 'Biometric Security',
    severity: 'Critical',
    status: 'New',
    device_model: 'Redmi Note 12',
    android_version: 'Android 12',
    app_name: 'PayQuick Wallet',
    app_version: '1.9.0'
  },
  {
    crash_id: 'CRASH-9006',
    user_id: 'USR-806',
    app_id: 'APP-04',
    device_id: 'DEV-107',
    crash_time: '2026-07-27 11:02:18',
    exception_type: 'java.lang.SecurityException',
    stack_trace: `java.lang.SecurityException: Permission Denial: reading com.streamsync.media.MediaProvider requires android.permission.READ_EXTERNAL_STORAGE
    at android.os.Parcel.createExceptionOrNull(Parcel.java:2425)
    at com.streamsync.media.LocalMediaLoader.queryVideoFiles(LocalMediaLoader.java:54)
    at com.streamsync.ui.GalleryViewModel.fetchMedia(GalleryViewModel.java:89)`,
    module_name: 'Media Gallery',
    severity: 'High',
    status: 'Investigating',
    device_model: 'Edge 40',
    android_version: 'Android 13',
    app_name: 'StreamSync Video',
    app_version: '1.1.0'
  },
  {
    crash_id: 'CRASH-9007',
    user_id: 'USR-807',
    app_id: 'APP-01',
    device_id: 'DEV-103',
    crash_time: '2026-07-26 23:50:11',
    exception_type: 'java.lang.StackOverflowError',
    stack_trace: `java.lang.StackOverflowError: stack size 8192KB
    at com.crashlens.parser.JsonRecursiveParser.parseNestedNode(JsonRecursiveParser.java:62)
    at com.crashlens.parser.JsonRecursiveParser.parseNestedNode(JsonRecursiveParser.java:64)
    at com.crashlens.parser.JsonRecursiveParser.parseNestedNode(JsonRecursiveParser.java:64)`,
    module_name: 'Log Parser',
    severity: 'High',
    status: 'New',
    device_model: 'Galaxy A54',
    android_version: 'Android 13',
    app_name: 'CrashLens Mobile',
    app_version: '2.4.1'
  },
  {
    crash_id: 'CRASH-9008',
    user_id: 'USR-808',
    app_id: 'APP-03',
    device_id: 'DEV-105',
    crash_time: '2026-07-26 18:22:00',
    exception_type: 'java.lang.IllegalArgumentException',
    stack_trace: `java.lang.IllegalArgumentException: Invalid Bluetooth GATT characteristic UUID
    at com.fittrack.ble.BleManager.connectDevice(BleManager.java:112)
    at com.fittrack.ble.BleConnectService.onStartCommand(BleConnectService.java:45)`,
    module_name: 'Bluetooth BLE',
    severity: 'Low',
    status: 'Resolved',
    device_model: 'OnePlus 12',
    android_version: 'Android 14',
    app_name: 'FitTrack Pro',
    app_version: '3.2.0'
  }
];

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    testcase_id: 'TC-FUNC-001',
    category: 'Functional',
    module: 'Login Module',
    title: 'Verify NullPointer exception capture on missing auth token',
    description: 'Trigger network retry with empty UserProfile state and verify stack trace logging.',
    expected: 'Crash report created with NullPointerException and severity = Critical',
    actual: 'Crash report created with NullPointerException and severity = Critical',
    status: 'Passed',
    tester: 'Alex Rivera',
    execution_time_ms: 120
  },
  {
    testcase_id: 'TC-FUNC-002',
    category: 'Functional',
    module: 'Sync Engine',
    title: 'Verify background crash log ingestion FIFO queue',
    description: 'Send 50 rapid crash logs to background ingestion worker.',
    expected: 'All 50 logs queued sequentially without dropping frames',
    actual: 'All 50 logs queued sequentially without dropping frames',
    status: 'Passed',
    tester: 'Marcus Chen',
    execution_time_ms: 310
  },
  {
    testcase_id: 'TC-DB-101',
    category: 'Database',
    module: 'Database / SQL',
    title: 'Validate Duplicate Crash ID PK constraint failure prevention',
    description: 'Attempt to insert crash_id = CRASH-9001 into CrashLogs table twice.',
    expected: 'SQLiteConstraintException thrown; duplicate row rejected',
    actual: 'SQLiteConstraintException thrown; duplicate row rejected',
    status: 'Passed',
    tester: 'Elena Rostova',
    execution_time_ms: 45
  },
  {
    testcase_id: 'TC-DB-102',
    category: 'Database',
    module: 'Database / SQL',
    title: 'Verify Stored Procedure GenerateDailyCrashReport execution',
    description: 'Call CALL GenerateDailyCrashReport() and check aggregated metrics table output.',
    expected: 'Daily summary row inserted with total_crashes, critical_count, and rank metrics',
    actual: 'Daily summary row inserted with total_crashes, critical_count, and rank metrics',
    status: 'Passed',
    tester: 'Elena Rostova',
    execution_time_ms: 88
  },
  {
    testcase_id: 'TC-DB-103',
    category: 'Database',
    module: 'Database / SQL',
    title: 'Verify Critical Crash Auto-Trigger for Bug Reports',
    description: 'Insert new crash log with severity = Critical.',
    expected: 'Trigger automatically inserts a linked BugReport entry with priority = P0 - Immediate',
    actual: 'Trigger automatically inserted linked BugReport BUG-7001',
    status: 'Passed',
    tester: 'Priya Sharma',
    execution_time_ms: 62
  },
  {
    testcase_id: 'TC-PERF-201',
    category: 'Performance',
    module: 'Log Parser / C++',
    title: 'Measure Trie Stack Trace Lookup benchmark on 10,000 logs',
    description: 'Perform prefix search on 10,000 stack trace strings using C++ Trie data structure.',
    expected: 'Search response time < 5ms for 10,000 stack traces',
    actual: 'Search completed in 1.84ms',
    status: 'Passed',
    tester: 'Priya Sharma',
    execution_time_ms: 2
  },
  {
    testcase_id: 'TC-PERF-202',
    category: 'Performance',
    module: 'Ingestion Engine',
    title: 'Bulk ingest 10,000 crash records performance stress test',
    description: 'Post multi-part payload containing 10,000 crash records into database buffer.',
    expected: 'Throughput >= 2,000 records/sec; memory increase < 50MB',
    actual: 'Throughput = 3,420 records/sec; memory spike = 18MB',
    status: 'Passed',
    tester: 'Marcus Chen',
    execution_time_ms: 2920
  },
  {
    testcase_id: 'TC-SEC-301',
    category: 'Security',
    module: 'SQL Workbench',
    title: 'SQL Injection sanitization on crash search filter',
    description: 'Inject payload `\' OR 1=1; --` in exception_type search parameter.',
    expected: 'Query parameterized safely; no unauthorized data leak',
    actual: 'Query parameterized safely; 0 records matched string',
    status: 'Passed',
    tester: 'Alex Rivera',
    execution_time_ms: 18
  },
  {
    testcase_id: 'TC-SEC-302',
    category: 'Security',
    module: 'API Gateway',
    title: 'Role-Based Access Control (RBAC) on Bug Report Status update',
    description: 'Attempt to mark bug status as Closed using Novice role session token.',
    expected: 'HTTP 403 Forbidden - Only QA Lead or SDE Developer permitted',
    actual: 'HTTP 403 Forbidden received',
    status: 'Passed',
    tester: 'Marcus Chen',
    execution_time_ms: 25
  }
];

export const INITIAL_BUG_REPORTS: BugReport[] = [
  {
    bug_id: 'BUG-7001',
    crash_id: 'CRASH-9001',
    title: 'Uncaught NullPointer in LoginRepository token check',
    priority: 'P0 - Immediate',
    assigned_to: 'Priya Sharma',
    bug_status: 'Open',
    created_date: '2026-07-27 21:15:00',
    module_name: 'Login Module',
    exception_type: 'NullPointerException'
  },
  {
    bug_id: 'BUG-7002',
    crash_id: 'CRASH-9002',
    title: 'Camera Bitmap allocation OOM during payment QR scan',
    priority: 'P0 - Immediate',
    assigned_to: 'Marcus Chen',
    bug_status: 'In Progress',
    created_date: '2026-07-27 19:45:00',
    module_name: 'Payment Checkout',
    exception_type: 'OutOfMemoryError'
  },
  {
    bug_id: 'BUG-7003',
    crash_id: 'CRASH-9003',
    title: 'UNIQUE constraint conflict on local SQLite sync worker',
    priority: 'P1 - High',
    assigned_to: 'Elena Rostova',
    bug_status: 'Triaged',
    created_date: '2026-07-27 18:10:00',
    module_name: 'Sync Engine',
    exception_type: 'SQLiteConstraintException'
  },
  {
    bug_id: 'BUG-7004',
    crash_id: 'CRASH-9005',
    title: 'Biometric Auth UI thread blocking ANR on Android 12',
    priority: 'P0 - Immediate',
    assigned_to: 'Priya Sharma',
    bug_status: 'Open',
    created_date: '2026-07-27 14:20:00',
    module_name: 'Biometric Security',
    exception_type: 'ANR'
  },
  {
    bug_id: 'BUG-7005',
    crash_id: 'CRASH-9004',
    title: 'StepChartAdapter array index overflow on 12-month data view',
    priority: 'P2 - Normal',
    assigned_to: 'Alex Rivera',
    bug_status: 'Resolved',
    created_date: '2026-07-27 16:35:00',
    fixed_date: '2026-07-27 20:00:00',
    module_name: 'Analytics Dashboard',
    exception_type: 'IndexOutOfBoundsException'
  }
];

export const INITIAL_PERFORMANCE: PerformanceMetric[] = [
  { performance_id: 'PERF-01', timestamp: '12:00', cpu_usage: 24, memory_usage: 142, battery_usage: 2.1, fps: 59, response_time: 45, app_id: 'APP-01' },
  { performance_id: 'PERF-02', timestamp: '13:00', cpu_usage: 42, memory_usage: 210, battery_usage: 3.8, fps: 54, response_time: 78, app_id: 'APP-01' },
  { performance_id: 'PERF-03', timestamp: '14:00', cpu_usage: 88, memory_usage: 490, battery_usage: 8.5, fps: 22, response_time: 340, app_id: 'APP-01' },
  { performance_id: 'PERF-04', timestamp: '15:00', cpu_usage: 61, memory_usage: 320, battery_usage: 5.2, fps: 48, response_time: 120, app_id: 'APP-01' },
  { performance_id: 'PERF-05', timestamp: '16:00', cpu_usage: 30, memory_usage: 165, battery_usage: 2.4, fps: 60, response_time: 50, app_id: 'APP-01' },
  { performance_id: 'PERF-06', timestamp: '17:00', cpu_usage: 95, memory_usage: 580, battery_usage: 11.2, fps: 15, response_time: 890, app_id: 'APP-01' },
  { performance_id: 'PERF-07', timestamp: '18:00', cpu_usage: 52, memory_usage: 280, battery_usage: 4.1, fps: 52, response_time: 95, app_id: 'APP-01' },
];
