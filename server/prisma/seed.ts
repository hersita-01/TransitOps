import { PrismaClient, Role, VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Helpers
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomDecimal(min, max, precision = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(precision));
}

// Data pools
const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Ravi', 'Muthu', 'Sanjay', 'Rajesh', 'Amit', 'Anil', 'Vikram', 'Priya', 'Neha', 'Kiran', 'Venkatesh', 'Biju', 'Arjun', 'Rahul', 'Karthik', 'Suresh', 'Ramesh', 'Harish', 'Vijay', 'Manoj'];
const lastNames = ['Kumar', 'Sharma', 'Patil', 'Verma', 'Patel', 'Desai', 'Singh', 'Gupta', 'Reddy', 'Rao', 'Nair', 'Gowda', 'Iyer', 'Menon', 'Jain', 'Das', 'Bose', 'Yadav', 'Choudhury'];
const states = ['TN', 'KA', 'MH', 'DL', 'AP', 'TS', 'KL', 'GJ', 'WB', 'UP'];
const cities = ['Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore', 'Kochi', 'Vijayawada', 'Mumbai', 'Pune', 'Delhi', 'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'];
const vehicleModels = ['Tata Signa', 'Ashok Leyland Dost', 'BharatBenz 2823C', 'Mahindra Bolero Pickup', 'Eicher Pro 2049', 'Tata Prima', 'Tata Ace Gold', 'Ashok Leyland Bada Dost'];
const vehicleTypes = ['Truck', 'LCV', 'Trailer', 'Mini Truck', 'Pickup'];
const maintenanceServices = ['Engine Overhaul', 'Oil Change', 'Brake Replacement', 'Tire Alignment', 'Transmission Repair', 'Battery Replacement', 'General Service'];
const expenseCategories = ['Toll', 'Insurance', 'Repair', 'Permit', 'Parking', 'Washing'];

