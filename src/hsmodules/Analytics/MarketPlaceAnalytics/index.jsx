import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useMarketPlaceAnalytics } from '../../../hooks/queries/useMarketPlaceAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  ShoppingOutlined,
  ShopOutlined,
  SwapOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const MarketPlaceAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useMarketPlaceAnalytics(
    facilityId,
    filters.startDate,
    filters.endDate,
  );

  const formatCurrency = (value) => `₦${(value || 0).toLocaleString()}`;

  const stats = useMemo(
    () => [
      {
        title: 'Total Products',
        value: data?.totalProducts || 0,
        icon: 'ShoppingOutlined',
        color: '#1890ff',
      },
      {
        title: 'Listed Products',
        value: data?.listedProducts || 0,
        icon: 'ShopOutlined',
        color: '#52c41a',
      },
      {
        title: 'Total Orders',
        value: data?.totalOrders || 0,
        icon: 'SwapOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(data?.totalRevenue),
        icon: 'DollarOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    ShoppingOutlined: <ShoppingOutlined style={{ fontSize: 24 }} />,
    ShopOutlined: <ShopOutlined style={{ fontSize: 24 }} />,
    SwapOutlined: <SwapOutlined style={{ fontSize: 24 }} />,
    DollarOutlined: <DollarOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    products: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2'],
    status: ['#52c41a', '#1890ff', '#fa8c16', '#f5222d'],
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
              title="Top Selling Products"
              labels={
                data?.topSellingProducts?.map((item) => item.product) || []
              }
              data={data?.topSellingProducts?.map((item) => item.sales) || []}
              colors={chartColors.products}
              dataLabel="Sales"
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Orders by Status"
              labels={data?.ordersByStatus?.map((item) => item.status) || []}
              data={data?.ordersByStatus?.map((item) => item.count) || []}
              colors={chartColors.status}
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Sales Trend"
              labels={data?.salesTrend?.map((item) => item.month) || []}
              datasets={[
                {
                  label: 'Orders',
                  data: data?.salesTrend?.map((item) => item.orders) || [],
                  borderColor: '#1890ff',
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                },
                {
                  label: 'Revenue',
                  data: data?.salesTrend?.map((item) => item.revenue) || [],
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

export default MarketPlaceAnalytics;
