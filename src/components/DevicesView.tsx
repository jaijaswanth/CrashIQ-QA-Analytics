import React from 'react';
import { Smartphone, Cpu, Layers, AlertCircle, BarChart3, ShieldAlert } from 'lucide-react';
import { Device } from '../types';

interface DevicesViewProps {
  devices: Device[];
}

export const DevicesView: React.FC<DevicesViewProps> = ({ devices }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-mono">
            <Smartphone className="w-5 h-5 text-amber-400" />
            Client Hardware & Device Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Correlating crash frequencies with RAM capacity, processor chipset, and Android OS versions
          </p>
        </div>
      </div>

      {/* Hardware Inventory Grid Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Device Registry ({devices.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Device ID</th>
                <th className="py-2.5 px-3">Brand & Model</th>
                <th className="py-2.5 px-3">RAM</th>
                <th className="py-2.5 px-3">Processor</th>
                <th className="py-2.5 px-3">Android Version</th>
                <th className="py-2.5 px-3">Total Crashes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {devices.map((dev) => (
                <tr key={dev.device_id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-amber-300">{dev.device_id}</td>
                  <td className="py-3 px-3 font-sans font-semibold text-slate-100 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    <span>{dev.brand} {dev.model}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{dev.ram}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{dev.processor}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700">
                      {dev.android_version}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${
                      (dev.total_crashes || 0) > 80 ? 'text-rose-400' : 'text-amber-300'
                    }`}>
                      {dev.total_crashes || 0} crashes
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
