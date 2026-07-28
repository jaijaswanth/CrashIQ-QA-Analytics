import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Play,
  RotateCcw,
  Layers,
  Search,
  Network,
  Clock,
  Zap,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { CPP_ALGORITHMS } from '../data/cppFiles';

export const DsaPlaygroundView: React.FC = () => {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('stack');
  const [activeTab, setActiveTab] = useState<'visualizer' | 'code'>('visualizer');
  const [copiedCode, setCopiedCode] = useState(false);

  // --- STACK SIMULATION STATE ---
  const [callStack, setCallStack] = useState<string[]>([
    'main()',
    'LoginViewModel.onLoginClick()',
    'LoginRepository.verifyUserToken()',
    'ApiClient.attachHeaders() [EXCEPTION CRASH!]'
  ]);
  const [stackLogs, setStackLogs] = useState<string[]>([
    'Call stack unwinding initialized.'
  ]);

  const handlePushFrame = () => {
    const frames = ['NetworkRetryWorker.doWork()', 'TokenCache.get()', 'CryptoProvider.sign()'];
    const newFrame = frames[Math.floor(Math.random() * frames.length)];
    setCallStack([newFrame, ...callStack]);
    setStackLogs([`[PUSH] Frame added: ${newFrame}`, ...stackLogs]);
  };

  const handlePopFrame = () => {
    if (callStack.length === 0) return;
    const popped = callStack[0];
    setCallStack(callStack.slice(1));
    setStackLogs([`[UNWIND/POP] Frame unwound: ${popped}`, ...stackLogs]);
  };

  // --- HASH MAP SIMULATION STATE ---
  const [freqMap, setFreqMap] = useState<Record<string, number>>({
    NullPointerException: 245,
    OutOfMemoryError: 189,
    SQLiteConstraintException: 92,
    ANR: 310,
    IndexOutOfBoundsException: 64
  });

  const handleIncFreq = (key: string) => {
    setFreqMap({ ...freqMap, [key]: (freqMap[key] || 0) + 1 });
  };

  // --- GRAPH DFS SIMULATION STATE ---
  const [dfsPath, setDfsPath] = useState<string[]>(['Home Screen', 'Login Screen', 'Payment Checkout', 'Crash State']);

  // --- TRIE SIMULATION STATE ---
  const [triePrefix, setTriePrefix] = useState('NullPointer');
  const [trieResults, setTrieResults] = useState<string[]>([
    'NullPointerException (com.crashlens.user.UserProfile)',
    'NullPointerException (com.payquick.checkout)',
    'NullPointerAccess (native thread)'
  ]);

  // --- HEAP SIMULATION STATE ---
  const [heapItems, setHeapItems] = useState([
    { name: 'ANR (Biometric Auth)', freq: 310 },
    { name: 'NullPointerException (Login)', freq: 245 },
    { name: 'OutOfMemoryError (Camera)', freq: 189 }
  ]);

  // --- QUEUE SIMULATION STATE ---
  const [queueItems, setQueueItems] = useState([
    { id: 'CRASH-9001', payload: 'NullPointer in Login' },
    { id: 'CRASH-9002', payload: 'OOM in Payment Scanner' },
    { id: 'CRASH-9003', payload: 'SQLite Constraint Error' }
  ]);

  const handleEnqueue = () => {
    const id = `CRASH-${Math.floor(9000 + Math.random() * 1000)}`;
    setQueueItems([...queueItems, { id, payload: 'Inbound surge crash packet' }]);
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) return;
    setQueueItems(queueItems.slice(1));
  };

  // --- SEGMENT TREE STATE ---
  const [startHour, setStartHour] = useState(14);
  const [endHour, setEndHour] = useState(16);

  const selectedAlgo = CPP_ALGORITHMS.find(a => a.id === selectedAlgoId) || CPP_ALGORITHMS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedAlgo.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCpp = () => {
    const blob = new Blob([selectedAlgo.code], { type: 'text/x-c++src' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedAlgo.cppFileName;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-mono">
            <Code2 className="w-5 h-5 text-amber-400" />
            C++ DSA Log Processing Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time interactive C++ data structures and graph algorithms for high-speed crash processing
          </p>
        </div>

        {/* Visualizer vs Code Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-medium">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'visualizer' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Visualizer
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'code' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            C++ Source Code (.cpp)
          </button>
        </div>
      </div>

      {/* Main Grid: Algorithm Tabs + Active Execution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 8 Algorithm Tabs (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono px-2">
            Select C++ Algorithm (8):
          </span>

          <div className="space-y-1.5">
            {CPP_ALGORITHMS.map((algo) => {
              const isSelected = algo.id === selectedAlgoId;
              return (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgoId(algo.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col space-y-1 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="font-mono text-xs font-bold">{algo.title}</span>
                  <span className="text-[10px] text-slate-500 truncate">{algo.useCase}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Visualizer / Code Output Workspace (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          {/* Algorithm Info Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-amber-300 font-mono">{selectedAlgo.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedAlgo.subtitle}</p>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">
                Time: {selectedAlgo.timeComplexity}
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">
                Space: {selectedAlgo.spaceComplexity}
              </span>
            </div>
          </div>

          {/* TAB 1: INTERACTIVE VISUALIZER */}
          {activeTab === 'visualizer' && (
            <div className="space-y-4">
              {/* 1. STACK VISUALIZER */}
              {selectedAlgoId === 'stack' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePushFrame}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                    >
                      Push Frame (push_back)
                    </button>
                    <button
                      onClick={handlePopFrame}
                      className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-lg border border-rose-500/30 transition-all"
                    >
                      Unwind Frame (pop)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stack Frames Vertical Tower */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">std::stack&lt;string&gt; Call Stack:</span>
                      <div className="space-y-1.5 font-mono text-xs">
                        {callStack.map((frame, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border text-center transition-all ${
                              idx === 0
                                ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold shadow-md'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            {idx === 0 && <span className="text-[10px] text-rose-400 uppercase font-sans mr-2">[TOP - EXCEPTION]</span>}
                            {frame}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Unwind Logs */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px] text-slate-400 max-h-48 overflow-y-auto">
                      <span className="text-xs text-amber-400 font-bold">Execution Logs:</span>
                      {stackLogs.map((log, idx) => (
                        <div key={idx} className="border-b border-slate-900 pb-1">{log}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. HASH MAP VISUALIZER */}
              {selectedAlgoId === 'hashmap' && (
                <div className="space-y-4">
                  <span className="text-xs text-slate-400 font-semibold">
                    std::unordered_map&lt;string, int&gt; Exception Frequency Aggregator:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    {Object.entries(freqMap).map(([key, count]) => (
                      <div key={key} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-amber-300">{key}</p>
                          <p className="text-[10px] text-slate-500">Hash key lookup: O(1)</p>
                        </div>
                        <button
                          onClick={() => handleIncFreq(key)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 font-bold"
                        >
                          +1 ({count})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. GRAPH DFS VISUALIZER */}
              {selectedAlgoId === 'graph' && (
                <div className="space-y-4">
                  <span className="text-xs text-slate-400 font-semibold">
                    DFS Crash Path Search Engine (Nodes = Screens, Edges = Navigation):
                  </span>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
                    {dfsPath.map((screen, idx) => (
                      <React.Fragment key={screen}>
                        <div className="px-3 py-2 bg-rose-500/10 border border-rose-500/40 text-rose-300 font-bold rounded-xl shadow-lg">
                          {screen}
                        </div>
                        {idx < dfsPath.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. TRIE VISUALIZER */}
              {selectedAlgoId === 'trie' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={triePrefix}
                      onChange={(e) => setTriePrefix(e.target.value)}
                      placeholder="Prefix e.g. NullPointer"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none"
                    />
                    <span className="text-xs text-slate-400 font-mono">Trie O(L) Prefix Match</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 font-mono text-xs">
                    {trieResults.map((res, idx) => (
                      <div key={idx} className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                        {res}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. HEAP VISUALIZER */}
              {selectedAlgoId === 'heap' && (
                <div className="space-y-3 font-mono text-xs">
                  <span className="text-xs text-slate-400 font-semibold font-sans">
                    std::priority_queue Min-Heap maintaining Top 3 Most Frequent Crashes:
                  </span>

                  {heapItems.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-amber-300 font-bold">Rank #{idx + 1}: {item.name}</span>
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-bold rounded">
                        {item.freq} crashes
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. QUEUE VISUALIZER */}
              {selectedAlgoId === 'queue' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleEnqueue}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg"
                    >
                      Enqueue Packet
                    </button>
                    <button
                      onClick={handleDequeue}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700"
                    >
                      Dequeue to DB
                    </button>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center space-x-3 overflow-x-auto font-mono text-xs">
                    {queueItems.map((pkt, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl whitespace-nowrap min-w-[120px] text-center">
                        <p className="text-amber-400 font-bold">{pkt.id}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{pkt.payload}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. BINARY SEARCH VISUALIZER */}
              {selectedAlgoId === 'binary_search' && (
                <div className="space-y-3 font-mono text-xs">
                  <span className="text-xs text-slate-400 font-sans font-semibold">
                    Sorted Crash ID Index Array (Binary Search O(log N)):
                  </span>

                  <div className="flex items-center space-x-2 overflow-x-auto p-3 bg-slate-950 rounded-xl border border-slate-800">
                    {['CRASH-9001', 'CRASH-9002', 'CRASH-9003', 'CRASH-9004', 'CRASH-9005'].map((id) => (
                      <div
                        key={id}
                        className={`p-2.5 rounded-lg border font-bold ${
                          id === 'CRASH-9003'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {id}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-emerald-400">Target CRASH-9003 matched in 2 iterations (log₂ 5).</p>
                </div>
              )}

              {/* 8. SEGMENT TREE VISUALIZER */}
              {selectedAlgoId === 'segment_tree' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs">
                    <label className="text-slate-400 font-medium">Start Hour:</label>
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={startHour}
                      onChange={(e) => setStartHour(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 rounded p-1 w-16 text-amber-300 font-mono"
                    />

                    <label className="text-slate-400 font-medium">End Hour:</label>
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={endHour}
                      onChange={(e) => setEndHour(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 rounded p-1 w-16 text-amber-300 font-mono"
                    />
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                    <span className="text-amber-300 font-bold">Segment Tree Range Result:</span>
                    <p className="text-slate-200 mt-1">
                      Total crashes logged between {startHour}:00 and {endHour}:00 = <span className="text-amber-400 font-extrabold text-sm">450 crashes</span> (Query time: O(log 24) = 0.02ms).
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: C++ SOURCE CODE (.CPP) */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  {selectedAlgo.cppFileName}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all flex items-center space-x-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy C++</span>
                  </button>

                  <button
                    onClick={handleDownloadCpp}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .cpp</span>
                  </button>
                </div>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-amber-200 leading-relaxed overflow-x-auto max-h-96 scrollbar-thin">
                {selectedAlgo.code}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
