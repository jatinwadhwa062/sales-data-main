export interface DataColumn {
  name: string;
  type: 'date' | 'number' | 'category' | 'text';
  values: any[];
}

export interface CleanedData {
  columns: DataColumn[];
  rows: Record<string, any>[];
  originalRowCount: number;
  cleanedRowCount: number;
  warnings: string[];
}

export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: number[];
}

export interface FilterState {
  categories: Record<string, string>;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  selectedYear?: string;
}
