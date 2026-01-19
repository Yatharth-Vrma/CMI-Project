# Frontend Architecture

**Last Updated:** 2026-01-19
**Framework:** Next.js 13+ (Pages Router)
**Entry Point:** `pages/index.tsx`

## Structure

- **Pages:** `index.tsx` (Dashboard container)
- **Components:** Reusable UI elements (`Sidebar`, `KPICard`, Charts)
- **Hooks:** Custom logic (`useDashboardData`)
- **Utils:** API clients and Theme context

## Data Flow

User Interaction → `useDashboardData` Hook → API Client → Backend → State Update → UI Re-render

## External Dependencies

- **Chart.js:** Data visualization
- **React:** UI Library
- **Next.js:** Framework
