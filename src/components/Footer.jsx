import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Car, Shield, Phone, Mail, MapPin, Database, RotateCcw,
  Sparkles, ExternalLink, Heart
} from 'lucide-react';

export default function Footer() {
  const { setCurrentView, setCustomerTab, setIsDbmsModalOpen, resetToFactory, db } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-20 relative overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white font-['Outfit']">
                Drive<span className="text-blue-500">Ease</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              DriveEase is a premier, enterprise-grade Vehicle Rental Management System built on an 8-table relational DBMS model. Engineered for seamless customer reservations, automated fleet dispatch, real-time telemetry, and integrated ledger accounting.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setIsDbmsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:text-white hover:bg-indigo-900/60 transition-colors text-xs font-semibold"
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                DBMS Project ERD & Viva
              </button>

              <button
                onClick={resetToFactory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors text-xs"
                title="Reset database to initial demo state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-400 transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('vehicles')} className="hover:text-blue-400 transition-colors">
                  Browse Vehicles Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('customer-dashboard');
                    setCustomerTab('bookings');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Customer Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('customer-dashboard');
                    setCustomerTab('rentals');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Active Rentals
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin-auth')} className="hover:text-blue-400 transition-colors">
                  Staff / Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Vehicle Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Fleet Categories</h4>
            <ul className="space-y-2 text-xs">
              {db.categories.map(cat => (
                <li key={cat.category_id}>
                  <button
                    onClick={() => setCurrentView('vehicles')}
                    className="hover:text-blue-400 transition-colors flex items-center justify-between w-full pr-4"
                  >
                    <span>{cat.category_name}</span>
                    <span className="font-mono text-slate-500 text-[10px]">from ${cat.base_rate}/d</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">24/7 Operations Hub</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">+1 (800) 555-EASE</div>
                  <div className="text-[10px] text-slate-500">Toll-Free 24/7 Roadside Line</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">support@driveease.io</div>
                  <div className="text-[10px] text-slate-500">Fast-response booking desk</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Global Mobility Tower</div>
                  <div className="text-[10px] text-slate-500">Central Avenue, Seattle, WA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 DriveEase – Vehicle Rental Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-slate-300 cursor-pointer">DBMS Relational Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
