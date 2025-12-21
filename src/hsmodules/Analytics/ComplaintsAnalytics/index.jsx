import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useComplaintsAnalytics } from '../../../hooks/queries/useComplaintsAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  AlertOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SmileOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ComplaintsAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useComplaintsAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Complaints',
        value: data?.totalComplaints || 0,
        icon: 'AlertOutlined',
        color: '#1890ff',
      },
      {
        title: 'Open Complaints',
        value: data?.openComplaints || 0,
        icon: 'ExclamationCircleOutlined',
        color: '#f5222d',
      },
      {
        title: 'Resolved',
        value: data?.resolvedComplaints || 0,
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Satisfaction Rate',
        value: `${data?.satisfactionRate || 0}%`,
        icon: 'SmileOutlined',
        color: '#13c2c2',
      },
    ],
    [data],
  );

  const iconMap = {
    AlertOutlined: <AlertOutlined style={{ fontSize: 24 }} />,
    ExclamationCircleOutlined: (
      <ExclamationCircleOutlined style={{ fontSize: 24 }} />
    ),
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    SmileOutlined: <SmileOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    category: [
      '#1890ff',
      '#52c41a',
      '#fa8c16',
      '#722ed1',
      '#13c2c2',
      '#eb2f96',
    ],
    priority: ['#f5222d', '#fa8c16', '#faad14', '#1890ff'],
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
              title="Complaints by Category"
              labels={
                data?.complaintsByCategory?.map((item) => item.category) || []
              }
              data={data?.complaintsByCategory?.map((item) => item.count) || []}
              colors={chartColors.category}
              dataLabel="Complaints"
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Complaints by Priority"
              labels={
                data?.complaintsByPriority?.map((item) => item.priority) || []
              }
              data={data?.complaintsByPriority?.map((item) => item.count) || []}
              colors={chartColors.priority}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ComplaintsAnalytics;
