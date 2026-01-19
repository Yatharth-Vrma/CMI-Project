import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: { data: any[] }) {
  const brands = Array.from(new Set(data.map((d) => d.brand)));
  const values = brands.map((b) => data.filter((d) => d.brand === b).reduce((a, c) => a + (c.marketSize || 0), 0));

  const chartData = {
    labels: brands,
    datasets: [{
      data: values,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderWidth: 1,
    }]
  };

  return (
    <div className="chart-card">
      <Pie data={chartData} options={{ responsive: true }} />
    </div>
  );
}