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

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ data }: { data: any[] }) {
  // Compare Average Price by Region
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
        label: 'Avg Price by Region',
        data: values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Radar data={chartData} options={{ responsive: true, scales: { r: { beginAtZero: true } } }} />;
}
