import React from 'react';
import { Fuel, TrendingDown, TrendingUp, BarChart3, Activity } from 'lucide-react';
import type { Expense } from '@/types';

interface FuelSummaryCardsProps {
  expenses: Expense[];
}

export function FuelSummaryCards({ expenses }: FuelSummaryCardsProps): React.JSX.Element {
  
  const fuelExpenses = expenses.filter(e => e.category === 'fuel');
  
  const totalFuelCost = fuelExpenses.reduce((sum, e) => sum + e.amountUsd, 0);
  
  // Mock calculations for display
  const AVG_COST_PER_GALLON = 3.85; 
  const totalGallons = totalFuelCost / AVG_COST_PER_GALLON;
  
  // Assume average 15 miles per gallon for fleet
  const AVG_MPG = 15.2;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card 
        title="Total Fuel Cost" 
        value={`$${totalFuelCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        subtitle="Last 30 Days"
        icon={Fuel}
        trend="+4.2%"
        trendUp={true}
        color="blue"
      />
      <Card 
        title="Fuel Consumed" 
        value={`${Math.round(totalGallons).toLocaleString()} gal`}
        subtitle="Last 30 Days"
        icon={Activity}
        trend="-1.5%"
        trendUp={false}
        color="emerald"
      />
      <Card 
        title="Avg Cost / Gallon" 
        value={`$${AVG_COST_PER_GALLON.toFixed(2)}`}
        subtitle="Stable"
        icon={BarChart3}
        trend="0.0%"
        trendUp={false}
        color="amber"
      />
      <Card 
        title="Avg Fleet Mileage" 
        value={`${AVG_MPG} mpg`}
        subtitle="Across all vehicles"
        icon={TrendingUp}
        trend="+0.8%"
        trendUp={true}
        color="purple"
      />
    </div>
  );
}

function Card({ title, value, subtitle, icon: Icon, trend, trendUp, color }: { title: string; value: string; subtitle: string; icon: React.ElementType; trend: string; trendUp: boolean; color: string; }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex flex-col relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${colorMap[color].split(' ')[0].replace('text-', 'bg-')}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-slate-400 text-xs font-medium mb-1">{title}</h4>
        <p className="text-2xl font-bold text-slate-200">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
