import React from 'react';
import { useApp } from '../context/AppContext';
import { Fuel, Users, Gauge, Sparkles, ArrowRight, Eye, AlertOctagon } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
  const { setActiveVehicleDetails, setActiveBookingVehicle, getCategory, addToast } = useApp();
  const category = getCategory(vehicle.category_id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="badge-available px-2.5 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AVAILABLE
          </span>
        );
      case 'BOOKED':
        return (
          <span className="badge-booked px-2.5 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            BOOKED
          </span>
        );
      case 'RENTED':
        return (
          <span className="badge-rented px-2.5 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            RENTED
          </span>
        );
      case 'UNDER MAINTENANCE':
      default:
        return (
          <span className="badge-maintenance px-2.5 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
            <AlertOctagon className="w-3 h-3" />
            UNDER MAINTENANCE
          </span>
        );
    }
  };

  const handleBookNow = () => {
    if (vehicle.status === 'UNDER MAINTENANCE') {
      addToast('Vehicle Unavailable', 'This vehicle is currently under active maintenance/servicing and cannot be booked.', 'warning');
      return;
    }
    if (vehicle.status === 'RENTED') {
      addToast('Vehicle On Trip', 'This vehicle is currently dispatched on an active rental trip.', 'info');
      return;
    }
    if (vehicle.status === 'BOOKED') {
      addToast('Vehicle Reserved', 'This vehicle currently has a confirmed upcoming booking.', 'info');
      return;
    }
    setActiveBookingVehicle(vehicle);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden glass-card-hover border border-slate-800 flex flex-col group">
      {/* Vehicle Image Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-slate-200 border border-slate-700/60 shadow-lg">
            {category?.category_name || 'Premium'}
          </span>
          {getStatusBadge(vehicle.status)}
        </div>

        {/* Vehicle Registration Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 font-mono text-[11px] text-slate-300 font-medium">
            {vehicle.vehicle_no}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Brand */}
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {vehicle.brand} <span className="font-semibold text-slate-200">{vehicle.model}</span>
            </h3>
          </div>

          {/* Quick Specs Pill Row */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1.5 rounded-lg border border-slate-800">
              <Fuel className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{vehicle.fuel_type?.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1.5 rounded-lg border border-slate-800">
              <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{vehicle.seating_capacity} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1.5 rounded-lg border border-slate-800">
              <Gauge className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{vehicle.mileage?.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Card Footer: Price & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Daily Rate</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white font-mono">${vehicle.base_rate}</span>
              <span className="text-xs text-slate-400">/day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveVehicleDetails(vehicle)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
              title="View Specifications & Maintenance Log"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleBookNow}
              disabled={vehicle.status !== 'AVAILABLE'}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
                vehicle.status === 'AVAILABLE'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-800'
              }`}
            >
              {vehicle.status === 'AVAILABLE' ? (
                <>
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <span>{vehicle.status}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
