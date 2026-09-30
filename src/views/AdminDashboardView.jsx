import React from 'react';
import { useApp } from '../context/AppContext';
import AdminOverview from './admin/AdminOverview';
import AdminCustomers from './admin/AdminCustomers';
import AdminVehicles from './admin/AdminVehicles';
import AdminCategories from './admin/AdminCategories';
import AdminBookings from './admin/AdminBookings';
import AdminRentals from './admin/AdminRentals';
import AdminPayments from './admin/AdminPayments';
import AdminMaintenance from './admin/AdminMaintenance';
import AdminEmployees from './admin/AdminEmployees';
import AdminReports from './admin/AdminReports';

import {
  LayoutDashboard, Users, Car, Layers, Calendar, Key,
  CreditCard, Wrench, UserCheck, FileText, Database,
  LogOut, Shield, ChevronRight, Activity, Clock
} from 'lucide-react';

export default function AdminDashboardView() {
  const {
    adminUser,
    setAdminUser,
    setCurrentView,
    adminTab,
    setAdminTab,
    setIsDbmsModalOpen,
    db
  } = useApp();

  // If no admin user is logged in, use default Admin
  const currentAdmin = adminUser || db.employees[0];

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users, badge: db.customers.length },
    { id: 'vehicles', label: 'Vehicles', icon: Car, badge: db.vehicles.length },
    { id: 'categories', label: 'Vehicle Categories', icon: Layers },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: db.bookings.filter(b => b.status === 'CONFIRMED').length },
    { id: 'rentals', label: 'Rentals', icon: Key, badge: db.rentals.filter(r => r.status === 'ACTIVE').length },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: db.vehicles.filter(v => v.status === 'UNDER MAINTENANCE').length, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'employees', label: 'Employees', icon: UserCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Admin Header Bar */}
      <div className="mb-8 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Enterprise Administration Portal</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentAdmin.role}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Logged in as <strong className="text-slate-200">{currentAdmin.name}</strong> • {currentAdmin.department}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDbmsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Database className="w-3.5 h-3.5" />
            <span>DBMS Relational ERD</span>
          </button>

          <button
            onClick={() => {
              setAdminUser(null);
              setCurrentView('home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================================================================ */}
        {/* ADMIN SIDEBAR */}
        {/* ================================================================ */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-4 border border-slate-800 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
            DBMS Master Tables
          </div>

          <div className="space-y-1 text-xs font-semibold">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      item.badgeColor || (isActive ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-300')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => setIsDbmsModalOpen(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30 text-xs font-bold transition-all"
            >
              <Database className="w-4 h-4" />
              <span>SQL Query Playground</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SUBVIEW CONTAINER */}
        {/* ================================================================ */}
        <div className="lg:col-span-9">
          {adminTab === 'overview' && <AdminOverview setAdminTab={setAdminTab} />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'vehicles' && <AdminVehicles />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'bookings' && <AdminBookings />}
          {adminTab === 'rentals' && <AdminRentals />}
          {adminTab === 'payments' && <AdminPayments />}
          {adminTab === 'maintenance' && <AdminMaintenance />}
          {adminTab === 'employees' && <AdminEmployees />}
          {adminTab === 'reports' && <AdminReports />}
        </div>
      </div>
    </div>
  );
}
