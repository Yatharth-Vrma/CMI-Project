export const KPICard = ({ title, value }: any) => (
  <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
    <h4 style={{ margin: 0, color: '#666' }}>{title}</h4>
    <h2 style={{ margin: '10px 0 0' }}>{value || '—'}</h2>
  </div>
);
