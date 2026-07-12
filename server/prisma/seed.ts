import {
  PrismaClient,
  Role,
  VehicleStatus,
  DriverStatus,
  TripStatus,
  MaintenanceStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Default demo password for all seeded users: TransitOps@2024
// Change immediately in production.
const SEED_PASSWORD = 'TransitOps@2024';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function dec(min: number, max: number, p = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(p));
}

// ─── Data Pools ───────────────────────────────────────────────────────────────

// Mostly Indian names (~80%), a few American (~20%)
const indianFirst = [
  'Aarav', 'Arjun', 'Aditya', 'Ajay', 'Amitabh', 'Anil', 'Anoop', 'Anupam',
  'Balamurugan', 'Biju', 'Dinesh', 'Ganesh', 'Girish', 'Gopal', 'Harish',
  'Jagdish', 'Jeevan', 'Karthik', 'Kiran', 'Krishna', 'Mahesh', 'Manoj',
  'Mohan', 'Muthu', 'Naveen', 'Nikhil', 'Prabhu', 'Pradeep', 'Prakash',
  'Ramesh', 'Rajan', 'Rajesh', 'Ravi', 'Rohit', 'Sanjay', 'Santosh',
  'Senthil', 'Shiva', 'Suresh', 'Thiru', 'Uday', 'Venkat', 'Vijay',
  'Vikram', 'Vinod', 'Yogesh', 'Yuvaraj', 'Zubair',
];
const americanFirst = ['James', 'Michael', 'Robert', 'David', 'William'];
const allFirst = [...indianFirst, ...americanFirst];

const indianLast = [
  'Bose', 'Choudhury', 'Das', 'Desai', 'Gowda', 'Gupta', 'Iyer', 'Jain',
  'Kumar', 'Menon', 'Nair', 'Patel', 'Patil', 'Pillai', 'Rao', 'Reddy',
  'Sharma', 'Singh', 'Sinha', 'Srinivasan', 'Subramanian', 'Thakur',
  'Verma', 'Yadav',
];
const americanLast = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones'];
const allLast = [...indianLast, ...americanLast];

// Indian state codes & typical district numbers
const stateInfo: { code: string; districts: number[] }[] = [
  { code: 'TN', districts: [1, 2, 3, 5, 9, 10, 11, 14, 15, 19, 20, 21, 25, 31, 33, 36, 38] },
  { code: 'KA', districts: [1, 2, 3, 4, 5, 9, 14, 20, 25, 27, 28, 34, 41, 50, 57] },
  { code: 'MH', districts: [1, 2, 3, 4, 5, 6, 7, 12, 14, 20, 22, 23, 31, 34, 43, 48] },
  { code: 'DL', districts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { code: 'AP', districts: [1, 2, 3, 4, 5, 7, 9, 11, 12, 13] },
  { code: 'TS', districts: [1, 2, 3, 4, 5, 7, 9, 10, 11] },
  { code: 'KL', districts: [1, 2, 3, 4, 5, 7, 9, 11, 13, 14, 15] },
  { code: 'GJ', districts: [1, 2, 3, 4, 5, 6, 7, 9, 12, 15, 18, 27] },
  { code: 'RJ', districts: [1, 2, 3, 4, 6, 7, 9, 10, 11, 14, 20] },
  { code: 'UP', districts: [12, 13, 14, 15, 20, 25, 32, 60, 65, 70, 80] },
  { code: 'WB', districts: [1, 2, 3, 4, 5, 6, 7, 12, 13, 19, 20, 23] },
  { code: 'PB', districts: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13] },
];

function indianReg(): string {
  const state = pick(stateInfo);
  const dist = String(pick(state.districts)).padStart(2, '0');
  const series =
    String.fromCharCode(65 + randomInt(0, 25)) +
    String.fromCharCode(65 + randomInt(0, 25));
  const num = String(randomInt(1000, 9999));
  return `${state.code}-${dist}-${series}-${num}`;
}

function indianLicense(): string {
  const state = pick(stateInfo);
  const year = randomInt(2000, 2022);
  const num = String(randomInt(1000000, 9999999)).padStart(7, '0');
  return `${state.code}-${year}-${num}`;
}

