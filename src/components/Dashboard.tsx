import { useMemo, useState } from 'react';
import { Home, Menu, X, FileJson } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col font-sans">
      {/* Premium Executive Header */}
      <header className="bg-[#0d2240] shadow-lg py-4 px-6 flex-shrink-0 sticky top-0 z-50 border-b border-blue-900">
        <div className="max-w-full flex items-center justify-between">
          {/* Left: Logo, Title, Subtitle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-blue-900/20 rounded-lg transition-colors text-white"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                <span className="sr-only">Logo</span>📊
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">Sales Sample Data Dashboard</h1>
                <p className="text-sm text-blue-200 font-medium -mt-1">Professional Analytics & Insights</p>
              </div>
            </div>
          </div>
          {/* Right: Export and Home buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow transition-colors text-base font-bold border-2 border-green-600"
              title="Export filtered data as CSV"
            >
              <FileJson size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-100 text-blue-900 rounded-xl shadow transition-colors text-base font-bold border-2 border-blue-900"
              >
                <Home size={20} />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className={`fixed lg:static inset-0 lg:inset-auto z-30 transition-all duration-300 ${
          sidebarOpen ? 'left-0' : 'left-full lg:left-0'
        }`}>
          {sidebarOpen && (
            <div
              className="absolute inset-0 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className="relative w-80 lg:w-72 bg-white border-r border-gray-200 overflow-y-auto shadow-lg lg:shadow-none h-full lg:h-auto">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔍</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
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
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 space-y-8">
          {/* Data Quality Alert */}
          {data.warnings.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-xl">ℹ️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">Data Quality Report</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {data.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Key Performance Indicators */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
              <p className="text-sm text-gray-500 mt-2">Core metrics and KPIs at a glance</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {kpis.map((metric, idx) => (
                <div key={idx} className="transition-transform duration-300 hover:scale-105">
                  <KPICard metric={metric} />
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Analytics & Visualizations - Executive Layout */}
          <section className="w-full max-w-7xl mx-auto mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">Sales Trend Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Sales Trend by Order Date (Monthly/Yearly)</p>
            </div>
            {/* Large Trend Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-100">
              {dateColumns.length > 0 && salesColumn && (
                <TrendLineChart
                  data={aggregateByDate(filteredData, dateColumns[0].name, salesColumn.name)}
                  title={`Sales Trend by ${dateColumns[0].name}`}
                />
              )}
            </div>

            {/* Donut and Bar Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Donut Chart: Product Line Composition */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col justify-center">
                {categoryColumns[2] && salesColumn && (
                  <DistributionPieChart
                    data={aggregateByCategory(filteredData, categoryColumns[2].name, salesColumn.name)}
                    title="Product Line Composition"
                  />
                )}
              </div>
              {/* Bar Chart: Sales by Status */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col justify-center">
                {categoryColumns[1] && salesColumn && (
                  <ColumnChart
                    data={aggregateByCategory(filteredData, categoryColumns[1].name, salesColumn.name)}
                    title={`Sales Distribution by ${categoryColumns[1].name}`}
                  />
                )}
              </div>
            </div>

            {/* Bottom: Top Cities/Territories by Sales */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Cities/Territories by Sales</h3>
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {categoryColumns[0] && salesColumn && (
                  <CategoryBarChart
                    data={aggregateByCategory(filteredData, categoryColumns[0].name, salesColumn.name)}
                    title={`Top ${categoryColumns[0].name}s by Sales`}
                  />
                )}
              </div>
            </div>

            {/* Collapsible detailed table (optional, placeholder) */}
            <div className="mt-10">
              <details className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700">Show Raw Data Table (Drill-down)</summary>
                <div className="mt-4 text-gray-400 text-xs italic">(Paginated, exportable table placeholder – implement as needed)</div>
              </details>
            </div>
          </section>

          {/* Footer Spacing */}
          <div className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
