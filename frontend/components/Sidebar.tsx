import React from 'react';
import { useTheme } from '../utils/ThemeContext';

interface SidebarProps {
  filters: any;
  setFilters: (filters: any) => void;
  filterOptions: { regions: string[]; brands: string[]; years: number[] };
  onGenerateInsight: () => void;
  loadingInsight: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  filters, 
  setFilters, 
  filterOptions, 
  onGenerateInsight, 
  loadingInsight 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="brand-title">
        Coherent <br/> Market Insights
      </div>
      
      <div style={{ flex: 1 }}>
        <div className="filter-group">
          <label>Geographic Region</label>
          <select value={filters.region} onChange={(e) => setFilters({...filters, region: e.target.value})}>
            <option value="">Global (All Regions)</option>
            {filterOptions.regions?.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Brand Manufacturer</label>
          <select value={filters.brand} onChange={(e) => setFilters({...filters, brand: e.target.value})}>
            <option value="">All Brands</option>
            {filterOptions.brands?.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Fiscal Year</label>
          <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
            <option value="">All Years</option>
            {filterOptions.years?.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />

        <button className="primary-btn" onClick={onGenerateInsight} disabled={loadingInsight}>
          {loadingInsight ? 'Processing...' : 'Generate Executive Summary'}
        </button>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </button>
    </aside>
  );
};
