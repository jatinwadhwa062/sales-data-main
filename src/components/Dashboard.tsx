import { useMemo, useState } from 'react';
import { Home, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CleanedData, FilterState } from '../types/dashboard';
import { calculateKPIs, aggregateByCategory, aggregateByDate } from '../utils/metrics';
import { KPICard } from './KPICard';
import { TrendLineChart, CategoryBarChart, ColumnChart, DistributionPieChart } from './Charts';
import { Filters } from './Filters';

interface DashboardProps {
  data: CleanedData;
  description: string;
  fileSize?: number;
  dataType?: string | null;
  onBack?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  data,
  description,
  onBack,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: {},
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const categoryColumns = data.columns.filter(col => col.type === 'category');
  const dateColumns = data.columns.filter(col => col.type === 'date');
  const numericColumns = data.columns.filter(col => col.type === 'number');

  const availableYears = useMemo(() => {
    if (dateColumns.length === 0) return [];
    const dateCol = dateColumns[0];
    const yearSet = new Set<string>();
    dateCol.values.forEach(dateStr => {
      if (dateStr && typeof dateStr === 'string') {
        const match = dateStr.match(/(\d{4})$/);
        if (match) {
          yearSet.add(match[1]);
        }
      }
    });
    return Array.from(yearSet).sort().reverse();
  }, [dateColumns]);

  const availableFilters = useMemo(() => {
    const filterOptions: Record<string, string[]> = {};
    categoryColumns.forEach(col => {
      const uniqueValues = Array.from(new Set(col.values.filter(v => v && v !== 'Unknown')));
      if (uniqueValues.length > 0 && uniqueValues.length < 50) {
        filterOptions[col.name] = uniqueValues.sort();
      }
    });
    return filterOptions;
  }, [categoryColumns]);

  const filteredData = useMemo(() => {
    let rows = data.rows;

    if (filters.selectedYear && dateColumns.length > 0) {
      rows = rows.filter(row => {
        const dateStr = row[dateColumns[0].name];
        if (!dateStr) return false;
        return dateStr.toString().endsWith(filters.selectedYear);
      });
    }

    if (!Object.values(filters.categories).every(v => !v)) {
      rows = rows.filter(row => {
        return Object.entries(filters.categories).every(([category, value]) => {
          if (!value) return true;
          return row[category] === value;
        });
      });
    }

    return {
      ...data,
      rows,
      cleanedRowCount: rows.length,
    };
  }, [data, filters, dateColumns]);

  const kpis = useMemo(() => calculateKPIs(filteredData, description), [filteredData, description]);

  const salesColumn = numericColumns.find(
    col => col.name.toLowerCase().includes('sales') ||
           col.name.toLowerCase().includes('revenue') ||
           col.name.toLowerCase().includes('amount')
  );

  const handleFilterChange = (category: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value,
      },
    }));
  };

  const handleYearChange = (year: string) => {
    setFilters(prev => ({
      ...prev,
      selectedYear: year || undefined,
    }));
  };

  const handleResetFilters = () => {
    setFilters({ categories: {} });
  };

  const exportData = () => {
    const csv = [
      Object.keys(filteredData.rows[0]).join(','),
      ...filteredData.rows.map(row =>
        Object.values(row).map(v => `"${v}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${description.replace(/\s+/g, '_')}_filtered_data.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col font-sans">
      {/* Textile-inspired Executive Header */}
      <header className="bg-gradient-to-r from-[#1e3a5f] via-[#2c5282] to-[#1e3a5f] shadow-xl py-4 px-6 flex-shrink-0 sticky top-0 z-50 border-b-2 border-[#3b82f6]">
        <div className="max-w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">Sales Sample Data Dashboard</h1>
                <p className="text-xs text-blue-100 font-medium">Textiles Analytics & Insights</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-sm font-semibold hover:-translate-y-0.5 duration-200"
              title="Export filtered data as CSV"
            >
              <FileDown size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-[#1e3a5f] rounded-xl shadow-lg hover:shadow-xl transition-all text-sm font-semibold hover:-translate-y-0.5 duration-200"
              >
                <Home size={18} />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Fixed Left Sidebar - Filters */}
        <aside className={`${sidebarCollapsed ? 'w-0' : 'w-80'} transition-all duration-300 ease-in-out bg-gradient-to-b from-white to-gray-50 border-r-2 border-gray-200 shadow-lg relative flex-shrink-0 overflow-hidden`}>
          <div className={`${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 h-full flex flex-col`}>
            <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <Filters
                onFilterChange={handleFilterChange}
                onYearChange={handleYearChange}
                onReset={handleResetFilters}
                selectedFilters={filters}
                categories={availableFilters}
                availableYears={availableYears}
              />
            </div>
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white rounded-r-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center"
          >
            {sidebarCollapsed ? <ChevronRight size={18} className="text-white" /> : <ChevronLeft size={18} className="text-white" />}
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#FAFBFC] p-8">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Top 4 KPI Cards - Uniform & Clean */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpis.slice(0, 4).map((metric) => (
                  <KPICard key={metric.id} metric={metric} />
                ))}
              </div>
            </section>

            {/* Large Sales Trend Chart */}
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  Sales Trend Overview
                </h2>
                <p className="text-sm text-gray-600 mt-2 ml-6">Revenue performance over time with monthly/yearly breakdown</p>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-2 border-gray-200 p-10">
                {dateColumns.length > 0 && salesColumn && (
                  <TrendLineChart
                    data={aggregateByDate(filteredData, dateColumns[0].name, salesColumn.name)}
                    title={`Sales Trend by ${dateColumns[0].name}`}
                  />
                )}
              </div>
            </section>

            {/* Two Side-by-Side Charts */}
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                  Performance Breakdown
                </h2>
                <p className="text-sm text-gray-600 mt-2 ml-6">Product composition and status distribution analysis</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                {/* Donut Chart: Product Line Composition */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-2 border-gray-200 p-10">
                  {categoryColumns[2] && salesColumn && (
                    <DistributionPieChart
                      data={aggregateByCategory(filteredData, categoryColumns[2].name, salesColumn.name)}
                      title="Product Line Composition"
                    />
                  )}
                </div>
                {/* Bar Chart: Sales by Status */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-2 border-gray-200 p-10">
                  {categoryColumns[1] && salesColumn && (
                    <ColumnChart
                      data={aggregateByCategory(filteredData, categoryColumns[1].name, salesColumn.name)}
                      title={`Sales Distribution by ${categoryColumns[1].name}`}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Bottom: Top Cities/Territories */}
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
                  Top Performers
                </h2>
                <p className="text-sm text-gray-600 mt-2 ml-6">Highest revenue generating territories and locations</p>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-2 border-gray-200 p-10">
                {categoryColumns[0] && salesColumn && (
                  <CategoryBarChart
                    data={aggregateByCategory(filteredData, categoryColumns[0].name, salesColumn.name)}
                    title={`Top ${categoryColumns[0].name}s by Sales`}
                  />
                )}
              </div>
            </section>

            {/* Data Quality Info */}
            {data.warnings.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 text-sm mb-2">Data Quality Report</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {data.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
