import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Car, Calendar, User, Key, ArrowRight, X } from 'lucide-react';

export default function GlobalSearchModal() {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    db,
    setActiveVehicleDetails,
    setCurrentView,
    setCustomerTab,
    setAdminTab,
    adminUser
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchModalOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const vehicleResults = q
    ? db.vehicles.filter(v =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.vehicle_no.toLowerCase().includes(q) ||
        v.status.toLowerCase().includes(q)
      )
    : db.vehicles.slice(0, 3);

  const customerResults = q
    ? db.customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.customer_id.toLowerCase().includes(q)
      )
    : [];

  const bookingResults = q
    ? db.bookings.filter(b =>
        b.booking_id.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q) ||
        b.customer_id.toLowerCase().includes(q)
      )
    : [];

  const rentalResults = q
    ? db.rentals.filter(r =>
        r.rental_id.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-800/40">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicles, bookings, customers, rentals... (Esc to close)"
            className="w-full bg-transparent px-3 py-1 text-slate-100 placeholder-slate-500 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="ml-2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-5">
          {/* Vehicles Section */}
          {vehicleResults.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                Vehicles ({vehicleResults.length})
              </div>
              <div className="space-y-1.5">
                {vehicleResults.map(v => (
                  <div
                    key={v.vehicle_id}
                    onClick={() => {
                      setActiveVehicleDetails(v);
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={v.image} alt={v.model} className="w-10 h-7 object-cover rounded-md" />
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          {v.brand} {v.model}
                        </div>
                        <div className="text-xs text-slate-400">
                          {v.vehicle_no} • ${v.base_rate}/day
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        v.status === 'AVAILABLE' ? 'badge-available' :
                        v.status === 'RENTED' ? 'badge-rented' :
                        v.status === 'BOOKED' ? 'badge-booked' : 'badge-maintenance'
                      }`}>
                        {v.status}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Section */}
          {bookingResults.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Bookings ({bookingResults.length})
              </div>
              <div className="space-y-1.5">
                {bookingResults.map(b => (
                  <div
                    key={b.booking_id}
                    onClick={() => {
                      if (adminUser) {
                        setCurrentView('admin-dashboard');
                        setAdminTab('bookings');
                      } else {
                        setCurrentView('customer-dashboard');
                        setCustomerTab('bookings');
                      }
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                        Booking #{b.booking_id}
                      </div>
                      <div className="text-xs text-slate-400">
                        {b.start_date} to {b.end_date} • ${b.total_amount}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers Section */}
          {customerResults.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                Customers ({customerResults.length})
              </div>
              <div className="space-y-1.5">
                {customerResults.map(c => (
                  <div
                    key={c.customer_id}
                    onClick={() => {
                      if (adminUser) {
                        setCurrentView('admin-dashboard');
                        setAdminTab('customers');
                      }
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                        {c.name} ({c.customer_id})
                      </div>
                      <div className="text-xs text-slate-400">
                        {c.email} • {c.phone}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rentals Section */}
          {rentalResults.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Rentals ({rentalResults.length})
              </div>
              <div className="space-y-1.5">
                {rentalResults.map(r => (
                  <div
                    key={r.rental_id}
                    onClick={() => {
                      if (adminUser) {
                        setCurrentView('admin-dashboard');
                        setAdminTab('rentals');
                      } else {
                        setCurrentView('customer-dashboard');
                        setCustomerTab('rentals');
                      }
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">
                        Rental #{r.rental_id}
                      </div>
                      <div className="text-xs text-slate-400">
                        Pickup: {r.pickup_date} • Return: {r.return_date}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q && vehicleResults.length === 0 && customerResults.length === 0 && bookingResults.length === 0 && rentalResults.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">Esc</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
}
