Backend for Health Insight Dashboard (Vaccine Market Analytics)

Run locally:
- Install: npm install
- Start: npm run dev

API endpoints:
- GET /api/vaccines?region=&brand=&year=
- GET /api/summary?region=&brand=&year=
- GET /api/insights?region=&brand=&year=&prompt=

Environment:
- OPENAI_API_KEY in .env for insights endpoint
