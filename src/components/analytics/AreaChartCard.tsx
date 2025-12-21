import { Line } from 'react-chartjs-2';
import { ChartCard } from './ChartCard';

interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

interface AreaChartCardProps {
  title: string;
  labels: string[];
  datasets: Dataset[];
  yAxisLabel?: string;
  xAxisLabel?: string;
  extra?: React.ReactNode;
  stacked?: boolean;
}

export const AreaChartCard = ({
  title,
  labels,
  datasets,
  yAxisLabel = '',
  xAxisLabel = '',
  extra,
  stacked = false,
}: AreaChartCardProps) => {
  const chartData = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      fill: true,
      tension: 0.4,
      borderWidth: 2,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 15,
          font: { size: 11, weight: 'normal' as const },
          color: '#333',
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context: any) =>
            ` ${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked,
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
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          color: '#666',
          font: { size: 12, weight: 'normal' as const },
        },
      },
      x: {
        stacked,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#666',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
        },
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          color: '#666',
          font: { size: 12, weight: 'normal' as const },
        },
      },
    },
  };

  return (
    <ChartCard title={title} extra={extra} height="400px">
      <Line data={chartData} options={chartOptions} />
    </ChartCard>
  );
};
