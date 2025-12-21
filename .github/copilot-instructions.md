# HealthStack Frontend - AI Coding Agent Instructions

## Project Overview
HealthStack is a comprehensive healthcare management system frontend built with React 18, Vite, TypeScript, and Material-UI. The application is a modular, multi-tenant hospital management system with 20+ specialized modules (Clinic, Pharmacy, Laboratory, Ward, Finance, etc.).

## Architecture

### Module-Based Structure
- **Module Pattern**: Each healthcare domain is a lazy-loaded module with its own `*Home.jsx` wrapper and route configuration
- **Module Homes**: Located in `src/hsmodules/*/`, each module (e.g., `ClientHome`, `PharmacyHome`) handles location selection and context initialization before rendering child routes
- **Route Configuration**: All routes are centralized in `src/hsmodules/routes/*-routes.jsx` files and imported into `src/hsmodules/routes.jsx`
- **Private Routes**: All authenticated routes are nested under `/app` and protected by `PrivateOutlet.tsx` which wraps the main `Dashboard`

### State Management
- **Global Context**: `ObjectContext` (from `src/context.jsx`) provides centralized module state via `useModuleState` hook
- **Module State Pattern**: Each module has dedicated state slice in the global state (e.g., `state.ClientModule`, `state.PharmacyModule`)
- **Location Management**: Modules track employee location via `state.employeeLocation` with properties: `locationName`, `locationType`, `locationId`, `facilityId`, `case`
- **Action Loader**: Global loading state managed via `showActionLoader(message)` and `hideActionLoader()` from `ObjectContext`

### Backend Integration
- **FeathersJS Client**: `src/feathers.jsx` configures WebSocket connection to backend via Socket.io
- **Backend URL**: Currently points to `https://hs-backend-w6my.onrender.com/` (see `feathers.jsx` for other environments)
- **Data Layer Hook**: `useRepository<T>(modelName)` (from `src/components/hooks/repository.ts`) provides CRUD operations
  - Returns: `{list, find, get, submit, remove, user, facility, location}`
  - Auto-refetches on socket events: `created`, `updated`, `patched`, `removed`
  - Model constants defined in `src/hsmodules/app/Constants.ts` (e.g., `Models.CLIENT`, `Models.APPOINTMENT`)

### Component Architecture
- **Reusable Components**: All shared UI in `src/components/` organized by feature (buttons, inputs, modal, tables, etc.)
- **Lazy Loading**: Main modules and routes use React lazy loading with `Suspense` fallback to `PageLoaderComponent`
- **Styling**: Mix of Material-UI components, styled-components (in `src/ui/styled/`), and component-level CSS
- **Forms**: React Hook Form with Yup validation; inputs in `src/components/inputs/` and `src/components/new-inputs/`

## Development Workflow

### Commands
```bash
pnpm dev          # Start dev server (Vite with HMR)
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

### Adding a New Module
1. Create module home: `src/hsmodules/[Module]/[Module]Home.jsx` with location selection logic (see `ClientHome.jsx` pattern)
2. Create routes file: `src/hsmodules/routes/[module]-routes.jsx` exporting routes array
3. Import routes in `src/hsmodules/routes.jsx` and add `<Route path="/app/[module]" element={<[Module]Home />}>` block
4. Add module state to `useModuleState` hook in `src/hooks/useModuleState.jsx`
5. Create lazy-loaded dashboard/landing component

### Location Pattern
Most clinical modules require location selection before use:
- Check user locations: `user.currentEmployee.locations.filter(item => item.locationType === '[Type]')`
- Set `state.employeeLocation` with location details
- Show location modal if not selected: `state.[ModuleName].locationModal`
- Pattern demonstrated in `ClientHome.jsx`, `ClinicHome.jsx`

### API Patterns
```javascript
// Using repository hook
const { list, find, submit, remove, user } = useRepository(Models.CLIENT);

// Direct service access
const service = client.service('appointments');
const result = await service.find({ query: { status: 'pending', $limit: 50 } });
await service.create(data);
await service.patch(id, updates);
```

## Key Conventions

### File Naming
- Module homes: PascalCase (e.g., `ClientHome.jsx`)
- Routes: kebab-case (e.g., `client-routes.jsx`)
- Components: PascalCase for files, exports
- Mix of `.jsx`, `.tsx` extensions (migrating to TypeScript incrementally)

### Module State Updates
Always use functional updates to avoid stale state:
```javascript
setState(prev => ({
  ...prev,
  ModuleName: { ...prev.ModuleName, newProperty: value }
}));
```

### Authentication
- User context: `const { user } = useContext(UserContext)`
- Current employee: `user.currentEmployee` (has `facilityDetail`, `locations`)
- Re-authentication on mount in `context.jsx` via `client.reAuthenticate()`

### Routing Structure
- Auth routes: `/` (login, signup, etc.) from `auth-routes.jsx`
- App routes: `/app/*` (protected)
- Module routes: `/app/[module]/*` (e.g., `/app/clinic/dashboard`)
- External routes: `/create-policy-external-link/:hmoFacilityId/:facilityType`, `/external-payment/:hospitalId/:patientId`

## Important Files
- `src/feathers.jsx` - Backend connection config
- `src/context.jsx` - Global user and object context
- `src/hooks/useModuleState.jsx` - Centralized module state
- `src/components/hooks/repository.ts` - Data fetching hook
- `src/hsmodules/routes.jsx` - Main routing configuration
- `src/hsmodules/app/Constants.ts` - Model names and view constants
- `src/App.jsx` - Root component with providers and theme

## Common Patterns to Follow
- Always wrap long-running operations with `showActionLoader()` / `hideActionLoader()`
- Use `ModalBox` component from `src/components/modal` for modals
- Toast notifications via `react-toastify`: `toast.success()`, `toast.error()`
- Date handling: Use `date-fns` or `dayjs` (both available)
- Tables: `react-data-table-component` or custom `customtable` component
- Form validation: Yup schemas with React Hook Form's `@hookform/resolvers/yup`

## Module List
Accounts, Admin, Analytics, Appointment, ART, Bloodbank, CaseManagement, Client, Clinic, Communication, Complaints, Corporate, CRM, Dashboard, Documentation, Epidemiology, Finance, GlobalAdmin, Immunization, Inventory, Laboratory, ManagedCare, Pharmacy, ProviderRelationship, Radiology, Referral, Schedule, Theatre, Ward

## Planned Improvements
See `REFACTORING_PLAN.md` for detailed modernization roadmap including:
- Migration to Zustand for state management
- TanStack Query for data fetching and caching
- Performance optimizations (memoization, virtualization, code splitting)
- TypeScript migration strategy
- Testing infrastructure setup
