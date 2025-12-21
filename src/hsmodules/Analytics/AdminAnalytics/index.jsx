import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useAdminAnalytics } from '../../../hooks/queries/useAdminAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  UserOutlined,
  CheckCircleOutlined,
  BankOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const AdminAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useAdminAnalytics(
    facilityId,
    filters.startDate,
    filters.endDate,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Users',
        value: data?.totalUsers || 0,
        icon: 'UserOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Users',
        value: data?.activeUsers || 0,
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Total Facilities',
        value: data?.totalFacilities || 0,
        icon: 'BankOutlined',
        color: '#722ed1',
      },
      {
        title: 'Total Modules',
        value: data?.totalModules || 0,
        icon: 'AppstoreOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    UserOutlined: <UserOutlined style={{ fontSize: 24 }} />,
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    BankOutlined: <BankOutlined style={{ fontSize: 24 }} />,
    AppstoreOutlined: <AppstoreOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    users: ['#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#13c2c2', '#eb2f96'],
    facilities: ['#1890ff', '#52c41a', '#fa8c16'],
    activity: ['#1890ff', '#52c41a'],
    modules: ['#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#13c2c2', '#eb2f96'],
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
                value={stat.value.toLocaleString()}
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
              title="Users by Role"
              labels={data?.usersByRole?.map((item) => item.role) || []}
              data={data?.usersByRole?.map((item) => item.count) || []}
              colors={chartColors.users}
              dataLabel="Users"
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Facilities by Type"
              labels={data?.facilitiesByType?.map((item) => item.type) || []}
              data={data?.facilitiesByType?.map((item) => item.count) || []}
              colors={chartColors.facilities}
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="System Activity"
              labels={data?.systemActivity?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Logins',
                  data: data?.systemActivity?.map((item) => item.logins) || [],
                  borderColor: '#1890ff',
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                },
                {
                  label: 'Actions',
                  data: data?.systemActivity?.map((item) => item.actions) || [],
                  borderColor: '#52c41a',
                  backgroundColor: 'rgba(82, 196, 26, 0.1)',
                },
              ]}
            />
          </Col>

          <Col xs={24}>
            <BarChartCard
              title="Module Usage"
              labels={data?.moduleUsage?.map((item) => item.module) || []}
              data={data?.moduleUsage?.map((item) => item.usage) || []}
              colors={chartColors.modules}
              dataLabel="Usage %"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminAnalytics;
