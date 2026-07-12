import React from 'react';
import { Truck, Activity, CheckCircle, XCircle, Route, Fuel, DollarSign, Settings, BarChart, Clock, Users } from 'lucide-react';

interface AnalyticsKPIsProps {
  metrics: {
    totalFleetSize: number;
    fleetUtilization: number;
    totalCompleted: number;
    cancelledCount: number;
    avgTripDistance: number;
    fuelEfficiency: number;
    fuelCost: number;
    maintCost: number;
    operationalCost: number;
    driverUtilization: number;
    inMaint: number;
  };
}

export function AnalyticsKPIs({ metrics }: AnalyticsKPIsProps): React.JSX.Element {
  
  const cards = [
    { title: 'Total Fleet Size', value: metrics.totalFleetSize, icon: Truck, color: 'blue' },
    { title: 'Fleet Utilization', value: `${metrics.fleetUtilization.toFixed(1)}%`, icon: Activity, color: 'emerald' },
    { title: 'Completed Trips', value: metrics.totalCompleted, icon: CheckCircle, color: 'blue' },
    { title: 'Cancelled Trips', value: metrics.cancelledCount, icon: XCircle, color: 'red' },
    { title: 'Avg Trip Dist.', value: `${metrics.avgTripDistance.toFixed(0)} km`, icon: Route, color: 'purple' },
    { title: 'Fuel Efficiency', value: `${metrics.fuelEfficiency.toFixed(2)} km/L`, icon: Fuel, color: 'amber' },
    { title: 'Fuel Cost (Mo)', value: `$${metrics.fuelCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, color: 'amber' },
    { title: 'Maintenance Cost', value: `$${metrics.maintCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Settings, color: 'slate' },
    { title: 'Operational Cost', value: `$${metrics.operationalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: BarChart, color: 'emerald' },
    { title: 'In Maintenance', value: metrics.inMaint, icon: Clock, color: 'orange' },
    { title: 'Driver Utilization', value: `${metrics.driverUtilization.toFixed(1)}%`, icon: Users, color: 'indigo' },
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'emerald': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'red': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'purple': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'amber': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'slate': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      case 'orange': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'indigo': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 mb-8">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const colorClasses = getColorClasses(c.color);
        return (
          <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${colorClasses}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">{c.title}</p>
            </div>
            <p className="text-xl font-bold text-slate-200">{c.value}</p>
          </div>
        );
      })}
    </div>
  );
}
