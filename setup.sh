#!/bin/bash

# Create Directory Structure
mkdir -p backend/src/routes backend/src/controllers backend/src/utils backend/src/data
mkdir -p frontend/pages frontend/components frontend/styles frontend/utils frontend/public

# --- BACKEND FILES ---

cat << 'EOF' > backend/package.json
{
  "name": "health-insight-backend",
  "version": "0.1.0",
  "type": "commonjs",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "openai": "^3.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node": "^10.9.1",
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.0",
    "ts-node-dev": "^2.0.0"
  }
}
EOF

cat << 'EOF' > backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  }
}
EOF

cat << 'EOF' > backend/src/index.ts
import express from 'express';
import cors from 'cors';
import vaccineRouter from './routes/vaccines';
import summaryRouter from './routes/summary';
import insightsRouter from './routes/insights';
import dotenv from 'dotenv';
import { loadVaccinesData } from './utils/dataLoader';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

loadVaccinesData().then((data) => {
  console.log(`Loaded ${data.length} vaccine records`);
}).catch((e) => {
  console.error('Data load error', e);
});

app.use('/api/vaccines', vaccineRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/insights', insightsRouter);

app.get('/', (_req, res) => res.send('Health Insight Dashboard Backend'));

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
export default app;
EOF

cat << 'EOF' > backend/src/routes/vaccines.ts
import { Router } from 'express';
import { filterVaccines } from '../controllers/vaccinesController';

const router = Router();

router.get('/', async (req, res) => {
  const { region, brand, year } = req.query;
  const data = await filterVaccines({ region: region as string, brand: brand as string, year: year as string });
  res.json(data);
});

export default router;
EOF

cat << 'EOF' > backend/src/routes/summary.ts
import { Router } from 'express';
import { summaryForFilters } from '../controllers/summaryController';

const router = Router();

router.get('/', async (req, res) => {
  const { region, brand, year } = req.query;
  const summary = await summaryForFilters({ region: region as string, brand: brand as string, year: year as string });
  res.json(summary);
});

export default router;
EOF

cat << 'EOF' > backend/src/routes/insights.ts
import { Router } from 'express';
import { generateInsight } from '../controllers/insightsController';

const router = Router();

router.get('/', async (req, res) => {
  const { region, brand, year, prompt } = req.query;
  const insight = await generateInsight({ region: region as string, brand: brand as string, year: year as string, prompt: prompt as string });
  res.json(insight);
});

export default router;
EOF

cat << 'EOF' > backend/src/controllers/vaccinesController.ts
import { loadVaccinesData } from '../utils/dataLoader';

export async function filterVaccines(filters: { region?: string; brand?: string; year?: string }) {
  let results = await loadVaccinesData();

  if (filters.region) results = results.filter(r => r.region === filters.region);
  if (filters.brand) results = results.filter(r => r.brand === filters.brand);
  if (filters.year) results = results.filter(r => String(r.year) === filters.year);

  return results;
}
EOF

cat << 'EOF' > backend/src/controllers/summaryController.ts
import { loadVaccinesData } from '../utils/dataLoader';

export async function summaryForFilters(filters: { region?: string; brand?: string; year?: string }) {
  let list = await loadVaccinesData();
  if (filters.region) list = list.filter(r => r.region === filters.region);
  if (filters.brand) list = list.filter(r => r.brand === filters.brand);
  if (filters.year) list = list.filter(r => String(r.year) === filters.year);

  const marketSizeTotal = list.reduce((a, b) => a + Number(b.marketSize || 0), 0);
  const avgPrice = list.reduce((a, b) => a + Number(b.price || 0), 0) / (list.length || 1);

  const years = Array.from(new Set(list.map((r) => Number(r.year)))).sort((a,b)=>a-b);
  let cagr = 0;
  if (years.length >= 2) {
    const initial = list.filter(r => Number(r.year) === years[0]).reduce((a, b) => a + Number(b.marketSize || 0), 0);
    const final = list.filter(r => Number(r.year) === years[years.length - 1]).reduce((a, b) => a + Number(b.marketSize || 0), 0);
    const t = years.length - 1;
    cagr = ((final / (initial || 1)) ** (1 / (t || 1)) - 1) * 100;
  }

  return { marketSizeTotal, avgPrice, cagr, years };
}
EOF

cat << 'EOF' > backend/src/controllers/insightsController.ts
import { Configuration, OpenAIApi } from 'openai';
import { loadVaccinesData } from '../utils/dataLoader';

export async function generateInsight(params: any) {
  const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY || '' });
  const openai = new OpenAIApi(cfg);

  const data = await loadVaccinesData();
  const filtered = data.filter((r) => {
    if (params.region && r.region !== params.region) return false;
    if (params.brand && r.brand !== params.brand) return false;
    if (params.year && String(r.year) !== String(params.year)) return false;
    return true;
  });

  const totalMarket = filtered.reduce((a, r) => a + Number(r.marketSize || 0), 0);
  const avgPrice = filtered.length ? filtered.reduce((a, r) => a + Number(r.price || 0), 0) / filtered.length : 0;

  if (!process.env.OPENAI_API_KEY) return { error: 'OPENAI_API_KEY not configured' };

  try {
    const promptText = `Analyze these vaccine market stats: Total Market Size: ${totalMarket}, Average Price: ${avgPrice}. Provide 2 concise business insights.`;
    const res = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: promptText,
      max_tokens: 150,
      temperature: 0.7,
    });
    return { text: res.data?.choices?.[0]?.text?.trim(), totalMarket, avgPrice };
  } catch (e: any) {
    return { error: 'OpenAI failed', details: e.message };
  }
}
EOF

