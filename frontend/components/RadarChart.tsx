import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useTheme } from '../utils/ThemeContext';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const regionStats: Record<string, { total: number; count: number }> = {};
  data.forEach(r => {
    if (!regionStats[r.region]) regionStats[r.region] = { total: 0, count: 0 };
    regionStats[r.region].total += Number(r.price || 0);
    regionStats[r.region].count += 1;
  });

  const labels = Object.keys(regionStats);
  const values = labels.map(l => regionStats[l].total / regionStats[l].count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average Unit Price',
        data: values,
        backgroundColor: 'rgba(255, 193, 7, 0.2)', // Muted Gold transparent
        borderColor: '#FFC107', // Gold
        pointBackgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        pointBorderColor: '#FFC107',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: isDark ? '#343A40' : '#DEE2E6' },
        grid: { color: isDark ? '#343A40' : '#DEE2E6' },
        pointLabels: { color: isDark ? '#ADB5BD' : '#6C757D', font: { size: 11, weight: 'bold' as const } },
        ticks: { display: false, backdropColor: 'transparent' }
      }
    },
    plugins: { legend: { display: false } }
  };

  return <div style={{ height: '100%', width: '100%' }}><Radar data={chartData} options={options} /></div>;
}
