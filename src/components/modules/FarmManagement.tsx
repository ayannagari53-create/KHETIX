import React, { useState } from 'react';
import {
  Tractor,
  Layers,
  CheckCircle2,
  Circle,
  Plus,
  Wrench,
  Calendar,
  AlertCircle,
  Sparkles,
  Power,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';

export const FarmManagement: React.FC = () => {
  const { activeFarm, toggleFieldValve } = useFarm();

  const [activities, setActivities] = useState([
    { id: 'act-1', text: 'Top-dress Calcium Nitrate in Field A (Tomato)', date: 'Today, 07:00 AM', done: true, priority: 'High' },
    { id: 'act-2', text: 'Field B furrow weed clearing before rain', date: 'Today, 03:00 PM', done: false, priority: 'Critical' },
    { id: 'act-3', text: 'Scout Field C Orchard for pomegranate bacterial blight', date: 'Tomorrow, 08:30 AM', done: false, priority: 'Medium' },
    { id: 'act-4', text: 'Check Solar Drip Pump sand filter backwash', date: 'Sep 19', done: false, priority: 'Medium' },
  ]);

  const [equipmentList] = useState([
    { name: 'Mahindra 575 DI Tractor (45 HP)', status: 'Operational', lastService: '2026-08-12', hoursRun: '640 hrs', fuel: '82%' },
    { name: 'Solar Submersible 5HP Drip Pump', status: 'Running (Solar Mode)', lastService: '2026-07-28', hoursRun: '1,280 hrs', fuel: 'Solar (4.2 kW)' },
    { name: 'AgriDrone 16L Hexacopter Sprayer', status: 'Standby / Ready', lastService: '2026-09-02', hoursRun: '48 hrs', fuel: '95% Batt' },
  ]);

  const [newActivityText, setNewActivityText] = useState('');

  const toggleActivity = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, done: !act.done } : act))
    );
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityText.trim()) return;
    setActivities([
      ...activities,
      {
        id: 'act-' + Date.now(),
        text: newActivityText.trim(),
        date: 'Scheduled',
        done: false,
        priority: 'Medium',
      },
    ]);
    setNewActivityText('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tractor className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Farm & Field Operations Hub
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Agronomy ERP
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Hierarchical farm layout, individual field plots, task execution checklists, and agricultural machinery logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs">
            <span className="text-slate-400 block text-[10px]">Active Estate</span>
            <span className="font-bold text-white">{activeFarm.name} ({activeFarm.totalAcres} Ac)</span>
          </div>
        </div>
      </div>

      {/* Field Plots Hierarchy Cards */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-white font-display">
          Active Field Plots & Real-Time Telemetry
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeFarm.fields.map((field) => (
            <div
              key={field.id}
              className="p-5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm">{field.name}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      field.status === 'Healthy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {field.status}
                  </span>
                </div>

                <p className="text-xs text-emerald-400 font-semibold mb-3">
                  {field.crop} • {field.acres} Acres
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Sowing Date</span>
                    <span className="font-medium text-white">{field.sowingDate}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Est. Harvest</span>
                    <span className="font-medium text-white">{field.harvestExpected}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Soil Moisture</span>
                    <strong className="text-emerald-400">{field.moisture}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">NDVI Health</span>
                    <strong className="text-sky-400">{field.ndvi}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => toggleFieldValve(field.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition border ${
                    field.valvesOpen
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                      : 'bg-[#0d2e20] border-emerald-500/30 text-slate-300 hover:text-white'
                  }`}
                >
                  {field.valvesOpen ? '💧 Drip Valve Active' : '⭕ Toggle Valve'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Activity Checklist & Machinery Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Checklist (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white">Daily Field Activity Checklist</h3>
              <p className="text-xs text-slate-400">Agronomic schedule and tasks</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              {activities.filter((a) => a.done).length} / {activities.length} Completed
            </span>
          </div>

          <form onSubmit={handleAddActivity} className="flex gap-2">
            <input
              type="text"
              placeholder="Add new farm task (e.g., Spray neem oil in Field C)..."
              value={newActivityText}
              onChange={(e) => setNewActivityText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </form>

          <div className="space-y-2.5">
            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => toggleActivity(act.id)}
                className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                  act.done
                    ? 'bg-[#0d2e20]/40 border-white/5 opacity-70 line-through text-slate-400'
                    : 'bg-[#0d2e20] border-emerald-500/20 text-slate-200 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {act.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-semibold leading-snug">{act.text}</p>
                    <span className="text-[10px] text-slate-400">{act.date}</span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    act.priority === 'Critical'
                      ? 'bg-red-500/20 text-red-300'
                      : act.priority === 'High'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {act.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Machinery & Equipment (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white">Equipment & Machinery Logs</h3>
              <p className="text-xs text-slate-400">Maintenance & telematics</p>
            </div>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-3">
            {equipmentList.map((eq, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0d2e20] border border-emerald-500/20 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{eq.name}</h4>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {eq.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>Last Service: <span className="text-slate-400">{eq.lastService}</span></div>
                  <div>Runtime: <span className="text-white font-medium">{eq.hoursRun}</span></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  <span>Energy / Fuel:</span>
                  <strong className="text-emerald-300">{eq.fuel}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
