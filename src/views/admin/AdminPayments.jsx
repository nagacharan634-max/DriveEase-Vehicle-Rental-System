import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard, DollarSign, Search, Download, Printer,
  ArrowUpRight, CheckCircle2, ShieldCheck, Filter
} from 'lucide-react';

export default function AdminPayments() {
  const { db, getCustomer, getRental, getVehicle } = useApp();

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const totalCollected = db.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalTransactions = db.payments.length;
  const avgOrderVal = totalTransactions > 0 ? (totalCollected / totalTransactions) : 0;

  const filtered = db.payments.filter(p => {
    const cust = getCustomer(p.customer_id);
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.payment_id.toLowerCase().includes(q) ||
      p.rental_id.toLowerCase().includes(q) ||
      p.transaction_id.toLowerCase().includes(q) ||
      (cust?.name && cust.name.toLowerCase().includes(q));

    const matchMethod = methodFilter === 'ALL' || p.payment_method.toLowerCase().includes(methodFilter.toLowerCase());
    return matchSearch && matchMethod;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            Payment Ledger & Accounting (PAYMENT Table)
          </h2>
          <p className="text-xs text-slate-400">
            Relational financial records settled against active and completed RENTAL contracts
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 self-start sm:self-auto transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Financial Ledger</span>
        </button>
      </div>

      {/* Revenue Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Total Revenue Settled</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ${totalCollected.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> 100% Cleared via Gateway
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Total Settled Transactions</div>
          <div className="text-2xl font-black text-white font-mono">{totalTransactions}</div>
          <div className="text-[10px] text-slate-400 mt-1">Directly mapped to RENTAL entries</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Average Rental Value</div>
          <div className="text-2xl font-black text-blue-400 font-mono">
            ${avgOrderVal.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Per transaction ticket</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Payment ID, Rental ID, customer name, or txn trace..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Payment Channels</option>
            <option value="Card">Credit / Debit Card</option>
            <option value="UPI">UPI / QR Code</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Payment ID (PK)</th>
              <th className="py-3 px-4 font-semibold">Rental ID (FK)</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Vehicle</th>
              <th className="py-3 px-4 font-semibold">Settlement Date</th>
              <th className="py-3 px-4 font-semibold">Payment Method</th>
              <th className="py-3 px-4 font-semibold">Amount</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map(p => {
              const cust = getCustomer(p.customer_id);
              const rental = getRental(p.rental_id);
              const veh = rental ? getVehicle(rental.vehicle_id) : null;
              return (
                <tr key={p.payment_id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{p.payment_id}</td>
                  <td className="py-3.5 px-4 text-amber-400">{p.rental_id}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-white">
                    {cust?.name || p.customer_id}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    {veh ? `${veh.brand} ${veh.model}` : 'Assigned Fleet'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{p.payment_date}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">{p.payment_method}</td>
                  <td className="py-3.5 px-4 font-bold text-white text-sm">
                    ${Number(p.amount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Print Invoice Receipt"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
