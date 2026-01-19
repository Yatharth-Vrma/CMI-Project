import { promises as fs } from 'fs';
import path from 'path';

export type VaccineRecord = {
  region: string; country: string; brand: string; year: number; marketSize: number; price: number;
};

let cache: VaccineRecord[] | null = null;

export async function loadVaccinesData(): Promise<VaccineRecord[]> {
  if (cache) return cache;
  
  // Try resolving path relative to build output or source
  const possiblePaths = [
    path.join(__dirname, '../data/vaccines.json'), // standard src structure
    path.join(process.cwd(), 'src/data/vaccines.json'), // raw source
    path.join(process.cwd(), 'dist/data/vaccines.json'), // build output
    path.join(process.cwd(), 'backend/src/data/vaccines.json') // monorepo style
  ];

  for (const p of possiblePaths) {
    try {
      const text = await fs.readFile(p, { encoding: 'utf-8' });
      cache = JSON.parse(text);
      return cache || [];
    } catch (e) {
      // Continue to next path
    }
  }

  console.error('[DataLoader] Failed to load vaccines.json from any path. Paths tried:', possiblePaths);
  return [];
}
