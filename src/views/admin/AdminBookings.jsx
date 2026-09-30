import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar, Check, X, Key, Search, Eye, Filter
} from 'lucide-react';

export default function AdminBookings() {
  const {
    db,
    getCustomer,
    getVehicle,
    cancelBooking,
    startRental,
    setActiveVehicleDetails,
    addToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = db.bookings.filter(b => {
    const cust = getCustomer(b.customer_id);
    const veh = getVehicle(b.vehicle_id);
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.booking_id.toLowerCase().includes(q) ||
      (cust?.name && cust.name.toLowerCase().includes(q)) ||
      (veh?.brand && veh.brand.toLowerCase().includes(q)) ||
      (veh?.model && veh.model.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStartRentalFromBooking = (bookingId) => {
    const existing = db.rentals.find(r => r.booking_id === bookingId && r.status === 'ACTIVE');
    if (existing) {
      addToast('Rental Already Active', `Rental contract #${existing.rental_id} is already in progress.`, 'warning');
      return;
    }
    startRental(bookingId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            Booking & Reservation Management (BOOKING Table)
          </h2>
          <p className="text-xs text-slate-400">
            Relational reservations connecting CUSTOMER and VEHICLE records with calculated tariffs
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
            placeholder="Search by Booking ID, customer name, or vehicle..."
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
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Booking ID</th>
              <th className="py-3 px-4 font-semibold">Customer (FK)</th>
              <th className="py-3 px-4 font-semibold">Vehicle (FK)</th>
              <th className="py-3 px-4 font-semibold">Booking Date</th>
              <th className="py-3 px-4 font-semibold">Rental Period</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Total Amount</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map(b => {
              const cust = getCustomer(b.customer_id);
              const veh = getVehicle(b.vehicle_id);
              return (
                <tr key={b.booking_id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-sky-400">{b.booking_id}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white">{cust?.name || b.customer_id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.customer_id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white">{veh?.brand} {veh?.model}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{veh?.vehicle_no}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{b.booking_date}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="text-slate-200">{b.start_date} to {b.end_date}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{b.days} Days • {b.pickup_hub}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-300' :
                      b.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                      b.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    ${Number(b.total_amount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => handleStartRentalFromBooking(b.booking_id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold text-xs flex items-center gap-1 border border-emerald-500/30 transition-colors"
                            title="Dispatch keys and create active RENTAL"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>Start Rental</span>
                          </button>

                          <button
                            onClick={() => cancelBooking(b.booking_id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Cancel Booking"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => veh && setActiveVehicleDetails(veh)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="View Vehicle Specs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
