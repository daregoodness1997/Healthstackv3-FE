import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartJSData {
  labels: string[];
  datasets: Array<{
    label?: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
    cutout?: string | number;
    spacing?: number;
  }>;
}

interface DoughnutChartProps {
  // Support both raw data and Chart.js formatted data
  data?: ChartJSData | any[];
  // For raw data transformation
  nameKey?: string;
  valueKey?: string;
  options?: ChartOptions<'doughnut'>;
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
  '#0288d1',
  '#d32f2f',
  '#7b1fa2',
  '#00796b',
  '#f57c00',
];

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  nameKey,
  valueKey,
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
            data: [],
            backgroundColor: [],
          },
        ],
      };
    }

    // If data is already in Chart.js format
    if (!Array.isArray(data) && 'labels' in data && 'datasets' in data) {
      return data as ChartJSData;
    }

    // Transform raw data array
    if (Array.isArray(data) && nameKey && valueKey) {
      const colors = defaultColors.slice(0, data.length);
      return {
        labels: data.map((item: any) => item[nameKey]?.toString() || ''),
        datasets: [
          {
            data: data.map((item: any) => Number(item[valueKey]) || 0),
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1,
          },
        ],
      };
    }

    // Fallback for invalid data
    return {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    };
  }, [data, nameKey, valueKey]);

  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
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
      <Doughnut options={mergedOptions} data={chartData} />
    </Box>
  );
};
