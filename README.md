# Assisted Ownership Transfer

An Omada Identity Cloud prototype built with React and @omada/prototype-components.

## Overview

This prototype demonstrates [describe key functionality here].

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## Features

- **Table View**: View all items in a sortable, filterable table
- **Filtering**: Filter by status, category, search text
- **Grouping**: Group items by identity, system, category, or AI recommendation
- **AI Recommendations**: AI-powered approve/reject suggestions with confidence levels
- **Bulk Actions**: Process multiple items at once
- **Column Visibility**: Show/hide columns as needed

## Project Structure

```
src/
├── components/           # React components
│   └── MainTable.jsx     # Main table component (create this)
├── data/
│   └── items.json        # Mock data
├── App.js                # Main application
└── index.js              # Entry point
```

## Using @omada/prototype-components

This project uses the `@omada/prototype-components` package for shared components:

```jsx
import {
  FilterBar,
  GroupHeader,
  CompactRecommendationCard,
  useFilters,
  omadaTheme,
  groupByField,
  searchItems
} from '@omada/prototype-components';
```

See the [component library documentation](https://github.com/OmadaIdentity/omada-prototype-toolkit/tree/main/packages/components) for more details.

## Data Files

### items.json

Contains the main data items. Each item should have:

- `id`: Unique identifier
- `name`: Display name
- `status`: Current status (pending, approved, rejected)
- `category`: Item category
- Add your specific fields as needed

## Next Steps

1. **Create MainTable Component**: Build your main table component in `src/components/MainTable.jsx`
2. **Add Data**: Update `src/data/items.json` with your mock data
3. **Customize**: Add domain-specific fields and logic
4. **Document**: Update this README with your specific features

## Technologies

- React 19
- Material-UI 7
- @omada/prototype-components
- Create React App

## Available Scripts

- `npm start` - Run development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Updating Components

To update to the latest version of @omada/prototype-components:

```bash
npm update @omada/prototype-components
```
