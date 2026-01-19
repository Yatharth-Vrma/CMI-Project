import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { KPICard } from '../components/KPICard';
import { fetchSummary, fetchVaccines, fetchFilters, fetchInsights } from '../utils/api';
import { useTheme } from '../utils/ThemeContext';

const BarChart = dynamic(() => import('../components/BarChart'), { ssr: false });
const LineChart = dynamic(() => import('../components/LineChart'), { ssr: false });
const PieChart = dynamic(() => import('../components/PieChart'), { ssr: false });
const DoughnutChart = dynamic(() => import('../components/DoughnutChart'), { ssr: false });
const RadarChart = dynamic(() => import('../components/RadarChart'), { ssr: false });

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [filters, setFilters] = useState({ region: '', brand: '', year: '' });
  const [filterOptions, setFilterOptions] = useState({ regions: [], brands: [], years: [] });
  
  const [summary, setSummary] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Set date on client side
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  // Load initial filter options
  useEffect(() => {
    fetchFilters().then(data => {
      if (data) setFilterOptions(data);
    });
  }, []);

  // Load data when filters change
  useEffect(() => {
    (async () => {
      const s = await fetchSummary(filters);
      setSummary(s);
      const r = await fetchVaccines(filters);
      setRecords(r);
      // Reset insight when filters change to avoid stale data
      setInsight('');
    })();
  }, [filters]);

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await fetchInsights(filters);
      if (res.text) setInsight(res.text);
      else if (res.error) setInsight(`Error: ${res.error} - ${res.details || ''}`);
    } catch (e) {
      setInsight('Failed to generate insights.');
    }
    setLoadingInsight(false);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 style={{ marginBottom: '20px' }}>Health Insight</h2>
        
        <div className="filter-group">
          <label>Region</label>
          <select value={filters.region} onChange={(e) => setFilters({...filters, region: e.target.value})}>
            <option value="">All Regions</option>
            {filterOptions.regions?.map((r: string) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Brand</label>
          <select value={filters.brand} onChange={(e) => setFilters({...filters, brand: e.target.value})}>
            <option value="">All Brands</option>
            {filterOptions.brands?.map((b: string) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Year</label>
          <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
            <option value="">All Years</option>
            {filterOptions.years?.map((y: string) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <button className="primary-btn" onClick={handleGenerateInsight} disabled={loadingInsight}>
          {loadingInsight ? 'Analyzing...' : 'Generate AI Insights'}
        </button>

        <button className="theme-toggle" onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </aside>

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Vaccine Market Analytics</h1>
          <span>{currentDate}</span>
        </div>

        {/* AI Insight Section */}
        {insight && (
          <div className="card" style={{ marginBottom: '30px', borderLeft: '4px solid var(--accent-color)' }}>
            <h3>🤖 AI Analysis</h3>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{insight}</p>
          </div>
        )}

        {/* KPIs */}
        <div className="kpi-grid">
          <KPICard title="CAGR %" value={summary?.cagr ? summary.cagr.toFixed(2) + '%' : 'N/A'} />
          <KPICard title="Total Market Size" value={summary?.marketSizeTotal ? '$' + summary.marketSizeTotal.toLocaleString() : '$0'} />
          <KPICard title="Avg Price" value={summary?.avgPrice ? '$' + summary.avgPrice.toFixed(2) : '$0.00'} />
        </div>

        {/* Charts */}
        <div className="chart-grid">
          <div className="card">
            <h3>Market Size Trend (Year)</h3>
            <div style={{ height: '300px' }}><LineChart data={records} /></div>
          </div>
          <div className="card">
            <h3>Market Size by Country</h3>
            <div style={{ height: '300px' }}><BarChart data={records} /></div>
          </div>
          <div className="card">
            <h3>Market Share by Brand</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}><PieChart data={records} /></div>
          </div>
          <div className="card">
            <h3>Regional Distribution</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}><DoughnutChart data={records} /></div>
          </div>
          <div className="card">
            <h3>Avg Price Metrics</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}><RadarChart data={records} /></div>
          </div>
        </div>
      </main>
    </div>
  );
}