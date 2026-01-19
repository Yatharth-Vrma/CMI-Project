# Backend Architecture

**Last Updated:** 2026-01-19
**Runtime:** Node.js + Express
**Entry Point:** `src/index.ts`

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/vaccines` | GET | List all vaccine records with filtering |
| `/api/vaccines/filters` | GET | Get available filter options (metadata) |
| `/api/summary` | GET | Calculate KPIs (CAGR, Market Size) |
| `/api/insights` | GET | Generate AI executive summary (Gemini) |

## Data Flow

Request → Middleware (CORS, JSON) → Route Handler → Controller → Service/Loader → Response

## Key Components

- **Controllers:** Business logic for processing data.
- **Utils:** Data loading (JSON/CSV) and error handling.
- **Config:** Environment variable management.
