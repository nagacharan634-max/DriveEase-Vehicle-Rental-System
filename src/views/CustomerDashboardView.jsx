import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Car, Calendar, Key, CreditCard, User,
  LogOut, Shield, Clock, CheckCircle2, ArrowRight, XCircle,
  Eye, Download, AlertCircle, Edit2, Save, Sparkles, MapPin, Fuel
} from 'lucide-react';

export default function CustomerDashboardView() {
  const {
    currentUser,
    setCurrentUser,
    setCurrentView,
    customerTab,
    setCustomerTab,
    db,
    getVehicle,
    getCategory,
    cancelBooking,
    completeRental,
    setActivePaymentRental,
    setActiveVehicleDetails,
    updateCustomer,
    addToast
  } = useApp();

  // If user is not logged in, show fallback redirect
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <User className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Customer Session Not Found</h2>
        <p className="text-xs text-slate-400">Please sign in or select a demo profile to access your dashboard.</p>
        <button
          onClick={() => setCurrentView('customer-auth')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileAddress, setProfileAddress] = useState(currentUser.address);
  const [profileLicense, setProfileLicense] = useState(currentUser.driver_license_no);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Return Rental Modal/State
  const [returningRentalId, setReturningRentalId] = useState(null);
  const [returnOdometer, setReturnOdometer] = useState('');
  const [returnNotes, setReturnNotes] = useState('');

  // Customer's specific data
  const myBookings = db.bookings.filter(b => b.customer_id === currentUser.customer_id);
  const myRentals = db.rentals.filter(r => r.customer_id === currentUser.customer_id);
  const myRentalIds = myRentals.map(r => r.rental_id);
  const myPayments = db.payments.filter(p => myRentalIds.includes(p.rental_id) || p.customer_id === currentUser.customer_id);

  // Computed metrics
  const totalBookingsCount = myBookings.length;
  const activeRentals = myRentals.filter(r => r.status === 'ACTIVE');
  const completedRentals = myRentals.filter(r => r.status === 'COMPLETED');
  const totalAmountSpent = myPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // Current active rental if any
  const currentRental = activeRentals[0] || null;
  const currentVehicle = currentRental ? getVehicle(currentRental.vehicle_id) : null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCustomer(currentUser.customer_id, {
      name: profileName,
      phone: profilePhone,
      address: profileAddress,
      driver_license_no: profileLicense
    });
    setIsEditingProfile(false);
  };

  const handleReturnVehicleSubmit = (rentalId) => {
    completeRental(rentalId, returnOdometer ? Number(returnOdometer) : null, '100%', returnNotes);
    setReturningRentalId(null);
    setReturnOdometer('');
    setReturnNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================================================================ */}
        {/* SIDEBAR NAVIGATION */}
        {/* ================================================================ */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-4 border border-slate-800 space-y-6">
          {/* User mini badge */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/40"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">{currentUser.customer_id}</div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Verified Driver
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setCustomerTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                customerTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView('vehicles')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 transition-all"
            >
              <Car className="w-4 h-4 text-blue-400" />
              <span>Browse Vehicles</span>
            </button>

            <button
              onClick={() => setCustomerTab('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                customerTab === 'bookings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>My Bookings</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {myBookings.length}
              </span>
            </button>

            <button
              onClick={() => setCustomerTab('rentals')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                customerTab === 'rentals'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-amber-400" />
                <span>My Rentals</span>
              </div>
              {activeRentals.length > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {activeRentals.length} Active
                </span>
              )}
            </button>

            <button
              onClick={() => setCustomerTab('payments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                customerTab === 'payments'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Payments</span>
            </button>

            <button
              onClick={() => setCustomerTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                customerTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <User className="w-4 h-4 text-sky-400" />
              <span>Profile</span>
            </button>

            <div className="pt-4 border-t border-slate-800/80">
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView('home');
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* MAIN DASHBOARD CONTENT */}
        {/* ================================================================ */}
        <div className="lg:col-span-9 space-y-8">
          {/* TAB 1: OVERVIEW */}
          {customerTab === 'overview' && (
            <div className="space-y-8">
              {/* TOP 4 STATISTIC CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Total Bookings</span>
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{totalBookingsCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Confirmed & Past</div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Active Rentals</span>
                    <Key className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">{activeRentals.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">On the road now</div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Completed</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">{completedRentals.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Successfully returned</div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Total Spent</span>
                    <CreditCard className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">${totalAmountSpent.toFixed(2)}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Lifetime rentals</div>
                </div>
              </div>

              {/* CURRENT RENTAL SPOTLIGHT */}
              {currentRental && currentVehicle && (
                <div className="glass-card p-6 rounded-3xl border border-amber-500/40 relative overflow-hidden bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <img
                        src={currentVehicle.image}
                        alt={currentVehicle.model}
                        className="w-36 h-24 object-cover rounded-2xl ring-1 ring-amber-500/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge-rented px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            CURRENT ACTIVE TRIP
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Contract: {currentRental.rental_id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1">
                          {currentVehicle.brand} {currentVehicle.model}
                        </h3>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          Plate: {currentVehicle.vehicle_no} • Dispatched at {currentRental.odometer_start} km
                        </div>
                        <div className="text-xs text-slate-300 mt-2 flex items-center gap-3">
                          <span>Pickup: {currentRental.pickup_date}</span>
                          <span>•</span>
                          <span>Due: {currentRental.return_date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => setActivePaymentRental(currentRental)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <span>Pay Settlement</span>
                      </button>

                      <button
                        onClick={() => setReturningRentalId(currentRental.rental_id)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center gap-2"
                      >
                        <Key className="w-4 h-4" />
                        <span>Return & Complete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* RECENT BOOKINGS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Recent Bookings
                  </h3>
                  <button
                    onClick={() => setCustomerTab('bookings')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View All ({myBookings.length})
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                  {myBookings.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      You haven't made any bookings yet.{' '}
                      <span
                        onClick={() => setCurrentView('vehicles')}
                        className="text-blue-400 hover:underline cursor-pointer"
                      >
                        Browse vehicles to reserve now!
                      </span>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
                          <th className="py-3 px-4 font-semibold">Booking ID</th>
                          <th className="py-3 px-4 font-semibold">Vehicle</th>
                          <th className="py-3 px-4 font-semibold">Rental Dates</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold">Amount</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {myBookings.slice(0, 4).map(b => {
                          const veh = getVehicle(b.vehicle_id);
                          return (
                            <tr key={b.booking_id} className="hover:bg-slate-800/30">
                              <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                                #{b.booking_id}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-white">{veh?.brand} {veh?.model}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{veh?.vehicle_no}</div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-300">
                                <div>{b.start_date} to {b.end_date}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{b.days} Days</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  b.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-300' :
                                  b.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                                  b.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-300' :
                                  'bg-slate-700 text-slate-300'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-white">
                                ${b.total_amount}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {b.status === 'CONFIRMED' && (
                                  <button
                                    onClick={() => cancelBooking(b.booking_id)}
                                    className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
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
                  )}
                </div>
              </div>

              {/* RECOMMENDED VEHICLES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Recommended Vehicles for Your Next Journey
                  </h3>
                  <button
                    onClick={() => setCurrentView('vehicles')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {db.vehicles.filter(v => v.status === 'AVAILABLE').slice(0, 3).map(v => (
                    <div
                      key={v.vehicle_id}
                      onClick={() => setActiveVehicleDetails(v)}
                      className="glass-card p-3 rounded-2xl border border-slate-800 cursor-pointer glass-card-hover group"
                    >
                      <img
                        src={v.image}
                        alt={v.model}
                        className="w-full h-32 object-cover rounded-xl group-hover:scale-105 transition-transform"
                      />
                      <div className="mt-2.5 flex items-baseline justify-between">
                        <div className="text-xs font-bold text-white">{v.brand} {v.model}</div>
                        <div className="text-xs font-mono font-bold text-blue-400">${v.base_rate}/d</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {customerTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">My Reservations & Bookings</h2>
                  <p className="text-xs text-slate-400">All historical and confirmed upcoming booking contracts</p>
                </div>
                <button
                  onClick={() => setCurrentView('vehicles')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-900/30"
                >
                  New Reservation
                </button>
              </div>

              <div className="space-y-3">
                {myBookings.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs glass-card rounded-2xl border border-slate-800">
                    No bookings found.
                  </div>
                ) : (
                  myBookings.map(b => {
                    const veh = getVehicle(b.vehicle_id);
                    return (
                      <div
                        key={b.booking_id}
                        className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <img
                            src={veh?.image}
                            alt={veh?.model}
                            className="w-20 h-16 object-cover rounded-xl"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-blue-400">#{b.booking_id}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                b.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-300' :
                                b.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}>
                                {b.status}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-white mt-1">{veh?.brand} {veh?.model}</div>
                            <div className="text-xs text-slate-400 font-mono">
                              {b.start_date} → {b.end_date} ({b.days} days) • Hub: {b.pickup_hub}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400">Total Price</div>
                            <div className="text-lg font-black text-white font-mono">${b.total_amount}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {b.status === 'CONFIRMED' && (
                              <button
                                onClick={() => cancelBooking(b.booking_id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => veh && setActiveVehicleDetails(veh)}
                              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                              title="View Vehicle Specs"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MY RENTALS */}
          {customerTab === 'rentals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">My Vehicle Rentals</h2>
                  <p className="text-xs text-slate-400">Active contracts, odometer inspections, and returns</p>
                </div>
              </div>

              <div className="space-y-4">
                {myRentals.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs glass-card rounded-2xl border border-slate-800">
                    No rental contracts dispatched yet.
                  </div>
                ) : (
                  myRentals.map(r => {
                    const veh = getVehicle(r.vehicle_id);
                    const booking = db.bookings.find(b => b.booking_id === r.booking_id);
                    return (
                      <div
                        key={r.rental_id}
                        className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-3">
                            <Key className="w-5 h-5 text-amber-400" />
                            <div>
                              <div className="font-mono font-bold text-white text-xs">Rental Contract: {r.rental_id}</div>
                              <div className="text-[11px] text-slate-400 font-mono">Linked Booking: #{r.booking_id}</div>
                            </div>
                          </div>
                          <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold ${
                            r.status === 'ACTIVE' ? 'badge-rented' : 'badge-available'
                          }`}>
                            {r.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <div className="text-slate-400">Vehicle</div>
                            <div className="text-white font-bold mt-0.5">{veh?.brand} {veh?.model}</div>
                            <div className="text-slate-400 font-mono">{veh?.vehicle_no}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Schedule</div>
                            <div className="text-white mt-0.5">Pickup: {r.pickup_date}</div>
                            <div className="text-slate-400">Return: {r.return_date}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Telemetry Odometer</div>
                            <div className="text-white font-mono mt-0.5">Start: {r.odometer_start} km</div>
                            <div className="text-slate-400 font-mono">
                              End: {r.odometer_end ? `${r.odometer_end} km` : 'In Transit'}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <div className="text-xs text-slate-400">
                            Inspection: <span className="text-slate-300 italic">"{r.inspection_notes}"</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {r.status === 'ACTIVE' && (
                              <>
                                <button
                                  onClick={() => setActivePaymentRental(r)}
                                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
                                >
                                  Make Payment
                                </button>
                                <button
                                  onClick={() => setReturningRentalId(r.rental_id)}
                                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                                >
                                  Return Vehicle
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {customerTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Payment & Billing History</h2>
                  <p className="text-xs text-slate-400">Settled invoices and transaction ledger receipts</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                {myPayments.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No settled transactions on record.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
                        <th className="py-3 px-4 font-semibold">Payment ID</th>
                        <th className="py-3 px-4 font-semibold">Rental Ref</th>
                        <th className="py-3 px-4 font-semibold">Payment Date</th>
                        <th className="py-3 px-4 font-semibold">Method</th>
                        <th className="py-3 px-4 font-semibold">Amount</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {myPayments.map(p => (
                        <tr key={p.payment_id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-bold text-blue-400">{p.payment_id}</td>
                          <td className="py-3 px-4 text-slate-300">{p.rental_id}</td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">{p.payment_date}</td>
                          <td className="py-3 px-4 font-sans text-slate-300">{p.payment_method}</td>
                          <td className="py-3 px-4 font-bold text-white">${Number(p.amount).toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => window.print()}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Print Receipt"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {customerTab === 'profile' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                    <div className="text-xs text-slate-400 font-mono">Customer ID: {currentUser.customer_id}</div>
                    <div className="text-xs text-slate-500">Member since: {currentUser.registered_at}</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Telephone Contact</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Driver License No.</label>
                      <input
                        type="text"
                        value={profileLicense}
                        onChange={(e) => setProfileLicense(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Billing Address</label>
                      <input
                        type="text"
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-400">Email Address</div>
                    <div className="text-white font-semibold mt-1">{currentUser.email}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-400">Phone Number</div>
                    <div className="text-white font-semibold mt-1">{currentUser.phone}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-400">Driver License Number</div>
                    <div className="text-white font-mono font-semibold mt-1">{currentUser.driver_license_no}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Expires: {currentUser.license_expiry}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-400">Residential Address</div>
                    <div className="text-white font-semibold mt-1">{currentUser.address}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: RETURN VEHICLE CONFIRMATION */}
      {returningRentalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              Return Vehicle Check-In
            </h3>
            <p className="text-xs text-slate-400">
              Returning the vehicle will complete contract <span className="font-mono text-white">#{returningRentalId}</span> and automatically restore the automobile's status to <span className="text-emerald-400 font-bold">AVAILABLE</span> in the DBMS database.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Ending Odometer Reading (km)</label>
                <input
                  type="number"
                  placeholder="e.g. 19200"
                  value={returnOdometer}
                  onChange={(e) => setReturnOdometer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Post-Trip Condition & Notes</label>
                <textarea
                  rows="2"
                  placeholder="Returned in immaculate condition with full tank."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReturningRentalId(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReturnVehicleSubmit(returningRentalId)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
