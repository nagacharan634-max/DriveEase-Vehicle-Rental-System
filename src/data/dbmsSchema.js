// ============================================================================
// DBMS Academic Project Metadata: Schema, ERD Definition, & SQL Playground
// ============================================================================

export const DBMS_TABLES = [
  {
    name: "CUSTOMER",
    pk: "CUSTOMER_ID",
    description: "Stores registered client profiles, contact coordinates, and driver authorization credentials.",
    columns: [
      { name: "CUSTOMER_ID", type: "VARCHAR(20)", key: "PK", desc: "Unique identifier for customer" },
      { name: "NAME", type: "VARCHAR(100)", key: "", desc: "Full legal name" },
      { name: "PHONE", type: "VARCHAR(20)", key: "", desc: "Direct contact telephone" },
      { name: "EMAIL", type: "VARCHAR(100)", key: "UNIQUE", desc: "Registered email address" },
      { name: "ADDRESS", type: "TEXT", key: "", desc: "Billing & residential address" },
      { name: "DRIVER_LICENSE_NO", type: "VARCHAR(50)", key: "UNIQUE", desc: "Government issued driver license" },
      { name: "LICENSE_EXPIRY", type: "DATE", key: "", desc: "License validity expiration date" },
      { name: "REGISTERED_AT", type: "DATE", key: "", desc: "Registration timestamp" }
    ]
  },
  {
    name: "VEHICLE_CATEGORY",
    pk: "CATEGORY_ID",
    description: "Defines vehicle classifications (Economy, Sedan, SUV, Luxury) with baseline pricing matrices.",
    columns: [
      { name: "CATEGORY_ID", type: "VARCHAR(20)", key: "PK", desc: "Unique category code (e.g. CAT-101)" },
      { name: "CATEGORY_NAME", type: "VARCHAR(50)", key: "", desc: "Category designation" },
      { name: "DESCRIPTION", type: "TEXT", key: "", desc: "Target audience & utility details" },
      { name: "BASE_RATE", type: "DECIMAL(10,2)", key: "", desc: "Default starting price per day" }
    ]
  },
  {
    name: "VEHICLE",
    pk: "VEHICLE_ID",
    description: "The core fleet catalog detailing individual automobiles, current availability status, and specifications.",
    columns: [
      { name: "VEHICLE_ID", type: "VARCHAR(20)", key: "PK", desc: "Unique fleet asset tag" },
      { name: "VEHICLE_NO", type: "VARCHAR(20)", key: "UNIQUE", desc: "Government registration plate number" },
      { name: "BRAND", type: "VARCHAR(50)", key: "", desc: "Manufacturer brand (e.g. BMW, Tesla)" },
      { name: "MODEL", type: "VARCHAR(50)", key: "", desc: "Automobile model designation" },
      { name: "CATEGORY_ID", type: "VARCHAR(20)", key: "FK", desc: "References VEHICLE_CATEGORY(CATEGORY_ID)" },
      { name: "BASE_RATE", type: "DECIMAL(10,2)", key: "", desc: "Effective daily rental fee" },
      { name: "STATUS", type: "VARCHAR(25)", key: "", desc: "AVAILABLE | BOOKED | RENTED | UNDER MAINTENANCE" },
      { name: "FUEL_TYPE", type: "VARCHAR(30)", key: "", desc: "Electric, Hybrid, Petrol, Diesel" },
      { name: "TRANSMISSION", type: "VARCHAR(30)", key: "", desc: "Automatic, Dual-Clutch, Manual" },
      { name: "SEATING_CAPACITY", type: "INT", key: "", desc: "Total passenger capacity" },
      { name: "ODOMETER", type: "INT", key: "", desc: "Current mileage in kilometers" }
    ]
  },
  {
    name: "BOOKING",
    pk: "BOOKING_ID",
    description: "Reservation records linking customer intentions to specific fleet vehicles across date ranges.",
    columns: [
      { name: "BOOKING_ID", type: "VARCHAR(20)", key: "PK", desc: "Unique reservation code" },
      { name: "CUSTOMER_ID", type: "VARCHAR(20)", key: "FK", desc: "References CUSTOMER(CUSTOMER_ID)" },
      { name: "VEHICLE_ID", type: "VARCHAR(20)", key: "FK", desc: "References VEHICLE(VEHICLE_ID)" },
      { name: "BOOKING_DATE", type: "DATE", key: "", desc: "Timestamp when reservation was placed" },
      { name: "START_DATE", type: "DATE", key: "", desc: "Rental schedule start date" },
      { name: "END_DATE", type: "DATE", key: "", desc: "Rental schedule return date" },
      { name: "DAYS", type: "INT", key: "", desc: "Calculated duration" },
      { name: "TOTAL_AMOUNT", type: "DECIMAL(10,2)", key: "", desc: "Computed cost with insurance & taxes" },
      { name: "STATUS", type: "VARCHAR(20)", key: "", desc: "CONFIRMED | PENDING | CANCELLED | COMPLETED" }
    ]
  },
  {
    name: "RENTAL",
    pk: "RENTAL_ID",
    description: "The active physical dispatch and handover contract initiated from a confirmed booking.",
    columns: [
      { name: "RENTAL_ID", type: "VARCHAR(20)", key: "PK", desc: "Unique contract dispatch ID" },
      { name: "BOOKING_ID", type: "VARCHAR(20)", key: "FK", desc: "References BOOKING(BOOKING_ID)" },
      { name: "VEHICLE_ID", type: "VARCHAR(20)", key: "FK", desc: "References VEHICLE(VEHICLE_ID)" },
      { name: "CUSTOMER_ID", type: "VARCHAR(20)", key: "FK", desc: "References CUSTOMER(CUSTOMER_ID)" },
      { name: "PICKUP_DATE", type: "DATE", key: "", desc: "Actual physical key handover date" },
      { name: "RETURN_DATE", type: "DATE", key: "", desc: "Actual or agreed vehicle return date" },
      { name: "ODOMETER_START", type: "INT", key: "", desc: "Odometer reading at vehicle dispatch" },
      { name: "ODOMETER_END", type: "INT", key: "", desc: "Odometer reading at vehicle return" },
      { name: "STATUS", type: "VARCHAR(20)", key: "", desc: "UPCOMING | ACTIVE | COMPLETED" }
    ]
  },
  {
    name: "PAYMENT",
    pk: "PAYMENT_ID",
    description: "Financial transactions settled for active and completed vehicle rentals.",
    columns: [
      { name: "PAYMENT_ID", type: "VARCHAR(20)", key: "PK", desc: "Financial ledger transaction code" },
      { name: "RENTAL_ID", type: "VARCHAR(20)", key: "FK", desc: "References RENTAL(RENTAL_ID)" },
      { name: "BOOKING_ID", type: "VARCHAR(20)", key: "FK", desc: "References BOOKING(BOOKING_ID)" },
      { name: "PAYMENT_DATE", type: "DATETIME", key: "", desc: "Timestamp when payment was executed" },
      { name: "AMOUNT", type: "DECIMAL(10,2)", key: "", desc: "Total transaction monetary sum" },
      { name: "PAYMENT_METHOD", type: "VARCHAR(50)", key: "", desc: "Credit Card, UPI, Net Banking" },
      { name: "STATUS", type: "VARCHAR(20)", key: "", desc: "PAID | PENDING | REFUNDED" },
      { name: "TRANSACTION_ID", type: "VARCHAR(50)", key: "UNIQUE", desc: "Gateway reference trace ID" }
    ]
  },
  {
    name: "MAINTENANCE",
    pk: "MAINTENANCE_ID",
    description: "Logs automotive servicing, periodic repairs, technician notes, and safety inspections.",
    columns: [
      { name: "MAINTENANCE_ID", type: "VARCHAR(20)", key: "PK", desc: "Service ticket identifier" },
      { name: "VEHICLE_ID", type: "VARCHAR(20)", key: "FK", desc: "References VEHICLE(VEHICLE_ID)" },
      { name: "SERVICE_DATE", type: "DATE", key: "", desc: "Date service commenced" },
      { name: "DESCRIPTION", type: "TEXT", key: "", desc: "Detailed breakdown of repair works" },
      { name: "COST", type: "DECIMAL(10,2)", key: "", desc: "Parts and labor expenditure" },
      { name: "STATUS", type: "VARCHAR(20)", key: "", desc: "SCHEDULED | IN_PROGRESS | COMPLETED" },
      { name: "TECHNICIAN", type: "VARCHAR(100)", key: "", desc: "Assigned certified technician" }
    ]
  },
  {
    name: "EMPLOYEE",
    pk: "EMPLOYEE_ID",
    description: "Staff administrative credentials managing rentals, fleet mechanics, and customer bookings.",
    columns: [
      { name: "EMPLOYEE_ID", type: "VARCHAR(20)", key: "PK", desc: "Staff corporate ID" },
      { name: "NAME", type: "VARCHAR(100)", key: "", desc: "Full employee name" },
      { name: "PHONE", type: "VARCHAR(20)", key: "", desc: "Direct desk / mobile phone" },
      { name: "EMAIL", type: "VARCHAR(100)", key: "UNIQUE", desc: "Work email address" },
      { name: "ROLE", type: "VARCHAR(50)", key: "", desc: "Admin | Fleet Manager | Rental Staff | Maintenance Staff" },
      { name: "DEPARTMENT", type: "VARCHAR(50)", key: "", desc: "Operational unit" }
    ]
  }
];

