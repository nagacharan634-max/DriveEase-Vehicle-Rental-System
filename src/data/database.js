// ============================================================================
// DriveEase – Relational DBMS Database Structure & Initial Demo Data
// 8 Core Tables:
// 1. CUSTOMER
// 2. VEHICLE_CATEGORY
// 3. VEHICLE
// 4. BOOKING
// 5. RENTAL
// 6. PAYMENT
// 7. MAINTENANCE
// 8. EMPLOYEE
// ============================================================================

export const INITIAL_CATEGORIES = [
  {
    category_id: "CAT-101",
    category_name: "Economy",
    description: "Fuel-efficient, compact cars ideal for agile city commuting and budget-conscious travel.",
    base_rate: 45,
    icon: "Car",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    features: ["High Mileage", "Easy Parking", "Bluetooth Audio", "Dual Airbags"]
  },
  {
    category_id: "CAT-102",
    category_name: "Sedan",
    description: "Comfortable, stylish sedans engineered for executive travel, family getaways, and smooth highway cruising.",
    base_rate: 75,
    icon: "CarTaxiFront",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80",
    features: ["Spacious Legroom", "Cruise Control", "Apple CarPlay / Android Auto", "Climate Control"]
  },
  {
    category_id: "CAT-103",
    category_name: "SUV",
    description: "Rugged and spacious all-wheel-drive SUVs built for adventure, off-road versatility, and family touring.",
    base_rate: 110,
    icon: "Truck",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    features: ["AWD / 4x4", "7-Seater Option", "High Ground Clearance", "Panoramic Sunroof"]
  },
  {
    category_id: "CAT-104",
    category_name: "Luxury",
    description: "Flagship automotive masterpieces featuring handcrafted luxury, peerless performance, and prestige.",
    base_rate: 195,
    icon: "Crown",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    features: ["Bespoke Leather Interior", "Burmester Surround Sound", "Adaptive Air Suspension", "Heads-Up Display"]
  }
];

