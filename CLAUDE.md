# Claude Development Guidelines

This document outlines best practices and requirements when working with Claude (AI assistant) on this project.

## Project Context

This is an Omada Identity Cloud prototype: **Assisted Ownership Transfer**

## Key Files

- **src/data/*.json** - Mock data files (modify to change displayed data)
- **src/components/** - React components
- **src/App.js** - Main application setup with theme and FilterProvider

## Component Library

This project uses `@omada/prototype-components` which provides:

- **FilterBar** - Top filter bar with status tabs, search, AI Actions, Bulk Actions
- **GroupHeader** - Collapsible group headers
- **CompactRecommendationCard** - AI recommendation displays
- **FilterProvider & useFilters** - Filter state management
- **omadaTheme** - Omada Identity Cloud theme
- **Utility functions** - groupByField, searchItems, etc.

See the [component library docs](https://github.com/OmadaIdentity/omada-prototype-toolkit/tree/main/packages/components) for full API.

## Common Tasks

### Adding New Data Fields

1. Update the JSON data file in `src/data/`
2. Update the table columns in your component
3. Update filters if needed using `useFilters` from the component library

### Creating the Main Table

1. Create `src/components/MainTable.jsx`
2. Import components from `@omada/prototype-components`:
   ```jsx
   import {
     FilterBar,
     useFilters,
     groupByField,
     searchItems
   } from '@omada/prototype-components';
   ```
3. Use the `useFilters` hook for filter state
4. Render FilterBar with appropriate handlers

### Modifying Filters

Filters are managed by the `FilterProvider` from the component library. Use the `useFilters` hook:

```jsx
const {
  filters,
  setSearch,
  setStatus,
  setGroupBy,
  selectedResources,
  toggleSelection,
  selectAll,
  clearSelection
} = useFilters();
```

### Working with AI Recommendations

Use utility functions from the component library:

```jsx
import {
  generateRecommendation,
  filterByRecommendation,
  getRecommendationStats
} from '@omada/prototype-components';
```

## Coding Standards

- Use functional React components with hooks
- Use Material-UI components for UI
- Import from `@omada/prototype-components` for shared functionality
- Keep components focused and reasonably sized
- Use the omadaTheme from the component library

## Documentation Updates

When adding new functionality, update:
- This file (CLAUDE.md) with new context
- README.md with feature descriptions
- instructions/instructions.md with implementation details
