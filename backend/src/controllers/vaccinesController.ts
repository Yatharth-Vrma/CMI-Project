import { loadVaccinesData } from '../utils/dataLoader';

export async function filterVaccines(filters: { region?: string; brand?: string; year?: string }) {
  let results = await loadVaccinesData();

  if (filters.region) results = results.filter(r => r.region === filters.region);
  if (filters.brand) results = results.filter(r => r.brand === filters.brand);
  if (filters.year) results = results.filter(r => String(r.year) === filters.year);

  return results;
}
