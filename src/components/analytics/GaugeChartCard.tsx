import { Doughnut } from 'react-chartjs-2';
import { ChartCard } from './ChartCard';

interface GaugeChartCardProps {
  title: string;
  value: number;
  maxValue?: number;
  label?: string;
  color?: string;
  backgroundColor?: string;
  showDatePicker?: boolean;
  showMoreMenu?: boolean;
}

export const GaugeChartCard = ({
  title,
  value,
  maxValue = 100,
  label = '',
  color = '#1890ff',
  backgroundColor = '#f0f0f0',
  showDatePicker = true,
  showMoreMenu = true,
}: GaugeChartCardProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const remaining = 100 - percentage;

  const chartData = {
    labels: ['Value', 'Remaining'],
    datasets: [
      {
        data: [percentage, remaining],
        backgroundColor: [color, backgroundColor],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  const getColorByPercentage = (percent: number): string => {
    if (percent >= 80) return '#52c41a'; // Green
    if (percent >= 60) return '#faad14'; // Yellow
    if (percent >= 40) return '#ff7a45'; // Orange
    return '#ff4d4f'; // Red
  };

  const dynamicColor =
    color === '#1890ff' ? getColorByPercentage(percentage) : color;

  return (
    <ChartCard
      title={title}
      height="auto"
      showDatePicker={showDatePicker}
      showMoreMenu={showMoreMenu}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '180px',
            position: 'relative',
          }}
        >
          <Doughnut
            data={{
              ...chartData,
              datasets: [
                {
                  ...chartData.datasets[0],
                  backgroundColor: [dynamicColor, backgroundColor],
                },
              ],
            }}
            options={chartOptions}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: dynamicColor,
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              {percentage.toFixed(1)}%
            </div>
            {label && (
              <div
                style={{
                  fontSize: '13px',
                  color: '#666',
                  fontWeight: '500',
                }}
              >
                {label}
              </div>
            )}
            <div
              style={{
                fontSize: '12px',
                color: '#999',
                marginTop: '4px',
              }}
            >
              {value} / {maxValue}
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};
