// AppointmentTimeline.tsx
import React from 'react';
import { Card, Typography, Tag, Timeline } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function AppointmentTimeline({
  startDate,
  endDate,
  appointments,
}: any) {
  // Group appointments by patient
  const patientAppointments = appointments.reduce((acc: any, appt: any) => {
    if (!acc[appt.patientId]) {
      acc[appt.patientId] = {
        patientName: appt.patientName,
        appointments: [],
      };
    }
    acc[appt.patientId].appointments.push(appt);
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'scheduled':
        return '#3B82F6';
      default:
        return '#EF4444';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Missed';
    }
  };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header with legend */}
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Appointment Timeline
        </Title>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircleOutlined
              style={{ color: '#52c41a', fontSize: '16px' }}
            />
            <Text>Completed</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClockCircleOutlined
              style={{ color: '#1890ff', fontSize: '16px' }}
            />
            <Text>Scheduled</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloseCircleOutlined
              style={{ color: '#ff4d4f', fontSize: '16px' }}
            />
            <Text>Missed</Text>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div style={{ maxHeight: '680px', overflow: 'auto' }}>
        {Object.entries(patientAppointments).map(
          ([patientId, data]: [string, any]) => (
            <div
              key={patientId}
              style={{
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Title level={5} style={{ margin: 0, marginBottom: '4px' }}>
                  {data.patientName}
                </Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {data.appointments.length} appointment
                  {data.appointments.length !== 1 ? 's' : ''}
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {data.appointments.map((appt: any) => (
                  <div
                    key={appt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      background: '#fafafa',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${getStatusColor(appt.status)}`,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: getStatusColor(appt.status),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '16px',
                      }}
                    >
                      {appt.status === 'completed' ? (
                        <CheckCircleOutlined />
                      ) : appt.status === 'scheduled' ? (
                        <ClockCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                        {dayjs(appt.startDate).format('MMM DD, YYYY HH:mm')}
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Duration:{' '}
                        {dayjs(appt.endDate).diff(
                          dayjs(appt.startDate),
                          'minute',
                        )}{' '}
                        mins
                      </Text>
                    </div>
                    <Tag
                      color={
                        appt.status === 'completed'
                          ? 'success'
                          : appt.status === 'scheduled'
                            ? 'processing'
                            : 'error'
                      }
                    >
                      {getStatusLabel(appt.status)}
                    </Tag>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </Card>
  );
}
