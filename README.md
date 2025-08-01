# QFC Employment Standards Office - Compliance Management System

A modern React application built with Vite and Ant Design for managing compliance reviews and employment standards.

## 🏗️ Project Structure

The project has been organized into a clean, scalable folder structure following React best practices:

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout-specific components
│   │   ├── Header.jsx   # Application header with logo and user info
│   │   ├── Sidebar.jsx  # Navigation sidebar
│   │   └── index.js     # Clean exports for layout components
│   └── ui/              # Reusable UI components
│       ├── PageHeader.jsx    # Consistent page headers
│       ├── ReviewCard.jsx    # Review display cards
│       ├── StatCard.jsx      # Statistics display cards
│       └── index.js          # Clean exports for UI components
├── data/                # Data layer
│   ├── index.js         # Centralized data exports
│   ├── menuConfig.jsx   # Navigation menu configuration
│   ├── mockData.js      # Mock data and constants
│   └── tableColumns.jsx # Table column definitions
├── pages/               # Page components
│   ├── AllReviews.jsx   # All reviews management page
│   ├── Dashboard.jsx    # Main dashboard page
│   ├── NewReview.jsx    # New review creation page
│   ├── Regulations.jsx  # Compliance analysis results
│   ├── Reports.jsx      # Reports and analytics page
│   ├── Settings.jsx     # User settings page
│   └── index.js         # Clean exports for pages
├── styles/              # Styling files
│   ├── App.css          # Component-specific styles
│   └── index.css        # Global styles and overrides
└── utils/               # Utility functions (ready for future use)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd qfc-compliance-system

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Architecture Benefits

### Modularity
- **Separation of Concerns**: Each component has a single responsibility
- **Reusable Components**: UI components can be used across multiple pages
- **Clean Imports**: Index files provide clean import paths

### Scalability
- **Easy to Extend**: Add new pages by creating files in `/pages`
- **Component Library**: Build a consistent design system in `/components/ui`
- **Data Layer**: Centralized data management in `/data`

### Maintainability
- **Smaller Files**: No more 680+ line monoliths
- **Clear Structure**: Easy to locate and modify specific functionality
- **Consistent Patterns**: Standardized component structure

## 🧩 Component Usage Examples

### Using UI Components
```jsx
import { PageHeader, StatCard, ReviewCard } from '../components/ui';

// In your page component
<PageHeader 
  title="Dashboard" 
  subtitle="Welcome back, Sarah."
/>

<StatCard 
  title="Reviews This Month" 
  value={23}
  backgroundColor="#f0f8ff"
/>
```

### Using Layout Components
```jsx
import { Header, Sidebar } from '../components/layout';

// Layout components are already integrated in App.jsx
```

### Importing Data
```jsx
import { statsData, recentReviews, menuItems } from '../data';

// Use the imported data in your components
```

## 🎨 Styling Guidelines

- **Global Styles**: Use `styles/index.css` for global styles and Ant Design overrides
- **Component Styles**: Use `styles/App.css` for component-specific styles
- **Consistent Classes**: Follow the existing CSS class naming convention (e.g., `qfc-header`, `stat-card`)

## 📊 Data Management

### Mock Data
All mock data is centralized in `src/data/mockData.js`:
- `statsData` - Dashboard statistics
- `recentReviews` - Recent review items
- `allReviewsData` - Complete reviews table data

### Configuration
- `menuConfig.jsx` - Navigation menu items
- `tableColumns.jsx` - Table column definitions

## 🔧 Adding New Features

### Adding a New Page
1. Create a new file in `src/pages/NewPage.jsx`
2. Export it from `src/pages/index.js`
3. Add route handling in `App.jsx`
4. Add menu item to `src/data/menuConfig.jsx`

### Adding a New Component
1. Create component in appropriate subfolder (`ui` or `layout`)
2. Export from the subfolder's `index.js`
3. Import and use in your pages

### Adding New Data
1. Add data to `src/data/mockData.js`
2. Export from `src/data/index.js`
3. Import in components that need it

## 🛠️ Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Ant Design 5** - UI component library
- **ESLint** - Code linting

## 📝 Development Guidelines

1. **Component Naming**: Use PascalCase for component files
2. **Clean Imports**: Use index files for cleaner import statements
3. **Single Responsibility**: Keep components focused on one task
4. **Consistent Structure**: Follow the established folder structure
5. **Documentation**: Comment complex logic and component props

## 🔄 Migration Notes

The application has been refactored from a single 680+ line `App.jsx` file into a modular structure:

- **Before**: All functionality in one massive file
- **After**: Organized into logical, maintainable modules
- **Benefits**: Better code organization, easier testing, improved developer experience

All functionality remains the same - this was purely a structural improvement for better maintainability and scalability.
