import { CleanedData, KPIMetric } from '../types/dashboard';

export const calculateKPIs = (data: CleanedData, description: string): KPIMetric[] => {
  const kpis: KPIMetric[] = [];

  const salesColumn = data.columns.find(
    col => col.name.toLowerCase().includes('sales') ||
           col.name.toLowerCase().includes('revenue') ||
           col.name.toLowerCase().includes('amount')
  );

  const quantityColumn = data.columns.find(
    col => col.name.toLowerCase().includes('quantity') ||
           col.name.toLowerCase().includes('qty') ||
           col.name.toLowerCase().includes('units')
  );

  const regionColumn = data.columns.find(
    col => col.name.toLowerCase().includes('region') ||
           col.name.toLowerCase().includes('country') ||
           col.name.toLowerCase().includes('city')
  );

  const categoryColumn = data.columns.find(
    col => col.name.toLowerCase().includes('category') ||
           col.name.toLowerCase().includes('product') ||
           col.name.toLowerCase().includes('segment')
  );

  if (salesColumn && salesColumn.type === 'number') {
    const totalSales = data.rows.reduce((sum, row) => {
      const value = Number(row[salesColumn.name]) || 0;
      return sum + value;
    }, 0);
    
    if (totalSales > 0) {
      kpis.push({
        id: 'total-sales',
        label: 'Total Sales',
        value: `$${(totalSales / 1000000).toFixed(2)}M`,
        subtitle: 'Revenue generated',
        icon: 'dollar-sign',
      });
    }
  }

  if (quantityColumn && quantityColumn.type === 'number') {
    const totalQuantity = data.rows.reduce((sum, row) => {
      const value = Number(row[quantityColumn.name]) || 0;
      return sum + value;
    }, 0);
    
    if (totalQuantity > 0) {
      kpis.push({
        id: 'total-quantity',
        label: 'Total Quantity',
        value: totalQuantity.toLocaleString(),
        subtitle: 'Units sold',
        icon: 'package',
      });
    }
  }

  if (salesColumn && quantityColumn) {
    const totalSales = data.rows.reduce((sum, row) => {
      const value = Number(row[salesColumn.name]) || 0;
      return sum + value;
    }, 0);
    
    const totalQuantity = data.rows.reduce((sum, row) => {
      const value = Number(row[quantityColumn.name]) || 0;
      return sum + value;
    }, 0);
    
    const avgPrice = totalQuantity > 0 ? totalSales / totalQuantity : 0;
    
    if (avgPrice > 0) {
      kpis.push({
        id: 'avg-price',
        label: 'Average Price',
        value: `$${avgPrice.toFixed(2)}`,
        subtitle: 'Per unit',
        icon: 'trending-up',
      });
    }
  }

  if (regionColumn && salesColumn) {
    const regionSales: Record<string, number> = {};
    data.rows.forEach(row => {
      const region = row[regionColumn.name];
      const sales = Number(row[salesColumn.name]) || 0;
      regionSales[region] = (regionSales[region] || 0) + sales;
    });

    const topRegion = Object.entries(regionSales).sort((a, b) => b[1] - a[1])[0];
    if (topRegion) {
      kpis.push({
        id: 'top-region',
        label: `Best ${regionColumn.name}`,
        value: topRegion[0],
        subtitle: `$${(topRegion[1] / 1000000).toFixed(2)}M`,
        icon: 'map-pin',
      });
    }
  }

  if (categoryColumn && salesColumn) {
    const categorySales: Record<string, number> = {};
    data.rows.forEach(row => {
      const category = row[categoryColumn.name];
      const sales = Number(row[salesColumn.name]) || 0;
      categorySales[category] = (categorySales[category] || 0) + sales;
    });

    const topCategory = Object.entries(categorySales).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      kpis.push({
        id: 'top-category',
        label: `Top ${categoryColumn.name}`,
        value: topCategory[0],
        subtitle: `$${(topCategory[1] / 1000000).toFixed(2)}M revenue`,
        icon: 'star',
      });
    }
  }

  kpis.push({
    id: 'total-records',
    label: 'Total Records',
    value: data.cleanedRowCount.toLocaleString(),
    subtitle: 'Data points analyzed',
    icon: 'database',
  });

  return kpis.slice(0, 6);
};

export const aggregateByCategory = (
  data: CleanedData,
  categoryColumnName: string,
  valueColumnName: string,
  aggregation: 'sum' | 'count' | 'avg' = 'sum'
): Array<{ name: string; value: number }> => {
  const grouped: Record<string, number[]> = {};

  data.rows.forEach(row => {
    const category = row[categoryColumnName];
    const value = Number(row[valueColumnName]) || 0;

    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(value);
  });

  return Object.entries(grouped).map(([name, values]) => {
    let aggregatedValue: number;

    switch (aggregation) {
      case 'sum':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'count':
        aggregatedValue = values.length;
        break;
      case 'avg':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
    }

    return { name, value: aggregatedValue };
  }).sort((a, b) => b.value - a.value);
};

export const aggregateByDate = (
  data: CleanedData,
  dateColumnName: string,
  valueColumnName: string,
  period: 'month' | 'year' = 'month'
): Array<{ date: string; value: number }> => {
  const grouped: Record<string, number[]> = {};
  const monthNames: Record<string, number> = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };

  data.rows.forEach(row => {
    const dateStr = row[dateColumnName];
    // Skip null, undefined, or invalid date strings
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined') return;

    let periodKey: string;
    
    // If the date is in "MMM yyyy" format (e.g., "Feb 2024")
    if (period === 'month' && dateStr.match(/^[A-Z][a-z]{2}\s\d{4}$/)) {
      periodKey = dateStr; // Already in correct format
    } else if (period === 'year' && dateStr.match(/^[A-Z][a-z]{2}\s\d{4}$/)) {
      // Extract year from "MMM yyyy" format
      periodKey = dateStr.split(' ')[1];
    } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Handle ISO format (yyyy-MM-dd)
      const [year, month] = dateStr.split('-');
      const monthNum = parseInt(month);
      const monthName = Object.entries(monthNames).find(([_, num]) => num === monthNum)?.[0] || 'Jan';
      if (period === 'month') {
        periodKey = `${monthName} ${year}`;
      } else {
        periodKey = year;
      }
    } else {
      // Skip rows with unrecognized date formats
      return;
    }

    const value = Number(row[valueColumnName]) || 0;

    if (!grouped[periodKey]) {
      grouped[periodKey] = [];
    }
    grouped[periodKey].push(value);
  });

  return Object.entries(grouped)
    .map(([date, values]) => ({
      date,
      value: values.reduce((sum, val) => sum + val, 0),
    }))
    .sort((a, b) => {
      // Sort by date properly - handle "MMM yyyy" format
      if (a.date.match(/^[A-Z][a-z]{2}\s\d{4}$/) && b.date.match(/^[A-Z][a-z]{2}\s\d{4}$/)) {
        const [aMonth, aYear] = a.date.split(' ');
        const [bMonth, bYear] = b.date.split(' ');
        const aDate = parseInt(aYear) * 100 + monthNames[aMonth];
        const bDate = parseInt(bYear) * 100 + monthNames[bMonth];
        return aDate - bDate;
      }
      return a.date.localeCompare(b.date);
    });
};
