import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X, Check, ShieldCheck, Fuel, Users, Gauge, Wrench,
  Calendar, Award, Key, AlertTriangle, ArrowRight
} from 'lucide-react';

export default function VehicleDetailsModal() {
  const {
    activeVehicleDetails,
    setActiveVehicleDetails,
    setActiveBookingVehicle,
    getCategory,
    getMaintenanceForVehicle,
    addToast
  } = useApp();

  if (!activeVehicleDetails) return null;

  const vehicle = activeVehicleDetails;
  const category = getCategory(vehicle.category_id);
  const maintenanceRecords = getMaintenanceForVehicle(vehicle.vehicle_id);

  const handleBookFromDetails = () => {
    if (vehicle.status === 'UNDER MAINTENANCE') {
      addToast('Vehicle In Workshop', 'This vehicle is currently undergoing mechanical maintenance and cannot be reserved.', 'warning');
      return;
    }
    if (vehicle.status !== 'AVAILABLE') {
      addToast('Not Available', `This vehicle is currently ${vehicle.status}.`, 'info');
      return;
    }
    const current = vehicle;
    setActiveVehicleDetails(null);
    setActiveBookingVehicle(current);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          <button
            onClick={() => setActiveVehicleDetails(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-lg bg-blue-600/90 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  {category?.category_name}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-xs">
                  {vehicle.vehicle_no}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {vehicle.brand} <span className="font-light text-slate-300">{vehicle.model}</span>
              </h2>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Daily Rental Rate</div>
              <div className="text-3xl font-black text-white font-mono text-blue-400">
                ${vehicle.base_rate}
                <span className="text-sm text-slate-400 font-normal"> /day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Status Alert Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                vehicle.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' :
                vehicle.status === 'RENTED' ? 'bg-amber-500/20 text-amber-400' :
                vehicle.status === 'BOOKED' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {vehicle.status === 'AVAILABLE' ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">Current Fleet Status</div>
                <div className="text-sm font-bold text-white">{vehicle.status}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400">Current Odometer</div>
              <div className="text-sm font-mono font-bold text-slate-200">{vehicle.odometer.toLocaleString()} km</div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Fuel className="w-4 h-4 text-blue-400" />
                  Fuel System
                </div>
                <div className="text-sm font-semibold text-slate-200">{vehicle.fuel_type}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Gauge className="w-4 h-4 text-purple-400" />
                  Transmission
                </div>
                <div className="text-sm font-semibold text-slate-200">{vehicle.transmission}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Seating Capacity
                </div>
                <div className="text-sm font-semibold text-slate-200">{vehicle.seating_capacity} Passengers</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  Fuel Economy / Range
                </div>
                <div className="text-sm font-semibold text-slate-200">{vehicle.mileage}</div>
              </div>
            </div>
          </div>

          {/* Vehicle Features */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Included Premium Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vehicle.features?.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-800/30 border border-slate-800/80">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance History Log (DBMS Table Connection) */}
          <div className="border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-rose-400" />
                Fleet Maintenance & Inspection History
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">FK: VEHICLE_ID = {vehicle.vehicle_id}</span>
            </div>

            {maintenanceRecords.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-400">
                No scheduled maintenance incidents recorded for this automobile. Fully certified for dispatch.
              </div>
            ) : (
              <div className="space-y-2">
                {maintenanceRecords.map(m => (
                  <div key={m.maintenance_id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-300">{m.maintenance_id}</span>
                        <span className="text-slate-500">• {m.service_date}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-slate-300">{m.description}</p>
                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Technician: {m.technician}</span>
                      <span className="font-mono text-slate-300">Cost: ${m.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={() => setActiveVehicleDetails(null)}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold"
          >
            Close
          </button>

          <button
            onClick={handleBookFromDetails}
            disabled={vehicle.status !== 'AVAILABLE'}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              vehicle.status === 'AVAILABLE'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-900/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <span>Book This Vehicle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
