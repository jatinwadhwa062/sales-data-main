import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber, formatCurrency } from '../utils/formatters';

interface ChartData {
  [key: string]: any;
}

interface BaseChartProps {
  data: ChartData[];
  title: string;
}

// Textile-inspired soft color palette - Pinterest aesthetic
const COLORS = [
  '#B91C4C', // Maroon (Classic Cars)
  '#2563EB', // Soft Blue (Trucks/Buses)
  '#10B981', // Emerald (Motorcycles)
  '#F59E0B', // Amber (Trains)
  '#7C3AED', // Soft Purple (Ships)
  '#EC4899', // Rose (Planes)
  '#14B8A6', // Teal (Vintage)
];

const tooltipStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  padding: '12px',
};

export const TrendLineChart = ({ data, title }: BaseChartProps) => {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const yearlyData = data.reduce((acc: any[], item: any) => {
    const dateStr = item.date?.toString() || '';
    const yearMatch = dateStr.match(/(\d{4})$/);
    const year = yearMatch ? yearMatch[1] : 'Unknown';

    const existing = acc.find(d => d.date === year);
    if (existing) {
      existing.value += item.value;
    } else {
      acc.push({ date: year, value: item.value });
    }
    return acc;
  }, []);

  const monthlyData = data;
  const displayData = viewMode === 'year' ? yearlyData : monthlyData;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">Track revenue trends by period</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all ${
              viewMode === 'month'
                ? 'bg-[#0d6efd] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all ${
              viewMode === 'year'
                ? 'bg-[#0d6efd] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={displayData} margin={{ top: 20, right: 30, left: 60, bottom: 50 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B91C4C" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#B91C4C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: '500' }}
            angle={0}
            textAnchor="middle"
            height={50}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: '500' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `$${formatNumber(value)}`}
            width={80}
          />
          <Tooltip
            formatter={(value: any) => [formatCurrency(value), 'Sales Revenue']}
            contentStyle={{ ...tooltipStyle, fontSize: '13px' }}
            cursor={{ stroke: '#B91C4C', strokeWidth: 2, strokeDasharray: '5 5', opacity: 0.3 }}
            labelStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#B91C4C"
            strokeWidth={3}
            dot={{ fill: '#B91C4C', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2, fill: '#B91C4C' }}
            name="Sales"
            fill="url(#salesGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryBarChart = ({ data, title }: BaseChartProps) => {
  const limitedData = data.slice(0, 10);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Performance by location</p>
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={limitedData} margin={{ top: 20, right: 40, left: 100, bottom: 30 }} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: '500' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `$${formatNumber(value)}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: '500' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            width={90}
          />
          <Tooltip
            formatter={(value: any) => [formatCurrency(value), 'Sales']}
            contentStyle={{ ...tooltipStyle, fontSize: '13px' }}
            cursor={{ fill: 'rgba(37, 99, 235, 0.08)' }}
            labelStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}
          />
          <Bar
            dataKey="value"
            fill="#2563EB"
            name="Sales"
            radius={[0, 8, 8, 0]}
            maxBarSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ColumnChart = ({ data, title }: BaseChartProps) => {
  const limitedData = data.slice(0, 8);
  const maxValue = Math.max(...limitedData.map(d => d.value));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Breakdown by status</p>
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={limitedData} margin={{ top: 30, right: 30, left: 60, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: '500' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            angle={0}
            textAnchor="middle"
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: '500' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `$${formatNumber(value)}`}
            width={80}
          />
          <Tooltip
            formatter={(value: any) => [formatCurrency(value), 'Sales']}
            contentStyle={{ ...tooltipStyle, fontSize: '13px' }}
            cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
            labelStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}
          />
          <Bar
            dataKey="value"
            name="Sales"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          >
            {limitedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value === maxValue ? '#10B981' : '#94A3B8'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DistributionPieChart = ({ data, title }: BaseChartProps) => {
  const limitedData = data.slice(0, 6);
  const total = limitedData.reduce((sum, entry) => sum + entry.value, 0);

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${percent}%`;
  };

  const LEGEND_DATA = limitedData.map((item, index) => ({
    value: item.name,
    type: 'circle',
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Revenue distribution by product</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Pie
            data={limitedData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={3}
            dataKey="value"
            label={(entry) => renderLabel(entry)}
            labelLine={{
              stroke: '#9ca3af',
              strokeWidth: 1,
            }}
          >
            {limitedData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => {
              const percent = ((value / total) * 100).toFixed(1);
              return [formatCurrency(value), `${percent}%`];
            }}
            contentStyle={{ ...tooltipStyle, fontSize: '13px' }}
            labelStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
