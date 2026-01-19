import { useState, useEffect } from 'react';
import { fetchSummary, fetchVaccines, fetchFilters, fetchInsights } from '../utils/api';

export function useDashboardData() {
  const [filters, setFilters] = useState({ region: '', brand: '', year: '' });
  const [filterOptions, setFilterOptions] = useState<{ regions: string[], brands: string[], years: number[] }>({ regions: [], brands: [], years: [] });
  const [summary, setSummary] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    fetchFilters().then(data => { if (data) setFilterOptions(data); });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([
          fetchSummary(filters),
          fetchVaccines(filters)
        ]);
        setSummary(s);
        setRecords(r);
        setInsight('');
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    })();
  }, [filters]);

  const generateInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await fetchInsights(filters);
      if (res.text) setInsight(res.text);
      else if (res.error) setInsight(`Error: ${res.error} - ${res.details || ''}`);
    } catch (e) {
      setInsight('Failed to generate insights.');
    } finally {
      setLoadingInsight(false);
    }
  };

  return {
    filters,
    setFilters,
    filterOptions,
    summary,
    records,
    insight,
    loadingInsight,
    generateInsight
  };
}
