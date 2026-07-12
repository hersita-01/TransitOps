ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_odometer_check" CHECK ("odometer" >= 0);
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_acquisitionCost_check" CHECK ("acquisitionCost" >= 0);

ALTER TABLE "Driver" ADD CONSTRAINT "Driver_safetyScore_check" CHECK ("safetyScore" >= 0 AND "safetyScore" <= 100);

ALTER TABLE "Trip" ADD CONSTRAINT "Trip_cargoWeight_check" CHECK ("cargoWeight" > 0);
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_plannedDistance_check" CHECK ("plannedDistance" > 0);
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_actualDistance_check" CHECK ("actualDistance" >= 0);
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_fuelUsed_check" CHECK ("fuelUsed" >= 0);

ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_cost_check" CHECK ("cost" >= 0);

ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_liters_check" CHECK ("liters" > 0);
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_cost_check" CHECK ("cost" >= 0);

ALTER TABLE "Expense" ADD CONSTRAINT "Expense_amount_check" CHECK ("amount" >= 0);