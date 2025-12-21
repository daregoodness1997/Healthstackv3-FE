import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useFinanceAnalytics } from '../../../hooks/queries/useFinanceAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  DollarOutlined,
  FallOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const FinanceAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useFinanceAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const formatCurrency = (value) => `₦${(value || 0).toLocaleString()}`;

  const stats = useMemo(
    () => [
      {
        title: 'Total Revenue',
        value: formatCurrency(data?.totalRevenue),
        icon: 'DollarOutlined',
        color: '#52c41a',
      },
      {
        title: 'Total Expenses',
        value: formatCurrency(data?.totalExpenses),
        icon: 'FallOutlined',
        color: '#ff4d4f',
      },
      {
        title: 'Net Profit',
        value: formatCurrency(data?.netProfit),
        icon: 'RiseOutlined',
        color: '#1890ff',
      },
      {
        title: 'Outstanding Payments',
        value: formatCurrency(data?.outstandingPayments),
        icon: 'ClockCircleOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    DollarOutlined: <DollarOutlined style={{ fontSize: 24 }} />,
    FallOutlined: <FallOutlined style={{ fontSize: 24 }} />,
    RiseOutlined: <RiseOutlined style={{ fontSize: 24 }} />,
    ClockCircleOutlined: <ClockCircleOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    revenue: '#52c41a',
    expenses: '#ff4d4f',
    profit: '#1890ff',
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
            <BarChartCard
              title="Revenue by Department"
              labels={data?.revenueByDepartment?.map((item) => item.department) || []}
              data={data?.revenueByDepartment?.map((item) => item.revenue) || []}
              colors={Array(data?.revenueByDepartment?.length || 0).fill(chartColors.revenue)}
              dataLabel="Revenue"
            />
          </Col>
          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Expenses by Category"
              labels={data?.expensesByCategory?.map((item) => item.category) || []}
              data={data?.expensesByCategory?.map((item) => item.amount) || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']}
            />
          </Col>
          <Col xs={24}>
            <LineChartCard
              title="Monthly Revenue Trend"
              labels={data?.monthlyRevenue?.map((item) => item.month) || []}
              datasets={[
                {
                  label: 'Revenue',
                  data: data?.monthlyRevenue?.map((item) => item.revenue) || [],
                  borderColor: chartColors.revenue,
                  backgroundColor: chartColors.revenue + '20',
                },
              ]}
              yAxisLabel="Revenue"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FinanceAnalytics;
