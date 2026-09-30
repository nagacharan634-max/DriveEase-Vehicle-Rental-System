import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users, Car, Calendar, Key, DollarSign, Wrench,
  TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle2,
  AlertTriangle, Clock, ChevronRight
} from 'lucide-react';

export default function AdminOverview({ setAdminTab }) {
  const { db, getVehicle, getCustomer, cancelBooking } = useApp();

  // Top Metrics Calculations
  const totalCustomers = db.customers.length;
  const totalVehicles = db.vehicles.length;
  const activeBookings = db.bookings.filter(b => b.status === 'CONFIRMED').length;
  const activeRentals = db.rentals.filter(r => r.status === 'ACTIVE').length;
  const totalRevenue = db.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const vehiclesUnderMaintenance = db.vehicles.filter(v => v.status === 'UNDER MAINTENANCE').length;

  // Fleet availability breakdown for donut chart
  const availableCount = db.vehicles.filter(v => v.status === 'AVAILABLE').length;
  const bookedCount = db.vehicles.filter(v => v.status === 'BOOKED').length;
  const rentedCount = db.vehicles.filter(v => v.status === 'RENTED').length;
  const maintenanceCount = vehiclesUnderMaintenance;

  const totalV = totalVehicles || 1;
  const availablePct = Math.round((availableCount / totalV) * 100);
  const bookedPct = Math.round((bookedCount / totalV) * 100);
  const rentedPct = Math.round((rentedCount / totalV) * 100);
  const maintenancePct = Math.round((maintenanceCount / totalV) * 100);

  // Monthly Analytics Mock Bar Data
  const monthlyBookingsData = [
    { month: 'Apr', count: 18, rev: 3200 },
    { month: 'May', count: 24, rev: 4100 },
    { month: 'Jun', count: 32, rev: 5900 },
    { month: 'Jul', count: 45, rev: 7800 },
    { month: 'Aug', count: 38, rev: 6900 },
    { month: 'Sep', count: 48, rev: 8400 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. TOP 6 METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Customers */}
        <div
          onClick={() => setAdminTab('customers')}
          className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer glass-card-hover"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Customers</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalCustomers}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +12% this month
          </div>
        </div>

        {/* Total Vehicles */}
        <div
          onClick={() => setAdminTab('vehicles')}
          className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer glass-card-hover"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Fleet Assets</span>
            <Car className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalVehicles}</div>
          <div className="text-[10px] text-slate-400 mt-1">Across 4 Categories</div>
        </div>

        {/* Active Bookings */}
        <div
          onClick={() => setAdminTab('bookings')}
          className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer glass-card-hover"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Bookings</span>
            <Calendar className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">{activeBookings}</div>
          <div className="text-[10px] text-slate-400 mt-1">Confirmed reservations</div>
        </div>

        {/* Active Rentals */}
        <div
          onClick={() => setAdminTab('rentals')}
          className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer glass-card-hover"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Rentals</span>
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{activeRentals}</div>
          <div className="text-[10px] text-amber-400 mt-1">Currently on trip</div>
        </div>

        {/* Total Revenue */}
        <div
          onClick={() => setAdminTab('payments')}
          className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer glass-card-hover"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +18.4% YoY
          </div>
        </div>

        {/* Vehicles Under Maintenance */}
        <div
          onClick={() => setAdminTab('maintenance')}
          className="glass-card p-4 rounded-2xl border border-slate-800 cursor-pointer glass-card-hover"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Maintenance</span>
            <Wrench className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">{vehiclesUnderMaintenance}</div>
          <div className="text-[10px] text-rose-300 mt-1">In workshop bays</div>
        </div>
      </div>

      {/* 2. ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Booking & Revenue Analytics */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Monthly Booking & Revenue Analytics
              </h3>
              <p className="text-xs text-slate-400">Reservation count & ledger turnover (Last 6 Months)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
                <span className="text-slate-300">Bookings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                <span className="text-slate-300">Revenue ($)</span>
              </div>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-4 pt-4 px-2 border-b border-slate-800">
            {monthlyBookingsData.map(item => {
              const maxBookings = 50;
              const barHeightPct = (item.count / maxBookings) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.rev}
                  </div>
                  <div className="w-full max-w-[40px] flex items-end justify-center gap-1 h-44 bg-slate-900/60 rounded-t-lg p-1">
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md transition-all duration-500 group-hover:from-blue-500 group-hover:to-indigo-400 shadow-lg shadow-blue-900/30"
                      title={`${item.count} Bookings`}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-slate-400">Peak Month</div>
              <div className="text-white font-bold font-mono mt-0.5">September (48 Bookings)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-slate-400">Average Turnaround</div>
              <div className="text-white font-bold font-mono mt-0.5">3.8 Days per Rental</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-slate-400">Fleet Utilization</div>
              <div className="text-emerald-400 font-bold font-mono mt-0.5">87.5% Active Fleet</div>
            </div>
          </div>
        </div>

        {/* Right Chart: Fleet Availability Donut */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Vehicle Availability</h3>
            <p className="text-xs text-slate-400">Live fleet allocation status</p>
          </div>

          {/* Visual Donut representation */}
          <div className="relative flex items-center justify-center py-4">
            <svg viewBox="0 0 100 100" className="w-44 h-44 -rotate-90">
              {/* Background track */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="14" />
              {/* Available segment */}
              <circle
                cx="50" cy="50" r="40" fill="transparent"
                stroke="#10b981" strokeWidth="14"
                strokeDasharray={`${availablePct * 2.51} 251`}
                strokeDashoffset="0"
              />
              {/* Booked segment */}
              <circle
                cx="50" cy="50" r="40" fill="transparent"
                stroke="#3b82f6" strokeWidth="14"
                strokeDasharray={`${bookedPct * 2.51} 251`}
                strokeDashoffset={`-${availablePct * 2.51}`}
              />
              {/* Rented segment */}
              <circle
                cx="50" cy="50" r="40" fill="transparent"
                stroke="#f59e0b" strokeWidth="14"
                strokeDasharray={`${rentedPct * 2.51} 251`}
                strokeDashoffset={`-${(availablePct + bookedPct) * 2.51}`}
              />
              {/* Maintenance segment */}
              <circle
                cx="50" cy="50" r="40" fill="transparent"
                stroke="#ef4444" strokeWidth="14"
                strokeDasharray={`${maintenancePct * 2.51} 251`}
                strokeDashoffset={`-${(availablePct + bookedPct + rentedPct) * 2.51}`}
              />
            </svg>

            {/* Inner text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white font-mono">{totalVehicles}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Cars</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300">Available</span>
              </div>
              <span className="font-mono font-bold text-white">{availableCount} ({availablePct}%)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-300">Booked</span>
              </div>
              <span className="font-mono font-bold text-white">{bookedCount} ({bookedPct}%)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-300">Rented (On Trip)</span>
              </div>
              <span className="font-mono font-bold text-white">{rentedCount} ({rentedPct}%)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-300">Under Maintenance</span>
              </div>
              <span className="font-mono font-bold text-white">{maintenanceCount} ({maintenancePct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT BOOKINGS QUICK TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent System Bookings</h3>
            <p className="text-xs text-slate-400">Incoming reservations linked to CUSTOMER and VEHICLE tables</p>
          </div>
          <button
            onClick={() => setAdminTab('bookings')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
                <th className="py-3 px-4 font-semibold">Booking ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Vehicle</th>
                <th className="py-3 px-4 font-semibold">Dates</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {db.bookings.slice(0, 5).map(b => {
                const cust = getCustomer(b.customer_id);
                const veh = getVehicle(b.vehicle_id);
                return (
                  <tr key={b.booking_id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-blue-400">{b.booking_id}</td>
                    <td className="py-3 px-4 font-sans text-white font-medium">{cust?.name || b.customer_id}</td>
                    <td className="py-3 px-4 font-sans text-slate-300">{veh?.brand} {veh?.model}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{b.start_date} to {b.end_date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-300' :
                        b.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">${b.total_amount}</td>
                    <td className="py-3 px-4 text-right font-sans">
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => cancelBooking(b.booking_id)}
                          className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
