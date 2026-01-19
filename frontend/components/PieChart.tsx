import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTheme } from '../utils/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const brands = Array.from(new Set(data.map((d) => d.brand)));
  const values = brands.map((b) => data.filter((d) => d.brand === b).reduce((a, c) => a + (c.marketSize || 0), 0));

  // Distinct but professional palette
  const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545'];

  const chartData = {
    labels: brands,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom' as const,
        labels: { color: isDark ? '#ADB5BD' : '#6C757D', usePointStyle: true, boxWidth: 8 }
      }
    }
  };

  return <div style={{ height: '100%', width: '100%' }}><Pie data={chartData} options={options} /></div>;
}