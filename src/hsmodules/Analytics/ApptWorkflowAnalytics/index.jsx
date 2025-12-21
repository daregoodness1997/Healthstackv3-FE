import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useApptWorkflowAnalytics } from '../../../hooks/queries/useApptWorkflowAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  ReconciliationOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ApptWorkflowAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useApptWorkflowAnalytics(
    facilityId,
    filters.startDate,
    filters.endDate,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Workflows',
        value: data?.totalWorkflows || 0,
        icon: 'ReconciliationOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Workflows',
        value: data?.activeWorkflows || 0,
        icon: 'SyncOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Completed',
        value: data?.completedWorkflows || 0,
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Avg Completion Time',
        value: `${data?.averageCompletionTime || 0} min`,
        icon: 'ClockCircleOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    ReconciliationOutlined: <ReconciliationOutlined style={{ fontSize: 24 }} />,
    SyncOutlined: <SyncOutlined style={{ fontSize: 24 }} />,
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    ClockCircleOutlined: <ClockCircleOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    status: ['#faad14', '#1890ff', '#52c41a', '#f5222d'],
    type: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'],
    trend: ['#52c41a', '#1890ff'],
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
              title="Workflows by Status"
              labels={data?.workflowsByStatus?.map((item) => item.status) || []}
              data={data?.workflowsByStatus?.map((item) => item.count) || []}
              colors={chartColors.status}
            />
          </Col>

          <Col xs={24} lg={12}>
            <BarChartCard
              title="Workflows by Type"
              labels={data?.workflowsByType?.map((item) => item.type) || []}
              data={data?.workflowsByType?.map((item) => item.count) || []}
              colors={chartColors.type}
              dataLabel="Workflows"
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Completion Rate Trend"
              labels={data?.completionRateTrend?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Completed',
                  data:
                    data?.completionRateTrend?.map((item) => item.completed) ||
                    [],
                  borderColor: '#52c41a',
                  backgroundColor: 'rgba(82, 196, 26, 0.1)',
                },
                {
                  label: 'Total',
                  data:
                    data?.completionRateTrend?.map((item) => item.total) || [],
                  borderColor: '#1890ff',
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

export default ApptWorkflowAnalytics;