export const INITIAL_VEHICLES = [
  {
    vehicle_id: "VEH-201",
    vehicle_no: "KA-01-MJ-2024",
    brand: "BMW",
    model: "M3 Competition",
    category_id: "CAT-104",
    base_rate: 220,
    status: "AVAILABLE", // AVAILABLE, BOOKED, RENTED, UNDER MAINTENANCE
    fuel_type: "Petrol Twin-Turbo",
    transmission: "8-Speed M Steptronic",
    seating_capacity: 5,
    mileage: "10.2 km/l",
    odometer: 14250,
    color: "Isle of Man Green",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80",
    features: ["503 HP Engine", "Carbon Fiber Roof", "M xDrive AWD", "Harman Kardon Audio", "Laserlights"]
  },
  {
    vehicle_id: "VEH-202",
    vehicle_no: "MH-02-EE-8899",
    brand: "Mercedes-Benz",
    model: "C-Class AMG Line",
    category_id: "CAT-102",
    base_rate: 85,
    status: "AVAILABLE",
    fuel_type: "Mild Hybrid Petrol",
    transmission: "9G-TRONIC Automatic",
    seating_capacity: 5,
    mileage: "15.4 km/l",
    odometer: 21400,
    color: "Obsidian Black",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",
    features: ["MBUX Hyperscreen", "Ambient Lighting 64 Colors", "Active Parking Assist", "Panoramic Glass"]
  },
  {
    vehicle_id: "VEH-203",
    vehicle_no: "DL-03-AX-4433",
    brand: "Tesla",
    model: "Model Y Dual Motor",
    category_id: "CAT-103",
    base_rate: 125,
    status: "RENTED",
    fuel_type: "Electric",
    transmission: "Single-Speed Fixed Gear",
    seating_capacity: 5,
    mileage: "514 km Range",
    odometer: 18900,
    color: "Pearl White Multi-Coat",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80",
    features: ["Full Self-Driving Capability", "Supercharging", "Glass Roof", "15-inch Touchscreen", "Sentry Mode"]
  },
  {
    vehicle_id: "VEH-204",
    vehicle_no: "KA-05-ZX-9090",
    brand: "Range Rover",
    model: "Velar R-Dynamic",
    category_id: "CAT-103",
    base_rate: 145,
    status: "AVAILABLE",
    fuel_type: "Diesel Turbo",
    transmission: "8-Speed Automatic",
    seating_capacity: 5,
    mileage: "13.8 km/l",
    odometer: 32100,
    color: "Fuji White / Black Roof",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80",
    features: ["Terrain Response 2", "Matrix LED Headlights", "Meridian Sound", "Air Suspension", "360 3D Camera"]
  },
  {
    vehicle_id: "VEH-205",
    vehicle_no: "TN-07-LK-7711",
    brand: "Audi",
    model: "RS e-tron GT",
    category_id: "CAT-104",
    base_rate: 260,
    status: "BOOKED",
    fuel_type: "Pure Electric",
    transmission: "2-Speed Transmission",
    seating_capacity: 4,
    mileage: "472 km Range",
    odometer: 9800,
    color: "Kemora Gray",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80",
    features: ["637 HP Boost Mode", "Quattro AWD", "Bang & Olufsen 3D", "Matrix Laser Headlights", "Carbon Ceramic Brakes"]
  },
  {
    vehicle_id: "VEH-206",
    vehicle_no: "HR-26-BV-1212",
    brand: "Toyota",
    model: "Camry Hybrid Elegance",
    category_id: "CAT-102",
    base_rate: 75,
    status: "AVAILABLE",
    fuel_type: "Petrol Hybrid",
    transmission: "e-CVT Automatic",
    seating_capacity: 5,
    mileage: "23.2 km/l",
    odometer: 28400,
    color: "Platinum White Pearl",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80",
    features: ["Toyota Safety Sense 2.5", "JBL Premium 9-Speakers", "Reclining Rear Seats", "Wireless Charging"]
  },
  {
    vehicle_id: "VEH-207",
    vehicle_no: "KA-04-MC-3344",
    brand: "Hyundai",
    model: "i20 N-Line Turbo",
    category_id: "CAT-101",
    base_rate: 45,
    status: "AVAILABLE",
    fuel_type: "Petrol Turbo",
    transmission: "7-Speed Dual Clutch (DCT)",
    seating_capacity: 5,
    mileage: "20.1 km/l",
    odometer: 16700,
    color: "Thunder Blue",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80",
    features: ["Sport Exhaust Note", "Bose 7-Speaker Sound", "Paddle Shifters", "Digital Cluster", "Sunroof"]
  },
  {
    vehicle_id: "VEH-208",
    vehicle_no: "DL-01-QQ-5566",
    brand: "Porsche",
    model: "911 Carrera S",
    category_id: "CAT-104",
    base_rate: 290,
    status: "UNDER MAINTENANCE",
    fuel_type: "Twin-Turbo Boxer 6",
    transmission: "8-Speed PDK Dual-Clutch",
    seating_capacity: 4,
    mileage: "9.5 km/l",
    odometer: 12400,
    color: "Guards Red",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    features: ["Sport Chrono Package", "PASM Sport Suspension", "Bose Surround System", "Sport Exhaust System"]
  }
];

export const INITIAL_CUSTOMERS = [
  {
    customer_id: "CUST-1001",
    name: "Alex Sterling",
    phone: "+1 (555) 382-9012",
    email: "alex.sterling@driveease.io",
    address: "742 Evergreen Terrace, Seattle, WA 98101",
    driver_license_no: "DL-WA-89210-994",
    license_expiry: "2029-08-15",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    registered_at: "2026-01-14"
  },
  {
    customer_id: "CUST-1002",
    name: "Elena Rostova",
    phone: "+1 (555) 749-1120",
    email: "elena.rostova@cloudscale.net",
    address: "1280 Sunset Boulevard, Los Angeles, CA 90028",
    driver_license_no: "DL-CA-44912-381",
    license_expiry: "2028-11-20",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    registered_at: "2026-02-03"
  },
  {
    customer_id: "CUST-1003",
    name: "Marcus Vance",
    phone: "+1 (555) 602-4488",
    email: "marcus.vance@venturecap.com",
    address: "350 5th Avenue, New York, NY 10118",
    driver_license_no: "DL-NY-77301-522",
    license_expiry: "2027-04-10",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    registered_at: "2026-03-19"
  },
  {
    customer_id: "CUST-1004",
    name: "Dr. Sarah Chen",
    phone: "+1 (555) 919-8230",
    email: "sarah.chen@medcenter.org",
    address: "500 Pasteur Drive, Palo Alto, CA 94304",
    driver_license_no: "DL-CA-99201-119",
    license_expiry: "2030-01-25",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    registered_at: "2026-05-11"
  }
];

