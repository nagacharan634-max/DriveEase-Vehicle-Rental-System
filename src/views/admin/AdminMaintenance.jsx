import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench, Plus, Search, CheckCircle2, Clock,
  AlertTriangle, DollarSign, X, Check, ArrowRight
} from 'lucide-react';

export default function AdminMaintenance() {
  const {
    db,
    getVehicle,
    scheduleMaintenance,
    completeMaintenance,
    addToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [vehicleId, setVehicleId] = useState(() => db.vehicles[0]?.vehicle_id || 'VEH-201');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(250);
  const [technician, setTechnician] = useState('Vikram Mehta (Lead Master Tech)');

  const filtered = db.maintenance.filter(m => {
    const veh = getVehicle(m.vehicle_id);
    const q = search.toLowerCase();
    return !q ||
      m.maintenance_id.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (veh?.brand && veh.brand.toLowerCase().includes(q)) ||
      (veh?.model && veh.model.toLowerCase().includes(q));
  });

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!description) {
      addToast('Description Required', 'Please enter a description of the mechanical repair/service required.', 'warning');
      return;
    }
    scheduleMaintenance(vehicleId, description, cost, technician);
    setModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-rose-400" />
            Fleet Maintenance & Workshop Diagnostics (MAINTENANCE Table)
          </h2>
          <p className="text-xs text-slate-400">
            Scheduling service automatically sets vehicle to UNDER MAINTENANCE (preventing customer booking)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Service</span>
        </button>
      </div>

      {/* Active Service Bay Notice */}
      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-300 leading-relaxed">
          <span className="font-bold">DBMS Integrity Rule Enforced:</span> Any automobile registered with status <span className="font-mono text-white font-bold">IN_PROGRESS</span> in the <span className="font-mono font-bold">MAINTENANCE</span> table automatically flags the vehicle as <span className="font-mono font-bold text-rose-400">UNDER MAINTENANCE</span> in the fleet catalog, disabling customer reservations until service sign-off.
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search maintenance logs by ID, vehicle model, technician, or repair description..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Maintenance Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Service ID (PK)</th>
              <th className="py-3 px-4 font-semibold">Vehicle Asset (FK)</th>
              <th className="py-3 px-4 font-semibold">Commencement Date</th>
              <th className="py-3 px-4 font-semibold">Work Description</th>
              <th className="py-3 px-4 font-semibold">Cost</th>
              <th className="py-3 px-4 font-semibold">Lead Tech</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map(m => {
              const veh = getVehicle(m.vehicle_id);
              return (
                <tr key={m.maintenance_id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-rose-400">{m.maintenance_id}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white">{veh?.brand} {veh?.model}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{veh?.vehicle_no}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{m.service_date}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-300 max-w-sm">
                    {m.description}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">${m.cost}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">{m.technician}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    {m.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => completeMaintenance(m.maintenance_id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                        title="Sign off service and restore vehicle availability"
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Schedule Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-rose-400" />
                Schedule Workshop Service
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Select Fleet Automobile (VEHICLE_ID) *</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {db.vehicles.map(v => (
                    <option key={v.vehicle_id} value={v.vehicle_id}>
                      {v.brand} {v.model} ({v.vehicle_no}) – Currently {v.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Service & Diagnostic Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. 30,000km routine service, brake pad replacement and wheel alignment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Estimated Cost ($) *</label>
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Assigned Master Tech</label>
                  <input
                    type="text"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-[11px] text-rose-300">
                Warning: Scheduling service immediately transitions the automobile to <span className="font-bold text-white">UNDER MAINTENANCE</span> status.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md"
                >
                  Commit Service Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
