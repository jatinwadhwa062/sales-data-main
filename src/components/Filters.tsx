import { RotateCcw } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Year Filter */}
      {availableYears.length > 0 && (
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Year
          </label>
          <select
            value={selectedFilters.selectedYear || ''}
            onChange={(e) => onYearChange?.(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm bg-white hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium shadow-sm"
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      {/* Category Filters */}
      {Object.entries(categories).map(([categoryName, values]) => (
        <div key={categoryName} className="space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {categoryName}
          </label>
          <select
            value={selectedFilters.categories[categoryName] || ''}
            onChange={(e) => onFilterChange(categoryName, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm bg-white hover:border-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium shadow-sm"
          >
            <option value="">All {categoryName}</option>
            {values.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      ))}

      {/* Reset Button */}
      <div className="pt-6 border-t-2 border-gray-200">
        <button
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          title="Reset all filters"
        >
          <RotateCcw size={17} />
          Reset All Filters
        </button>
      </div>
    </div>
  );
};
