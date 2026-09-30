import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car, Plus, Search, Edit2, Trash2, X, Eye,
  Fuel, Users, Gauge, Check, ShieldAlert
} from 'lucide-react';

export default function AdminVehicles() {
  const {
    db,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setActiveVehicleDetails,
    getCategory
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Form inputs
  const [vehicleNo, setVehicleNo] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [categoryId, setCategoryId] = useState('CAT-102');
  const [baseRate, setBaseRate] = useState(75);
  const [status, setStatus] = useState('AVAILABLE');
  const [fuelType, setFuelType] = useState('Petrol Turbo');
  const [transmission, setTransmission] = useState('Automatic');
  const [seats, setSeats] = useState(5);
  const [mileage, setMileage] = useState('16.5 km/l');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1000&q=80');

  const filtered = db.vehicles.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !q || v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.vehicle_no.toLowerCase().includes(q);
    const matchCategory = categoryFilter === 'ALL' || v.category_id === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const openAddModal = () => {
    setVehicleNo('KA-03-NV-5000');
    setBrand('Mercedes-Benz');
    setModel('E-Class Luxury');
    setCategoryId('CAT-102');
    setBaseRate(95);
    setStatus('AVAILABLE');
    setFuelType('Hybrid');
    setTransmission('9-Speed Automatic');
    setSeats(5);
    setMileage('18.2 km/l');
    setImage('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80');
    setSelectedVehicle(null);
    setModalMode('add');
  };

  const openEditModal = (veh) => {
    setSelectedVehicle(veh);
    setVehicleNo(veh.vehicle_no);
    setBrand(veh.brand);
    setModel(veh.model);
    setCategoryId(veh.category_id);
    setBaseRate(veh.base_rate);
    setStatus(veh.status);
    setFuelType(veh.fuel_type);
    setTransmission(veh.transmission);
    setSeats(veh.seating_capacity);
    setMileage(veh.mileage);
    setImage(veh.image);
    setModalMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addVehicle({
        vehicle_no: vehicleNo,
        brand,
        model,
        category_id: categoryId,
        base_rate: Number(baseRate),
        status,
        fuel_type: fuelType,
        transmission,
        seating_capacity: Number(seats),
        mileage,
        image
      });
    } else if (modalMode === 'edit' && selectedVehicle) {
      updateVehicle(selectedVehicle.vehicle_id, {
        vehicle_no: vehicleNo,
        brand,
        model,
        category_id: categoryId,
        base_rate: Number(baseRate),
        status,
        fuel_type: fuelType,
        transmission,
        seating_capacity: Number(seats),
        mileage,
        image
      });
    }
    setModalMode(null);
  };

  const handleQuickStatusChange = (vehId, newStatus) => {
    updateVehicle(vehId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-indigo-400" />
            Vehicle Fleet Management (VEHICLE Table)
          </h2>
          <p className="text-xs text-slate-400">
            Provision, monitor operational availability status, and modify rate cards
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand, model, or license plate..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            {db.categories.map(c => (
              <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BOOKED">BOOKED</option>
            <option value="RENTED">RENTED</option>
            <option value="UNDER MAINTENANCE">UNDER MAINTENANCE</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Vehicle ID</th>
              <th className="py-3 px-4 font-semibold">Plate & Automobile</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Daily Rate</th>
              <th className="py-3 px-4 font-semibold">Availability Status</th>
              <th className="py-3 px-4 font-semibold">Specifications</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map(veh => {
              const cat = getCategory(veh.category_id);
              return (
                <tr key={veh.vehicle_id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-blue-400">{veh.vehicle_id}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-3">
                      <img src={veh.image} alt={veh.model} className="w-10 h-7 object-cover rounded-md" />
                      <div>
                        <div className="font-bold text-white">{veh.brand} {veh.model}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{veh.vehicle_no}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium">
                      {cat?.category_name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">${veh.base_rate}/d</td>
                  <td className="py-3.5 px-4 font-sans">
                    <select
                      value={veh.status}
                      onChange={(e) => handleQuickStatusChange(veh.vehicle_id, e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer bg-slate-900 ${
                        veh.status === 'AVAILABLE' ? 'text-emerald-400 border-emerald-500/40' :
                        veh.status === 'BOOKED' ? 'text-blue-400 border-blue-500/40' :
                        veh.status === 'RENTED' ? 'text-amber-400 border-amber-500/40' :
                        'text-rose-400 border-rose-500/40'
                      }`}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="BOOKED">BOOKED</option>
                      <option value="RENTED">RENTED</option>
                      <option value="UNDER MAINTENANCE">UNDER MAINTENANCE</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-400 text-[11px]">
                    <div>{veh.transmission} • {veh.fuel_type}</div>
                    <div className="font-mono text-slate-500 text-[10px]">{veh.odometer.toLocaleString()} km</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setActiveVehicleDetails(veh)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(veh)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit Vehicle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteVehicle(veh.vehicle_id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Delete Vehicle"
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

      {/* ADD / EDIT VEHICLE MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {modalMode === 'add' ? 'Register New Fleet Vehicle' : `Edit Vehicle ${selectedVehicle?.vehicle_id}`}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Registration Plate (VEHICLE_NO) *</label>
                  <input
                    type="text"
                    required
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Vehicle Category (FK) *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {db.categories.map(c => (
                      <option key={c.category_id} value={c.category_id}>{c.category_name} (${c.base_rate}/d)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Brand Manufacturer *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Model Designation *</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Daily Base Rate ($/day) *</label>
                  <input
                    type="number"
                    required
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="RENTED">RENTED</option>
                    <option value="UNDER MAINTENANCE">UNDER MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Fuel / Propulsion</label>
                  <input
                    type="text"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Transmission</label>
                  <input
                    type="text"
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Seats</label>
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
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
                  {modalMode === 'add' ? 'Register Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
