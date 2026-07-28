export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type BugStatus = 'Open' | 'Triaged' | 'In Progress' | 'Resolved' | 'Closed';
export type CrashStatus = 'New' | 'Investigating' | 'Resolved' | 'Ignored';
export type TestStatus = 'Passed' | 'Failed' | 'Blocked' | 'Pending';
export type TestCategory = 'Functional' | 'Database' | 'Performance' | 'Security';
export type UserRole = 'QA Lead' | 'SDE Developer' | 'SQL Architect' | 'Test Engineer';

export interface Device {
  device_id: string;
  brand: string;
  model: string;
  ram: string;
  processor: string;
  android_version: string;
  total_crashes?: number;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  device_id: string;
  country: string;
  city: string;
  experience_level: 'Novice' | 'Intermediate' | 'Power User';
  role?: UserRole;
}

export interface Application {
  app_id: string;
  app_name: string;
  version: string;
  release_date: string;
  platform: 'Android' | 'iOS' | 'Cross-Platform';
  status: 'Active' | 'Beta' | 'Deprecated';
}

export interface CrashLog {
  crash_id: string;
  user_id: string;
  app_id: string;
  device_id?: string;
  crash_time: string;
  exception_type: string;
  stack_trace: string;
  module_name: string;
  severity: Severity;
  status: CrashStatus;
  device_model?: string;
  android_version?: string;
  app_name?: string;
  app_version?: string;
  ai_analysis?: {
    summary: string;
    root_cause: string;
    suggested_fix: string;
    c_plus_plus_fix?: string;
    impact_score: number;
  };
}

export interface TestCase {
  testcase_id: string;
  category: TestCategory;
  module: string;
  title: string;
  description: string;
  expected: string;
  actual: string;
  status: TestStatus;
  tester: string;
  execution_time_ms?: number;
}

export interface BugReport {
  bug_id: string;
  crash_id: string;
  title: string;
  priority: 'P0 - Immediate' | 'P1 - High' | 'P2 - Normal' | 'P3 - Low';
  assigned_to: string;
  bug_status: BugStatus;
  created_date: string;
  fixed_date?: string;
  module_name?: string;
  exception_type?: string;
}

export interface PerformanceMetric {
  performance_id: string;
  timestamp: string;
  cpu_usage: number; // percentage
  memory_usage: number; // MB
  battery_usage: number; // percentage per hr
  fps: number;
  response_time: number; // ms
  app_id: string;
}

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  executionTimeMs: number;
  rowCount: number;
  query: string;
  description?: string;
}

export interface DsaExecutionStep {
  step: number;
  description: string;
  highlightedLine?: number;
  state: Record<string, any>;
}

export interface DsaAlgorithm {
  id: 'stack' | 'hashmap' | 'graph' | 'trie' | 'heap' | 'queue' | 'binary_search' | 'segment_tree';
  title: string;
  subtitle: string;
  cppFileName: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  useCase: string;
}
