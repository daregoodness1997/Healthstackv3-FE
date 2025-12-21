import React, { useContext, useMemo } from 'react';
import {
  Card,
  Col,
  Row,
  Select,
  Button,
  DatePicker,
  Space,
  Statistic,
} from 'antd';
import { UserContext } from '../../../context';
import { useARTAnalytics } from '../../../hooks/queries/useARTAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  TeamOutlined,
  UserOutlined,
  UserAddOutlined,
  HeartOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ArtAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useARTAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Patients',
        value: data?.totalPatients || 0,
        icon: 'TeamOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Patients',
        value: data?.activePatients || 0,
        icon: 'UserOutlined',
        color: '#52c41a',
      },
      {
        title: 'New Enrollments',
        value: data?.newEnrollments || 0,
        icon: 'UserAddOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Adherence Rate',
        value: `${data?.adherenceRate || 0}%`,
        icon: 'HeartOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    TeamOutlined: <TeamOutlined style={{ fontSize: 24 }} />,
    UserOutlined: <UserOutlined style={{ fontSize: 24 }} />,
    UserAddOutlined: <UserAddOutlined style={{ fontSize: 24 }} />,
    HeartOutlined: <HeartOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    regimen: ['#1890ff', '#52c41a', '#722ed1', '#fa8c16'],
    enrollments: '#1890ff',
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
              title="Patients by Regimen Type"
              labels={
                data?.patientsByRegimenType?.map((item) => item.regimen) || []
              }
              data={
                data?.patientsByRegimenType?.map((item) => item.count) || []
              }
              colors={chartColors.regimen}
              dataLabel="Patients"
            />
          </Col>

          <Col xs={24} lg={12}>
            <Card style={{ height: '100%' }}>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
                  Viral Load Suppression
                </div>
                <Statistic
                  value={data?.viralLoadSuppression || 0}
                  suffix="%"
                  valueStyle={{
                    color: '#52c41a',
                    fontSize: 48,
                    fontWeight: 'bold',
                  }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Monthly Enrollments"
              labels={data?.monthlyEnrollments?.map((item) => item.month) || []}
              datasets={[
                {
                  label: 'Enrollments',
                  data:
                    data?.monthlyEnrollments?.map((item) => item.count) || [],
                  borderColor: chartColors.enrollments,
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

export default ArtAnalytics;
