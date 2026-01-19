import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ data }: { data: any[] }) {
  // Aggregate Market Size by Region
  const agg: Record<string, number> = {};
  data.forEach(r => {
    agg[r.region] = (agg[r.region] || 0) + Number(r.marketSize || 0);
  });
  
  const labels = Object.keys(agg);
  const values = Object.values(agg);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Market Size by Region',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Regional Distribution' } } }} />;
}
