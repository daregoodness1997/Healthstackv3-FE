import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useWardAnalytics } from '../../../hooks/queries/useWardAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  HomeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  PercentageOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const WardAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useWardAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const occupancyRate = (
    (data?.occupiedBeds / data?.totalBeds) * 100 || 0
  ).toFixed(1);

  const stats = useMemo(
    () => [
      {
        title: 'Total Beds',
        value: (data?.totalBeds || 0).toLocaleString(),
        icon: 'HomeOutlined',
        color: '#1890ff',
      },
      {
        title: 'Occupied Beds',
        value: (data?.occupiedBeds || 0).toLocaleString(),
        icon: 'CloseCircleOutlined',
        color: '#ff4d4f',
      },
      {
        title: 'Available Beds',
        value: (data?.availableBeds || 0).toLocaleString(),
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Occupancy Rate',
        value: `${occupancyRate}%`,
        icon: 'PercentageOutlined',
        color: '#13c2c2',
      },
    ],
    [data, occupancyRate],
  );

  const iconMap = {
    HomeOutlined: <HomeOutlined style={{ fontSize: 24 }} />,
    CloseCircleOutlined: <CloseCircleOutlined style={{ fontSize: 24 }} />,
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    PercentageOutlined: <PercentageOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
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
              title="Admissions by Ward"
              labels={data?.admissionsByWard?.map((item) => item.ward) || []}
              data={data?.admissionsByWard?.map((item) => item.count) || []}
              colors={Array(data?.admissionsByWard?.length || 0).fill(chartColors.primary)}
              dataLabel="Admissions"
            />
          </Col>
          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Discharges by Status"
              labels={data?.dischargesByStatus?.map((item) => item.status) || []}
              data={data?.dischargesByStatus?.map((item) => item.count) || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']}
            />
          </Col>
          <Col xs={24}>
            <LineChartCard
              title="Daily Admissions Trend"
              labels={data?.dailyAdmissions?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Admissions',
                  data: data?.dailyAdmissions?.map((item) => item.count) || [],
                  borderColor: chartColors.primary,
                  backgroundColor: chartColors.primary + '20',
                },
              ]}
              yAxisLabel="Admissions"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WardAnalytics;