export const INITIAL_BOOKINGS = [
  {
    booking_id: "BKG-3001",
    customer_id: "CUST-1001",
    vehicle_id: "VEH-203",
    booking_date: "2026-09-21",
    start_date: "2026-09-22",
    end_date: "2026-09-28",
    days: 6,
    daily_rate: 125,
    subtotal: 750,
    taxes: 75,
    insurance: 60,
    total_amount: 885,
    status: "CONFIRMED", // CONFIRMED, PENDING, CANCELLED, COMPLETED
    pickup_hub: "Downtown Mobility Hub"
  },
  {
    booking_id: "BKG-3002",
    customer_id: "CUST-1002",
    vehicle_id: "VEH-205",
    booking_date: "2026-09-24",
    start_date: "2026-09-29",
    end_date: "2026-10-02",
    days: 3,
    daily_rate: 260,
    subtotal: 780,
    taxes: 78,
    insurance: 45,
    total_amount: 903,
    status: "CONFIRMED",
    pickup_hub: "International Airport Terminal 3"
  },
  {
    booking_id: "BKG-3003",
    customer_id: "CUST-1003",
    vehicle_id: "VEH-201",
    booking_date: "2026-09-10",
    start_date: "2026-09-12",
    end_date: "2026-09-16",
    days: 4,
    daily_rate: 220,
    subtotal: 880,
    taxes: 88,
    insurance: 50,
    total_amount: 1018,
    status: "COMPLETED",
    pickup_hub: "Silicon Valley Tech Station"
  },
  {
    booking_id: "BKG-3004",
    customer_id: "CUST-1004",
    vehicle_id: "VEH-206",
    booking_date: "2026-09-18",
    start_date: "2026-09-19",
    end_date: "2026-09-21",
    days: 2,
    daily_rate: 75,
    subtotal: 150,
    taxes: 15,
    insurance: 20,
    total_amount: 185,
    status: "COMPLETED",
    pickup_hub: "Downtown Mobility Hub"
  }
];

export const INITIAL_RENTALS = [
  {
    rental_id: "RNT-4001",
    booking_id: "BKG-3001",
    vehicle_id: "VEH-203",
    customer_id: "CUST-1001",
    pickup_date: "2026-09-22",
    return_date: "2026-09-28",
    odometer_start: 18900,
    odometer_end: null,
    status: "ACTIVE", // UPCOMING, ACTIVE, COMPLETED
    fuel_level_start: "100%",
    fuel_level_end: null,
    inspection_notes: "Pristine condition upon dispatch. Zero scratch or dent detected."
  },
  {
    rental_id: "RNT-4002",
    booking_id: "BKG-3003",
    vehicle_id: "VEH-201",
    customer_id: "CUST-1003",
    pickup_date: "2026-09-12",
    return_date: "2026-09-16",
    odometer_start: 13650,
    odometer_end: 14250,
    status: "COMPLETED",
    fuel_level_start: "100%",
    fuel_level_end: "95%",
    inspection_notes: "Vehicle returned in immaculate state. Routine post-rental wash performed."
  },
  {
    rental_id: "RNT-4003",
    booking_id: "BKG-3004",
    vehicle_id: "VEH-206",
    customer_id: "CUST-1004",
    pickup_date: "2026-09-19",
    return_date: "2026-09-21",
    odometer_start: 28150,
    odometer_end: 28400,
    status: "COMPLETED",
    fuel_level_start: "100%",
    fuel_level_end: "100%",
    inspection_notes: "Tank refilled to 100%. All accessories accounted for."
  }
];

