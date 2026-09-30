import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import GlobalSearchModal from './components/GlobalSearchModal';
import DbmsSchemaModal from './components/DbmsSchemaModal';
import VehicleDetailsModal from './components/VehicleDetailsModal';
import BookingModal from './components/BookingModal';
import PaymentModal from './components/PaymentModal';

import HomeView from './views/HomeView';
import VehiclesView from './views/VehiclesView';
import CustomerAuthView from './views/CustomerAuthView';
import CustomerDashboardView from './views/CustomerDashboardView';
import AdminAuthView from './views/AdminAuthView';
import AdminDashboardView from './views/AdminDashboardView';

function MainLayout() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Routed View */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'vehicles' && <VehiclesView />}
        {currentView === 'customer-auth' && <CustomerAuthView />}
        {currentView === 'customer-dashboard' && <CustomerDashboardView />}
        {currentView === 'admin-auth' && <AdminAuthView />}
        {currentView === 'admin-dashboard' && <AdminDashboardView />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <VehicleDetailsModal />
      <BookingModal />
      <PaymentModal />
      <DbmsSchemaModal />
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