cat << 'EOF' > backend/src/utils/dataLoader.ts
import { promises as fs } from 'fs';
import path from 'path';

export type VaccineRecord = {
  region: string; country: string; brand: string; year: number; marketSize: number; price: number;
};

let cache: VaccineRecord[] | null = null;

export async function loadVaccinesData(): Promise<VaccineRecord[]> {
  if (cache) return cache;
  const jsonPath = path.join(__dirname, '../data/vaccines.json');
  try {
    const text = await fs.readFile(jsonPath, { encoding: 'utf-8' });
    cache = JSON.parse(text);
    return cache || [];
  } catch {
    return [];
  }
}
EOF

cat << 'EOF' > backend/src/data/vaccines.json
[
  {"region":"Americas","country":"USA","brand":"VaxX","year":2020,"marketSize":50000000,"price":12.5},
  {"region":"Americas","country":"USA","brand":"VaxX","year":2021,"marketSize":62000000,"price":13.0},
  {"region":"EMEA","country":"Germany","brand":"VaxX","year":2020,"marketSize":48000000,"price":11.8},
  {"region":"EMEA","country":"Germany","brand":"VaxX","year":2021,"marketSize":60000000,"price":13.2},
  {"region":"APAC","country":"India","brand":"CureMore","year":2020,"marketSize":4200000,"price":4.0},
  {"region":"APAC","country":"Japan","brand":"VaxX","year":2021,"marketSize":55000000,"price":14.2}
]
EOF

cat << 'EOF' > backend/.gitignore
node_modules/
dist/
.env
EOF

cat << 'EOF' > backend/.env.example
OPENAI_API_KEY=
PORT=5000
EOF

# --- FRONTEND FILES ---

cat << 'EOF' > frontend/package.json
{
  "name": "health-insight-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.3.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "chart.js": "^4.2.1",
    "react-chartjs-2": "^5.2.0",
    "typescript": "4.9.5"
  }
}
EOF

cat << 'EOF' > frontend/pages/index.tsx
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { KPICard } from '../components/KPICard';
import { fetchSummary, fetchVaccines } from '../utils/api';

const BarChart = dynamic(() => import('../components/BarChart'), { ssr: false });
const LineChart = dynamic(() => import('../components/LineChart'), { ssr: false });
const PieChart = dynamic(() => import('../components/PieChart'), { ssr: false });

export default function Dashboard() {
  const [filters, setFilters] = useState({ region: '', brand: '', year: '' });
  const [summary, setSummary] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const s = await fetchSummary(filters);
      setSummary(s);
      const r = await fetchVaccines(filters);
      setRecords(r);
    })();
  }, [filters]);

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '250px', padding: '20px', borderRight: '1px solid #ddd' }}>
        <h3>Filters</h3>
        <select onChange={(e) => setFilters({...filters, region: e.target.value})}>
          <option value="">All Regions</option>
          <option value="Americas">Americas</option>
          <option value="EMEA">EMEA</option>
          <option value="APAC">APAC</option>
        </select>
        <br/><br/>
        <select onChange={(e) => setFilters({...filters, brand: e.target.value})}>
          <option value="">All Brands</option>
          <option value="VaxX">VaxX</option>
          <option value="CureMore">CureMore</option>
        </select>
      </aside>
      <main style={{ flex: 1, padding: '20px' }}>
        <h1>Health Insight Dashboard</h1>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <KPICard title="CAGR %" value={summary?.cagr?.toFixed(2) + '%'} />
          <KPICard title="Market Size" value={summary?.marketSizeTotal?.toLocaleString()} />
          <KPICard title="Avg Price" value={'$' + summary?.avgPrice?.toFixed(2)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <BarChart data={records} />
          <LineChart data={records} />
          <PieChart data={records} />
        </div>
      </main>
    </div>
  );
}
EOF

cat << 'EOF' > frontend/components/KPICard.tsx
export const KPICard = ({ title, value }: any) => (
  <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
    <h4 style={{ margin: 0, color: '#666' }}>{title}</h4>
    <h2 style={{ margin: '10px 0 0' }}>{value || '—'}</h2>
  </div>
);
EOF

cat << 'EOF' > frontend/utils/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
export const fetchSummary = (f: any) => fetch(`${BASE}/api/summary?region=${f.region}&brand=${f.brand}&year=${f.year}`).then(res => res.json());
export const fetchVaccines = (f: any) => fetch(`${BASE}/api/vaccines?region=${f.region}&brand=${f.brand}&year=${f.year}`).then(res => res.json());
EOF

cat << 'EOF' > frontend/styles/globals.css
body { margin: 0; font-family: sans-serif; background: #f9f9f9; }
EOF

cat << 'EOF' > README.md
# Vaccine Market Analytics Platform

## Setup
1. Backend: \`cd backend && npm install && npm run dev\`
2. Frontend: \`cd frontend && npm install && npm run dev\`
EOF

echo "Project setup complete!"
