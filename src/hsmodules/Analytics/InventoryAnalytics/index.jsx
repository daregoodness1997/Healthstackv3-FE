import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useInventoryAnalytics } from '../../../hooks/queries/useInventoryAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  InboxOutlined,
  WarningOutlined,
  StopOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const InventoryAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useInventoryAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const formatCurrency = (value) => `₦${(value || 0).toLocaleString()}`;

  const stats = useMemo(
    () => [
      {
        title: 'Total Items',
        value: (data?.totalItems || 0).toLocaleString(),
        icon: 'InboxOutlined',
        color: '#1890ff',
      },
      {
        title: 'Low Stock Items',
        value: (data?.lowStockItems || 0).toLocaleString(),
        icon: 'WarningOutlined',
        color: '#fa8c16',
      },
      {
        title: 'Out of Stock',
        value: (data?.outOfStockItems || 0).toLocaleString(),
        icon: 'StopOutlined',
        color: '#ff4d4f',
      },
      {
        title: 'Total Value',
        value: formatCurrency(data?.totalValue),
        icon: 'DollarOutlined',
        color: '#52c41a',
      },
    ],
    [data],
  );

  const iconMap = {
    InboxOutlined: <InboxOutlined style={{ fontSize: 24 }} />,
    WarningOutlined: <WarningOutlined style={{ fontSize: 24 }} />,
    StopOutlined: <StopOutlined style={{ fontSize: 24 }} />,
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
              title="Items by Category"
              labels={data?.itemsByCategory?.map((item) => item.category) || []}
              data={data?.itemsByCategory?.map((item) => item.count) || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']}
            />
          </Col>
          <Col xs={24} lg={12}>
            <BarChartCard
              title="Top Moving Items"
              labels={data?.topMovingItems?.map((item) => item.name) || []}
              data={data?.topMovingItems?.map((item) => item.quantity) || []}
              colors={Array(data?.topMovingItems?.length || 0).fill('#1890ff')}
              dataLabel="Quantity"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
