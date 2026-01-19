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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ data }: { data: any[] }) {
  const labels = Array.from(new Set(data.map((d) => d.country || 'Unknown'))).slice(0, 10); // Show top 10 countries or similar
  // Group by country
  const values = labels.map((c) => data.filter(d => d.country === c).reduce((a, b) => a + (b.marketSize || 0), 0));

  const chartData = {
    labels,
    datasets: [{
      label: 'Market Size by Country',
      data: values,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };

  return (
    <div className="chart-card">
      <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' as const } } }} />
    </div>
  );
}