import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartJSData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    fill?: boolean;
  }>;
}

interface LineDefinition {
  key: string;
  name: string;
  color?: string;
}

interface LineChartProps {
  // Support both raw data and Chart.js formatted data
  data?: ChartJSData | any[];
  // For raw data transformation
  xKey?: string;
  lines?: LineDefinition[];
  options?: ChartOptions<'line'>;
  height?: string | number;
}

const defaultColors = [
  'rgb(255, 99, 132)',
  'rgb(53, 162, 235)',
  'rgb(75, 192, 192)',
  'rgb(255, 159, 64)',
  'rgb(153, 102, 255)',
];

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  lines = [],
  options: customOptions,
  height = '100%',
}) => {
  const chartData = useMemo(() => {
    // Handle empty or undefined data
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // If data is already in Chart.js format
    if (!Array.isArray(data) && 'labels' in data && 'datasets' in data) {
      return data as ChartJSData;
    }

    // Transform raw data array with lines configuration
    if (Array.isArray(data) && xKey && lines.length > 0) {
      return {
        labels: data.map((item: any) => item[xKey]?.toString() || ''),
        datasets: lines.map((line, index) => ({
          label: line.name,
          data: data.map((item: any) => Number(item[line.key]) || 0),
          borderColor:
            line.color || defaultColors[index % defaultColors.length],
          backgroundColor: line.color
            ? `${line.color}33`
            : defaultColors[index % defaultColors.length]
                .replace('rgb', 'rgba')
                .replace(')', ', 0.2)'),
          tension: 0.3,
        })),
      };
    }

    // Fallback for invalid data
    return {
      labels: [],
      datasets: [],
    };
  }, [data, xKey, lines]);

  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const mergedOptions = customOptions
    ? { ...defaultOptions, ...customOptions }
    : defaultOptions;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        height,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Line options={mergedOptions} data={chartData} />
    </Box>
  );
};
