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
