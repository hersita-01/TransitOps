import { PrismaClient, Role, VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@transitops.in' },
    update: {},
    create: { name: 'Ravi Kumar', email: 'admin@transitops.in', password: 'hashedpassword', role: Role.ADMIN }
  });

  const dispatcher = await prisma.user.upsert({
    where: { email: 'dispatcher@transitops.in' },
    update: {},
    create: { name: 'Priya Sharma', email: 'dispatcher@transitops.in', password: 'hashedpassword', role: Role.DISPATCHER }
  });

  const fleetManager = await prisma.user.upsert({
    where: { email: 'fleet@transitops.in' },
    update: {},
    create: { name: 'Anil Desai', email: 'fleet@transitops.in', password: 'hashedpassword', role: Role.FLEET_MANAGER }
  });

  const safetyOfficer = await prisma.user.upsert({
    where: { email: 'safety@transitops.in' },
    update: {},
    create: { name: 'Vikram Singh', email: 'safety@transitops.in', password: 'hashedpassword', role: Role.SAFETY_OFFICER }
  });

  const finance = await prisma.user.upsert({
    where: { email: 'finance@transitops.in' },
    update: {},
    create: { name: 'Neha Gupta', email: 'finance@transitops.in', password: 'hashedpassword', role: Role.FINANCE }
  });

  // Vehicles
  const v1 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'TN-01-AB-1234' },
    update: {},
    create: { registrationNumber: 'TN-01-AB-1234', model: 'Tata Signa', type: 'Truck', capacity: 15000, odometer: 45000, acquisitionCost: 2500000, status: VehicleStatus.ON_TRIP }
  });

  const v2 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'KA-05-XY-9876' },
    update: {},
    create: { registrationNumber: 'KA-05-XY-9876', model: 'Ashok Leyland Dost', type: 'LCV', capacity: 3000, odometer: 12000, acquisitionCost: 800000, status: VehicleStatus.AVAILABLE }
  });

  const v3 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'MH-12-CD-5678' },
    update: {},
    create: { registrationNumber: 'MH-12-CD-5678', model: 'BharatBenz 2823C', type: 'Truck', capacity: 28000, odometer: 85000, acquisitionCost: 3500000, status: VehicleStatus.IN_SHOP }
  });

  const v4 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'DL-01-EF-4321' },
    update: {},
    create: { registrationNumber: 'DL-01-EF-4321', model: 'Mahindra Bolero Pickup', type: 'Pickup', capacity: 1500, odometer: 56000, acquisitionCost: 750000, status: VehicleStatus.AVAILABLE }
  });

  const v5 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'AP-09-GH-2468' },
    update: {},
    create: { registrationNumber: 'AP-09-GH-2468', model: 'Eicher Pro 2049', type: 'Truck', capacity: 5000, odometer: 150000, acquisitionCost: 1200000, status: VehicleStatus.RETIRED }
  });

  const v6 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'TS-07-IJ-1357' },
    update: {},
    create: { registrationNumber: 'TS-07-IJ-1357', model: 'Tata Prima', type: 'Trailer', capacity: 40000, odometer: 120000, acquisitionCost: 4500000, status: VehicleStatus.ON_TRIP }
  });

  const v7 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'KL-01-KL-9753' },
    update: {},
    create: { registrationNumber: 'KL-01-KL-9753', model: 'Tata Ace Gold', type: 'Mini Truck', capacity: 750, odometer: 8000, acquisitionCost: 500000, status: VehicleStatus.AVAILABLE }
  });

  const v8 = await prisma.vehicle.upsert({
    where: { registrationNumber: 'GJ-01-MN-8642' },
    update: {},
    create: { registrationNumber: 'GJ-01-MN-8642', model: 'Ashok Leyland Bada Dost', type: 'LCV', capacity: 3500, odometer: 25000, acquisitionCost: 900000, status: VehicleStatus.AVAILABLE }
  });

  // Drivers
  const d1 = await prisma.driver.upsert({
    where: { licenseNumber: 'TN-2010-0012345' },
    update: {},
    create: { name: 'Muthu Kumar', licenseNumber: 'TN-2010-0012345', category: 'Heavy', expiryDate: new Date('2028-12-31'), contact: '9876543210', safetyScore: 4.8, status: DriverStatus.ON_TRIP }
  });

  const d2 = await prisma.driver.upsert({
    where: { licenseNumber: 'KA-2015-0098765' },
    update: {},
    create: { name: 'Ramesh Gowda', licenseNumber: 'KA-2015-0098765', category: 'Light', expiryDate: new Date('2026-06-30'), contact: '9876543211', safetyScore: 4.2, status: DriverStatus.AVAILABLE }
  });

  const d3 = await prisma.driver.upsert({
    where: { licenseNumber: 'MH-2008-0056789' },
    update: {},
    create: { name: 'Sanjay Patil', licenseNumber: 'MH-2008-0056789', category: 'Heavy', expiryDate: new Date('2025-10-15'), contact: '9876543212', safetyScore: 3.5, status: DriverStatus.OFF_DUTY }
  });

  const d4 = await prisma.driver.upsert({
    where: { licenseNumber: 'DL-2012-0043210' },
    update: {},
    create: { name: 'Rajesh Verma', licenseNumber: 'DL-2012-0043210', category: 'Light', expiryDate: new Date('2027-01-20'), contact: '9876543213', safetyScore: 4.9, status: DriverStatus.AVAILABLE }
  });

  const d5 = await prisma.driver.upsert({
    where: { licenseNumber: 'AP-2018-0024680' },
    update: {},
    create: { name: 'Kiran Reddy', licenseNumber: 'AP-2018-0024680', category: 'Heavy', expiryDate: new Date('2029-03-10'), contact: '9876543214', safetyScore: 4.0, status: DriverStatus.SUSPENDED }
  });

  const d6 = await prisma.driver.upsert({
    where: { licenseNumber: 'TS-2014-0013579' },
    update: {},
    create: { name: 'Venkatesh Rao', licenseNumber: 'TS-2014-0013579', category: 'Heavy', expiryDate: new Date('2026-11-25'), contact: '9876543215', safetyScore: 4.6, status: DriverStatus.ON_TRIP }
  });

  const d7 = await prisma.driver.upsert({
    where: { licenseNumber: 'KL-2019-0097531' },
    update: {},
    create: { name: 'Biju Nair', licenseNumber: 'KL-2019-0097531', category: 'Light', expiryDate: new Date('2028-05-15'), contact: '9876543216', safetyScore: 4.4, status: DriverStatus.AVAILABLE }
  });

  const d8 = await prisma.driver.upsert({
    where: { licenseNumber: 'GJ-2016-0086420' },
    update: {},
    create: { name: 'Amit Patel', licenseNumber: 'GJ-2016-0086420', category: 'Light', expiryDate: new Date('2027-08-05'), contact: '9876543217', safetyScore: 4.7, status: DriverStatus.AVAILABLE }
  });

  // Trips
  await prisma.trip.create({
    data: { vehicleId: v1.id, driverId: d1.id, source: 'Chennai', destination: 'Bengaluru', cargoWeight: 14000, plannedDistance: 350, actualDistance: 355, fuelUsed: 120, status: TripStatus.COMPLETED, startTime: new Date('2023-10-01T08:00:00Z'), endTime: new Date('2023-10-01T16:00:00Z') }
  });

  await prisma.trip.create({
    data: { vehicleId: v1.id, driverId: d1.id, source: 'Bengaluru', destination: 'Hyderabad', cargoWeight: 12000, plannedDistance: 570, status: TripStatus.DISPATCHED, startTime: new Date('2023-10-25T09:00:00Z') }
  });

  await prisma.trip.create({
    data: { vehicleId: v6.id, driverId: d6.id, source: 'Mumbai', destination: 'Pune', cargoWeight: 38000, plannedDistance: 150, status: TripStatus.DISPATCHED, startTime: new Date('2023-10-26T10:00:00Z') }
  });

  await prisma.trip.create({
    data: { vehicleId: v2.id, driverId: d2.id, source: 'Delhi', destination: 'Gurugram', cargoWeight: 2000, plannedDistance: 35, status: TripStatus.DRAFT, startTime: new Date('2023-11-01T08:00:00Z') }
  });

  await prisma.trip.create({
    data: { vehicleId: v4.id, driverId: d4.id, source: 'Kolkata', destination: 'Howrah', cargoWeight: 1000, plannedDistance: 20, status: TripStatus.CANCELLED, startTime: new Date('2023-10-15T08:00:00Z') }
  });

  // Maintenance
  await prisma.maintenance.create({
    data: { vehicleId: v3.id, serviceType: 'Engine Overhaul', description: 'Complete engine check and repair', cost: 150000, status: MaintenanceStatus.OPEN, startDate: new Date('2023-10-20T10:00:00Z') }
  });

  await prisma.maintenance.create({
    data: { vehicleId: v1.id, serviceType: 'Oil Change', description: 'Routine oil and filter change', cost: 5000, status: MaintenanceStatus.COMPLETED, startDate: new Date('2023-09-15T10:00:00Z'), endDate: new Date('2023-09-15T14:00:00Z') }
  });

  // Fuel Logs
  await prisma.fuelLog.create({
    data: { vehicleId: v1.id, liters: 100, cost: 9500, date: new Date('2023-09-30T18:00:00Z') }
  });

  await prisma.fuelLog.create({
    data: { vehicleId: v6.id, liters: 250, cost: 23750, date: new Date('2023-10-25T18:00:00Z') }
  });

  // Expenses
  await prisma.expense.create({
    data: { vehicleId: v1.id, category: 'Toll', amount: 1500, description: 'Chennai-Bengaluru Highway Tolls', date: new Date('2023-10-01T12:00:00Z') }
  });

  await prisma.expense.create({
    data: { vehicleId: v6.id, category: 'Insurance', amount: 45000, description: 'Annual Premium', date: new Date('2023-01-15T10:00:00Z') }
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
