/**
 * Format large numbers with K, M, B notation for Indian numbering system
 * Examples: 2000 -> "2k", 1000000 -> "1M", 5000000 -> "50L", 1000000000 -> "1B"
 */
export const formatNumber = (value: number): string => {
  if (value === 0) return '0';
  
  const absValue = Math.abs(value);
  const isNegative = value < 0;
  const sign = isNegative ? '-' : '';

  // Billions
  if (absValue >= 1000000000) {
    const formatted = (absValue / 1000000000).toFixed(1);
    return sign + (formatted.endsWith('.0') ? Math.floor(parseFloat(formatted)) : formatted) + 'B';
  }

  // Crores (10 million)
  if (absValue >= 10000000) {
    const formatted = (absValue / 10000000).toFixed(1);
    return sign + (formatted.endsWith('.0') ? Math.floor(parseFloat(formatted)) : formatted) + 'Cr';
  }

  // Millions
  if (absValue >= 1000000) {
    const formatted = (absValue / 1000000).toFixed(1);
    return sign + (formatted.endsWith('.0') ? Math.floor(parseFloat(formatted)) : formatted) + 'M';
  }

  // Lakhs (100,000)
  if (absValue >= 100000) {
    const formatted = (absValue / 100000).toFixed(1);
    return sign + (formatted.endsWith('.0') ? Math.floor(parseFloat(formatted)) : formatted) + 'L';
  }

  // Thousands
  if (absValue >= 1000) {
    const formatted = (absValue / 1000).toFixed(1);
    return sign + (formatted.endsWith('.0') ? Math.floor(parseFloat(formatted)) : formatted) + 'k';
  }

  return sign + absValue.toFixed(0);
};

/**
 * Format number with currency symbol for tooltips
 */
export const formatCurrency = (value: number): string => {
  return '$' + formatNumber(value);
};

/**
 * Format number with percentage
 */
export const formatPercentage = (value: number): string => {
  return value.toFixed(1) + '%';
};
