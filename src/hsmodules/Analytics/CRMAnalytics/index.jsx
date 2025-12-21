import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useCRMAnalytics } from '../../../hooks/queries/useCRMAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  ContactsOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const CRMAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useCRMAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Contacts',
        value: data?.totalContacts || 0,
        icon: 'ContactsOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Leads',
        value: data?.activeLeads || 0,
        icon: 'ThunderboltOutlined',
        color: '#fa8c16',
      },
      {
        title: 'Converted Leads',
        value: data?.convertedLeads || 0,
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Conversion Rate',
        value: `${data?.conversionRate || 0}%`,
        icon: 'RiseOutlined',
        color: '#722ed1',
      },
    ],
    [data],
  );

  const iconMap = {
    ContactsOutlined: <ContactsOutlined style={{ fontSize: 24 }} />,
    ThunderboltOutlined: <ThunderboltOutlined style={{ fontSize: 24 }} />,
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    RiseOutlined: <RiseOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    source: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96'],
    status: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#f5222d'],
    revenue: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96'],
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
              title="Leads by Source"
              labels={data?.leadsBySource?.map((item) => item.source) || []}
              data={data?.leadsBySource?.map((item) => item.count) || []}
              colors={chartColors.source}
              dataLabel="Leads"
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Leads by Status"
              labels={data?.leadsByStatus?.map((item) => item.status) || []}
              data={data?.leadsByStatus?.map((item) => item.count) || []}
              colors={chartColors.status}
            />
          </Col>

          <Col xs={24} lg={12}>
            <BarChartCard
              title="Revenue by Source"
              labels={data?.revenueBySource?.map((item) => item.source) || []}
              data={data?.revenueBySource?.map((item) => item.revenue) || []}
              colors={chartColors.revenue}
              dataLabel="Revenue ($)"
            />
          </Col>

          <Col xs={24} lg={12}>
            <LineChartCard
              title="Monthly CRM Trend"
              labels={data?.monthlyTrend?.map((item) => item.month) || []}
              datasets={[
                {
                  label: 'Contacts',
                  data: data?.monthlyTrend?.map((item) => item.contacts) || [],
                  borderColor: '#1890ff',
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                },
                {
                  label: 'Converted',
                  data: data?.monthlyTrend?.map((item) => item.converted) || [],
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

export default CRMAnalytics;
