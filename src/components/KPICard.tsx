import {
  DollarSign,
  Package,
  TrendingUp,
  MapPin,
  Star,
  Database,
} from 'lucide-react';
import { KPIMetric } from '../types/dashboard';

const iconMap = {
  'dollar-sign': DollarSign,
  'package': Package,
  'trending-up': TrendingUp,
  'map-pin': MapPin,
  'star': Star,
  'database': Database,
};

// Textile-inspired color schemes with soft, elegant palette
const colorSchemes: Record<string, { icon: string; bg: string; gradient: string; }> = {
  'dollar-sign': { icon: 'text-[#2563EB]', bg: 'bg-blue-50', gradient: 'from-blue-500 to-indigo-600' },
  'package': { icon: 'text-[#10B981]', bg: 'bg-emerald-50', gradient: 'from-emerald-500 to-teal-600' },
  'trending-up': { icon: 'text-[#10B981]', bg: 'bg-green-50', gradient: 'from-green-500 to-emerald-600' },
  'map-pin': { icon: 'text-[#F59E0B]', bg: 'bg-amber-50', gradient: 'from-amber-500 to-orange-600' },
  'star': { icon: 'text-[#7C3AED]', bg: 'bg-purple-50', gradient: 'from-purple-500 to-pink-600' },
  'database': { icon: 'text-[#6B7280]', bg: 'bg-gray-50', gradient: 'from-gray-500 to-slate-600' },
};

interface KPICardProps {
  metric: KPIMetric;
}

export const KPICard = ({ metric }: KPICardProps) => {
  const Icon = iconMap[metric.icon as keyof typeof iconMap] || DollarSign;
  const scheme = colorSchemes[metric.icon as keyof typeof colorSchemes] || colorSchemes['database'];
  const isTotalSales = metric.label?.toLowerCase().includes('total sales');

  return (
    <div
      className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-7 flex flex-col h-full min-h-[160px] group ${
        isTotalSales ? 'ring-2 ring-blue-400 ring-offset-2' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${scheme.bg} shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${scheme.icon}`} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
          {metric.label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-gray-900 leading-none">
            {metric.value}
          </span>
          {metric.trend && (
            <span
              className={`text-sm font-bold ${
                metric.trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {metric.trend > 0 ? '↑' : '↓'} {Math.abs(metric.trend)}%
            </span>
          )}
        </div>
        {metric.subtitle && (
          <p className="text-xs text-gray-600 mt-2 font-medium">{metric.subtitle}</p>
        )}
      </div>
    </div>
  );
};
