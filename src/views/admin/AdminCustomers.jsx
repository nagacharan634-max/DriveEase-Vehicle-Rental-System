import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users, UserPlus, Search, Edit2, Trash2, X,
  Save, Phone, Mail, MapPin, FileText
} from 'lucide-react';

export default function AdminCustomers() {
  const { db, addCustomer, updateCustomer, deleteCustomer } = useApp();

  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [selectedCust, setSelectedCust] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLicense, setFormLicense] = useState('');
  const [formExpiry, setFormExpiry] = useState('');

  const filteredCustomers = db.customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.customer_id.toLowerCase().includes(search.toLowerCase()) ||
    c.driver_license_no.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormAddress('');
    setFormLicense('');
    setFormExpiry('2029-12-31');
    setSelectedCust(null);
    setModalMode('add');
  };

  const openEditModal = (cust) => {
    setSelectedCust(cust);
    setFormName(cust.name);
    setFormEmail(cust.email);
    setFormPhone(cust.phone);
    setFormAddress(cust.address);
    setFormLicense(cust.driver_license_no);
    setFormExpiry(cust.license_expiry);
    setModalMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addCustomer({
        name: formName,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        driver_license_no: formLicense,
        license_expiry: formExpiry
      });
    } else if (modalMode === 'edit' && selectedCust) {
      updateCustomer(selectedCust.customer_id, {
        name: formName,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        driver_license_no: formLicense,
        license_expiry: formExpiry
      });
    }
    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Customer Management (CUSTOMER Table)
          </h2>
          <p className="text-xs text-slate-400">
            Registered customer entities with driver credentials and contact details
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email, ID, or license number..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Customer ID</th>
              <th className="py-3 px-4 font-semibold">Name & Contact</th>
              <th className="py-3 px-4 font-semibold">Address</th>
              <th className="py-3 px-4 font-semibold">Driver License</th>
              <th className="py-3 px-4 font-semibold">Total Bookings</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredCustomers.map(cust => {
              const bookingCount = db.bookings.filter(b => b.customer_id === cust.customer_id).length;
              return (
                <tr key={cust.customer_id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                    {cust.customer_id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={cust.avatar} alt={cust.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-white">{cust.name}</div>
                        <div className="text-[11px] text-slate-400">{cust.email}</div>
                        <div className="text-[10px] text-slate-500">{cust.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                    {cust.address}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-200">{cust.driver_license_no}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Exp: {cust.license_expiry}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[11px]">
                      {bookingCount} Bookings
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(cust)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(cust.customer_id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {modalMode === 'add' ? 'Add New Customer' : `Edit Customer (${selectedCust?.customer_id})`}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Driver License No. *</label>
                  <input
                    type="text"
                    required
                    value={formLicense}
                    onChange={(e) => setFormLicense(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  {modalMode === 'add' ? 'Create Customer' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
