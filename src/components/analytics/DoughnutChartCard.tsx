import { Doughnut } from 'react-chartjs-2';
import { ChartCard } from './ChartCard';

interface DoughnutChartCardProps {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  centerText?: {
    line1: string;
    line2: string;
  };
}

export const DoughnutChartCard = ({
  title,
  labels,
  data,
  colors,
  centerText,
}: DoughnutChartCardProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartCard title={title} height="auto">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          padding: '16px 8px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '280px',
            position: 'relative' as const,
          }}
        >
          <Doughnut data={chartData} options={chartOptions} />
          {centerText && (
            <div
              style={{
                position: 'absolute' as const,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center' as const,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}
              >
                {centerText.line1}
              </div>
              <div
                style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}
              >
                {centerText.line2}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: '12px',
            justifyContent: 'center',
            marginTop: '24px',
            maxWidth: '100%',
          }}
        >
          {labels.map((label, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: colors[i],
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#666', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
};