export const INITIAL_PAYMENTS = [
  {
    payment_id: "PAY-5001",
    rental_id: "RNT-4001",
    booking_id: "BKG-3001",
    customer_id: "CUST-1001",
    payment_date: "2026-09-21 16:42:10",
    amount: 885,
    payment_method: "Credit Card (Visa •••• 4242)",
    status: "PAID", // PAID, PENDING, REFUNDED
    transaction_id: "TXN-882109432",
    currency: "USD"
  },
  {
    payment_id: "PAY-5002",
    rental_id: "RNT-4002",
    booking_id: "BKG-3003",
    customer_id: "CUST-1003",
    payment_date: "2026-09-12 09:15:30",
    amount: 1018,
    payment_method: "UPI (marcus.v@okaxis)",
    status: "PAID",
    transaction_id: "TXN-773918239",
    currency: "USD"
  },
  {
    payment_id: "PAY-5003",
    rental_id: "RNT-4003",
    booking_id: "BKG-3004",
    customer_id: "CUST-1004",
    payment_date: "2026-09-19 11:30:00",
    amount: 185,
    payment_method: "Net Banking (JPMorgan Chase)",
    status: "PAID",
    transaction_id: "TXN-994821034",
    currency: "USD"
  }
];

export const INITIAL_MAINTENANCE = [
  {
    maintenance_id: "MNT-6001",
    vehicle_id: "VEH-208", // Porsche 911 Carrera S
    service_date: "2026-09-24",
    completion_date: null,
    description: "Ceramic brake inspection, high-performance synthetic oil flush, and PDK gearbox diagnostics.",
    cost: 450,
    status: "IN_PROGRESS", // SCHEDULED, IN_PROGRESS, COMPLETED
    technician: "Vikram Mehta (Lead Master Tech)",
    service_center: "DriveEase Performance Hub – Bay 4"
  },
  {
    maintenance_id: "MNT-6002",
    vehicle_id: "VEH-204", // Range Rover Velar
    service_date: "2026-08-30",
    completion_date: "2026-08-31",
    description: "Scheduled 30,000 km air-suspension calibration and HVAC air filter replacement.",
    cost: 280,
    status: "COMPLETED",
    technician: "Samantha Reed",
    service_center: "DriveEase Central Fleet Workshop"
  },
  {
    maintenance_id: "MNT-6003",
    vehicle_id: "VEH-202", // Mercedes-Benz C-Class
    service_date: "2026-09-02",
    completion_date: "2026-09-02",
    description: "Routine 20,000 km tire rotation, high-speed computerized wheel balancing, and headlight re-alignment.",
    cost: 160,
    status: "COMPLETED",
    technician: "David Ross",
    service_center: "DriveEase Rapid Service Bay"
  }
];

export const INITIAL_EMPLOYEES = [
  {
    employee_id: "EMP-7001",
    name: "Devon Sinclair",
    phone: "+1 (555) 100-7001",
    email: "devon.sinclair@driveease.io",
    role: "Admin", // Admin, Manager, Rental Staff, Maintenance Staff
    department: "Executive Operations",
    status: "Active",
    join_date: "2024-05-01"
  },
  {
    employee_id: "EMP-7002",
    name: "Jessica Albright",
    phone: "+1 (555) 100-7002",
    email: "jessica.a@driveease.io",
    role: "Fleet Manager",
    department: "Fleet Logistics & Procurement",
    status: "Active",
    join_date: "2024-08-15"
  },
  {
    employee_id: "EMP-7003",
    name: "Liam O'Connor",
    phone: "+1 (555) 100-7003",
    email: "liam.oc@driveease.io",
    role: "Rental Staff",
    department: "Customer Service & Dispatch",
    status: "Active",
    join_date: "2025-01-10"
  },
  {
    employee_id: "EMP-7004",
    name: "Vikram Mehta",
    phone: "+1 (555) 100-7004",
    email: "vikram.m@driveease.io",
    role: "Maintenance Staff",
    department: "Automotive Engineering & Tech",
    status: "Active",
    join_date: "2024-11-20"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-1",
    title: "New Booking Confirmed",
    message: "Booking #BKG-3002 for Audi RS e-tron GT was placed by Elena Rostova.",
    type: "booking",
    timestamp: "10 mins ago",
    read: false
  },
  {
    id: "NOTIF-2",
    title: "Vehicle Rented Out",
    message: "Tesla Model Y (VEH-203) rental RNT-4001 is now ACTIVE.",
    type: "rental",
    timestamp: "1 hour ago",
    read: false
  },
  {
    id: "NOTIF-3",
    title: "Payment Received",
    message: "Payment of $885.00 settled via Visa •••• 4242 for Rental #RNT-4001.",
    type: "payment",
    timestamp: "3 hours ago",
    read: true
  },
  {
    id: "NOTIF-4",
    title: "Vehicle Service In Progress",
    message: "Porsche 911 Carrera S (VEH-208) is currently in Bay 4 for brake servicing.",
    type: "maintenance",
    timestamp: "Yesterday",
    read: true
  }
];

