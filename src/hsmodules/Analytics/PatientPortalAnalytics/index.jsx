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
import { usePatientPortalAnalytics } from '../../../hooks/queries/usePatientPortalAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  UserAddOutlined,
  UserOutlined,
  CalendarOutlined,
  SmileOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const PatientPortalAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } =
    usePatientPortalAnalytics(facilityId, filters.startDate, filters.endDate);

  const stats = useMemo(
    () => [
      {
        title: 'Total Portal Users',
        value: data?.totalPortalUsers || 0,
        icon: 'UserAddOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Users',
        value: data?.activeUsers || 0,
        icon: 'UserOutlined',
        color: '#52c41a',
      },
      {
        title: 'Appointments Booked',
        value: data?.appointmentsBooked || 0,
        icon: 'CalendarOutlined',
        color: '#13c2c2',
      },
      {
        title: 'User Satisfaction',
        value: `${data?.userSatisfaction || 0}/10`,
        icon: 'SmileOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    UserAddOutlined: <UserAddOutlined style={{ fontSize: 24 }} />,
    UserOutlined: <UserOutlined style={{ fontSize: 24 }} />,
    CalendarOutlined: <CalendarOutlined style={{ fontSize: 24 }} />,
    SmileOutlined: <SmileOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    features: [
      '#1890ff',
      '#52c41a',
      '#fa8c16',
      '#722ed1',
      '#13c2c2',
      '#eb2f96',
    ],
    trend: ['#1890ff', '#52c41a'],
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

        {/* Charts and Additional Stats Grid */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card>
              <h3 style={{ marginBottom: 16 }}>Portal Activity</h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Prescription Refills"
                    value={data?.prescriptionRefills || 0}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Bill Payments"
                    value={data?.billPayments || 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Lab Results Viewed"
                    value={data?.labResultsViewed || 0}
                    valueStyle={{ color: '#13c2c2' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="New Registrations"
                    value={data?.newRegistrations || 0}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <BarChartCard
              title="User Engagement by Feature"
              labels={
                data?.userEngagementByFeature?.map((item) => item.feature) || []
              }
              data={
                data?.userEngagementByFeature?.map((item) => item.usage) || []
              }
              colors={chartColors.features}
              dataLabel="Usage"
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Activity Trend"
              labels={data?.activityTrend?.map((item) => item.month) || []}
              datasets={[
                {
                  label: 'Logins',
                  data: data?.activityTrend?.map((item) => item.logins) || [],
                  borderColor: '#1890ff',
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                },
                {
                  label: 'Actions',
                  data: data?.activityTrend?.map((item) => item.actions) || [],
                  borderColor: '#52c41a',
                  backgroundColor: 'rgba(82, 196, 26, 0.1)',
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PatientPortalAnalytics;
