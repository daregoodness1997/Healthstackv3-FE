import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useTheatreAnalytics } from '../../../hooks/queries/useTheatreAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  ScissorOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  PercentageOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const TheatreAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useTheatreAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Surgeries',
        value: (data?.totalSurgeries || 0).toLocaleString(),
        icon: 'ScissorOutlined',
        color: '#1890ff',
      },
      {
        title: 'Completed',
        value: (data?.completedSurgeries || 0).toLocaleString(),
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Scheduled',
        value: (data?.scheduledSurgeries || 0).toLocaleString(),
        icon: 'CalendarOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Utilization Rate',
        value: `${data?.theatreUtilizationRate || 0}%`,
        icon: 'PercentageOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    ScissorOutlined: <ScissorOutlined style={{ fontSize: 24 }} />,
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    CalendarOutlined: <CalendarOutlined style={{ fontSize: 24 }} />,
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
              title="Surgeries by Type"
              labels={data?.surgeriesByType?.map((item) => item.type) || []}
              data={data?.surgeriesByType?.map((item) => item.count) || []}
              colors={Array(data?.surgeriesByType?.length || 0).fill(chartColors.primary)}
              dataLabel="Surgeries"
            />
          </Col>
          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Surgeries by Theatre"
              labels={data?.surgeriesByTheatre?.map((item) => item.theatre) || []}
              data={data?.surgeriesByTheatre?.map((item) => item.count) || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']}
            />
          </Col>
          <Col xs={24}>
            <LineChartCard
              title="Daily Surgeries Trend"
              labels={data?.dailySurgeries?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Surgeries',
                  data: data?.dailySurgeries?.map((item) => item.count) || [],
                  borderColor: chartColors.primary,
                  backgroundColor: chartColors.primary + '20',
                },
              ]}
              yAxisLabel="Surgeries"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TheatreAnalytics;
