# Assisted Ownership Transfer - Implementation Instructions

## Overview

[Describe what this prototype demonstrates]

## Data Structure

### items.json

Required fields:
- `id` (string): Unique identifier
- `name` (string): Display name
- `status` (string): One of: pending, approved, rejected
- `category` (string): Item category

Add domain-specific fields as needed.

## Components to Implement

### MainTable Component

Location: `src/components/MainTable.jsx`

Requirements:
1. Import FilterBar and useFilters from `@omada/prototype-components`
2. Load data from `src/data/items.json`
3. Apply filters using the useFilters hook
4. Render FilterBar component
5. Display data in Material-UI Table or DataGrid
6. Support grouping using groupByField utility
7. Show AI recommendations using CompactRecommendationCard

Example structure:
```jsx
import React, { useState } from 'react';
import { FilterBar, useFilters, groupByField } from '@omada/prototype-components';
import itemsData from '../data/items.json';

function MainTable() {
  const { filters, getSelectedIds, getSelectedCount } = useFilters();
  const [items, setItems] = useState(itemsData);

  // Apply filters
  const filteredItems = items.filter(item => {
    // Filter logic here
  });

  // Group if needed
  const groups = filters.groupBy !== 'none'
    ? groupByField(filteredItems, filters.groupBy)
    : { 'All Items': filteredItems };

  return (
    <Box>
      <FilterBar
        selectedCount={getSelectedCount()}
        statusCounts={{ all: items.length, pending: 10, approved: 5, rejected: 3 }}
        onSelectAll={() => { /* ... */ }}
        onClearSelection={() => { /* ... */ }}
      />
      {/* Render table/groups */}
    </Box>
  );
}
```

## Features to Implement

1. **Table Display**
   - Show all items from items.json
   - Sortable columns
   - Row selection

2. **Filtering**
   - Status filtering via FilterBar tabs
   - Text search
   - Category filtering

3. **Grouping**
   - Support grouping by category, identity, system
   - Use GroupHeader for group display
   - Collapsible groups

4. **Bulk Actions**
   - Select multiple items
   - Approve/reject selected items
   - Update item status

5. **AI Recommendations** (optional)
   - Generate recommendations for items
   - Display using CompactRecommendationCard
   - AI Actions menu integration

## Testing

1. Verify all filters work correctly
2. Test grouping functionality
3. Verify bulk actions update data
4. Check responsive layout
5. Test selection/deselection

## Next Steps

1. Implement MainTable component
2. Add domain-specific data fields
3. Customize recommendation logic if needed
4. Add additional components as required
5. Update README with completed features
