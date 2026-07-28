import React, { useState } from 'react';
import {
  FileText,
  X,
  Copy,
  Check,
  Download,
  Database,
  Code2,
  CheckSquare,
  Sparkles,
  Layers,
  Terminal,
  BookOpen
} from 'lucide-react';

interface ProjectDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const readmeMarkdown = `# CrashLens – Mobile App Crash Analytics & Testing Platform

> A QA platform that collects, analyzes, and predicts mobile application crashes using SQL analytics, C++ DSA log processing, software testing suites, and Gemini AI.

---

## 🛠️ Tech Stack & Architecture

| Component | Technology |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts |
| **Backend** | Node.js Express Server, REST APIs |
| **Database** | MySQL / SQLite Relational Schema |
| **Algorithms** | C++ DSA Processing Engine (Stack, Trie, Graph, Heap, Segment Tree) |
| **AI Engine** | Gemini AI (\`gemini-3.6-flash\`) Server-Side Diagnostics |
| **Testing** | Manual QA, SQL Integrity Constraints, Bulk Stress Benchmarks |

---

## 🗄️ Database Design & Schema

### Tables Defined:
- \`Devices\`: \`device_id\`, \`brand\`, \`model\`, \`ram\`, \`processor\`, \`android_version\`
- \`Users\`: \`user_id\`, \`name\`, \`email\`, \`device_id\`, \`country\`, \`city\`, \`experience_level\`
- \`Application\`: \`app_id\`, \`app_name\`, \`version\`, \`release_date\`, \`platform\`
- \`CrashLogs\`: \`crash_id\`, \`user_id\`, \`app_id\`, \`crash_time\`, \`exception_type\`, \`stack_trace\`, \`severity\`, \`status\`
- \`TestCases\`: \`testcase_id\`, \`category\`, \`module\`, \`title\`, \`expected\`, \`actual\`, \`status\`, \`tester\`
- \`BugReports\`: \`bug_id\`, \`crash_id\`, \`priority\`, \`assigned_to\`, \`bug_status\`, \`created_date\`
- \`Performance\`: \`performance_id\`, \`cpu_usage\`, \`memory_usage\`, \`fps\`, \`response_time\`

### Advanced SQL Concepts Implemented:
1. **Window Functions**:
   \`\`\`sql
   SELECT model, COUNT(*) AS crashes,
          RANK() OVER(ORDER BY COUNT(*) DESC) AS crash_rank
   FROM CrashLogs JOIN Devices USING(device_id)
   GROUP BY model;
   \`\`\`
2. **Views**: \`CriticalCrashView\` filtering P0 critical crash logs.
3. **Stored Procedures**: \`CALL GenerateDailyCrashReport();\`
4. **Triggers**: \`auto_create_bug_on_critical_crash\` automatically inserting Bug Reports on Critical exceptions.

---

## 💻 C++ Data Structures & Algorithms

1. **Stack (\`std::stack<string>\`)**: Call Stack Frame Unwinding on exception.
2. **Hash Map (\`std::unordered_map<string, int>\`)**: O(1) Exception Frequency Aggregator.
3. **Graph & DFS**: Screen Navigation Transition Graph to locate most dangerous crash paths.
4. **Trie**: Fast O(L) prefix autocomplete across millions of stack trace tokens.
5. **Min/Max Heap (\`std::priority_queue\`)**: Dynamic Top K frequent crash priority queue.
6. **Queue (\`std::queue\`)**: Client crash packet FIFO ingestion buffer.
7. **Binary Search**: Fast O(log N) lookup of crash IDs in sorted logs.
8. **Segment Tree**: Dynamic time-range crash count queries (e.g. 14:00 to 16:00).

---

## 🧪 Software Testing & QA Suites

- **Functional Testing**: Stack trace inspection, status workflow, daily summary.
- **Database Testing**: Duplicate PK check, foreign key orphan validation, null constraint checks.
- **Performance Stress Testing**: Ingest 10,000 crash records benchmark (measuring throughput in logs/sec and memory spike).
- **Security Testing**: SQL Injection vulnerability probe & RBAC authorization checks.
`;

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([readmeMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-mono">
              CrashLens Portfolio Documentation & Report
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyReadme}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy README</span>
            </button>

            <button
              onClick={handleDownloadReadme}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download README.md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed space-y-4">
          <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 space-y-2">
            {readmeMarkdown}
          </pre>
        </div>
      </div>
    </div>
  );
};
