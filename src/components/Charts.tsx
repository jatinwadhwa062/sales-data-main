import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

const COLORS = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'];

const tooltipStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '2px solid #E5E7EB',
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
};

export const TrendLineChart = ({ data, title }: BaseChartProps) => {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('year');

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

  const renderDataLabel = (props: any) => {
    const { x, y, value } = props;
    if (!value && value !== 0) return null;
    const formatted = formatNumber(value);
    return (
      <text
        x={x}
        y={y - 12}
        fill="#1F2937"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
      >
        {formatted}
      </text>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 text-[9px] rounded-md font-semibold transition-all ${ viewMode === 'month' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`px-3 py-1.5 text-[9px] rounded-md font-semibold transition-all ${ viewMode === 'year' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={displayData} margin={{ top: 25, right: 20, left: 0, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            style={{ fontSize: '11px', fontWeight: '500' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis hide={true} />
          <Tooltip
            formatter={(value: any) => [formatCurrency(value), 'Sales']}
            contentStyle={{ ...tooltipStyle, fontSize: '12px' }}
            cursor={{ stroke: '#D1D5DB', strokeWidth: 1 }}
            labelStyle={{ color: '#1F2937', fontWeight: 'bold', fontSize: '12px' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#DC2626"
            strokeWidth={3}
            dot={{ fill: '#DC2626', r: 4 }}
            activeDot={{ r: 6 }}
            name="Sales"
            isAnimationActive={false}
            label={viewMode === 'year' ? renderDataLabel : false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryBarChart = ({ data, title }: BaseChartProps) => {
  const limitedData = data.slice(0, 8);

  const renderDataLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (!value && value !== 0) return null;
    const formatted = formatNumber(value);
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#1F2937"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
      >
        {formatted}
      </text>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={limitedData} margin={{ top: 30, right: 20, left: 0, bottom: 70 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            style={{ fontSize: '11px', fontWeight: '500' }}
            angle={-45}
            textAnchor="end"
            height={90}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis hide={true} />
          <Tooltip
            formatter={(value: any) => [formatCurrency(value), 'Sales']}
            contentStyle={{ ...tooltipStyle, fontSize: '12px' }}
            cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
            labelStyle={{ color: '#1F2937', fontWeight: 'bold', fontSize: '12px' }}
          />
          <Bar 
            dataKey="value" 
            fill="#F59E0B" 
            name="Sales" 
            radius={[10, 10, 0, 0]}
            isAnimationActive={false}
            label={renderDataLabel}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ColumnChart = ({ data, title }: BaseChartProps) => {
  const limitedData = data.slice(0, 8);

  const renderDataLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (!value && value !== 0) return null;
    const formatted = formatNumber(value);
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#1F2937"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
      >
        {formatted}
      </text>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={limitedData} margin={{ top: 30, right: 20, left: 0, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            style={{ fontSize: '11px', fontWeight: '500' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis hide={true} />
          <Tooltip
            formatter={(value: any) => [formatCurrency(value), 'Sales']}
            contentStyle={{ ...tooltipStyle, fontSize: '12px' }}
            cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
            labelStyle={{ color: '#1F2937', fontWeight: 'bold', fontSize: '12px' }}
          />
          <Bar 
            dataKey="value" 
            fill="#3B82F6" 
            name="Sales" 
            radius={[8, 8, 0, 0]}
            isAnimationActive={false}
            label={renderDataLabel}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DistributionPieChart = ({ data, title }: BaseChartProps) => {
  const limitedData = data.slice(0, 5);
  const total = limitedData.reduce((sum, entry) => sum + entry.value, 0);

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${percent}%`;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <Pie
            data={limitedData}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={65}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={(entry) => renderLabel(entry)}
            labelLine={false}
            isAnimationActive={false}
          >
            {limitedData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                opacity={0.85}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => {
              const percent = ((value / total) * 100).toFixed(1);
              return [formatCurrency(value), `${percent}%`];
            }}
            contentStyle={{ ...tooltipStyle, fontSize: '12px' }}
            labelStyle={{ color: '#1F2937', fontWeight: 'bold', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
