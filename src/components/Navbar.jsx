import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import NotificationDropdown from './NotificationDropdown';
import {
  Car, Search, Database, User, Shield, Menu, X,
  ChevronDown, LogOut, LayoutDashboard, Key, Calendar
} from 'lucide-react';

export default function Navbar() {
  const {
    currentView,
    setCurrentView,
    setCustomerTab,
    setAdminTab,
    currentUser,
    setCurrentUser,
    adminUser,
    setAdminUser,
    setIsDbmsModalOpen,
    setIsSearchModalOpen,
    switchDemoCustomer,
    db
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNav = (view, subtab = 'overview') => {
    setCurrentView(view);
    if (view === 'customer-dashboard') setCustomerTab(subtab);
    if (view === 'admin-dashboard') setAdminTab(subtab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* LOGO */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                Drive<span className="text-blue-500">Ease</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
            <div className="text-[10px] tracking-wider text-slate-400 font-medium">
              Vehicle Rental Management System
            </div>
          </div>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'home'
                ? 'text-white bg-slate-800/80 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('vehicles')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'vehicles'
                ? 'text-white bg-slate-800/80 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Fleet & Marketplace
          </button>

          <button
            onClick={() => {
              if (currentUser) {
                handleNav('customer-dashboard', 'bookings');
              } else {
                handleNav('customer-auth');
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-all"
          >
            My Bookings
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('why-choose-us');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else handleNav('home');
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-all"
          >
            Why Us
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else handleNav('home');
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-all"
          >
            How It Works
          </button>
        </nav>

        {/* ACTIONS & TOOLS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button (Ctrl+K) */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-xs"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span className="hidden lg:inline text-slate-400">Search fleet & records...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* DBMS Viva / ERD Explorer Pill Button */}
          <button
            onClick={() => setIsDbmsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition-all text-xs font-semibold shadow-sm"
            title="Open DBMS Project Schema, ER Diagram & SQL Playground"
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">DBMS Schema</span>
          </button>

          {/* Notification Bell Dropdown */}
          <NotificationDropdown />

          {/* User Account / Admin Switcher */}
          <div className="relative">
            {adminUser ? (
              /* Admin is logged in */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 text-xs font-bold transition-all"
                >
                  <Shield className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">{adminUser.role}</span>
                </button>
                <button
                  onClick={() => {
                    setAdminUser(null);
                    setCurrentView('home');
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
                  title="Sign Out Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : currentUser ? (
              /* Customer is logged in */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-700/60 hover:border-slate-600 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/50"
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400">Customer</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl z-50 p-2 text-xs animate-in fade-in"
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <div className="font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNav('customer-dashboard', 'overview');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                      Customer Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNav('customer-dashboard', 'bookings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      My Bookings
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNav('customer-dashboard', 'rentals');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Key className="w-4 h-4 text-amber-400" />
                      My Rentals
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNav('admin-auth');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-t border-slate-800/80 mt-1 pt-2"
                    >
                      <Shield className="w-4 h-4 text-rose-400" />
                      Admin / Staff Portal
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setCurrentUser(null);
                        setCurrentView('home');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest: Sign in / Register buttons */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('customer-auth')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all border border-slate-700/60"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('admin-auth')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  Staff
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 border-b border-slate-800 bg-slate-950 space-y-3 animate-in slide-in-from-top">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('home')}
              className="p-3 rounded-xl bg-slate-900 text-xs font-semibold text-white text-left"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('vehicles')}
              className="p-3 rounded-xl bg-slate-900 text-xs font-semibold text-white text-left"
            >
              Vehicles Fleet
            </button>
            <button
              onClick={() => handleNav('customer-dashboard', 'overview')}
              className="p-3 rounded-xl bg-slate-900 text-xs font-semibold text-white text-left"
            >
              Customer Dashboard
            </button>
            <button
              onClick={() => handleNav('admin-auth')}
              className="p-3 rounded-xl bg-slate-900 text-xs font-semibold text-rose-300 text-left"
            >
              Admin / Staff Portal
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsDbmsModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-bold"
          >
            <Database className="w-4 h-4 text-indigo-400" />
            View DBMS Project Schema & Viva ERD
          </button>
        </div>
      )}
    </header>
  );
}
