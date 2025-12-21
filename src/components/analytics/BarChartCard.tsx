import { Bar } from 'react-chartjs-2';
import { ChartCard } from './ChartCard';

interface BarChartCardProps {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  dataLabel?: string;
  horizontal?: boolean;
}

export const BarChartCard = ({
  title,
  labels,
  data,
  colors,
  dataLabel = 'Count',
  horizontal = false,
}: BarChartCardProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: dataLabel,
        data,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 50,
      },
    ],
  };

  const chartOptions = {
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context: any) =>
            ` ${horizontal ? context.parsed.x : context.parsed.y} ${dataLabel.toLowerCase()}`,
        },
      },
    },
    scales: {
      [horizontal ? 'x' : 'y']: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#666',
          font: { size: 11 },
          padding: 8,
        },
      },
      [horizontal ? 'y' : 'x']: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#666',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <ChartCard title={title}>
      <Bar data={chartData} options={chartOptions} />
    </ChartCard>
  );
};
