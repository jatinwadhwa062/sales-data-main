# AI Code Generation Prompt Reference

This document provides a comprehensive prompt template for AI tools (Claude, Grok, ChatGPT, etc.) to build interactive sales data dashboards.

## Complete Prompt Template

```
Create a comprehensive, interactive web-based sales data dashboard application with the following specifications:

### Core Requirements

1. **File Upload System**
   - Support CSV, XLSX, and XLS files
   - Drag-and-drop interface
   - File validation and size checking
   - Large dataset warning (>1MB)

2. **Data Description Dialog**
   - Prompt user to describe their data
   - Use description to customize dashboard title
   - Professional modal/dialog design

3. **Automatic Exploratory Data Analysis (EDA)**
   - Parse files using PapaParse
   - Detect column types (date, number, category, text)
   - Handle multiple date formats:
     * yyyy-MM-dd, MM/dd/yyyy, dd/MM/yyyy
     * MM-dd-yy, dd-MM-yy, yyyy/MM/dd
     * ISO timestamps, yyyy-MM, MM/yyyy
   - Clean missing values:
     * Numbers → 0
     * Categories/Text → "Unknown"
     * Dates → null
   - Remove duplicates
   - Standardize date formats to ISO (YYYY-MM-DD)
   - Convert currency strings ($, commas) to numbers
   - Normalize category casing

4. **KPI Cards (4-6 metrics)**
   - Total Sales (formatted as $X.XXM)
   - Total Quantity Sold
   - Average Selling Price
   - Best Region/Country/City
   - Top Product Category
   - Total Records Analyzed
   - Each with icon, value, and subtitle

5. **Interactive Charts**
   Generate only where data supports it:
   - **Line Chart**: Sales trends over time (requires date + numeric column)
   - **Bar Charts**: Category comparisons (top 10 items)
   - **Pie/Donut Charts**: Distribution (limit to 5-7 slices)
   - All charts must have:
     * Descriptive titles
     * Axis labels and legends
     * Interactive tooltips
     * Smooth animations
     * Responsive sizing

6. **Filtering System**
   - Dynamic filters based on categorical columns
   - Dropdown selects for each category
   - Real-time dashboard updates
   - Filter tags with removal
   - Reset all filters button

7. **Professional Design**
   - Color scheme: Deep blues (#001F3F, #007BFF), grays (#F5F5F5, #333333)
   - Accent colors: Green (#28A745) for positive, Red (#DC3545) for negative
   - NO purple/indigo/violet colors
   - Responsive grid layout
   - Card-based design with shadows
   - WCAG compliant contrast ratios
   - Mobile-friendly breakpoints

8. **Export Functionality**
   - Download filtered data as CSV
   - Maintain all applied filters

9. **Error Handling**
   - Validate file format
   - Check for empty files
   - Handle malformed data gracefully
   - Show user-friendly error messages
   - Display data cleaning warnings

10. **Large Dataset Handling**
    - Detect files >1MB or >10,000 rows
    - Show warning with backend recommendations:
      * Node.js + Express server
      * Free hosting: Render.com, Vercel, Heroku
      * SQLite or in-memory storage
      * API endpoints for aggregation

### Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for charts (or Chart.js)
- PapaParse for CSV/Excel parsing
- Luxon (or Moment.js) for date handling
- Lucide React for icons

### File Structure

```
src/
├── components/
│   ├── FileUpload.tsx
│   ├── DescriptionDialog.tsx
│   ├── Dashboard.tsx
│   ├── KPICard.tsx
│   ├── Charts.tsx
│   ├── Filters.tsx
│   └── WarningBanner.tsx
├── utils/
│   ├── dataProcessor.ts
│   └── metrics.ts
├── types/
│   └── dashboard.ts
└── App.tsx
```

### Key Features to Implement

1. **Smart Type Detection**
   - Sample first 50 rows
   - 70% date matches → date type
   - 80% numeric matches → number type
   - <50% unique values and <20 unique → category type
   - Otherwise → text type

2. **Date Format Detection**
   - Try multiple formats sequentially
   - Fallback to Date.parse()
   - Return null if all fail

3. **Metric Calculation**
   - Auto-detect sales/revenue/amount columns
   - Auto-detect quantity columns
   - Auto-detect region/country columns
   - Auto-detect category/product columns
   - Calculate KPIs based on available columns

4. **Dynamic Chart Generation**
   - Only show line chart if date column exists
   - Generate bar charts for top categorical breakdowns
   - Show pie chart for distributions (limit slices)
   - Skip charts if required data is missing

5. **Filter Logic**
   - Only create filters for categories with <50 unique values
   - Apply filters to all visualizations simultaneously
   - Update KPIs based on filtered data

### User Flow

1. User lands on upload page
2. User selects/drops file → Size check → Warning if large
3. Description dialog appears → User enters description
4. Processing screen with spinner → EDA runs
5. Dashboard renders with:
   - Custom title from description
   - Data cleaning report
   - KPI cards
   - Filters (if applicable)
   - Charts (based on available data)
   - Export button

### Sample Data Format

```csv
Date,Product Category,Region,Sales Amount,Quantity,Customer Type
2024-01-15,Electronics,North America,12500.50,45,Retail
2024-01-18,Textiles,Europe,8750.25,120,Wholesale
...
```

### Error Messages to Include

- "No data found in file. Please check your file format."
- "All data was filtered out during cleaning. Please check your data quality."
- "Dataset is large (X MB). Front-end processing may be slow."
- "Column 'X': Y missing values filled with defaults"
- "Removed X duplicate rows"

### Accessibility Requirements

- All colors must have 4.5:1 contrast ratio minimum
- Interactive elements must have focus states
- Charts must have aria labels
- Form inputs must have labels
- Keyboard navigation support

### Performance Considerations

- Memoize expensive calculations (useMemo)
- Debounce filter updates if needed
- Lazy load charts if many visualizations
- Consider virtualization for large data tables

### Testing Scenarios

1. Empty file upload
2. File with all missing values
3. File with invalid dates
4. File with mixed date formats
5. File with currency strings ($1,234.56)
6. File with duplicate rows
7. Large file (>1MB)
8. CSV with only 2 columns
9. File with no date column
10. File with no numeric column

### Nice-to-Have Features

- Dark mode toggle
- Chart type switching
- Custom date range picker
- Drill-down interactions (click chart to filter)
- Save/load filter presets
- PDF export of dashboard
- Comparison mode (compare two time periods)

### Code Quality

- TypeScript for type safety
- Functional components with hooks
- Proper error boundaries
- Clean separation of concerns
- Reusable utility functions
- Commented complex logic
- Consistent naming conventions

Generate complete, production-ready code with all features implemented.
```

