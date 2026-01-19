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
