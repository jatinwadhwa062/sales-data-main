/**
 * Format numbers consistently in millions for BI dashboard
 * Standardized to millions notation (M) for all values
 * Examples: 10030000 -> "10.03M", 1080000 -> "1.08M", 500000 -> "0.50M"
 */
export const formatNumber = (value: number): string => {
  if (value === 0) return '0';

  const absValue = Math.abs(value);
  const isNegative = value < 0;
  const sign = isNegative ? '-' : '';

  // Always format in millions for consistency
  const millions = absValue / 1000000;
  const formatted = millions.toFixed(2);
  return sign + formatted + 'M';
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
