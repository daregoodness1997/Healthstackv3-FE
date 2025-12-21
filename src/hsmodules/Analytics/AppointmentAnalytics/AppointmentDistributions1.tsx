import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { distribubtion1Data } from './data';

const { Title } = Typography;

ChartJS.register(ArcElement, Tooltip, Legend);

const commonOptions = {
  cutout: '50%', // Thin ring like your screenshot
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  maintainAspectRatio: false,
  hoverOffset: 8,
};

const percentage = (part: number, total: number) => {
  return total === 0 ? 0 : Math.round((part / total) * 100);
};

export default function AppointmentDistributions({ charts }: any) {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <Title level={4} style={{ marginBottom: '24px' }}>
        Appointment Analytics
      </Title>

      <Row gutter={[16, 16]}>
        {charts.map((chart, i) => (
          <Col xs={24} md={12} key={i}>
            <Card
              bordered={false}
              style={{ borderRadius: '12px', height: '100%' }}
            >
              <Title level={5} style={{ marginBottom: '16px' }}>
                {chart.title}
              </Title>

              <div style={{ height: 280, position: 'relative' }}>
                <Doughnut
                  data={{
                    labels: chart.labels,
                    datasets: [
                      {
                        data: chart.data,
                        backgroundColor: chart.colors,
                        borderColor: '#fff',
                        borderWidth: 3,
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={commonOptions}
                />
              </div>

              {/* Legend below */}
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
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      {label} {chart.data[idx]} (
                      {percentage(
                        chart.data[idx],
                        chart.data.reduce((a: number, b: number) => a + b, 0),
                      )}
                      %)
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
