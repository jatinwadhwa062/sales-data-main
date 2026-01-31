import { X, RotateCcw, Filter } from 'lucide-react';
import { FilterState } from '../types/dashboard';

interface FiltersProps {
  categories: Record<string, string[]>;
  availableYears?: string[];
  selectedFilters: FilterState;
  onFilterChange: (category: string, value: string) => void;
  onYearChange?: (year: string) => void;
  onReset: () => void;
}

export const Filters = ({
  categories,
  availableYears = [],
  selectedFilters,
  onFilterChange,
  onYearChange,
  onReset,
}: FiltersProps) => {
  const hasActiveFilters = selectedFilters.selectedYear || Object.values(selectedFilters.categories).some(v => v);

  return (
    <aside className="w-full max-w-xs min-w-[220px] flex flex-col h-full bg-white border-r border-gray-200 shadow-md rounded-r-2xl p-6 space-y-6">
      <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
        {/* Year Filter */}
        {availableYears.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Year</label>
            <select
              value={selectedFilters.selectedYear || ''}
              onChange={(e) => onYearChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-blue-400 focus:border-blue-600 focus:outline-none transition-all font-medium shadow-sm"
            >
              <option value="">All</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category Filters */}
          {Object.entries(categories).map(([categoryName, values]) => (
            <div key={categoryName} className="flex flex-col gap-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">{categoryName}</label>
              <select
                value={selectedFilters.categories[categoryName] || ''}
                onChange={(e) => onFilterChange(categoryName, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-blue-400 focus:border-blue-600 focus:outline-none transition-all font-medium shadow-sm"
              >
                <option value="">All</option>
                {values.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {/* Prominent Reset Button at bottom */}
        <div className="pt-4 mt-auto">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold shadow-md hover:from-blue-700 hover:to-blue-600 transition-all text-base"
            title="Reset all filters"
          >
            <RotateCcw size={18} />
            Reset Filters
          </button>
        </div>
      </aside>
    );
};
