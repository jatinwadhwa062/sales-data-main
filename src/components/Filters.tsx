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
    <div className="space-y-5">
      {/* Year Filter */}
      {availableYears.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Year
          </label>
          <select
            value={selectedFilters.selectedYear || ''}
            onChange={(e) => onYearChange?.(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-[#0d6efd] focus:border-[#0d6efd] focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/20 transition-all font-medium"
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
        <div key={categoryName} className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            {categoryName}
          </label>
          <select
            value={selectedFilters.categories[categoryName] || ''}
            onChange={(e) => onFilterChange(categoryName, e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-[#0d6efd] focus:border-[#0d6efd] focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/20 transition-all font-medium"
          >
            <option value="">All {categoryName}</option>
            {values.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      ))}

      {/* Reset Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0d6efd] to-[#0a58ca] text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset all filters"
        >
          <RotateCcw size={16} />
          Reset All Filters
        </button>
      </div>
    </div>
  );
};
