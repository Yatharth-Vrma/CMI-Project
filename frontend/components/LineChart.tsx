import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../utils/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const years = Array.from(new Set(data.map((d) => d.year))).sort((a, b) => a - b);
  const values = years.map((yr) => data.filter(d => d.year === yr).reduce((a, b) => a + (b.marketSize || 0), 0));

  const chartData = {
    labels: years,
    datasets: [{
      label: 'Market Size (USD)',
      data: values,
      borderColor: '#0056B3', // Corporate Blue
      backgroundColor: 'rgba(0, 86, 179, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      pointBorderColor: '#0056B3',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.1 // Slight curve, but mostly precise
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
        padding: 10,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#ADB5BD' : '#6C757D' }
      },
      y: {
        grid: { color: isDark ? '#343A40' : '#E9ECEF', borderDash: [2, 2] },
        ticks: { 
          color: isDark ? '#ADB5BD' : '#6C757D',
          callback: (v: any) => '$' + (v / 1000000).toFixed(0) + 'M'
        },
        border: { display: false }
      }
    }
  };

  return <div style={{ height: '100%', width: '100%' }}><Line data={chartData} options={options} /></div>;
}