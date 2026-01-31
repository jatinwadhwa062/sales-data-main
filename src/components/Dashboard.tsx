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
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      {/* Modern Executive Header */}
      <header className="bg-gradient-to-r from-[#0d1f3d] to-[#1a3a5c] shadow-lg py-4 px-6 flex-shrink-0 sticky top-0 z-50">
        <div className="max-w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0d6efd] to-[#0a58ca] rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Sales Sample Data Dashboard</h1>
                <p className="text-xs text-blue-200 font-medium">Professional Analytics & Insights</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg shadow-md transition-all text-sm font-semibold"
              title="Export filtered data as CSV"
            >
              <FileDown size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-[#0d1f3d] rounded-lg shadow-md transition-all text-sm font-semibold"
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
        <aside className={`${sidebarCollapsed ? 'w-0' : 'w-72'} transition-all duration-300 ease-in-out bg-white border-r border-gray-200 shadow-sm relative flex-shrink-0 overflow-hidden`}>
          <div className={`${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 h-full flex flex-col`}>
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0d6efd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900">Filters</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
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
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-12 bg-white border border-gray-200 rounded-r-lg shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            {sidebarCollapsed ? <ChevronRight size={16} className="text-gray-600" /> : <ChevronLeft size={16} className="text-gray-600" />}
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fc] p-8">
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
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">Sales Trend Analysis</h2>
                <p className="text-sm text-gray-500 mt-1">Revenue performance over time</p>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart: Product Line Composition */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                  {categoryColumns[2] && salesColumn && (
                    <DistributionPieChart
                      data={aggregateByCategory(filteredData, categoryColumns[2].name, salesColumn.name)}
                      title="Product Line Composition"
                    />
                  )}
                </div>
                {/* Bar Chart: Sales by Status */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
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
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Top Cities / Territories by Sales</h3>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
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
