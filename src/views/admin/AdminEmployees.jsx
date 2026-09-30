import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck, UserPlus, Search, Edit2, Trash2, X,
  Shield, Building, Phone, Mail
} from 'lucide-react';

export default function AdminEmployees() {
  const { db, addEmployee, updateEmployee, deleteEmployee, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Rental Staff');
  const [department, setDepartment] = useState('Customer Service & Dispatch');

  const filtered = db.employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setSelectedEmp(null);
    setName('');
    setEmail('');
    setPhone('+1 (555) 000-0000');
    setRole('Rental Staff');
    setDepartment('Customer Service & Dispatch');
    setModalMode('add');
  };

  const openEdit = (emp) => {
    setSelectedEmp(emp);
    setName(emp.name);
    setEmail(emp.email);
    setPhone(emp.phone);
    setRole(emp.role);
    setDepartment(emp.department);
    setModalMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addEmployee({
        name,
        email,
        phone,
        role,
        department
      });
    } else if (modalMode === 'edit' && selectedEmp) {
      updateEmployee(selectedEmp.employee_id, {
        name,
        email,
        phone,
        role,
        department
      });
    }
    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Staff & Employee Administration (EMPLOYEE Table)
          </h2>
          <p className="text-xs text-slate-400">
            Corporate access control, operational division assignments, and role authorities
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/30 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by staff name, email, operational role, or department..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Employee ID</th>
              <th className="py-3 px-4 font-semibold">Staff Name</th>
              <th className="py-3 px-4 font-semibold">Contact Email</th>
              <th className="py-3 px-4 font-semibold">Telephone</th>
              <th className="py-3 px-4 font-semibold">Role Authority</th>
              <th className="py-3 px-4 font-semibold">Department</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map(emp => {
              let badgeColor = 'bg-blue-500/10 text-blue-400';
              if (emp.role === 'Admin') badgeColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
              if (emp.role === 'Fleet Manager') badgeColor = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
              if (emp.role === 'Rental Staff') badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
              if (emp.role === 'Maintenance Staff') badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';

              return (
                <tr key={emp.employee_id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-indigo-400">{emp.employee_id}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-white">{emp.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">{emp.email}</td>
                  <td className="py-3.5 px-4 text-slate-400">{emp.phone}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">{emp.department}</td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(emp)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEmployee(emp.employee_id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Remove Staff Member"
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

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {modalMode === 'add' ? 'Enroll New Employee' : `Edit Staff (${selectedEmp?.employee_id})`}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Role Authority *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Rental Staff">Rental Staff</option>
                    <option value="Maintenance Staff">Maintenance Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Department Unit</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
                >
                  Save Employee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
