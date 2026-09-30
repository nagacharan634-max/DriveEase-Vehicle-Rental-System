import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield, Lock, Mail, ArrowRight, UserCheck, CheckCircle2,
  Building, Wrench, Key, Database
} from 'lucide-react';

export default function AdminAuthView() {
  const { db, loginAsAdminRole, addToast } = useApp();

  const [email, setEmail] = useState('devon.sinclair@driveease.io');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    const staff = db.employees.find(emp => emp.email.toLowerCase() === email.toLowerCase().trim()) || db.employees[0];
    loginAsAdminRole(staff);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl">
            <Shield className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
              Enterprise Operations
            </span>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Staff & Fleet Control
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Administrative suite for vehicle provisioning, dispatch contracts, maintenance scheduling, and relational database analytics.
            </p>
          </div>

          {/* 1-Click Role Switcher for Academic Viva */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">1-Click Staff Roles (Viva Demo):</span>
              <span className="text-[10px] text-indigo-400">DBMS Staff</span>
            </div>

            <div className="space-y-2">
              {db.employees.map(emp => {
                let badgeClass = 'bg-blue-500/10 text-blue-400';
                if (emp.role === 'Admin') badgeClass = 'bg-rose-500/10 text-rose-400';
                if (emp.role === 'Fleet Manager') badgeClass = 'bg-purple-500/10 text-purple-400';
                if (emp.role === 'Rental Staff') badgeClass = 'bg-amber-500/10 text-amber-400';
                if (emp.role === 'Maintenance Staff') badgeClass = 'bg-emerald-500/10 text-emerald-400';

                return (
                  <button
                    key={emp.employee_id}
                    onClick={() => loginAsAdminRole(emp)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{emp.department}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                      {emp.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Staff Single Sign-On</h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter administrative credentials or click any demo role on the left.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                Staff Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devon.sinclair@driveease.io"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Full CRUD privileges granted based on assigned staff role in `EMPLOYEE` table.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Authenticate & Enter Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
