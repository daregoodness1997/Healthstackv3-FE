import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useManagedCareAnalytics } from '../../../hooks/queries/useManagedCareAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ManagedCareAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useManagedCareAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const formatCurrency = (value) => `₦${(value || 0).toLocaleString()}`;

  const stats = useMemo(
    () => [
      {
        title: 'Total Enrollees',
        value: (data?.totalEnrollees || 0).toLocaleString(),
        icon: 'TeamOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Enrollees',
        value: (data?.activeEnrollees || 0).toLocaleString(),
        icon: 'UserOutlined',
        color: '#52c41a',
      },
      {
        title: 'Total Claims',
        value: (data?.totalClaims || 0).toLocaleString(),
        icon: 'FileTextOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Claim Value',
        value: formatCurrency(data?.claimValue),
        icon: 'DollarOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    TeamOutlined: <TeamOutlined style={{ fontSize: 24 }} />,
    UserOutlined: <UserOutlined style={{ fontSize: 24 }} />,
    FileTextOutlined: <FileTextOutlined style={{ fontSize: 24 }} />,
    DollarOutlined: <DollarOutlined style={{ fontSize: 24 }} />,
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
                value={stat.value}
                icon={iconMap[stat.icon]}
                color={stat.color}
              />
            </Col>
          ))}
        </Row>

        {/* Charts Grid */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Claims by Status"
              labels={data?.claimsByStatus?.map((item) => item.status) || []}
              data={data?.claimsByStatus?.map((item) => item.count) || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']}
            />
          </Col>
          <Col xs={24} lg={12}>
            <Card>
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 'bold',
                    color: '#1890ff',
                    marginBottom: 8,
                  }}
                >
                  {data?.utilizationRate || 0}%
                </div>
                <div style={{ fontSize: 16, color: '#8c8c8c' }}>
                  Utilization Rate
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ManagedCareAnalytics;
