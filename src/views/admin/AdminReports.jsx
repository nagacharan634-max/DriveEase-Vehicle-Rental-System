import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText, Download, Printer, Filter, Calendar,
  DollarSign, Car, Users, Key, Wrench, Search
} from 'lucide-react';

export default function AdminReports() {
  const { db, getCustomer, getVehicle, getCategory } = useApp();

  const [reportType, setReportType] = useState('bookings'); // 'customers' | 'vehicles' | 'bookings' | 'rentals' | 'payments' | 'maintenance'
  const [filterQuery, setFilterQuery] = useState('');

  // Generate Report Data based on selection
  let tableHeaders = [];
  let tableRows = [];

  if (reportType === 'bookings') {
    tableHeaders = ['Booking ID', 'Customer', 'Vehicle', 'Booking Date', 'Dates', 'Days', 'Amount', 'Status'];
    tableRows = db.bookings
      .filter(b => {
        const cust = getCustomer(b.customer_id);
        const veh = getVehicle(b.vehicle_id);
        const q = filterQuery.toLowerCase();
        return !q || b.booking_id.toLowerCase().includes(q) || (cust?.name && cust.name.toLowerCase().includes(q));
      })
      .map(b => {
        const cust = getCustomer(b.customer_id);
        const veh = getVehicle(b.vehicle_id);
        return [
          b.booking_id,
          cust?.name || b.customer_id,
          `${veh?.brand || ''} ${veh?.model || ''}`,
          b.booking_date,
          `${b.start_date} to ${b.end_date}`,
          b.days,
          `$${b.total_amount}`,
          b.status
        ];
      });
  } else if (reportType === 'vehicles') {
    tableHeaders = ['Vehicle ID', 'Plate Number', 'Brand', 'Model', 'Category', 'Rate/Day', 'Odometer', 'Status'];
    tableRows = db.vehicles
      .filter(v => !filterQuery || v.brand.toLowerCase().includes(filterQuery.toLowerCase()) || v.model.toLowerCase().includes(filterQuery.toLowerCase()))
      .map(v => {
        const cat = getCategory(v.category_id);
        return [
          v.vehicle_id,
          v.vehicle_no,
          v.brand,
          v.model,
          cat?.category_name || v.category_id,
          `$${v.base_rate}`,
          `${v.odometer} km`,
          v.status
        ];
      });
  } else if (reportType === 'customers') {
    tableHeaders = ['Customer ID', 'Full Name', 'Email', 'Phone', 'Driver License', 'Registered Date'];
    tableRows = db.customers
      .filter(c => !filterQuery || c.name.toLowerCase().includes(filterQuery.toLowerCase()) || c.email.toLowerCase().includes(filterQuery.toLowerCase()))
      .map(c => [
        c.customer_id,
        c.name,
        c.email,
        c.phone,
        c.driver_license_no,
        c.registered_at
      ]);
  } else if (reportType === 'rentals') {
    tableHeaders = ['Rental ID', 'Booking ID', 'Customer', 'Vehicle', 'Pickup', 'Return', 'Start Odo', 'End Odo', 'Status'];
    tableRows = db.rentals
      .filter(r => !filterQuery || r.rental_id.toLowerCase().includes(filterQuery.toLowerCase()))
      .map(r => {
        const cust = getCustomer(r.customer_id);
        const veh = getVehicle(r.vehicle_id);
        return [
          r.rental_id,
          r.booking_id,
          cust?.name || r.customer_id,
          `${veh?.brand || ''} ${veh?.model || ''}`,
          r.pickup_date,
          r.return_date,
          `${r.odometer_start} km`,
          r.odometer_end ? `${r.odometer_end} km` : 'Active',
          r.status
        ];
      });
  } else if (reportType === 'payments') {
    tableHeaders = ['Payment ID', 'Rental ID', 'Customer', 'Payment Date', 'Method', 'Amount', 'Status'];
    tableRows = db.payments
      .filter(p => !filterQuery || p.payment_id.toLowerCase().includes(filterQuery.toLowerCase()))
      .map(p => {
        const cust = getCustomer(p.customer_id);
        return [
          p.payment_id,
          p.rental_id,
          cust?.name || p.customer_id,
          p.payment_date,
          p.payment_method,
          `$${p.amount}`,
          p.status
        ];
      });
  } else if (reportType === 'maintenance') {
    tableHeaders = ['Service ID', 'Vehicle ID', 'Service Date', 'Technician', 'Cost', 'Status', 'Description'];
    tableRows = db.maintenance
      .filter(m => !filterQuery || m.maintenance_id.toLowerCase().includes(filterQuery.toLowerCase()))
      .map(m => [
        m.maintenance_id,
        m.vehicle_id,
        m.service_date,
        m.technician,
        `$${m.cost}`,
        m.status,
        m.description
      ]);
  }

  // Export to CSV Function
  const exportCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += tableHeaders.join(",") + "\r\n";
    tableRows.forEach(row => {
      const sanitized = row.map(cell => `"${String(cell).replace(/"/g, '""')}"`);
      csvContent += sanitized.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DriveEase_${reportType.toUpperCase()}_REPORT_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Executive Reports & Telemetry Audits
          </h2>
          <p className="text-xs text-slate-400">
            Generate analytical CSV datasets and printable audits across all 8 DBMS relational entities
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'bookings', label: 'Bookings Report', icon: Calendar },
          { id: 'vehicles', label: 'Fleet Assets Report', icon: Car },
          { id: 'customers', label: 'Customers Report', icon: Users },
          { id: 'rentals', label: 'Rental Contracts Report', icon: Key },
          { id: 'payments', label: 'Payment Ledger Report', icon: DollarSign },
          { id: 'maintenance', label: 'Maintenance Audit Report', icon: Wrench },
        ].map(item => {
          const Icon = item.icon;
          const isActive = reportType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setReportType(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder={`Search ${reportType} report data...`}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="p-3 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between text-xs text-slate-400">
          <span>Active Dataset: <strong className="text-white capitalize">{reportType}</strong></span>
          <span className="font-mono text-emerald-400">{tableRows.length} Records Compiled</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/30">
              {tableHeaders.map((header, idx) => (
                <th key={idx} className="py-3 px-4 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {tableRows.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="py-8 text-center text-slate-400 font-sans text-xs">
                  No records matching the filter criteria.
                </td>
              </tr>
            ) : (
              tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/30">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-3.5 px-4 text-slate-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
