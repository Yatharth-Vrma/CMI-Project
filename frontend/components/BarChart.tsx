import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../utils/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const labels = Array.from(new Set(data.map((d) => d.country || 'Unknown'))).slice(0, 8);
  const values = labels.map((c) => data.filter(d => d.country === c).reduce((a, b) => a + (b.marketSize || 0), 0));

  const chartData = {
    labels,
    datasets: [{
      label: 'Market Size',
      data: values,
      backgroundColor: '#20C997', // Professional Teal
      borderRadius: 2,
      barThickness: 40,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#2C3034' : '#FFFFFF',
        titleColor: isDark ? '#E9ECEF' : '#212529',
        bodyColor: isDark ? '#DEE2E6' : '#212529',
        borderColor: isDark ? '#495057' : '#DEE2E6',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#ADB5BD' : '#6C757D' }
      },
      y: {
        grid: { color: isDark ? '#343A40' : '#E9ECEF', borderDash: [2, 2] },
        ticks: { display: false },
        border: { display: false }
      }
    }
  };

  return <div style={{ height: '100%', width: '100%' }}><Bar data={chartData} options={options} /></div>;
}