## Usage Instructions

1. Copy the prompt template above
2. Paste into your AI coding assistant
3. Adjust specifications as needed for your use case
4. The AI will generate a complete application

## Customization Points

To adapt for different use cases:

- **E-commerce**: Focus on product performance, conversion rates
- **Finance**: Emphasize revenue, profit margins, ROI
- **Operations**: Highlight efficiency metrics, throughput
- **Marketing**: Campaign performance, engagement metrics

Replace "sales" references with domain-specific terminology.

## Extending the Dashboard

To add new features, prompt with:

```
Add [feature] to the existing dashboard:
- [Specific requirements]
- [Integration points]
- [Expected behavior]

Ensure it follows the existing design system and architecture.
```

## Backend Integration Prompt

```
Create a Node.js Express backend for this dashboard with:
- POST /api/upload - Accept file, run EDA, return processed data
- GET /api/metrics - Return calculated KPIs
- POST /api/filter - Apply filters and return chart data
- Use SQLite for temporary storage
- Implement CORS for localhost:5173
- Deploy configuration for Render.com
```

## Common Issues and Solutions

1. **Charts not rendering**: Ensure data format matches expected structure
2. **Filters not working**: Check that filterState is properly passed down
3. **Large file crashes**: Implement streaming or chunked processing
4. **Date parsing fails**: Add more format patterns to detection logic
5. **Build size too large**: Code-split charts and use dynamic imports
