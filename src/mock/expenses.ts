import type { Expense, ExpenseCategory } from '@/types';

// Helper to generate a random mock expense
const generateExpenses = (count: number): Expense[] => {
  const expenses: Expense[] = [];
  const categories: ExpenseCategory[] = ['fuel', 'maintenance', 'insurance', 'tyres', 'repairs', 'tolls', 'permits', 'miscellaneous'];
  const vendors = {
    fuel: ['Shell', 'BP', 'Exxon', 'Chevron', 'Mobile'],
    maintenance: ['AutoZone', 'O-Reilly', 'NAPA Auto Parts', 'Pep Boys'],
    insurance: ['Geico Commercial', 'Progressive Fleet', 'State Farm'],
    tyres: ['Goodyear', 'Michelin', 'Discount Tire', 'Firestone'],
    repairs: ['Local Mechanic Shop', 'Dealer Service Center', 'Fleet Repair Inc'],
    tolls: ['E-ZPass', 'TollSmart', 'SunPass'],
    permits: ['DMV', 'State Transport Dept', 'City Council'],
    miscellaneous: ['Amazon', 'Walmart', 'Office Depot', 'Home Depot'],
  };

  const statuses: ('pending' | 'approved' | 'rejected')[] = ['approved', 'approved', 'approved', 'pending', 'pending', 'rejected'];

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const vendorList = vendors[category];
    const vendor = vendorList[Math.floor(Math.random() * vendorList.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate dates within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    // Vehicle ID 1-20 (80% chance) or null (20% chance)
    const hasVehicle = Math.random() > 0.2;
    const vehicleId = hasVehicle ? `veh_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}` : null;
    
    // Driver ID 1-25 (50% chance)
    const hasDriver = Math.random() > 0.5;
    const driverId = hasDriver ? `drv_${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}` : null;

    let amountUsd = 0;
    let description = '';

    switch (category) {
      case 'fuel':
        amountUsd = Math.floor(Math.random() * 200) + 50;
        description = `Diesel refill - ${Math.floor(amountUsd / 3.5)} gallons`;
        break;
      case 'maintenance':
        amountUsd = Math.floor(Math.random() * 500) + 100;
        description = 'Routine service and fluid checks';
        break;
      case 'insurance':
        amountUsd = Math.floor(Math.random() * 1000) + 500;
        description = 'Monthly fleet insurance premium';
        break;
      case 'tyres':
        amountUsd = Math.floor(Math.random() * 800) + 200;
        description = 'Replacement of worn tires';
        break;
      case 'repairs':
        amountUsd = Math.floor(Math.random() * 2000) + 300;
        description = 'Emergency repair due to breakdown';
        break;
      case 'tolls':
        amountUsd = Math.floor(Math.random() * 50) + 10;
        description = 'Interstate toll fees';
        break;
      case 'permits':
        amountUsd = Math.floor(Math.random() * 300) + 100;
        description = 'Annual state operating permit';
        break;
      case 'miscellaneous':
        amountUsd = Math.floor(Math.random() * 200) + 20;
        description = 'Office supplies and cleaning materials';
        break;
    }

    expenses.push({
      id: `exp_${String(i).padStart(3, '0')}`,
      vehicleId,
      driverId,
      tripId: null,
      category,
      amountUsd,
      vendor,
      description,
      date: date.toISOString(),
      receiptUrl: Math.random() > 0.3 ? `https://example.com/receipts/exp_${i}.pdf` : null,
      status,
      approvedBy: status === 'approved' ? 'Admin User' : null,
    });
  }

  // Sort descending by date
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const MOCK_EXPENSES = generateExpenses(50);
