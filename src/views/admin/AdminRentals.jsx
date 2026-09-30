import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Key, CheckCircle, Search, CreditCard, RotateCcw,
  X, Check, AlertCircle, ArrowRight
} from 'lucide-react';

export default function AdminRentals() {
  const {
    db,
    getCustomer,
    getVehicle,
    getBooking,
    completeRental,
    setActivePaymentRental
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [returnModalRental, setReturnModalRental] = useState(null);
  const [returnOdo, setReturnOdo] = useState('');
  const [returnNotes, setReturnNotes] = useState('');

  const filtered = db.rentals.filter(r => {
    const cust = getCustomer(r.customer_id);
    const veh = getVehicle(r.vehicle_id);
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.rental_id.toLowerCase().includes(q) ||
      r.booking_id.toLowerCase().includes(q) ||
      (cust?.name && cust.name.toLowerCase().includes(q)) ||
      (veh?.brand && veh.brand.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnModalRental) return;
    completeRental(returnModalRental.rental_id, returnOdo ? Number(returnOdo) : null, '100%', returnNotes);
    setReturnModalRental(null);
    setReturnOdo('');
    setReturnNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            Rental Dispatch & Return Contracts (RENTAL Table)
          </h2>
          <p className="text-xs text-slate-400">
            Physical key dispatches, telemetry odometer logs, and vehicle check-ins
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Rental ID, Booking ID, customer or car..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE (On Road)</option>
            <option value="COMPLETED">COMPLETED (Returned)</option>
          </select>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Rental ID</th>
              <th className="py-3 px-4 font-semibold">Booking ID</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Vehicle Asset</th>
              <th className="py-3 px-4 font-semibold">Dispatch Dates</th>
              <th className="py-3 px-4 font-semibold">Odometer (km)</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map(r => {
              const cust = getCustomer(r.customer_id);
              const veh = getVehicle(r.vehicle_id);
              return (
                <tr key={r.rental_id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-amber-400">{r.rental_id}</td>
                  <td className="py-3.5 px-4 text-sky-400 font-semibold">{r.booking_id}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-white">
                    {cust?.name || r.customer_id}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="text-white font-medium">{veh?.brand} {veh?.model}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{veh?.vehicle_no}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    <div>{r.pickup_date} → {r.return_date}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                    <div>Start: {r.odometer_start}</div>
                    <div>End: {r.odometer_end ? r.odometer_end : <span className="text-amber-400 italic">In Transit</span>}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'ACTIVE' ? 'badge-rented' : 'badge-available'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      {r.status === 'ACTIVE' && (
                        <button
                          onClick={() => {
                            setReturnModalRental(r);
                            setReturnOdo((r.odometer_start + 220).toString());
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm"
                        >
                          Return & Check-In
                        </button>
                      )}
                      <button
                        onClick={() => setActivePaymentRental(r)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Process / View Payment"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Return Modal */}
      {returnModalRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Return Vehicle & Restore Fleet Availability
              </h3>
              <button onClick={() => setReturnModalRental(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Contract <span className="font-mono text-white font-bold">{returnModalRental.rental_id}</span> will be marked as <span className="text-emerald-400 font-bold">COMPLETED</span>. The vehicle will immediately transition back to <span className="text-emerald-400 font-bold">AVAILABLE</span> for customer reservations.
            </p>

            <form onSubmit={handleReturnSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Ending Odometer (km) *</label>
                <input
                  type="number"
                  required
                  value={returnOdo}
                  onChange={(e) => setReturnOdo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Return Inspection Notes</label>
                <textarea
                  rows="2"
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Routine post-rental vehicle inspection passed..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalRental(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  Complete Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