export const SQL_DDL_SCRIPT = `-- ==========================================================
-- DRIVE EASE: RELATIONAL DBMS CREATION SCRIPT (MySQL / PostgreSQL)
-- ==========================================================

-- 1. VEHICLE_CATEGORY TABLE
CREATE TABLE VEHICLE_CATEGORY (
    CATEGORY_ID VARCHAR(20) PRIMARY KEY,
    CATEGORY_NAME VARCHAR(50) NOT NULL,
    DESCRIPTION TEXT,
    BASE_RATE DECIMAL(10, 2) NOT NULL
);

-- 2. VEHICLE TABLE
CREATE TABLE VEHICLE (
    VEHICLE_ID VARCHAR(20) PRIMARY KEY,
    VEHICLE_NO VARCHAR(20) NOT NULL UNIQUE,
    BRAND VARCHAR(50) NOT NULL,
    MODEL VARCHAR(50) NOT NULL,
    CATEGORY_ID VARCHAR(20) NOT NULL,
    BASE_RATE DECIMAL(10, 2) NOT NULL,
    STATUS VARCHAR(25) DEFAULT 'AVAILABLE',
    FUEL_TYPE VARCHAR(30),
    TRANSMISSION VARCHAR(30),
    SEATING_CAPACITY INT DEFAULT 5,
    ODOMETER INT DEFAULT 0,
    CONSTRAINT FK_VEHICLE_CATEGORY FOREIGN KEY (CATEGORY_ID) 
        REFERENCES VEHICLE_CATEGORY(CATEGORY_ID) ON DELETE RESTRICT
);

-- 3. CUSTOMER TABLE
CREATE TABLE CUSTOMER (
    CUSTOMER_ID VARCHAR(20) PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    PHONE VARCHAR(20) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL UNIQUE,
    ADDRESS TEXT NOT NULL,
    DRIVER_LICENSE_NO VARCHAR(50) NOT NULL UNIQUE,
    LICENSE_EXPIRY DATE NOT NULL,
    REGISTERED_AT DATE DEFAULT CURRENT_DATE
);

-- 4. BOOKING TABLE
CREATE TABLE BOOKING (
    BOOKING_ID VARCHAR(20) PRIMARY KEY,
    CUSTOMER_ID VARCHAR(20) NOT NULL,
    VEHICLE_ID VARCHAR(20) NOT NULL,
    BOOKING_DATE DATE NOT NULL,
    START_DATE DATE NOT NULL,
    END_DATE DATE NOT NULL,
    DAYS INT NOT NULL,
    TOTAL_AMOUNT DECIMAL(10, 2) NOT NULL,
    STATUS VARCHAR(20) DEFAULT 'CONFIRMED',
    CONSTRAINT FK_BOOKING_CUSTOMER FOREIGN KEY (CUSTOMER_ID) 
        REFERENCES CUSTOMER(CUSTOMER_ID) ON DELETE CASCADE,
    CONSTRAINT FK_BOOKING_VEHICLE FOREIGN KEY (VEHICLE_ID) 
        REFERENCES VEHICLE(VEHICLE_ID) ON DELETE RESTRICT
);

-- 5. RENTAL TABLE
CREATE TABLE RENTAL (
    RENTAL_ID VARCHAR(20) PRIMARY KEY,
    BOOKING_ID VARCHAR(20) NOT NULL UNIQUE,
    VEHICLE_ID VARCHAR(20) NOT NULL,
    CUSTOMER_ID VARCHAR(20) NOT NULL,
    PICKUP_DATE DATE NOT NULL,
    RETURN_DATE DATE NOT NULL,
    ODOMETER_START INT NOT NULL,
    ODOMETER_END INT,
    STATUS VARCHAR(20) DEFAULT 'ACTIVE',
    CONSTRAINT FK_RENTAL_BOOKING FOREIGN KEY (BOOKING_ID) 
        REFERENCES BOOKING(BOOKING_ID) ON DELETE RESTRICT,
    CONSTRAINT FK_RENTAL_VEHICLE FOREIGN KEY (VEHICLE_ID) 
        REFERENCES VEHICLE(VEHICLE_ID) ON DELETE RESTRICT,
    CONSTRAINT FK_RENTAL_CUSTOMER FOREIGN KEY (CUSTOMER_ID) 
        REFERENCES CUSTOMER(CUSTOMER_ID) ON DELETE RESTRICT
);

-- 6. PAYMENT TABLE
CREATE TABLE PAYMENT (
    PAYMENT_ID VARCHAR(20) PRIMARY KEY,
    RENTAL_ID VARCHAR(20) NOT NULL,
    BOOKING_ID VARCHAR(20) NOT NULL,
    PAYMENT_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    AMOUNT DECIMAL(10, 2) NOT NULL,
    PAYMENT_METHOD VARCHAR(50) NOT NULL,
    STATUS VARCHAR(20) DEFAULT 'PAID',
    TRANSACTION_ID VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT FK_PAYMENT_RENTAL FOREIGN KEY (RENTAL_ID) 
        REFERENCES RENTAL(RENTAL_ID) ON DELETE RESTRICT
);

-- 7. MAINTENANCE TABLE
CREATE TABLE MAINTENANCE (
    MAINTENANCE_ID VARCHAR(20) PRIMARY KEY,
    VEHICLE_ID VARCHAR(20) NOT NULL,
    SERVICE_DATE DATE NOT NULL,
    DESCRIPTION TEXT NOT NULL,
    COST DECIMAL(10, 2) NOT NULL,
    STATUS VARCHAR(20) DEFAULT 'IN_PROGRESS',
    TECHNICIAN VARCHAR(100),
    CONSTRAINT FK_MAINTENANCE_VEHICLE FOREIGN KEY (VEHICLE_ID) 
        REFERENCES VEHICLE(VEHICLE_ID) ON DELETE RESTRICT
);

-- 8. EMPLOYEE TABLE
CREATE TABLE EMPLOYEE (
    EMPLOYEE_ID VARCHAR(20) PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    PHONE VARCHAR(20) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL UNIQUE,
    ROLE VARCHAR(50) NOT NULL,
    DEPARTMENT VARCHAR(50) NOT NULL
);
`;

