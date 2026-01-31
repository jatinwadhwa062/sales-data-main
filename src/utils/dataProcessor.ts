import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';
import { CleanedData, DataColumn } from '../types/dashboard';

export const parseFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    // Check if it's an Excel file
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.type.includes('spreadsheet')) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellDates: true, // Convert date cells to JS Date objects
            dateNF: 'yyyy-mm-dd' // Format for date parsing
          });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          
          // Get the range to process headers and detect date columns
          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
          const dateColumns = new Set<string>();
          
          // Detect which columns contain dates by checking the first few rows
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const header = XLSX.utils.encode_col(C) + '1';
            const headerCell = worksheet[header];
            const headerName = headerCell?.v?.toString() || '';
            
            // Check if column header suggests it's a date column
            if (headerName.toLowerCase().includes('date') || 
                headerName.toLowerCase().includes('order') ||
                headerName.toLowerCase().includes('time')) {
              dateColumns.add(headerName);
            }
          }
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            defval: ''
          });
          
          // Post-process to ensure dates are properly converted
          const processedData = jsonData.map((row: any) => {
            const newRow: any = {};
            Object.entries(row).forEach(([key, value]) => {
              if (dateColumns.has(key) && value instanceof Date) {
                // Convert Date object to ISO string
                newRow[key] = value.toISOString().split('T')[0];
              } else if (dateColumns.has(key) && typeof value === 'number') {
                // Handle Excel serial date numbers
                // Excel dates: days since 1900-01-01 (or 1904-01-01 for Mac)
                const excelEpoch = new Date(1899, 11, 30); // Excel's epoch
                const jsDate = new Date(excelEpoch.getTime() + value * 86400000);
                newRow[key] = jsDate.toISOString().split('T')[0];
              } else {
                newRow[key] = value;
              }
            });
            return newRow;
          });
          
          resolve(processedData);
        } catch (error) {
          reject(new Error(`Failed to parse Excel file: ${error}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      // Handle CSV files with PapaParse
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    }
  });
};

const cleanDateString = (value: string): string => {
  // Remove trailing 'p' or 'c' characters and trim whitespace
  let cleaned = value.trim();
  // Remove trailing p or c (case insensitive) that might be artifact characters
  cleaned = cleaned.replace(/\s*[pc]\s*$/i, '').trim();
  // Remove trailing time if present (e.g., "17:00", "5:30 PM")
  cleaned = cleaned.replace(/\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]\.?m\.?)?$/i, '').trim();
  return cleaned;
};

const isValidYear = (year: number): boolean => {
  // Only accept years between 2000 and current year + 5 years (for sales forecasts)
  const currentYear = new Date().getFullYear();
  return year >= 2000 && year <= currentYear + 5;
};

const detectDateFormats = (value: string): DateTime | null => {
  const cleaned = cleanDateString(value);
  
  const formats = [
    // ISO and standard formats
    'yyyy-MM-dd',
    'yyyy/MM/dd',
    'yyyy-MM',
    // DD/MM/YYYY formats
    'dd/MM/yyyy',
    'dd/MM/yy',
    'dd-MM-yyyy',
    'dd-MM-yy',
    // MM/DD/YYYY formats (US style)
    'MM/dd/yyyy',
    'MM/dd/yy',
    'MM-dd-yyyy',
    'MM-dd-yy',
    // MM/YYYY formats
    'MM/yyyy',
    'MM-yyyy',
    // Other common formats
    'dd.MM.yyyy',
    'yyyy.MM.dd',
    // Day Month Year text formats (e.g., "11 may 2002", "11 May 2002")
    'dd MMMM yyyy',
    'dd MMM yyyy',
    'd MMMM yyyy',
    'd MMM yyyy',
    'ISO',
  ];

  for (const format of formats) {
    let dt: DateTime | null = null;

    if (format === 'ISO') {
      dt = DateTime.fromISO(cleaned);
    } else {
      try {
        dt = DateTime.fromFormat(cleaned, format);
      } catch (e) {
        dt = null;
      }
    }

    if (dt && dt.isValid && isValidYear(dt.year)) {
      return dt;
    }
  }

  // Try parsing as standard Date (handles various formats)
  try {
    const timestamp = Date.parse(cleaned);
    if (!isNaN(timestamp) && timestamp > 0) {
      const dt = DateTime.fromMillis(timestamp);
      if (dt.isValid && isValidYear(dt.year)) {
        return dt;
      }
    }
  } catch (e) {
    // Continue to next attempt
  }

  return null;
};

const inferColumnType = (values: any[]): 'date' | 'number' | 'category' | 'text' => {
  const sampleSize = Math.min(50, values.length);
  const sample = values.slice(0, sampleSize).filter(v => v !== null && v !== undefined && v !== '');

  if (sample.length === 0) return 'text';

  let dateCount = 0;
  let numberCount = 0;
  let uniqueValues = new Set(sample);

  for (const value of sample) {
    const strValue = String(value).trim();

    if (detectDateFormats(strValue)) {
      dateCount++;
    }

    const numValue = Number(strValue.replace(/[$,]/g, ''));
    if (!isNaN(numValue) && strValue !== '') {
      numberCount++;
    }
  }

  if (dateCount / sample.length > 0.7) return 'date';
  if (numberCount / sample.length > 0.8) return 'number';
  if (uniqueValues.size < sample.length * 0.5 && uniqueValues.size < 20) return 'category';

  return 'text';
};

const cleanValue = (value: any, type: string): any => {
  if (value === null || value === undefined || value === '') {
    switch (type) {
      case 'number':
        return 0;
      case 'category':
      case 'text':
        return 'Unknown';
      case 'date':
        return null;
      default:
        return value;
    }
  }

  const strValue = String(value).trim();

  switch (type) {
    case 'number':
      const cleaned = strValue.replace(/[$,]/g, '');
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;

    case 'date':
      const dt = detectDateFormats(strValue);
      // Convert to "MMM yyyy" format (e.g., "Feb 2002", "Mar 2024")
      return dt ? dt.toFormat('MMM yyyy') : null;

    case 'category':
      return strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase();

    default:
      return strValue;
  }
};

export const performEDA = (rawData: any[]): CleanedData => {
  const warnings: string[] = [];

  if (rawData.length === 0) {
    throw new Error('No data found in file');
  }

  const columnNames = Object.keys(rawData[0]);

  const columnsData: Record<string, any[]> = {};
  columnNames.forEach(name => {
    columnsData[name] = rawData.map(row => row[name]);
  });

  const columns: DataColumn[] = columnNames.map(name => {
    const values = columnsData[name];
    const type = inferColumnType(values);

    return {
      name,
      type,
      values: values.map(v => cleanValue(v, type)),
    };
  });

  // Filter out rows with invalid dates (null/invalid date values from date columns)
  const dateColumns = columns.filter(col => col.type === 'date');
  let rowsToProcess = rawData.map((_, index) => index);
  
  if (dateColumns.length > 0) {
    const invalidDateRows = new Set<number>();
    dateColumns.forEach(dateCol => {
      dateCol.values.forEach((value, idx) => {
        // Mark rows where date is null or doesn't match expected format
        if (value === null || value === undefined) {
          invalidDateRows.add(idx);
        }
      });
    });
    
    if (invalidDateRows.size > 0) {
      rowsToProcess = rowsToProcess.filter(idx => !invalidDateRows.has(idx));
      if (invalidDateRows.size > 0) {
        warnings.push(`Removed ${invalidDateRows.size} rows with invalid or missing dates`);
      }
    }
  }

  const uniqueRows = new Map<string, Record<string, any>>();

  rowsToProcess.forEach((index) => {
    const cleanedRow: Record<string, any> = {};

    columns.forEach(col => {
      cleanedRow[col.name] = col.values[index];
    });

    const rowKey = JSON.stringify(cleanedRow);
    if (!uniqueRows.has(rowKey)) {
      uniqueRows.set(rowKey, cleanedRow);
    }
  });

  const rows = Array.from(uniqueRows.values());

  if (rawData.length !== rows.length) {
    warnings.push(`Removed ${rawData.length - rows.length} duplicate rows`);
  }

  columns.forEach(col => {
    const nullCount = col.values.filter(v => v === null || v === 0 || v === 'Unknown').length;
    if (nullCount > 0) {
      warnings.push(`Column "${col.name}": ${nullCount} missing values filled with defaults`);
    }
  });

  return {
    columns,
    rows,
    originalRowCount: rawData.length,
    cleanedRowCount: rows.length,
    warnings,
  };
};

export const checkDatasetSize = (file: File): { isLarge: boolean; message?: string } => {
  const sizeMB = file.size / (1024 * 1024);

  if (sizeMB > 1) {
    return {
      isLarge: true,
      message: `Dataset is large (${sizeMB.toFixed(2)} MB). Front-end processing may be slow. Consider using a backend for better performance.`,
    };
  }

  return { isLarge: false };
};
