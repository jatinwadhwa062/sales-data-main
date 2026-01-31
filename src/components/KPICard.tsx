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

const colorSchemes: Record<string, { icon: string; bg: string; }> = {
  'dollar-sign': { icon: 'text-[#0d6efd]', bg: 'bg-blue-50' },
  'package': { icon: 'text-[#10b981]', bg: 'bg-green-50' },
  'trending-up': { icon: 'text-[#10b981]', bg: 'bg-green-50' },
  'map-pin': { icon: 'text-[#f59e0b]', bg: 'bg-orange-50' },
  'star': { icon: 'text-[#8b5cf6]', bg: 'bg-purple-50' },
  'database': { icon: 'text-[#6b7280]', bg: 'bg-gray-50' },
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
      className={`relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col h-full min-h-[140px] ${
        isTotalSales ? 'ring-2 ring-[#0d6efd]/30' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${scheme.bg}`}>
          <Icon className={`w-5 h-5 ${scheme.icon}`} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          {metric.label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 leading-none">
            {metric.value}
          </span>
          {metric.trend && (
            <span
              className={`text-xs font-semibold ${
                metric.trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {metric.trend > 0 ? '↑' : '↓'} {Math.abs(metric.trend)}%
            </span>
          )}
        </div>
        {metric.subtitle && (
          <p className="text-xs text-gray-500 mt-1.5">{metric.subtitle}</p>
        )}
      </div>
    </div>
  );
};
