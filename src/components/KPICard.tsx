
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

  const colorSchemes: Record<string, { gradient: string; icon: string; bg: string; border: string }> = {
    'dollar-sign': { gradient: 'from-blue-600 to-blue-700', icon: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    'package': { gradient: 'from-green-600 to-green-700', icon: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    'trending-up': { gradient: 'from-emerald-600 to-emerald-700', icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'map-pin': { gradient: 'from-orange-600 to-orange-700', icon: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    'star': { gradient: 'from-purple-600 to-purple-700', icon: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    'database': { gradient: 'from-indigo-600 to-indigo-700', icon: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
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
        className={`relative group overflow-hidden rounded-2xl border ${scheme.border} bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full min-h-[120px] flex flex-col justify-between ${isTotalSales ? 'ring-2 ring-blue-500 scale-105 z-10' : ''}`}
        style={{ boxShadow: isTotalSales ? '0 8px 32px 0 rgba(0,123,255,0.10)' : undefined }}
      >
        {/* Subtle background accent */}
        <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

        {/* Animated corner accent */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${scheme.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header with icon and label */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                {metric.label}
              </p>
              {metric.subtitle && (
                <p className="text-xs text-gray-400 font-light mt-0.5">{metric.subtitle}</p>
              )}
            </div>
            <div className={`p-2 rounded-xl ${scheme.bg} group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-2`}>
              <Icon className={`w-6 h-6 ${scheme.icon}`} />
            </div>
          </div>

          {/* Metric Value */}
          <div className="flex items-end gap-2 mt-1">
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {metric.value}
            </span>
            {metric.trend && (
              <span className={`text-xs font-bold ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>{metric.trend > 0 ? '▲' : '▼'} {Math.abs(metric.trend)}%</span>
            )}
          </div>

          {/* Optional sparkline/progress bar */}
          {metric.progress !== undefined && (
            <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${metric.progress}%`, background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)' }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
