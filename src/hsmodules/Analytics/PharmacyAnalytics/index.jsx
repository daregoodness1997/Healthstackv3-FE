import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { usePharmacyAnalytics } from '../../../hooks/queries/usePharmacyAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  MedicineBoxOutlined,
  DollarOutlined,
  WarningOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const PharmacyAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = usePharmacyAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const formatCurrency = (value) => `₦${(value || 0).toLocaleString()}`;

  const stats = useMemo(
    () => [
      {
        title: 'Total Prescriptions',
        value: (data?.totalPrescriptions || 0).toLocaleString(),
        icon: 'MedicineBoxOutlined',
        color: '#1890ff',
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(data?.totalRevenue),
        icon: 'DollarOutlined',
        color: '#52c41a',
      },
      {
        title: 'Low Stock Items',
        value: (data?.lowStockItems?.length || 0).toLocaleString(),
        icon: 'WarningOutlined',
        color: '#fa8c16',
      },
      {
        title: 'Average Daily Sales',
        value: formatCurrency((data?.totalRevenue || 0) / 30),
        icon: 'LineChartOutlined',
        color: '#13c2c2',
      },
    ],
    [data],
  );

  const iconMap = {
    MedicineBoxOutlined: <MedicineBoxOutlined style={{ fontSize: 24 }} />,
    DollarOutlined: <DollarOutlined style={{ fontSize: 24 }} />,
    WarningOutlined: <WarningOutlined style={{ fontSize: 24 }} />,
    LineChartOutlined: <LineChartOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    revenue: '#52c41a',
    primary: '#1890ff',
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
              title="Top Selling Drugs"
              labels={data?.topSellingDrugs?.map((item) => item.name) || []}
              data={data?.topSellingDrugs?.map((item) => item.quantity) || []}
              colors={Array(data?.topSellingDrugs?.length || 0).fill(chartColors.primary)}
              dataLabel="Quantity"
            />
          </Col>
          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Prescriptions by Status"
              labels={data?.prescriptionsByStatus?.map((item) => item.status) || []}
              data={data?.prescriptionsByStatus?.map((item) => item.count) || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']}
            />
          </Col>
          <Col xs={24}>
            <LineChartCard
              title="Daily Sales Trend"
              labels={data?.dailySales?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Revenue',
                  data: data?.dailySales?.map((item) => item.revenue) || [],
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

export default PharmacyAnalytics;
