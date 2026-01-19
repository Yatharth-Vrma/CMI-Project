import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../utils/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const agg: Record<string, number> = {};
  data.forEach(r => { agg[r.region] = (agg[r.region] || 0) + Number(r.marketSize || 0); });
  
  const labels = Object.keys(agg);
  const values = Object.values(agg);

  // Corporate Palette: Navy, Blue, Teal, Slate, Muted Gold
  const colors = [
    '#003366', // Deep Navy
    '#0056B3', // Corporate Blue
    '#20C997', // Teal
    '#6C757D', // Slate
    '#FFC107', // Gold
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right' as const,
        labels: { 
          color: isDark ? '#ADB5BD' : '#6C757D', 
          usePointStyle: true,
          boxWidth: 8,
          font: { family: 'Inter', size: 11 }
        }
      }
    },
    cutout: '65%',
  };

  return <div style={{ height: '100%', width: '100%' }}><Doughnut data={chartData} options={options} /></div>;
}