// LocalStorage Persistence Keys
const STORAGE_PREFIX = "driveease_db_";

export function loadDatabase() {
  try {
    const categories = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}categories`)) || INITIAL_CATEGORIES;
    const vehicles = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}vehicles`)) || INITIAL_VEHICLES;
    const customers = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}customers`)) || INITIAL_CUSTOMERS;
    const bookings = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}bookings`)) || INITIAL_BOOKINGS;
    const rentals = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}rentals`)) || INITIAL_RENTALS;
    const payments = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}payments`)) || INITIAL_PAYMENTS;
    const maintenance = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}maintenance`)) || INITIAL_MAINTENANCE;
    const employees = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}employees`)) || INITIAL_EMPLOYEES;
    const notifications = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}notifications`)) || INITIAL_NOTIFICATIONS;

    return {
      categories,
      vehicles,
      customers,
      bookings,
      rentals,
      payments,
      maintenance,
      employees,
      notifications
    };
  } catch (err) {
    console.error("Error loading database from localStorage:", err);
    return {
      categories: INITIAL_CATEGORIES,
      vehicles: INITIAL_VEHICLES,
      customers: INITIAL_CUSTOMERS,
      bookings: INITIAL_BOOKINGS,
      rentals: INITIAL_RENTALS,
      payments: INITIAL_PAYMENTS,
      maintenance: INITIAL_MAINTENANCE,
      employees: INITIAL_EMPLOYEES,
      notifications: INITIAL_NOTIFICATIONS
    };
  }
}

export function saveDatabase(data) {
  try {
    Object.keys(data).forEach(key => {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data[key]));
    });
  } catch (err) {
    console.error("Error saving database to localStorage:", err);
  }
}

export function resetDatabase() {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}categories`);
    localStorage.removeItem(`${STORAGE_PREFIX}vehicles`);
    localStorage.removeItem(`${STORAGE_PREFIX}customers`);
    localStorage.removeItem(`${STORAGE_PREFIX}bookings`);
    localStorage.removeItem(`${STORAGE_PREFIX}rentals`);
    localStorage.removeItem(`${STORAGE_PREFIX}payments`);
    localStorage.removeItem(`${STORAGE_PREFIX}maintenance`);
    localStorage.removeItem(`${STORAGE_PREFIX}employees`);
    localStorage.removeItem(`${STORAGE_PREFIX}notifications`);
  } catch (err) {
    console.error("Error clearing database:", err);
  }
  return {
    categories: INITIAL_CATEGORIES,
    vehicles: INITIAL_VEHICLES,
    customers: INITIAL_CUSTOMERS,
    bookings: INITIAL_BOOKINGS,
    rentals: INITIAL_RENTALS,
    payments: INITIAL_PAYMENTS,
    maintenance: INITIAL_MAINTENANCE,
    employees: INITIAL_EMPLOYEES,
    notifications: INITIAL_NOTIFICATIONS
  };
}
