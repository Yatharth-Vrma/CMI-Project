import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { KPICard } from '../components/KPICard';
import { fetchSummary, fetchVaccines, fetchFilters, fetchInsights } from '../utils/api';
import { useTheme } from '../utils/ThemeContext';
import Head from 'next/head';

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

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
    fetchFilters().then(data => { if (data) setFilterOptions(data); });
  }, []);

  useEffect(() => {
    (async () => {
      const s = await fetchSummary(filters);
      setSummary(s);
      const r = await fetchVaccines(filters);
      setRecords(r);
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
      <Head>
        <title>Market Intelligence Dashboard | CMI</title>
      </Head>

      <aside className="sidebar">
        <div className="brand-title">
          Coherent <br/> Market Insights
        </div>
        
        <div style={{ flex: 1 }}>
          <div className="filter-group">
            <label>Geographic Region</label>
            <select value={filters.region} onChange={(e) => setFilters({...filters, region: e.target.value})}>
              <option value="">Global (All Regions)</option>
              {filterOptions.regions?.map((r: string) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Brand Manufacturer</label>
            <select value={filters.brand} onChange={(e) => setFilters({...filters, brand: e.target.value})}>
              <option value="">All Brands</option>
              {filterOptions.brands?.map((b: string) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Fiscal Year</label>
            <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
              <option value="">All Years</option>
              {filterOptions.years?.map((y: string) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />

          <button className="primary-btn" onClick={handleGenerateInsight} disabled={loadingInsight}>
            {loadingInsight ? 'Processing...' : 'Generate Executive Summary'}
          </button>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
      </aside>

      <main className="main-content">
        <header>
          <div>
            <h1>Vaccine Market Analytics</h1>
            <p>Comprehensive analysis of global market trends, pricing strategies, and regional distribution.</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>Date:</strong> {currentDate} <br/>
            <strong>Report ID:</strong> VAX-2026-Q1
          </div>
        </header>

        {/* AI Insight Section */}
        {insight && (
          <div className="ai-insight">
            <h3>
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>✦</span> 
              Executive Market Summary
            </h3>
            <div className="ai-text">
              {insight}
            </div>
            <div style={{ marginTop: '15px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Generated by Gemini AI • Confidential • Internal Use Only
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="kpi-grid">
          <KPICard title="Total Market Valuation" value={summary?.marketSizeTotal ? '$' + (summary.marketSizeTotal / 1000000).toFixed(1) + 'M' : '$0'} trend={12.5} />
          <KPICard title="CAGR (Compound Annual Growth)" value={summary?.cagr ? summary.cagr.toFixed(2) + '%' : '0.00%'} trend={2.1} />
          <KPICard title="Average Unit Price (ASP)" value={summary?.avgPrice ? '$' + summary.avgPrice.toFixed(2) : '$0.00'} trend={-0.5} />
          <KPICard title="Active Markets" value={filterOptions.regions?.length?.toString() || '0'} />
        </div>

        {/* Charts */}
        <div className="chart-grid">
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h3>Market Size Trajectory (Year-over-Year)</h3>
            <div style={{ height: '350px' }}><LineChart data={records} /></div>
          </div>
          <div className="card">
            <h3>Regional Market Share</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}><DoughnutChart data={records} /></div>
          </div>
          <div className="card">
            <h3>Revenue by Country</h3>
            <div style={{ height: '300px' }}><BarChart data={records} /></div>
          </div>
          <div className="card">
            <h3>Brand Competitive Landscape</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}><PieChart data={records} /></div>
          </div>
          <div className="card">
            <h3>Pricing Strategy Analysis</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}><RadarChart data={records} /></div>
          </div>
        </div>
      </main>
    </div>
  );
}