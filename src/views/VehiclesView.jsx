import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import VehicleCard from '../components/VehicleCard';
import {
  Search, Filter, SlidersHorizontal, ArrowUpDown, RotateCcw,
  Car, Shield, Check
} from 'lucide-react';

export default function VehiclesView() {
  const { db } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'model'

  // Extract unique brands from fleet
  const brands = useMemo(() => {
    const list = Array.from(new Set(db.vehicles.map(v => v.brand)));
    return ['ALL', ...list];
  }, [db.vehicles]);

  // Filter & Sort Logic
  const filteredVehicles = useMemo(() => {
    return db.vehicles.filter(v => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.vehicle_no.toLowerCase().includes(q);

      // Category
      const matchCategory = selectedCategory === 'ALL' || v.category_id === selectedCategory;

      // Brand
      const matchBrand = selectedBrand === 'ALL' || v.brand === selectedBrand;

      // Status
      const matchStatus = selectedStatus === 'ALL' || v.status === selectedStatus;

      // Price
      const matchPrice = Number(v.base_rate) <= maxPrice;

      return matchSearch && matchCategory && matchBrand && matchStatus && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.base_rate - b.base_rate;
      if (sortBy === 'price-high') return b.base_rate - a.base_rate;
      if (sortBy === 'model') return a.model.localeCompare(b.model);
      return 0; // featured / default order
    });
  }, [db.vehicles, searchQuery, selectedCategory, selectedBrand, selectedStatus, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setSelectedStatus('ALL');
    setMaxPrice(300);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
            Automotive Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] mt-1">
            Browse Vehicle Fleet
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Filter across categories, real-time availability, and daily rates to reserve your ideal car.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="font-bold text-white">{filteredVehicles.length}</span> of {db.vehicles.length} Vehicles
        </div>
      </div>

      {/* Filter & Search Control Panel */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-5">
        {/* Row 1: Search & Sort Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model or plate number (e.g. BMW, Tesla, KA-01)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs w-full md:w-auto">
              <ArrowUpDown className="w-4 h-4 text-blue-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer w-full"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="model">Alphabetical (Model)</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Categories
          </button>
          {db.categories.map(cat => (
            <button
              key={cat.category_id}
              onClick={() => setSelectedCategory(cat.category_id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.category_id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.category_name} (${cat.base_rate}/d)
            </button>
          ))}
        </div>

        {/* Row 3: Faceted Filters (Brand, Status, Price Range) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80 text-xs">
          {/* Brand Filter */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Filter by Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              {brands.map(b => (
                <option key={b} value={b}>{b === 'ALL' ? 'All Brands' : b}</option>
              ))}
            </select>
          </div>

          {/* Availability Status Filter */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Availability Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE (Ready to rent)</option>
              <option value="BOOKED">BOOKED (Reserved)</option>
              <option value="RENTED">RENTED (On Trip)</option>
              <option value="UNDER MAINTENANCE">UNDER MAINTENANCE (Service)</option>
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5 font-medium">
              <span>Max Daily Rate:</span>
              <span className="font-mono text-white font-bold">${maxPrice}/day</span>
            </div>
            <input
              type="range"
              min="40"
              max="350"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 p-8 space-y-4">
          <Car className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Vehicles Match Your Filter Criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search keywords, price slider, or availability status to find other available fleet options.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-900/40"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
