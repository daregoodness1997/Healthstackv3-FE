import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useCommunicationAnalytics } from '../../../hooks/queries/useCommunicationAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  MessageOutlined,
  SendOutlined,
  InboxOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const CommunicationAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } =
    useCommunicationAnalytics(
      facilityId,
      filters.startDate ? new Date(filters.startDate) : undefined,
      filters.endDate ? new Date(filters.endDate) : undefined,
    );

  const stats = useMemo(
    () => [
      {
        title: 'Total Messages',
        value: data?.totalMessages || 0,
        icon: 'MessageOutlined',
        color: '#1890ff',
      },
      {
        title: 'Sent Messages',
        value: data?.sentMessages || 0,
        icon: 'SendOutlined',
        color: '#52c41a',
      },
      {
        title: 'Received Messages',
        value: data?.receivedMessages || 0,
        icon: 'InboxOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Avg Response Time',
        value: `${data?.averageResponseTime || 0} min`,
        icon: 'ClockCircleOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    MessageOutlined: <MessageOutlined style={{ fontSize: 24 }} />,
    SendOutlined: <SendOutlined style={{ fontSize: 24 }} />,
    InboxOutlined: <InboxOutlined style={{ fontSize: 24 }} />,
    ClockCircleOutlined: <ClockCircleOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    channel: ['#1890ff', '#52c41a', '#13c2c2', '#fa8c16'],
    status: ['#52c41a', '#faad14', '#f5222d', '#1890ff'],
    messages: '#1890ff',
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
            <DoughnutChartCard
              title="Messages by Channel"
              labels={
                data?.messagesByChannel?.map((item) => item.channel) || []
              }
              data={data?.messagesByChannel?.map((item) => item.count) || []}
              colors={chartColors.channel}
            />
          </Col>

          <Col xs={24} lg={12}>
            <BarChartCard
              title="Messages by Status"
              labels={data?.messagesByStatus?.map((item) => item.status) || []}
              data={data?.messagesByStatus?.map((item) => item.count) || []}
              colors={chartColors.status}
              dataLabel="Messages"
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Daily Messages"
              labels={data?.dailyMessages?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Messages',
                  data: data?.dailyMessages?.map((item) => item.count) || [],
                  borderColor: chartColors.messages,
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

export default CommunicationAnalytics;
