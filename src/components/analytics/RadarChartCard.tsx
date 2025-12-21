import { Radar } from 'react-chartjs-2';
import { ChartCard } from './ChartCard';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components for Radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
}

interface RadarChartCardProps {
  title: string;
  labels: string[];
  datasets: Dataset[];
  extra?: React.ReactNode;
}

export const RadarChartCard = ({
  title,
  labels,
  datasets,
  extra,
}: RadarChartCardProps) => {
  const chartData = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      borderWidth: 2,
      pointBackgroundColor: ds.borderColor,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: ds.borderColor,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 15,
          font: { size: 11, weight: 'normal' as const },
          color: '#333',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          color: '#666',
          font: { size: 11 },
        },
        ticks: {
          color: '#999',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <ChartCard title={title} extra={extra} height="400px">
      <Radar data={chartData} options={chartOptions} />
    </ChartCard>
  );
};
