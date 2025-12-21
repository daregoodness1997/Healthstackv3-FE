import { Line } from 'react-chartjs-2';
import { ChartCard } from './ChartCard';

interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

interface LineChartCardProps {
  title: string;
  labels: string[];
  datasets: Dataset[];
  yAxisLabel?: string;
  xAxisLabel?: string;
  extra?: React.ReactNode;
}

export const LineChartCard = ({
  title,
  labels,
  datasets,
  yAxisLabel = '',
  xAxisLabel = '',
  extra,
}: LineChartCardProps) => {
  const chartData = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: ds.borderColor,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: ds.borderColor,
      pointBorderWidth: 2,
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
          title: (context: any) => `${context[0].label}`,
          label: (context: any) =>
            ` ${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
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
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          color: '#666',
          font: { size: 12, weight: 'normal' as const },
        },
      },
      x: {
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
    <ChartCard title={title} extra={extra}>
      <Line data={chartData} options={chartOptions} />
    </ChartCard>
  );
};
