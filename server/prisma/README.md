# TransitOps Database Layer

This directory contains the Prisma schema, migrations, and seed data for the TransitOps backend.

## Entity Relationships

The schema is built around the following core entities:
- **User**: System users with Role-Based Access Control (RBAC). Roles include `ADMIN`, `DISPATCHER`, `FLEET_MANAGER`, `SAFETY_OFFICER`, and `FINANCE`.
- **Vehicle**: The trucks and light commercial vehicles in the fleet.
- **Driver**: The individuals driving the vehicles.
- **Trip**: A record of a journey, linking a `Vehicle` and a `Driver` (many-to-one).
- **Maintenance**: Records of vehicle repairs or service (linked to `Vehicle`).
- **FuelLog**: Fuel consumption tracking (linked to `Vehicle`).
- **Expense**: Associated operational costs like tolls or insurance (linked to `Vehicle`).

## Business Rules & Constraints

1. **Safety Constraints**: `vehicleId` and `driverId` relationships use `onDelete: Restrict` to prevent accidental deletion of resources that have history.
2. **Precision**: All financial costs, fuel amounts, and distances use `Decimal` with specific precision (e.g., `@db.Decimal(10, 2)`) to avoid floating point errors.
3. **Analytics Preparedness**: Appropriate indexes (`@@index`) are placed on frequently filtered fields like `status`, `date`, `startTime`, and `endTime` to ensure fast aggregation queries for KPIs.

## Common Commands

To format your schema:
```bash
npx prisma format
```

To validate the schema:
```bash
npx prisma validate
```

To generate the Prisma Client:
```bash
npx prisma generate
# or using npm
npm run prisma:generate
```

## How to Migrate

If you make changes to `schema.prisma`, you need to generate a new migration:
```bash
npx prisma migrate dev --name <descriptive_name>
# or using npm
npm run prisma:migrate -- --name <descriptive_name>
```

To check migration status against your current database:
```bash
npx prisma migrate status
```

## How to Seed

The `seed.ts` file contains realistic demo data designed to populate the dashboard KPIs. To populate a fresh database, run:
```bash
npx prisma db seed
# or using npm
npm run prisma:seed
```

If you need to completely reset the database and re-seed it:
```bash
npm run db:reset
```
