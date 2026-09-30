import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadDatabase, saveDatabase, resetDatabase, INITIAL_CUSTOMERS, INITIAL_EMPLOYEES } from '../data/database';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load Database state from localStorage or defaults
  const [db, setDb] = useState(() => loadDatabase());

  // Current session auth states
  // By default, let's keep a demo customer ready or guest
  const [currentUser, setCurrentUser] = useState(() => db.customers[0] || null);
  const [adminUser, setAdminUser] = useState(null); // When logged into admin portal

  // Navigation State
  // Views: 'home' | 'vehicles' | 'customer-auth' | 'customer-dashboard' | 'admin-auth' | 'admin-dashboard'
  const [currentView, setCurrentView] = useState('home');
  const [customerTab, setCustomerTab] = useState('overview'); // overview, bookings, rentals, payments, profile
  const [adminTab, setAdminTab] = useState('overview'); // overview, customers, vehicles, categories, bookings, rentals, payments, maintenance, employees, reports

  // Global Modals
  const [activeVehicleDetails, setActiveVehicleDetails] = useState(null);
  const [activeBookingVehicle, setActiveBookingVehicle] = useState(null);
  const [activePaymentRental, setActivePaymentRental] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [isDbmsModalOpen, setIsDbmsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Global Toast System
  const [toasts, setToasts] = useState([]);

  // Persist to localStorage whenever database updates
  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (title, message, type = 'system') => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    };
    setDb(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }));
  };

  const markNotificationRead = (id) => {
    setDb(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const markAllNotificationsRead = () => {
    setDb(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  // =========================================================================
  // Relational Lookup Helpers
  // =========================================================================
  const getCustomer = (id) => db.customers.find(c => c.customer_id === id);
  const getVehicle = (id) => db.vehicles.find(v => v.vehicle_id === id);
  const getCategory = (id) => db.categories.find(c => c.category_id === id);
  const getBooking = (id) => db.bookings.find(b => b.booking_id === id);
  const getRental = (id) => db.rentals.find(r => r.rental_id === id);
  const getPaymentByRental = (rentalId) => db.payments.find(p => p.rental_id === rentalId);
  const getMaintenanceForVehicle = (vehId) => db.maintenance.filter(m => m.vehicle_id === vehId);

  // =========================================================================
  // BUSINESS OPERATIONS & CRUD
  // =========================================================================

  // 1. ADD / CREATE BOOKING (Customer -> Booking -> updates Vehicle status)
  const createBooking = (bookingData) => {
    const bookingId = `BKG-${Math.floor(3000 + Math.random() * 9000)}`;
    const newBooking = {
      booking_id: bookingId,
      customer_id: bookingData.customer_id,
      vehicle_id: bookingData.vehicle_id,
      booking_date: new Date().toISOString().split('T')[0],
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      days: bookingData.days,
      daily_rate: bookingData.daily_rate,
      subtotal: bookingData.subtotal,
      taxes: bookingData.taxes,
      insurance: bookingData.insurance,
      total_amount: bookingData.total_amount,
      status: 'CONFIRMED',
      pickup_hub: bookingData.pickup_hub || 'Central Mobility Hub'
    };

    setDb(prev => {
      // Update vehicle status to BOOKED
      const updatedVehicles = prev.vehicles.map(v => 
        v.vehicle_id === bookingData.vehicle_id ? { ...v, status: 'BOOKED' } : v
      );

      return {
        ...prev,
        bookings: [newBooking, ...prev.bookings],
        vehicles: updatedVehicles
      };
    });

    const vehicle = getVehicle(bookingData.vehicle_id);
    addToast('Booking Confirmed!', `Reservation ${bookingId} for ${vehicle?.brand} ${vehicle?.model} created successfully.`, 'success');
    addNotification('New Booking Confirmed', `Booking ${bookingId} confirmed for ${vehicle?.brand} ${vehicle?.model}.`, 'booking');

    return newBooking;
  };

  // 2. CANCEL BOOKING
  const cancelBooking = (bookingId) => {
    const targetBooking = getBooking(bookingId);
    if (!targetBooking) return;

    setDb(prev => {
      const updatedBookings = prev.bookings.map(b => 
        b.booking_id === bookingId ? { ...b, status: 'CANCELLED' } : b
      );
      // Revert vehicle to AVAILABLE if it was marked BOOKED
      const updatedVehicles = prev.vehicles.map(v => 
        v.vehicle_id === targetBooking.vehicle_id && v.status === 'BOOKED'
          ? { ...v, status: 'AVAILABLE' }
          : v
      );
      return {
        ...prev,
        bookings: updatedBookings,
        vehicles: updatedVehicles
      };
    });

    addToast('Booking Cancelled', `Booking #${bookingId} has been cancelled and vehicle returned to available pool.`, 'info');
    addNotification('Booking Cancelled', `Booking #${bookingId} was cancelled by user.`, 'booking');
  };

  // 3. START RENTAL (Booking -> Rental -> Vehicle RENTED)
  const startRental = (bookingId, odometerStart = null) => {
    const booking = getBooking(bookingId);
    if (!booking) return;

    const vehicle = getVehicle(booking.vehicle_id);
    const rentalId = `RNT-${Math.floor(4000 + Math.random() * 9000)}`;

    const newRental = {
      rental_id: rentalId,
      booking_id: bookingId,
      vehicle_id: booking.vehicle_id,
      customer_id: booking.customer_id,
      pickup_date: new Date().toISOString().split('T')[0],
      return_date: booking.end_date,
      odometer_start: odometerStart || vehicle?.odometer || 15000,
      odometer_end: null,
      status: 'ACTIVE',
      fuel_level_start: '100%',
      fuel_level_end: null,
      inspection_notes: 'Vehicle inspected and keys handed over.'
    };

    setDb(prev => {
      const updatedVehicles = prev.vehicles.map(v => 
        v.vehicle_id === booking.vehicle_id ? { ...v, status: 'RENTED' } : v
      );
      return {
        ...prev,
        rentals: [newRental, ...prev.rentals],
        vehicles: updatedVehicles
      };
    });

    addToast('Rental Dispatched!', `Rental contract ${rentalId} is now ACTIVE. Vehicle status set to RENTED.`, 'success');
    addNotification('Rental Started', `Rental ${rentalId} dispatched for ${vehicle?.brand} ${vehicle?.model}.`, 'rental');
    return newRental;
  };

  // 4. COMPLETE RENTAL / RETURN VEHICLE (Vehicle -> AVAILABLE)
  const completeRental = (rentalId, odometerEnd, fuelLevelEnd = '100%', notes = '') => {
    const rental = getRental(rentalId);
    if (!rental) return;

    const booking = getBooking(rental.booking_id);
    const vehicle = getVehicle(rental.vehicle_id);

    const calculatedOdo = odometerEnd ? Number(odometerEnd) : (rental.odometer_start + 180);

    setDb(prev => {
      // 1. Mark rental as COMPLETED
      const updatedRentals = prev.rentals.map(r => 
        r.rental_id === rentalId ? {
          ...r,
          status: 'COMPLETED',
          odometer_end: calculatedOdo,
          fuel_level_end: fuelLevelEnd,
          inspection_notes: notes || 'Returned safely and inspected.'
        } : r
      );

      // 2. Mark booking as COMPLETED
      const updatedBookings = prev.bookings.map(b => 
        b.booking_id === rental.booking_id ? { ...b, status: 'COMPLETED' } : b
      );

      // 3. Mark vehicle as AVAILABLE and update odometer
      const updatedVehicles = prev.vehicles.map(v => 
        v.vehicle_id === rental.vehicle_id ? {
          ...v,
          status: 'AVAILABLE',
          odometer: calculatedOdo
        } : v
      );

      return {
        ...prev,
        rentals: updatedRentals,
        bookings: updatedBookings,
        vehicles: updatedVehicles
      };
    });

    addToast('Vehicle Returned!', `Rental #${rentalId} completed. ${vehicle?.brand} ${vehicle?.model} is now AVAILABLE.`, 'success');
    addNotification('Rental Completed', `Vehicle ${vehicle?.vehicle_no} returned and checked in.`, 'rental');
  };

  // 5. PROCESS PAYMENT
  const processPayment = (rentalId, amount, method = 'Credit Card') => {
    const rental = getRental(rentalId);
    const booking = rental ? getBooking(rental.booking_id) : null;
    const paymentId = `PAY-${Math.floor(5000 + Math.random() * 9000)}`;
    const txnId = `TXN-${Date.now().toString().slice(-8)}`;

    const newPayment = {
      payment_id: paymentId,
      rental_id: rentalId,
      booking_id: booking ? booking.booking_id : 'BKG-DIRECT',
      customer_id: rental ? rental.customer_id : (currentUser?.customer_id || 'CUST-1001'),
      payment_date: new Date().toLocaleString(),
      amount: Number(amount),
      payment_method: method,
      status: 'PAID',
      transaction_id: txnId,
      currency: 'USD'
    };

    setDb(prev => ({
      ...prev,
      payments: [newPayment, ...prev.payments]
    }));

    addToast('Payment Received!', `Successfully processed $${Number(amount).toFixed(2)} via ${method}.`, 'success');
    addNotification('Payment Settled', `Transaction ${txnId} for $${amount} confirmed.`, 'payment');
    return newPayment;
  };

  // 6. SCHEDULE MAINTENANCE (Vehicle -> UNDER MAINTENANCE)
  const scheduleMaintenance = (vehicleId, description, cost, technician) => {
    const maintenanceId = `MNT-${Math.floor(6000 + Math.random() * 9000)}`;
    const newMaintenance = {
      maintenance_id: maintenanceId,
      vehicle_id: vehicleId,
      service_date: new Date().toISOString().split('T')[0],
      completion_date: null,
      description,
      cost: Number(cost),
      status: 'IN_PROGRESS',
      technician: technician || 'Master Auto Specialist',
      service_center: 'DriveEase Central Service Bay'
    };

    setDb(prev => {
      // Crucial rule: Mark vehicle as UNDER MAINTENANCE
      const updatedVehicles = prev.vehicles.map(v => 
        v.vehicle_id === vehicleId ? { ...v, status: 'UNDER MAINTENANCE' } : v
      );
      return {
        ...prev,
        maintenance: [newMaintenance, ...prev.maintenance],
        vehicles: updatedVehicles
      };
    });

    const veh = getVehicle(vehicleId);
    addToast('Maintenance Scheduled', `${veh?.brand} ${veh?.model} placed UNDER MAINTENANCE. It cannot be booked now.`, 'warning');
    addNotification('Vehicle In Service', `${veh?.vehicle_no} marked under maintenance for ${description}.`, 'maintenance');
  };

  // 7. COMPLETE MAINTENANCE (Vehicle -> AVAILABLE)
  const completeMaintenance = (maintenanceId) => {
    const target = db.maintenance.find(m => m.maintenance_id === maintenanceId);
    if (!target) return;

    setDb(prev => {
      const updatedMaintenance = prev.maintenance.map(m => 
        m.maintenance_id === maintenanceId ? {
          ...m,
          status: 'COMPLETED',
          completion_date: new Date().toISOString().split('T')[0]
        } : m
      );

      // Restore vehicle status back to AVAILABLE
      const updatedVehicles = prev.vehicles.map(v => 
        v.vehicle_id === target.vehicle_id ? { ...v, status: 'AVAILABLE' } : v
      );

      return {
        ...prev,
        maintenance: updatedMaintenance,
        vehicles: updatedVehicles
      };
    });

    const veh = getVehicle(target.vehicle_id);
    addToast('Maintenance Finished', `${veh?.brand} ${veh?.model} service completed and restored to AVAILABLE pool!`, 'success');
    addNotification('Service Completed', `Vehicle ${veh?.vehicle_no} is now back in service.`, 'maintenance');
  };

  // 8. VEHICLE CRUD
  const addVehicle = (vehicleData) => {
    const newId = `VEH-${Math.floor(200 + Math.random() * 800)}`;
    const newVeh = {
      vehicle_id: newId,
      ...vehicleData,
      base_rate: Number(vehicleData.base_rate),
      odometer: Number(vehicleData.odometer || 0),
      seating_capacity: Number(vehicleData.seating_capacity || 5),
      status: vehicleData.status || 'AVAILABLE',
      image: vehicleData.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      features: vehicleData.features || ['Air Conditioning', 'Power Steering', 'ABS']
    };
    setDb(prev => ({
      ...prev,
      vehicles: [newVeh, ...prev.vehicles]
    }));
    addToast('Vehicle Added', `${newVeh.brand} ${newVeh.model} (${newVeh.vehicle_no}) registered to fleet.`, 'success');
    return newVeh;
  };

  const updateVehicle = (vehicleId, updatedFields) => {
    setDb(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => v.vehicle_id === vehicleId ? { ...v, ...updatedFields } : v)
    }));
    addToast('Vehicle Updated', `Fleet vehicle ${vehicleId} updated successfully.`, 'info');
  };

  const deleteVehicle = (vehicleId) => {
    // Check if vehicle has active rentals or bookings
    const activeRental = db.rentals.find(r => r.vehicle_id === vehicleId && r.status === 'ACTIVE');
    if (activeRental) {
      addToast('Cannot Delete', 'This vehicle is currently dispatched in an ACTIVE rental!', 'error');
      return false;
    }
    setDb(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(v => v.vehicle_id !== vehicleId)
    }));
    addToast('Vehicle Removed', `Vehicle ${vehicleId} removed from fleet records.`, 'info');
    return true;
  };

  // 9. CUSTOMER CRUD
  const addCustomer = (customerData) => {
    const newId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCust = {
      customer_id: newId,
      ...customerData,
      avatar: customerData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
      registered_at: new Date().toISOString().split('T')[0]
    };
    setDb(prev => ({
      ...prev,
      customers: [newCust, ...prev.customers]
    }));
    addToast('Customer Created', `${newCust.name} added to customer directory.`, 'success');
    return newCust;
  };

  const updateCustomer = (customerId, updatedFields) => {
    setDb(prev => ({
      ...prev,
      customers: prev.customers.map(c => c.customer_id === customerId ? { ...c, ...updatedFields } : c)
    }));
    if (currentUser?.customer_id === customerId) {
      setCurrentUser(prev => ({ ...prev, ...updatedFields }));
    }
    addToast('Profile Updated', 'Customer information was saved successfully.', 'info');
  };

  const deleteCustomer = (customerId) => {
    const hasActiveBooking = db.bookings.find(b => b.customer_id === customerId && b.status === 'CONFIRMED');
    if (hasActiveBooking) {
      addToast('Cannot Delete', 'Customer has active reservations that must be resolved first.', 'error');
      return false;
    }
    setDb(prev => ({
      ...prev,
      customers: prev.customers.filter(c => c.customer_id !== customerId)
    }));
    addToast('Customer Deleted', `Customer ${customerId} removed.`, 'info');
    return true;
  };

  // 10. CATEGORY CRUD
  const addCategory = (categoryData) => {
    const newId = `CAT-${Math.floor(100 + Math.random() * 900)}`;
    const newCat = {
      category_id: newId,
      ...categoryData,
      base_rate: Number(categoryData.base_rate)
    };
    setDb(prev => ({
      ...prev,
      categories: [...prev.categories, newCat]
    }));
    addToast('Category Added', `Category ${newCat.category_name} created.`, 'success');
  };

  const updateCategory = (categoryId, fields) => {
    setDb(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.category_id === categoryId ? { ...c, ...fields } : c)
    }));
    addToast('Category Updated', `Category ${categoryId} updated.`, 'info');
  };

  // 11. EMPLOYEE CRUD
  const addEmployee = (empData) => {
    const newId = `EMP-${Math.floor(7000 + Math.random() * 9000)}`;
    const newEmp = {
      employee_id: newId,
      ...empData,
      join_date: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setDb(prev => ({
      ...prev,
      employees: [...prev.employees, newEmp]
    }));
    addToast('Employee Registered', `${newEmp.name} enrolled with role: ${newEmp.role}.`, 'success');
  };

  const updateEmployee = (empId, fields) => {
    setDb(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.employee_id === empId ? { ...e, ...fields } : e)
    }));
    addToast('Employee Updated', `Staff details updated.`, 'info');
  };

  const deleteEmployee = (empId) => {
    setDb(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.employee_id !== empId)
    }));
    addToast('Employee Removed', `Staff member ${empId} removed.`, 'info');
  };

  // 12. RESET TO FACTORY DEMO DATA
  const resetToFactory = () => {
    const freshDb = resetDatabase();
    setDb(freshDb);
    setCurrentUser(freshDb.customers[0]);
    setAdminUser(null);
    addToast('Database Reset', 'DriveEase DBMS data reset to pristine sample state.', 'info');
  };

  // Quick switch demo customer
  const switchDemoCustomer = (customer) => {
    setCurrentUser(customer);
    addToast('Active Customer Switched', `Logged in as ${customer.name}`, 'info');
  };

  // Quick switch demo admin
  const loginAsAdminRole = (employee) => {
    setAdminUser(employee);
    setCurrentView('admin-dashboard');
    addToast('Admin Authenticated', `Welcome, ${employee.name} (${employee.role})`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        db,
        currentUser,
        setCurrentUser,
        adminUser,
        setAdminUser,
        currentView,
        setCurrentView,
        customerTab,
        setCustomerTab,
        adminTab,
        setAdminTab,
        activeVehicleDetails,
        setActiveVehicleDetails,
        activeBookingVehicle,
        setActiveBookingVehicle,
        activePaymentRental,
        setActivePaymentRental,
        activeInvoice,
        setActiveInvoice,
        isDbmsModalOpen,
        setIsDbmsModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        toasts,
        addToast,
        removeToast,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        // Entity Lookups
        getCustomer,
        getVehicle,
        getCategory,
        getBooking,
        getRental,
        getPaymentByRental,
        getMaintenanceForVehicle,
        // Actions
        createBooking,
        cancelBooking,
        startRental,
        completeRental,
        processPayment,
        scheduleMaintenance,
        completeMaintenance,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addCategory,
        updateCategory,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        resetToFactory,
        switchDemoCustomer,
        loginAsAdminRole
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