function indianPhone(): string {
  const prefix = pick(['6', '7', '8', '9']);
  return prefix + String(randomInt(100000000, 999999999));
}

// Indian heavy-vehicle models with realistic capacities
const vehicleModels: { make: string; model: string; type: string; capacityRange: [number, number]; costRange: [number, number] }[] = [
  { make: 'Tata',         model: 'Signa 4923.S',        type: 'HCV Truck',   capacityRange: [25000, 35000], costRange: [3200000, 4000000] },
  { make: 'Tata',         model: 'Prima 4038.S',         type: 'Trailer',     capacityRange: [35000, 49000], costRange: [4500000, 6000000] },
  { make: 'Tata',         model: 'LPT 1918',             type: 'MCV Truck',   capacityRange: [9000, 15000],  costRange: [1800000, 2500000] },
  { make: 'Tata',         model: 'Ace Gold Petrol',      type: 'Mini Truck',  capacityRange: [600, 1000],    costRange: [450000, 600000]  },
  { make: 'Ashok Leyland',model: 'Boss 1315',            type: 'MCV Truck',   capacityRange: [8000, 13000],  costRange: [1500000, 2200000] },
  { make: 'Ashok Leyland',model: 'U-Truck 4923',         type: 'HCV Truck',   capacityRange: [23000, 35000], costRange: [3000000, 4200000] },
  { make: 'Ashok Leyland',model: 'Dost Strong',          type: 'LCV',         capacityRange: [1500, 2500],   costRange: [700000, 950000]  },
  { make: 'Ashok Leyland',model: 'Captain 3518',         type: 'Trailer',     capacityRange: [30000, 45000], costRange: [4000000, 5500000] },
  { make: 'BharatBenz',   model: '2823R',                type: 'HCV Truck',   capacityRange: [20000, 28000], costRange: [2800000, 3800000] },
  { make: 'BharatBenz',   model: '3523R',                type: 'Trailer',     capacityRange: [30000, 40000], costRange: [3800000, 5000000] },
  { make: 'Eicher',       model: 'Pro 2059',             type: 'MCV Truck',   capacityRange: [8000, 13000],  costRange: [1400000, 2000000] },
  { make: 'Eicher',       model: 'Pro 6016',             type: 'HCV Truck',   capacityRange: [16000, 24000], costRange: [2500000, 3500000] },
  { make: 'Mahindra',     model: 'Bolero Pik-Up',        type: 'Pickup',      capacityRange: [1000, 1500],   costRange: [600000, 850000]  },
  { make: 'Mahindra',     model: 'Blazo X 28',           type: 'MCV Truck',   capacityRange: [14000, 20000], costRange: [2200000, 3000000] },
  { make: 'VECV (Eicher)',model: 'Pro 8030 XP',          type: 'Trailer',     capacityRange: [28000, 42000], costRange: [4000000, 5200000] },
];

