# Sales Data Dashboard

A comprehensive, interactive web-based sales data analytics dashboard that automatically processes and visualizes your sales data with exploratory data analysis.

## Features

### Data Processing
- **Smart File Upload**: Drag-and-drop or click to upload CSV and Excel files
- **Automatic EDA**: Intelligent data cleaning, type detection, and normalization
- **Date Format Detection**: Automatically recognizes and standardizes various date formats
- **Missing Value Handling**: Fills missing values with sensible defaults
- **Duplicate Detection**: Identifies and removes duplicate records
- **Large Dataset Warning**: Alerts users when files exceed 1MB with performance recommendations

### Interactive Dashboard
- **Dynamic KPI Cards**: Automatically calculated key metrics including:
  - Total Sales
  - Total Quantity Sold
  - Average Price
  - Best Performing Region
  - Top Product Category
  - Total Records Analyzed

- **Professional Visualizations**:
  - **Line Charts**: Time-series trends for sales over time
  - **Bar Charts**: Category comparisons for regions, products, etc.
  - **Pie/Donut Charts**: Distribution breakdowns with percentages
  - All charts include tooltips, legends, and formatted values

- **Advanced Filtering**:
  - Dynamic filters based on categorical columns
  - Real-time dashboard updates
  - Filter tags with easy removal
  - Reset all filters button

- **Data Export**: Download filtered data as CSV

### Design
- **Professional Color Scheme**: Deep blues (#001F3F, #007BFF), greens (#28A745), reds (#DC3545)
- **Responsive Layout**: Works seamlessly on mobile, tablet, and desktop
- **WCAG Compliant**: High contrast ratios for accessibility
- **Modern UI**: Clean shadows, smooth animations, professional typography

## Getting Started

### Installation

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

1. **Upload Your Data**
   - Click "Choose File" or drag and drop a CSV/Excel file
   - Supported formats: .csv, .xlsx, .xls
   - Sample data file included: `sample-sales-data.csv`

2. **Describe Your Data**
   - Enter a description of what your data represents
   - Example: "Sales of textiles in global markets"
   - This customizes your dashboard title and labels

3. **Explore Your Dashboard**
   - View automatically calculated KPIs
   - Interact with charts (hover for details)
   - Apply filters to drill down into specific segments
   - Export filtered data for further analysis

## Expected Data Format

Your data should include columns such as:

- **Date columns**: Any format (dd/mm/yyyy, MM-dd-yy, yyyy-MM-dd, etc.)
- **Sales/Revenue/Amount columns**: Numeric values (supports $, commas)
- **Quantity columns**: Integer values
- **Category columns**: Product names, segments, categories
- **Region columns**: Countries, cities, regions
- **Customer columns**: Customer types, segments, etc.

The dashboard automatically detects column types and generates appropriate visualizations.

## Sample Data

A sample CSV file (`sample-sales-data.csv`) is included with 63 records covering:
- Product categories: Electronics, Textiles, Home Goods
- Regions: North America, Europe, Asia
- Customer types: Retail, Wholesale
- Date range: January - December 2024

Try it out to see the dashboard in action!

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **PapaParse** for CSV/Excel parsing
- **Luxon** for date handling
- **Lucide React** for icons

## Large Dataset Handling

For datasets larger than 1MB or 10,000 rows:

1. The application will display a warning about potential performance issues
2. Consider creating a backend for better performance:
   - Use Node.js with Express
   - Deploy for free on Render.com, Vercel, or Heroku
   - Store data in SQLite or in-memory
   - Create API endpoints for data aggregation

Example backend structure:
```javascript
// Backend endpoint
app.post('/api/upload', (req, res) => {
  // Process and clean data
  // Aggregate for KPIs
  // Return processed data
});

app.get('/api/dashboard', (req, res) => {
  // Apply filters
  // Return chart data
});
```

## Error Handling

The application handles common issues:
- Invalid file formats
- Empty files
- Missing or malformed data
- Invalid date formats
- Non-numeric values in numeric columns

Clear error messages guide users to resolve issues.

## Customization

To customize the dashboard:

1. **Colors**: Edit the color values in components (currently #001F3F, #007BFF, #28A745, etc.)
2. **Metrics**: Modify `src/utils/metrics.ts` to add custom KPIs
3. **Charts**: Add new chart types in `src/components/Charts.tsx`
4. **Filters**: Extend filter logic in `src/components/Dashboard.tsx`

## Performance Tips

- Keep CSV files under 1MB for optimal front-end performance
- Use aggregated data when possible
- Consider pagination for very large datasets
- Implement server-side processing for production use with large data

## License

This project is provided as-is for educational and commercial use.

## Support

For issues or questions, refer to the inline documentation and component comments.
