import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartJSData {
  labels: string[];
  datasets: Array<{
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

interface BarChartProps {
  // Support both raw data and Chart.js formatted data
  data?: ChartJSData | any[];
  // For raw data transformation
  xKey?: string;
  yKey?: string;
  label?: string;
  options?: ChartOptions<'bar'>;
  height?: string | number;
}

const defaultColors = [
  '#1976d2',
  '#dc004e',
  '#f57c00',
  '#388e3c',
  '#7b1fa2',
  '#c2185b',
  '#00796b',
  '#5d4037',
  '#455a64',
  '#e64a19',
];

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  label = 'Value',
  options: customOptions,
  height = '100%',
}) => {
  const chartData = useMemo(() => {
    // Handle empty or undefined data
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return {
        labels: [],
        datasets: [
          {
            label,
            data: [],
            backgroundColor: defaultColors[0],
          },
        ],
      };
    }

    // If data is already in Chart.js format
    if (!Array.isArray(data) && 'labels' in data && 'datasets' in data) {
      return data as ChartJSData;
    }

    // Transform raw data array
    if (Array.isArray(data) && xKey && yKey) {
      return {
        labels: data.map((item: any) => item[xKey]?.toString() || ''),
        datasets: [
          {
            label,
            data: data.map((item: any) => Number(item[yKey]) || 0),
            backgroundColor: defaultColors,
          },
        ],
      };
    }

    // Fallback for invalid data
    return {
      labels: [],
      datasets: [
        {
          label,
          data: [],
          backgroundColor: defaultColors[0],
        },
      ],
    };
  }, [data, xKey, yKey, label]);

  const defaultOptions: ChartOptions<'bar'> = {
    scales: {
      y: {
        ticks: {
          precision: 0,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
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
      <Bar options={mergedOptions} data={chartData} />
    </Box>
  );
};
