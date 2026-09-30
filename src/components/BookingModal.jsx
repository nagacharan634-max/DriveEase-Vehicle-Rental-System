import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X, Check, Calendar, User, FileText, CheckCircle2,
  Car, Shield, Clock, MapPin, ArrowRight, ArrowLeft, Printer
} from 'lucide-react';

export default function BookingModal() {
  const {
    activeBookingVehicle,
    setActiveBookingVehicle,
    currentUser,
    getCategory,
    createBooking,
    setCurrentView,
    setCustomerTab
  } = useApp();

  const [step, setStep] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Form states
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [pickupHub, setPickupHub] = useState('Central Mobility Hub - Downtown');

  // Customer credentials
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Alex Sterling');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'alex.sterling@driveease.io');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+1 (555) 382-9012');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '742 Evergreen Terrace, Seattle, WA');
  const [licenseNo, setLicenseNo] = useState(currentUser?.driver_license_no || 'DL-WA-89210-994');
  const [licenseExpiry, setLicenseExpiry] = useState(currentUser?.license_expiry || '2029-08-15');

  if (!activeBookingVehicle) return null;

  const vehicle = activeBookingVehicle;
  const category = getCategory(vehicle.category_id);

  // Calculations
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(1, end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const dailyRate = vehicle.base_rate;
  const subtotal = dailyRate * diffDays;
  const taxes = Math.round(subtotal * 0.10); // 10% VAT / GST
  const insurance = 15 * diffDays; // $15 / day comprehensive damage waiver
  const totalAmount = subtotal + taxes + insurance;

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else if (step === 4) {
      // Step 5: Confirm Booking
      const bookingData = {
        customer_id: currentUser?.customer_id || 'CUST-1001',
        vehicle_id: vehicle.vehicle_id,
        start_date: startDate,
        end_date: endDate,
        days: diffDays,
        daily_rate: dailyRate,
        subtotal,
        taxes,
        insurance,
        total_amount: totalAmount,
        pickup_hub: pickupHub
      };
      const result = createBooking(bookingData);
      setConfirmedBooking(result);
      setStep(5);
    }
  };

  const handleClose = () => {
    setActiveBookingVehicle(null);
    setStep(1);
    setConfirmedBooking(null);
  };

  const goToDashboardBookings = () => {
    handleClose();
    setCurrentView('customer-dashboard');
    setCustomerTab('bookings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Steps */}
        <div className="px-6 py-4 bg-slate-800/70 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Vehicle Reservation Wizard</h2>
              <p className="text-xs text-slate-400">Step {step} of 5: {
                step === 1 ? 'Select / Confirm Vehicle' :
                step === 2 ? 'Rental Schedule & Hub' :
                step === 3 ? 'Driver & Customer Details' :
                step === 4 ? 'Review & Itemized Pricing' : 'Booking Confirmation'
              }</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {step < 5 && (
          <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
            {['Vehicle', 'Schedule', 'Driver', 'Review', 'Confirm'].map((label, idx) => {
              const currentStepNum = idx + 1;
              const isPast = step > currentStepNum;
              const isCurrent = step === currentStepNum;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-colors ${
                    isPast ? 'bg-emerald-500 text-white' :
                    isCurrent ? 'bg-blue-600 text-white ring-2 ring-blue-400/40' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {isPast ? <Check className="w-3.5 h-3.5" /> : currentStepNum}
                  </div>
                  <span className={`hidden sm:inline font-medium ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                    {label}
                  </span>
                  {idx < 4 && <div className="hidden sm:block w-8 h-[1px] bg-slate-800 mx-1"></div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: CONFIRM VEHICLE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 items-center">
                <img
                  src={vehicle.image}
                  alt={vehicle.model}
                  className="w-full sm:w-48 h-32 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                    {category?.category_name}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-1">Registration: {vehicle.vehicle_no}</div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                    <span>{vehicle.fuel_type}</span>
                    <span>•</span>
                    <span>{vehicle.transmission}</span>
                    <span>•</span>
                    <span>{vehicle.seating_capacity} Seats</span>
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5">
                  <div className="text-xs text-slate-400">Rate</div>
                  <div className="text-2xl font-black text-white font-mono">${vehicle.base_rate}</div>
                  <div className="text-[11px] text-slate-500">per day</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>All DriveEase reservations include 24/7 National Roadside Assistance, zero security deposit options, and contactless digital check-in.</span>
              </div>
            </div>
          )}

          {/* STEP 2: DATES & HUB */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Select Pickup & Drop Hub
                </label>
                <select
                  value={pickupHub}
                  onChange={(e) => setPickupHub(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Central Mobility Hub - Downtown">Central Mobility Hub - Downtown (24/7)</option>
                  <option value="International Airport Terminal 3">International Airport Terminal 3 (Express Shuttle)</option>
                  <option value="Silicon Valley Tech Hub">Silicon Valley Tech Hub - Bay Area</option>
                  <option value="Metro Executive Station Hub">Metro Executive Station Hub</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Rental Duration:</span>
                <span className="font-bold text-white font-mono bg-blue-500/20 text-blue-300 px-3 py-1 rounded-md">
                  {diffDays} {diffDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER & DRIVER CREDENTIALS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Driver License Number (PK Linked)</label>
                  <input
                    type="text"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">License Expiration Date</label>
                  <input
                    type="date"
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Billing / Residential Address</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW BOOKING & BREAKDOWN */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div>
                    <div className="text-base font-bold text-white">{vehicle.brand} {vehicle.model}</div>
                    <div className="text-xs text-slate-400 font-mono">Asset ID: {vehicle.vehicle_id} • Plate: {vehicle.vehicle_no}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300">
                    {category?.category_name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div><span className="text-slate-400">Pickup Date:</span> {startDate}</div>
                  <div><span className="text-slate-400">Return Date:</span> {endDate}</div>
                  <div><span className="text-slate-400">Duration:</span> {diffDays} Days</div>
                  <div><span className="text-slate-400">Hub:</span> {pickupHub}</div>
                </div>
              </div>

              {/* Itemized Cost Table */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Base Vehicle Rate (${dailyRate} × {diffDays} days)</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Zero-Deductible Comprehensive Insurance ($15/day)</span>
                  <span className="font-mono">${insurance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Government Tax & Transportation Cess (10%)</span>
                  <span className="font-mono">${taxes.toFixed(2)}</span>
                </div>
                <div className="pt-2.5 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Booking Amount</span>
                  <span className="text-xl font-black text-blue-400 font-mono">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: BOOKING CONFIRMED SUCCESS SCREEN */}
          {step === 5 && confirmedBooking && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">Reservation Successful</span>
                <h2 className="text-2xl font-black text-white mt-1">Booking Confirmed</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Your reservation request has been committed to the DriveEase DBMS database.
                </p>
              </div>

              {/* Success Voucher Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">BOOKING ID:</span>
                  <span className="text-emerald-400 font-bold">{confirmedBooking.booking_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="text-white font-sans font-semibold">{vehicle.brand} {vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="text-white font-sans">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rental Period:</span>
                  <span className="text-white">{confirmedBooking.start_date} to {confirmedBooking.end_date}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                  <span className="text-slate-300">Total Charged:</span>
                  <span className="text-blue-400 text-sm">${confirmedBooking.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={goToDashboardBookings}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-900/40"
                >
                  View in My Bookings
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 5 && (
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            ) : <div></div>}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/30"
            >
              <span>{step === 4 ? 'Confirm Booking' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
