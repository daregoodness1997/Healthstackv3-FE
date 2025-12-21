import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
} from 'chart.js';
import { distribution2Data } from './data';

const { Title: AntTitle, Text } = Typography;

// Register all required components
ChartJS.register(
  ArcElement,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
);

const commonDoughnutOptions = {
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  maintainAspectRatio: false,
  hoverOffset: 10,
};

const barOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b' },
    },
    y: {
      grid: { display: false },
      ticks: { color: '#1e293b', font: { weight: 500 } },
    },
  },
};

export default function AppointmentDistributions2({
  doughnutCharts,
  barCharts,
}: any) {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <AntTitle level={4} style={{ marginBottom: '24px' }}>
        Appointment Analytics
      </AntTitle>

      <Row gutter={[16, 16]}>
        {/* Doughnut Charts */}
        {doughnutCharts.map((chart, i) => (
          <Col xs={24} md={12} key={`doughnut-${i}`}>
            <Card
              bordered={false}
              style={{ borderRadius: '12px', height: '100%' }}
            >
              <AntTitle level={5} style={{ marginBottom: '16px' }}>
                {chart.title}
              </AntTitle>

              <div style={{ height: 280, position: 'relative' }}>
                <Doughnut
                  data={{
                    labels: chart.labels,
                    datasets: [
                      {
                        data: chart.data,
                        backgroundColor: chart.colors,
                        borderColor: '#fff',
                        borderWidth: 4,
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={commonDoughnutOptions}
                />
              </div>

              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  justifyContent: 'center',
                }}
              >
                {chart.labels.map((label, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: chart.colors[idx],
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {label} ({chart.data[idx]}%)
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        ))}

        {/* Horizontal Bar Charts */}
        {barCharts.map((chart, i) => (
          <Col xs={24} md={12} key={`bar-${i}`}>
            <Card
              bordered={false}
              style={{ borderRadius: '12px', height: '100%' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <AntTitle level={5} style={{ margin: 0 }}>
                  {chart.title}
                </AntTitle>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  1 month
                </Text>
              </div>

              <div style={{ height: 320 }}>
                <Bar
                  data={{
                    labels: chart.labels,
                    datasets: [
                      {
                        label: 'No of Patients',
                        data: chart.data,
                        backgroundColor: chart.backgroundColor,
                        borderRadius: 6,
                        barThickness: 24,
                      },
                    ],
                  }}
                  options={{
                    ...barOptions,
                    plugins: {
                      ...barOptions.plugins,
                      tooltip: {
                        callbacks: {
                          label: (context: any) => `${context.raw} patients`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
