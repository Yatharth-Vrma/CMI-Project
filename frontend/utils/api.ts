const BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000').replace(/\/$/, '');
export const fetchSummary = (f: any) => fetch(`${BASE}/api/summary?region=${f.region}&brand=${f.brand}&year=${f.year}`).then(res => res.json());
export const fetchVaccines = (f: any) => fetch(`${BASE}/api/vaccines?region=${f.region}&brand=${f.brand}&year=${f.year}`).then(res => res.json());
export const fetchFilters = () => fetch(`${BASE}/api/vaccines/filters`).then(res => res.json());
export const fetchInsights = (f: any) => fetch(`${BASE}/api/insights?region=${f.region}&brand=${f.brand}&year=${f.year}`).then(res => res.json());
