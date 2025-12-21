import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useClinicAnalytics } from '../../../hooks/queries/useClinicAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  MedicineBoxOutlined,
  UserOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ClinicAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useClinicAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Consultations',
        value: data?.totalConsultations || 0,
        icon: 'MedicineBoxOutlined',
        color: '#1890ff',
      },
      {
        title: 'Total Patients',
        value: data?.totalPatients || 0,
        icon: 'UserOutlined',
        color: '#52c41a',
      },
      {
        title: 'Average Wait Time',
        value: `${data?.averageWaitTime || 0} min`,
        icon: 'ClockCircleOutlined',
        color: '#fa8c16',
      },
      {
        title: 'Daily Average',
        value: Math.round((data?.totalConsultations || 0) / 30),
        icon: 'BarChartOutlined',
        color: '#13c2c2',
      },
    ],
    [data],
  );

  const iconMap = {
    MedicineBoxOutlined: <MedicineBoxOutlined style={{ fontSize: 24 }} />,
    UserOutlined: <UserOutlined style={{ fontSize: 24 }} />,
    ClockCircleOutlined: <ClockCircleOutlined style={{ fontSize: 24 }} />,
    BarChartOutlined: <BarChartOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    doctors: ['#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#13c2c2', '#eb2f96'],
    departments: [
      '#1890ff',
      '#52c41a',
      '#fa8c16',
      '#722ed1',
      '#13c2c2',
      '#eb2f96',
    ],
    trend: '#1890ff',
  };

  if (isLoading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        Error: {error?.message}
        <Button onClick={() => refetch()} style={{ marginLeft: 16 }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Filters Card */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            placeholder="Time Range"
            value={filters.timeRange}
            onChange={(value) => setFilters({ timeRange: value })}
            style={{ width: 150 }}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
            ]}
          />
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                setFilters({
                  startDate: dates[0]?.format('YYYY-MM-DD'),
                  endDate: dates[1]?.format('YYYY-MM-DD'),
                });
              } else {
                setFilters({ startDate: undefined, endDate: undefined });
              }
            }}
          />
          <Button onClick={resetFilters}>Reset Filters</Button>
        </Space>
      </Card>

      {/* Background Container */}
      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
        {/* Stats Grid */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {stats.map((stat, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <StatCard
                title={stat.title}
                value={
                  typeof stat.value === 'number'
                    ? stat.value.toLocaleString()
                    : stat.value
                }
                icon={iconMap[stat.icon]}
                color={stat.color}
              />
            </Col>
          ))}
        </Row>

        {/* Charts Grid */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <BarChartCard
              title="Consultations by Doctor"
              labels={
                data?.consultationsByDoctor?.map((item) => item.name) || []
              }
              data={
                data?.consultationsByDoctor?.map((item) => item.count) || []
              }
              colors={chartColors.doctors}
              dataLabel="Consultations"
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Patients by Department"
              labels={
                data?.patientsByDepartment?.map((item) => item.name) || []
              }
              data={data?.patientsByDepartment?.map((item) => item.count) || []}
              colors={chartColors.departments}
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Daily Consultations Trend"
              labels={data?.dailyConsultations?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Consultations',
                  data:
                    data?.dailyConsultations?.map((item) => item.count) || [],
                  borderColor: chartColors.trend,
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ClinicAnalytics;