export const PRESET_QUERIES = [
  {
    id: "q1",
    title: "1. Active Rentals with Customer & Vehicle Details (3-Table JOIN)",
    sql: `SELECT 
    R.RENTAL_ID,
    C.NAME AS CUSTOMER_NAME,
    V.BRAND || ' ' || V.MODEL AS VEHICLE_MODEL,
    V.VEHICLE_NO,
    R.PICKUP_DATE,
    R.RETURN_DATE,
    R.STATUS
FROM RENTAL R
JOIN CUSTOMER C ON R.CUSTOMER_ID = C.CUSTOMER_ID
JOIN VEHICLE V ON R.VEHICLE_ID = V.VEHICLE_ID
WHERE R.STATUS = 'ACTIVE';`,
    run: (db) => {
      return db.rentals
        .filter(r => r.status === 'ACTIVE')
        .map(r => {
          const cust = db.customers.find(c => c.customer_id === r.customer_id) || {};
          const veh = db.vehicles.find(v => v.vehicle_id === r.vehicle_id) || {};
          return {
            RENTAL_ID: r.rental_id,
            CUSTOMER_NAME: cust.name || 'Unknown',
            VEHICLE_MODEL: `${veh.brand || ''} ${veh.model || ''}`,
            VEHICLE_NO: veh.vehicle_no || 'N/A',
            PICKUP_DATE: r.pickup_date,
            RETURN_DATE: r.return_date,
            STATUS: r.status
          };
        });
    }
  },
  {
    id: "q2",
    title: "2. Revenue Breakdown by Vehicle Category (GROUP BY & SUM)",
    sql: `SELECT 
    VC.CATEGORY_NAME,
    COUNT(B.BOOKING_ID) AS TOTAL_BOOKINGS,
    COALESCE(SUM(P.AMOUNT), 0) AS REVENUE_COLLECTED
FROM VEHICLE_CATEGORY VC
JOIN VEHICLE V ON VC.CATEGORY_ID = V.CATEGORY_ID
JOIN BOOKING B ON V.VEHICLE_ID = B.VEHICLE_ID
LEFT JOIN PAYMENT P ON B.BOOKING_ID = P.BOOKING_ID
GROUP BY VC.CATEGORY_NAME;`,
    run: (db) => {
      return db.categories.map(cat => {
        const catVehicles = db.vehicles.filter(v => v.category_id === cat.category_id);
        const catVehIds = catVehicles.map(v => v.vehicle_id);
        const catBookings = db.bookings.filter(b => catVehIds.includes(b.vehicle_id));
        const catBookingIds = catBookings.map(b => b.booking_id);
        const totalRev = db.payments
          .filter(p => catBookingIds.includes(p.booking_id))
          .reduce((acc, p) => acc + Number(p.amount || 0), 0);

        return {
          CATEGORY_NAME: cat.category_name,
          TOTAL_BOOKINGS: catBookings.length,
          REVENUE_COLLECTED: `$${totalRev.toFixed(2)}`
        };
      });
    }
  },
  {
    id: "q3",
    title: "3. Fleet Availability Status Summary (COUNT & GROUP BY)",
    sql: `SELECT 
    STATUS, 
    COUNT(VEHICLE_ID) AS VEHICLE_COUNT
FROM VEHICLE
GROUP BY STATUS;`,
    run: (db) => {
      const counts = { AVAILABLE: 0, BOOKED: 0, RENTED: 0, 'UNDER MAINTENANCE': 0 };
      db.vehicles.forEach(v => {
        counts[v.status] = (counts[v.status] || 0) + 1;
      });
      return Object.keys(counts).map(status => ({
        STATUS: status,
        VEHICLE_COUNT: counts[status]
      }));
    }
  },
  {
    id: "q4",
    title: "4. Vehicles Requiring Service & Historical Costs (MAINTENANCE JOIN)",
    sql: `SELECT 
    V.VEHICLE_ID,
    V.BRAND || ' ' || V.MODEL AS VEHICLE,
    V.STATUS AS CURRENT_STATUS,
    M.DESCRIPTION,
    M.COST,
    M.STATUS AS SERVICE_STATUS
FROM VEHICLE V
JOIN MAINTENANCE M ON V.VEHICLE_ID = M.VEHICLE_ID
ORDER BY M.SERVICE_DATE DESC;`,
    run: (db) => {
      return db.maintenance.map(m => {
        const veh = db.vehicles.find(v => v.vehicle_id === m.vehicle_id) || {};
        return {
          VEHICLE_ID: m.vehicle_id,
          VEHICLE: `${veh.brand || ''} ${veh.model || ''}`,
          CURRENT_STATUS: veh.status,
          DESCRIPTION: m.description,
          COST: `$${m.cost}`,
          SERVICE_STATUS: m.status
        };
      });
    }
  },
  {
    id: "q5",
    title: "5. Top High-Value Customers by Total Booking Expenditure",
    sql: `SELECT 
    C.CUSTOMER_ID,
    C.NAME,
    C.EMAIL,
    COUNT(B.BOOKING_ID) AS TOTAL_BOOKINGS,
    SUM(B.TOTAL_AMOUNT) AS TOTAL_SPENT
FROM CUSTOMER C
JOIN BOOKING B ON C.CUSTOMER_ID = B.CUSTOMER_ID
GROUP BY C.CUSTOMER_ID, C.NAME, C.EMAIL
ORDER BY TOTAL_SPENT DESC;`,
    run: (db) => {
      return db.customers.map(c => {
        const custBookings = db.bookings.filter(b => b.customer_id === c.customer_id);
        const spent = custBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
        return {
          CUSTOMER_ID: c.customer_id,
          NAME: c.name,
          EMAIL: c.email,
          TOTAL_BOOKINGS: custBookings.length,
          TOTAL_SPENT: `$${spent.toFixed(2)}`
        };
      }).sort((a, b) => parseFloat(b.TOTAL_SPENT.slice(1)) - parseFloat(a.TOTAL_SPENT.slice(1)));
    }
  }
];