// Realistic Indian logistics routes with approximate distance (km)
const routes: { source: string; destination: string; distKm: number }[] = [
  { source: 'Chennai',       destination: 'Bengaluru',    distKm: 346  },
  { source: 'Chennai',       destination: 'Hyderabad',    distKm: 625  },
  { source: 'Chennai',       destination: 'Coimbatore',   distKm: 495  },
  { source: 'Chennai',       destination: 'Vijayawada',   distKm: 432  },
  { source: 'Chennai',       destination: 'Kochi',        distKm: 680  },
  { source: 'Chennai',       destination: 'Mumbai',       distKm: 1340 },
  { source: 'Chennai',       destination: 'Pune',         distKm: 1200 },
  { source: 'Bengaluru',     destination: 'Hyderabad',    distKm: 572  },
  { source: 'Bengaluru',     destination: 'Mumbai',       distKm: 984  },
  { source: 'Bengaluru',     destination: 'Kochi',        distKm: 545  },
  { source: 'Bengaluru',     destination: 'Pune',         distKm: 840  },
  { source: 'Hyderabad',     destination: 'Vijayawada',   distKm: 275  },
  { source: 'Hyderabad',     destination: 'Mumbai',       distKm: 711  },
  { source: 'Hyderabad',     destination: 'Nagpur',       distKm: 502  },
  { source: 'Hyderabad',     destination: 'Pune',         distKm: 560  },
  { source: 'Mumbai',        destination: 'Pune',         distKm: 150  },
  { source: 'Mumbai',        destination: 'Ahmedabad',    distKm: 524  },
  { source: 'Mumbai',        destination: 'Nagpur',       distKm: 867  },
  { source: 'Mumbai',        destination: 'Delhi',        distKm: 1415 },
  { source: 'Delhi',         destination: 'Jaipur',       distKm: 282  },
  { source: 'Delhi',         destination: 'Lucknow',      distKm: 550  },
  { source: 'Delhi',         destination: 'Chandigarh',   distKm: 250  },
  { source: 'Delhi',         destination: 'Kolkata',      distKm: 1472 },
  { source: 'Kolkata',       destination: 'Bhubaneswar',  distKm: 442  },
  { source: 'Kolkata',       destination: 'Patna',        distKm: 558  },
  { source: 'Ahmedabad',     destination: 'Surat',        distKm: 264  },
  { source: 'Ahmedabad',     destination: 'Jaipur',       distKm: 650  },
  { source: 'Pune',          destination: 'Nagpur',       distKm: 706  },
  { source: 'Coimbatore',    destination: 'Kochi',        distKm: 186  },
  { source: 'Vijayawada',    destination: 'Visakhapatnam',distKm: 350  },
  // A few American routes (~15%)
  { source: 'Los Angeles',   destination: 'Phoenix',      distKm: 600  },
  { source: 'Houston',       destination: 'Dallas',       distKm: 385  },
  { source: 'Chicago',       destination: 'Detroit',      distKm: 460  },
];

const maintenanceServices = [
  'Engine Overhaul', 'Oil & Filter Change', 'Brake Pad Replacement', 'Wheel Alignment & Balancing',
  'Transmission Repair', 'Battery Replacement', 'Clutch Replacement', 'Turbocharger Service',
  'Air Filter Replacement', 'Coolant Flush', 'Suspension Overhaul', 'Tyre Replacement (Full Set)',
  'Differential Repair', 'Fuel Injector Cleaning', 'Annual Safety Inspection',
];

