import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User, Mail, Lock, Phone, MapPin, FileText, ArrowRight,
  ShieldCheck, Car, Key, Sparkles, Check
} from 'lucide-react';

export default function CustomerAuthView() {
  const { db, setCurrentUser, setCurrentView, addCustomer, addToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('alex.sterling@driveease.io');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regLicense, setRegLicense] = useState('');
  const [regExpiry, setRegExpiry] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const existing = db.customers.find(c => c.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (existing) {
      setCurrentUser(existing);
      setCurrentView('customer-dashboard');
      addToast('Welcome Back!', `Signed in as ${existing.name}.`, 'success');
    } else {
      // If entered new credentials, use the first customer or create on the fly
      const fallback = db.customers[0];
      setCurrentUser(fallback);
      setCurrentView('customer-dashboard');
      addToast('Demo Session Initialized', `Signed in as ${fallback.name}.`, 'info');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regLicense) {
      addToast('Missing Fields', 'Please complete the required customer and driver license fields.', 'warning');
      return;
    }
    const newCustomer = addCustomer({
      name: regName,
      phone: regPhone || '+1 (555) 234-5678',
      email: regEmail,
      address: regAddress || '100 Innovation Way, Suite 400',
      driver_license_no: regLicense,
      license_expiry: regExpiry || '2030-12-31'
    });
    setCurrentUser(newCustomer);
    setCurrentView('customer-dashboard');
    addToast('Account Registered', `Welcome to DriveEase, ${newCustomer.name}!`, 'success');
  };

  const handleOneClickDemo = (customer) => {
    setCurrentUser(customer);
    setCurrentView('customer-dashboard');
    addToast('Instant Demo Login', `Authenticated as ${customer.name}`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl">
            <Car className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
              Customer Membership
            </span>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Access Your Rental Portal
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Manage your active reservations, verify driver credentials, download invoice receipts, and track telemetry in one unified account.
            </p>
          </div>

          {/* Quick Demo Customer Switcher (Viva convenience) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Quick 1-Click Demo Accounts:</span>
              <span className="text-[10px] text-blue-400">DBMS Demo</span>
            </div>
            <div className="space-y-2">
              {db.customers.slice(0, 3).map(cust => (
                <button
                  key={cust.customer_id}
                  onClick={() => handleOneClickDemo(cust)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={cust.avatar} alt={cust.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                        {cust.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{cust.customer_id}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-900 p-1 mb-6 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'register' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Registered Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="alex.sterling@driveease.io"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-blue-500 rounded"
                  />
                  <span>Remember my session</span>
                </label>
                <span className="text-blue-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rachel.adams@example.com"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="123 Ocean Drive, Miami, FL"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Driver License No. *</label>
                  <input
                    type="text"
                    required
                    value={regLicense}
                    onChange={(e) => setRegLicense(e.target.value)}
                    placeholder="DL-FL-99120-410"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    value={regExpiry}
                    onChange={(e) => setRegExpiry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Register & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
