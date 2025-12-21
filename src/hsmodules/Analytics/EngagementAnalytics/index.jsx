import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useEngagementAnalytics } from '../../../hooks/queries/useEngagementAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  InteractionOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const EngagementAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useEngagementAnalytics(
    facilityId,
    filters.startDate,
    filters.endDate,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Engagements',
        value: data?.totalEngagements || 0,
        icon: 'InteractionOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Engagements',
        value: data?.activeEngagements || 0,
        icon: 'ThunderboltOutlined',
        color: '#52c41a',
      },
      {
        title: 'Avg Response Time',
        value: `${data?.averageResponseTime || 0} min`,
        icon: 'ClockCircleOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Engagement Rate',
        value: `${data?.engagementRate || 0}%`,
        icon: 'RiseOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    InteractionOutlined: <InteractionOutlined style={{ fontSize: 24 }} />,
    ThunderboltOutlined: <ThunderboltOutlined style={{ fontSize: 24 }} />,
    ClockCircleOutlined: <ClockCircleOutlined style={{ fontSize: 24 }} />,
    RiseOutlined: <RiseOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    channel: ['#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#13c2c2'],
    type: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'],
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

        {/* Charts Grid */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <BarChartCard
              title="Engagements by Channel"
              labels={
                data?.engagementsByChannel?.map((item) => item.channel) || []
              }
              data={data?.engagementsByChannel?.map((item) => item.count) || []}
              colors={chartColors.channel}
              dataLabel="Engagements"
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Engagements by Type"
              labels={data?.engagementsByType?.map((item) => item.type) || []}
              data={data?.engagementsByType?.map((item) => item.count) || []}
              colors={chartColors.type}
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Monthly Engagement Trend"
              labels={data?.monthlyTrend?.map((item) => item.month) || []}
              datasets={[
                {
                  label: 'Engagements',
                  data:
                    data?.monthlyTrend?.map((item) => item.engagements) || [],
                  borderColor: '#1890ff',
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                },
                {
                  label: 'Responses',
                  data: data?.monthlyTrend?.map((item) => item.responses) || [],
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

export default EngagementAnalytics;
