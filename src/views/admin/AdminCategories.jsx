import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Plus, Edit2, X, Car, Shield } from 'lucide-react';

export default function AdminCategories() {
  const { db, addCategory, updateCategory } = useApp();

  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [selectedCat, setSelectedCat] = useState(null);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [baseRate, setBaseRate] = useState(60);

  const openAdd = () => {
    setSelectedCat(null);
    setName('');
    setDesc('');
    setBaseRate(60);
    setModalMode('add');
  };

  const openEdit = (cat) => {
    setSelectedCat(cat);
    setName(cat.category_name);
    setDesc(cat.description);
    setBaseRate(cat.base_rate);
    setModalMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addCategory({
        category_name: name,
        description: desc,
        base_rate: Number(baseRate)
      });
    } else if (modalMode === 'edit' && selectedCat) {
      updateCategory(selectedCat.category_id, {
        category_name: name,
        description: desc,
        base_rate: Number(baseRate)
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
            <Layers className="w-5 h-5 text-purple-400" />
            Vehicle Category Management (VEHICLE_CATEGORY Table)
          </h2>
          <p className="text-xs text-slate-400">
            Define classification tiers, fleet rate baselines, and utility descriptions
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {db.categories.map(cat => {
          const count = db.vehicles.filter(v => v.category_id === cat.category_id).length;
          return (
            <div
              key={cat.category_id}
              className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-400">{cat.category_id}</span>
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{cat.category_name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Base Rate</div>
                  <div className="text-base font-black text-white font-mono">${cat.base_rate}/day</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-mono">
                  {count} Vehicles
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Categories Table View */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
              <th className="py-3 px-4 font-semibold">Category ID (PK)</th>
              <th className="py-3 px-4 font-semibold">Category Name</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold">Base Rate</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {db.categories.map(cat => (
              <tr key={cat.category_id} className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-bold text-purple-400">{cat.category_id}</td>
                <td className="py-3.5 px-4 font-sans font-bold text-white">{cat.category_name}</td>
                <td className="py-3.5 px-4 font-sans text-slate-300 max-w-sm truncate">{cat.description}</td>
                <td className="py-3.5 px-4 font-bold text-white">${cat.base_rate}/day</td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {modalMode === 'add' ? 'Add Vehicle Category' : `Edit Category ${selectedCat?.category_id}`}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electric Hypercar"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

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
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Description of target vehicle class..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                ></textarea>
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
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
