import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, trend }) => {
  const isPositive = trend !== undefined && trend >= 0;
  
  return (
    <div className="card">
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
        {title}
      </div>
      
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {value}
      </div>

      {trend !== undefined && (
        <div style={{ 
          fontSize: '0.85rem', 
          fontWeight: 500,
          color: isPositive ? 'var(--success-color)' : 'var(--danger-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>vs prev. year</span>
        </div>
      )}
    </div>
  );
};
