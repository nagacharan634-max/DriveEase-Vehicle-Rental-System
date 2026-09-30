import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Calendar, Key, CreditCard, Wrench, Shield } from 'lucide-react';

export default function NotificationDropdown() {
  const { db, markNotificationRead, markAllNotificationsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = db.notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'rental':
        return <Key className="w-4 h-4 text-emerald-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-rose-400" />;
      default:
        return <Shield className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-slate-700/50"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-800/40">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-slate-100 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-medium bg-blue-500/20 text-blue-300 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {db.notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications to display
              </div>
            ) : (
              db.notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    !notif.read ? 'bg-blue-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800 shrink-0 mt-0.5 border border-slate-700/60">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs truncate ${!notif.read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></span>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/60 text-center">
            <span className="text-[11px] text-slate-500">Live DBMS Relational Event Dispatcher</span>
          </div>
        </div>
      )}
    </div>
  );
}
