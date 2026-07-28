import React, { useState } from 'react';
import {
  Bug,
  Plus,
  CheckCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { BugReport, BugStatus } from '../types';

interface BugTrackerViewProps {
  bugReports: BugReport[];
  onUpdateBugStatus: (id: string, status: BugStatus) => void;
  onCreateNewBug: (bug: Partial<BugReport>) => void;
}

export const BugTrackerView: React.FC<BugTrackerViewProps> = ({
  bugReports,
  onUpdateBugStatus,
  onCreateNewBug
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newModule, setNewModule] = useState('Login Module');
  const [newPriority, setNewPriority] = useState<BugReport['priority']>('P1 - High');
  const [newAssignee, setNewAssignee] = useState('Priya Sharma');

  const filteredBugs = bugReports.filter((b) => {
    const matchesPriority = priorityFilter === 'All' || b.priority.includes(priorityFilter);
    const matchesStatus = statusFilter === 'All' || b.bug_status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onCreateNewBug({
      title: newTitle,
      module_name: newModule,
      priority: newPriority,
      assigned_to: newAssignee,
      crash_id: 'CRASH-9001',
      exception_type: 'Manual Report'
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  const getPriorityBadge = (p: BugReport['priority']) => {
    if (p.includes('P0')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30">P0 - Immediate</span>;
    }
    if (p.includes('P1')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30">P1 - High</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30">{p}</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-mono">
            <Bug className="w-5 h-5 text-amber-400" />
            Bug Reports & Issue Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Triaging and developer resolution workflow for stack traces auto-created by database triggers
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Bug Report</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="All">Priority: All</option>
          <option value="P0">P0 - Immediate</option>
          <option value="P1">P1 - High</option>
          <option value="P2">P2 - Normal</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="All">Status: All</option>
          <option value="Open">Open</option>
          <option value="Triaged">Triaged</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Bug Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBugs.map((bug) => (
          <div
            key={bug.bug_id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-300">{bug.bug_id}</span>
                {getPriorityBadge(bug.priority)}
              </div>

              <h3 className="text-sm font-bold text-slate-100">{bug.title}</h3>

              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                <span>Linked: {bug.crash_id}</span>
                <span>•</span>
                <span>{bug.module_name || 'General'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{bug.assigned_to}</span>
              </div>

              <select
                value={bug.bug_status}
                onChange={(e) => onUpdateBugStatus(bug.bug_id, e.target.value as BugStatus)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Open">Open</option>
                <option value="Triaged">Triaged</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Bug Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Bug className="w-5 h-5 text-amber-400" />
              Create Bug Report
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Bug Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NullPointer during payment authentication"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Module Name:</label>
                <select
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 mt-1 focus:outline-none"
                >
                  <option value="Login Module">Login Module</option>
                  <option value="Payment Checkout">Payment Checkout</option>
                  <option value="Sync Engine">Sync Engine</option>
                  <option value="Biometric Security">Biometric Security</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Priority:</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 mt-1 focus:outline-none"
                >
                  <option value="P0 - Immediate">P0 - Immediate</option>
                  <option value="P1 - High">P1 - High</option>
                  <option value="P2 - Normal">P2 - Normal</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Assign Developer:</label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 mt-1 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl"
                >
                  Save Bug Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