const expenseCategories: { category: string; minAmt: number; maxAmt: number }[] = [
  { category: 'Toll',        minAmt: 200,    maxAmt: 3500  },
  { category: 'Insurance',   minAmt: 15000,  maxAmt: 85000 },
  { category: 'Repair',      minAmt: 2000,   maxAmt: 30000 },
  { category: 'State Permit',minAmt: 1500,   maxAmt: 8000  },
  { category: 'Parking',     minAmt: 100,    maxAmt: 800   },
  { category: 'Washing',     minAmt: 300,    maxAmt: 1200  },
  { category: 'Overloading Fine', minAmt: 5000, maxAmt: 25000 },
  { category: 'Driver Allowance', minAmt: 500,  maxAmt: 3000  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🧹  Cleaning existing data...');
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  // ── 1. Users ─────────────────────────────────────────────────────────────
  console.log('👤  Seeding users...');
  // Hash is computed once and reused for all users to keep seed fast
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  await prisma.user.createMany({
    data: [
      { name: 'Ravi Kumar',   email: 'admin@transitops.in',    password: passwordHash, role: Role.ADMIN },
      { name: 'Priya Sharma', email: 'dispatch@transitops.in', password: passwordHash, role: Role.DISPATCHER },
      { name: 'Anil Desai',   email: 'fleet@transitops.in',    password: passwordHash, role: Role.FLEET_MANAGER },
      { name: 'Vikram Singh', email: 'safety@transitops.in',   password: passwordHash, role: Role.SAFETY_OFFICER },
      { name: 'Neha Gupta',   email: 'finance@transitops.in',  password: passwordHash, role: Role.FINANCE },
    ],
  });
  console.log(`   🔑  All users seeded with password: ${SEED_PASSWORD}`);

  // ── 2. Vehicles ───────────────────────────────────────────────────────────
  console.log('🚛  Seeding vehicles...');
  const vehicleRows: any[] = [];
  const usedRegs = new Set<string>();

  for (let i = 0; i < 50; i++) {
    let status: VehicleStatus;
    if      (i < 10) status = VehicleStatus.ON_TRIP;
    else if (i < 15) status = VehicleStatus.IN_SHOP;
    else if (i > 46) status = VehicleStatus.RETIRED;
    else             status = VehicleStatus.AVAILABLE;

    const vm = pick(vehicleModels);

    let reg: string;
    do { reg = indianReg(); } while (usedRegs.has(reg));
    usedRegs.add(reg);

    vehicleRows.push({
      registrationNumber: reg,
      model:              `${vm.make} ${vm.model}`,
      type:               vm.type,
      capacity:           randomInt(vm.capacityRange[0], vm.capacityRange[1]),
      odometer:           randomInt(8000, 220000),
      acquisitionCost:    dec(vm.costRange[0], vm.costRange[1]),
      status,
    });
  }
  await prisma.vehicle.createMany({ data: vehicleRows });
  const vehicles = await prisma.vehicle.findMany();

  const onTripVehicles  = vehicles.filter(v => v.status === VehicleStatus.ON_TRIP);
  const inShopVehicles  = vehicles.filter(v => v.status === VehicleStatus.IN_SHOP);

  // ── 3. Drivers ────────────────────────────────────────────────────────────
  console.log('🪪  Seeding drivers...');
  const driverRows: any[] = [];
  const usedLicenses = new Set<string>();

  for (let i = 0; i < 75; i++) {
    let status: DriverStatus;
    if      (i < 10) status = DriverStatus.ON_TRIP;
    else if (i < 16) status = DriverStatus.OFF_DUTY;
    else if (i > 72) status = DriverStatus.SUSPENDED;
    else             status = DriverStatus.AVAILABLE;

    // ~20% American names
    const useAmerican = i % 5 === 0;
    const firstName = useAmerican ? pick(americanFirst) : pick(indianFirst);
    const lastName  = useAmerican ? pick(americanLast)  : pick(indianLast);

    let lic: string;
    do { lic = indianLicense(); } while (usedLicenses.has(lic));
    usedLicenses.add(lic);

    const expiryBase = new Date(now);
    expiryBase.setMonth(now.getMonth() + randomInt(6, 60)); // 6 months to 5 years from now

    driverRows.push({
      name:          `${firstName} ${lastName}`,
      licenseNumber: lic,
      category:      pick(['LMV', 'HMV', 'HMV-Transport', 'HPMV']),
      expiryDate:    expiryBase,
      contact:       indianPhone(),
      safetyScore:   dec(2.50, 5.00),
      status,
    });
  }
  await prisma.driver.createMany({ data: driverRows });
  const drivers = await prisma.driver.findMany();

  const onTripDrivers = drivers.filter(d => d.status === DriverStatus.ON_TRIP);

  // ── 4. Trips ──────────────────────────────────────────────────────────────
  console.log('🗺️  Seeding trips...');
  const tripRows: any[] = [];

  // 10 active DISPATCHED trips — must match ON_TRIP vehicles & drivers
  for (let i = 0; i < 10; i++) {
    const v = onTripVehicles[i];
    const d = onTripDrivers[i];
    const route = pick(routes);
    const noise = dec(0.97, 1.04);
    const plannedDistance = parseFloat((route.distKm * noise).toFixed(2));

    tripRows.push({
      vehicleId:       v.id,
      driverId:        d.id,
      source:          route.source,
      destination:     route.destination,
      cargoWeight:     dec(Math.min(500, Number(v.capacity) * 0.3), Number(v.capacity)),
      plannedDistance,
      status:          TripStatus.DISPATCHED,
      startTime:       randomDate(new Date(now.getTime() - 86400000 * 2), now),
    });
  }

  // ~216 COMPLETED + ~24 CANCELLED past trips
  for (let i = 0; i < 240; i++) {
    const v = pick(vehicles);
    const d = pick(drivers);
    const route = pick(routes);
    const noise = dec(0.97, 1.04);
    const plannedDistance = parseFloat((route.distKm * noise).toFixed(2));
    const isCompleted = Math.random() > 0.10;
    const startTime = randomDate(sixMonthsAgo, new Date(now.getTime() - 86400000 * 3));
    const durationMs = (plannedDistance / dec(40, 65)) * 3600000; // avg speed 40–65 km/h

    if (isCompleted) {
      const actualDistance = parseFloat((plannedDistance * dec(0.97, 1.05)).toFixed(2));
      const kmpl = dec(3.5, 9.5); // heavy trucks 4–7 kmpl
      const fuelUsed = parseFloat((actualDistance / kmpl).toFixed(2));
      tripRows.push({
        vehicleId:       v.id,
        driverId:        d.id,
        source:          route.source,
        destination:     route.destination,
        cargoWeight:     dec(Math.min(500, Number(v.capacity) * 0.3), Number(v.capacity)),
        plannedDistance,
        actualDistance,
        fuelUsed,
        status:          TripStatus.COMPLETED,
        startTime,
        endTime:         new Date(startTime.getTime() + durationMs),
      });
    } else {
      tripRows.push({
        vehicleId:       v.id,
        driverId:        d.id,
        source:          route.source,
        destination:     route.destination,
        cargoWeight:     dec(Math.min(500, Number(v.capacity) * 0.3), Number(v.capacity)),
        plannedDistance,
        status:          TripStatus.CANCELLED,
        startTime,
      });
    }
  }

  await prisma.trip.createMany({ data: tripRows });

  // ── 5. Maintenance ────────────────────────────────────────────────────────
  console.log('🔧  Seeding maintenance records...');
  const maintenanceRows: any[] = [];

  // Active (OPEN / IN_PROGRESS) for IN_SHOP vehicles
  for (const v of inShopVehicles) {
    maintenanceRows.push({
      vehicleId:   v.id,
      serviceType: pick(maintenanceServices),
      description: 'Vehicle admitted for scheduled service and inspection',
      cost:        dec(8000, 120000),
      status:      Math.random() > 0.5 ? MaintenanceStatus.OPEN : MaintenanceStatus.IN_PROGRESS,
      startDate:   randomDate(new Date(now.getTime() - 86400000 * 5), now),
    });
  }

  // 75 completed historical maintenance records
  for (let i = 0; i < 75; i++) {
    const v = pick(vehicles);
    const startDate = randomDate(sixMonthsAgo, new Date(now.getTime() - 86400000 * 10));
    maintenanceRows.push({
      vehicleId:   v.id,
      serviceType: pick(maintenanceServices),
      description: 'Completed as per preventive maintenance schedule',
      cost:        dec(3000, 150000),
      status:      MaintenanceStatus.COMPLETED,
      startDate,
      endDate:     new Date(startDate.getTime() + 86400000 * randomInt(1, 5)),
    });
  }

  await prisma.maintenance.createMany({ data: maintenanceRows });

  // ── 6. Fuel Logs ──────────────────────────────────────────────────────────
  console.log('⛽  Seeding fuel logs...');
  const fuelRows: any[] = [];
  const dieselPricePerLitre = () => dec(92, 108); // INR/litre realistic range

  for (let i = 0; i < 120; i++) {
    const v = pick(vehicles);
    const liters = dec(40, 350);
    fuelRows.push({
      vehicleId: v.id,
      liters,
      cost:      parseFloat((liters * dieselPricePerLitre()).toFixed(2)),
      date:      randomDate(sixMonthsAgo, now),
    });
  }
  await prisma.fuelLog.createMany({ data: fuelRows });

  // ── 7. Expenses ───────────────────────────────────────────────────────────
  console.log('💰  Seeding expenses...');
  const expenseRows: any[] = [];

  for (let i = 0; i < 200; i++) {
    const v = pick(vehicles);
    const ec = pick(expenseCategories);
    expenseRows.push({
      vehicleId:   v.id,
      category:    ec.category,
      amount:      dec(ec.minAmt, ec.maxAmt),
      description: `${ec.category} — vehicle ${v.registrationNumber}`,
      date:        randomDate(sixMonthsAgo, now),
    });
  }
  await prisma.expense.createMany({ data: expenseRows });

  console.log('✅  Enterprise seed complete!');
  console.log(`   Users:       5`);
  console.log(`   Vehicles:    ${vehicles.length}`);
  console.log(`   Drivers:     ${drivers.length}`);
  console.log(`   Trips:       ${tripRows.length}`);
  console.log(`   Maintenance: ${maintenanceRows.length}`);
  console.log(`   Fuel logs:   ${fuelRows.length}`);
  console.log(`   Expenses:    ${expenseRows.length}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
