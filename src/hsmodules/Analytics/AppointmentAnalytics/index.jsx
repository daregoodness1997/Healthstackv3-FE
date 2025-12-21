import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, DatePicker, Button, Space, Spin } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  SyncOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// Import components
import AppointmentTimeline from './AppointmentTimeline';
import AppointmentAnalytics from './AppointmentAnalytics';
import AppointmentDistributions1 from './AppointmentDistributions1';
import AppointmentDistributions2 from './AppointmentDistributions2';
import {
  analyticsData,
  distribubtion1Data,
  distribution2Data,
  timelineData,
} from './data';

export default function AppointmentDashboardWrapper() {
  const [loading, setLoading] = useState(false);

  const [rangeOption, setRangeOption] = useState('1 month');
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  // Mock data
  const [metrics, setMetrics] = React.useState(analyticsData.metrics);
  const [chartData, setChartData] = React.useState(analyticsData.chartData);
  const [appointments, setAppointments] = useState(timelineData.appointments);
  const [patients, setPatients] = useState(timelineData.patients);
  const [charts, setCharts] = useState(distribubtion1Data);
  const [doughnutCharts, setDoughnutCharts] = useState(
    distribution2Data.doughnutCharts,
  );
  const [barCharts, setBarCharts] = useState(distribution2Data.barCharts);

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  const RANGE_OPTIONS = [
    { label: 'Last 7 Days', value: '7 days', days: 7 },
    { label: 'Last 30 Days', value: '1 month', days: 30 },
    { label: 'Last 3 Months', value: '3 months', days: 90 },
    { label: 'Last 6 Months', value: '6 months', days: 180 },
    { label: 'Last Year', value: '1 year', days: 365 },
    { label: 'Custom Period', value: 'custom', days: 1 },
  ];

  const components = [
    {
      id: 0,
      element: <AppointmentAnalytics metrics={metrics} chartData={chartData} />,
    },
    {
      id: 1,
      element: (
        <AppointmentTimeline
          appointments={appointments}
          patients={patients}
          startDate={dateRange[0].format('YYYY-MM-DD')}
          endDate={dateRange[1].format('YYYY-MM-DD')}
        />
      ),
    },
    { id: 2, element: <AppointmentDistributions1 charts={charts} /> },
    {
      id: 3,
      element: (
        <AppointmentDistributions2
          doughnutCharts={doughnutCharts}
          barCharts={barCharts}
        />
      ),
    },
  ];

  return <AppointmentAnalytics metrics={metrics} chartData={chartData} />;
}