async function main() {
  console.log('Cleaning existing data...');
  // Wipe all data for idempotency
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding enterprise data...');

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  // 1. Users
  console.log('Creating users...');
  await prisma.user.createMany({
    data: [
      { name: 'Admin User', email: 'admin@transitops.in', password: 'hashedpassword', role: Role.ADMIN },
      { name: 'Dispatch Manager', email: 'dispatcher@transitops.in', password: 'hashedpassword', role: Role.DISPATCHER },
      { name: 'Fleet Controller', email: 'fleet@transitops.in', password: 'hashedpassword', role: Role.FLEET_MANAGER },
      { name: 'Safety Lead', email: 'safety@transitops.in', password: 'hashedpassword', role: Role.SAFETY_OFFICER },
      { name: 'Finance Head', email: 'finance@transitops.in', password: 'hashedpassword', role: Role.FINANCE },
    ]
  });

  // 2. Vehicles
  console.log('Creating vehicles...');
  const vehicles = [];

  for (let i = 0; i < 50; i++) {
    let status = VehicleStatus.AVAILABLE;
    if (i < 10) status = VehicleStatus.ON_TRIP;
    else if (i < 15) status = VehicleStatus.IN_SHOP;
    else if (i > 45) status = VehicleStatus.RETIRED;

    const state = randomItem(states);
    const code = String(randomInt(1, 99)).padStart(2, '0');
    const letters = String.fromCharCode(65 + randomInt(0, 25)) + String.fromCharCode(65 + randomInt(0, 25));
    const num = String(randomInt(1000, 9999));
    
    vehicles.push({
      registrationNumber: `${state}-${code}-${letters}-${num}`,
      model: randomItem(vehicleModels),
      type: randomItem(vehicleTypes),
      capacity: randomInt(1000, 40000),
      odometer: randomInt(5000, 200000),
      acquisitionCost: randomDecimal(500000, 5000000),
      status
    });
  }
  
  await prisma.vehicle.createMany({ data: vehicles });
  const createdVehicles = await prisma.vehicle.findMany();
  
  const onTripVehicles = createdVehicles.filter(v => v.status === VehicleStatus.ON_TRIP);
  const inShopVehicles = createdVehicles.filter(v => v.status === VehicleStatus.IN_SHOP);

  // 3. Drivers
  console.log('Creating drivers...');
  const drivers = [];
  
  for (let i = 0; i < 75; i++) {
    let status = DriverStatus.AVAILABLE;
    if (i < 10) status = DriverStatus.ON_TRIP;
    else if (i < 15) status = DriverStatus.OFF_DUTY;
    else if (i > 70) status = DriverStatus.SUSPENDED;

    const state = randomItem(states);
    
    drivers.push({
      name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      licenseNumber: `${state}-${randomInt(2000, 2024)}-${String(randomInt(1, 9999999)).padStart(7, '0')}`,
      category: randomItem(['Light', 'Heavy', 'Commercial']),
      expiryDate: randomDate(now, new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365 * 5)),
      contact: `98${String(randomInt(10000000, 99999999))}`,
      safetyScore: randomDecimal(2.5, 5.0),
      status
    });
  }

  await prisma.driver.createMany({ data: drivers });
  const createdDrivers = await prisma.driver.findMany();
  
  const onTripDrivers = createdDrivers.filter(d => d.status === DriverStatus.ON_TRIP);
  const availableDrivers = createdDrivers.filter(d => d.status === DriverStatus.AVAILABLE);

  // 4. Trips
  console.log('Creating trips...');
  const trips = [];
  
  // Create 10 active dispatched trips for ON_TRIP vehicles and drivers
  for (let i = 0; i < 10; i++) {
    const v = onTripVehicles[i];
    const d = onTripDrivers[i];
    
    let source = randomItem(cities);
    let dest = randomItem(cities);
    while(dest === source) dest = randomItem(cities);

    const plannedDist = randomDecimal(50, 1500);

    trips.push({
      vehicleId: v.id,
      driverId: d.id,
      source,
      destination: dest,
      cargoWeight: randomDecimal(100, v.capacity),
      plannedDistance: plannedDist,
      status: TripStatus.DISPATCHED,
      startTime: randomDate(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), now)
    });
  }

  // Create 240 past trips
  for (let i = 0; i < 240; i++) {
    const v = randomItem(createdVehicles);
    const d = randomItem(createdDrivers);
    
    let source = randomItem(cities);
    let dest = randomItem(cities);
    while(dest === source) dest = randomItem(cities);

    const plannedDist = randomDecimal(50, 1500);
    const isCompleted = Math.random() > 0.1; // 90% completed, 10% cancelled
    const startTime = randomDate(sixMonthsAgo, new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3));
    const endTime = new Date(startTime.getTime() + 1000 * 60 * 60 * Math.random() * 48); // up to 48 hours later

    if (isCompleted) {
      trips.push({
        vehicleId: v.id,
        driverId: d.id,
        source,
        destination: dest,
        cargoWeight: randomDecimal(100, v.capacity),
        plannedDistance: plannedDist,
        actualDistance: plannedDist * randomDecimal(0.95, 1.1),
        fuelUsed: plannedDist / randomDecimal(3, 10), // 3 to 10 kmpl
        status: TripStatus.COMPLETED,
        startTime,
        endTime
      });
    } else {
      trips.push({
        vehicleId: v.id,
        driverId: d.id,
        source,
        destination: dest,
        cargoWeight: randomDecimal(100, v.capacity),
        plannedDistance: plannedDist,
        status: TripStatus.CANCELLED,
        startTime
      });
    }
  }

  await prisma.trip.createMany({ data: trips });

  // 5. Maintenance
  console.log('Creating maintenance records...');
  const maintenance = [];

  // Active maintenance for IN_SHOP vehicles
  for (let i = 0; i < 5; i++) {
    const v = inShopVehicles[i];
    maintenance.push({
      vehicleId: v.id,
      serviceType: randomItem(maintenanceServices),
      description: 'Routine checks and active repairs',
      cost: randomDecimal(1000, 50000),
      status: Math.random() > 0.5 ? MaintenanceStatus.OPEN : MaintenanceStatus.IN_PROGRESS,
      startDate: randomDate(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5), now)
    });
  }

  // 75 Completed past maintenance records
  for (let i = 0; i < 75; i++) {
    const v = randomItem(createdVehicles);
    const startDate = randomDate(sixMonthsAgo, new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10));
    const endDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * randomInt(1, 5));
    
    maintenance.push({
      vehicleId: v.id,
      serviceType: randomItem(maintenanceServices),
      description: 'Completed scheduled service',
      cost: randomDecimal(1000, 100000),
      status: MaintenanceStatus.COMPLETED,
      startDate,
      endDate
    });
  }

  await prisma.maintenance.createMany({ data: maintenance });

  // 6. Fuel Logs
  console.log('Creating fuel logs...');
  const fuelLogs = [];
  for (let i = 0; i < 120; i++) {
    const v = randomItem(createdVehicles);
    const liters = randomDecimal(20, 200);
    const cost = liters * randomDecimal(90, 105); // Price of diesel/petrol
    
    fuelLogs.push({
      vehicleId: v.id,
      liters,
      cost,
      date: randomDate(sixMonthsAgo, now)
    });
  }
  
  await prisma.fuelLog.createMany({ data: fuelLogs });

  // 7. Expenses
  console.log('Creating expenses...');
  const expenses = [];
  for (let i = 0; i < 200; i++) {
    const v = randomItem(createdVehicles);
    expenses.push({
      vehicleId: v.id,
      category: randomItem(expenseCategories),
      amount: randomDecimal(100, 15000),
      description: 'Operational expense',
      date: randomDate(sixMonthsAgo, now)
    });
  }

  await prisma.expense.createMany({ data: expenses });

  console.log('Enterprise seed successfully applied!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
