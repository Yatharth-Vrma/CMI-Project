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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ data }: { data: any[] }) {
  const years = Array.from(new Set(data.map((d) => d.year))).sort((a, b) => a - b);
  const values = years.map((yr) => data.filter(d => d.year === yr).reduce((a, b) => a + (b.marketSize || 0), 0));

  const chartData = {
    labels: years,
    datasets: [{
      label: 'Total Market Size Trend',
      data: values,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      tension: 0.3
    }]
  };

  return (
    <div className="chart-card">
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' as const } } }} />
    </div>
  );
}