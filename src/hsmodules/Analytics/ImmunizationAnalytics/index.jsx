import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useImmunizationAnalytics } from '../../../hooks/queries/useImmunizationAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ImmunizationAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useImmunizationAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Vaccinations',
        value: (data?.totalVaccinations || 0).toLocaleString(),
        icon: 'MedicineBoxOutlined',
        color: '#1890ff',
      },
      {
        title: 'Completed',
        value: (data?.completedVaccinations || 0).toLocaleString(),
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Pending',
        value: (data?.pendingVaccinations || 0).toLocaleString(),
        icon: 'ClockCircleOutlined',
        color: '#fa8c16',
      },
      {
        title: 'Coverage Rate',
        value: `${data?.coverageRate || 0}%`,
        icon: 'PercentageOutlined',
        color: '#13c2c2',
      },
    ],
    [data],
  );

  const iconMap = {
    MedicineBoxOutlined: <MedicineBoxOutlined style={{ fontSize: 24 }} />,
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    ClockCircleOutlined: <ClockCircleOutlined style={{ fontSize: 24 }} />,
    PercentageOutlined: <PercentageOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    primary: '#1890ff',
    success: '#52c41a',
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
              title="Vaccinations by Type"
              labels={data?.vaccinationsByType?.map((item) => item.vaccine) || []}
              data={data?.vaccinationsByType?.map((item) => item.count) || []}
              colors={Array(data?.vaccinationsByType?.length || 0).fill(chartColors.primary)}
              dataLabel="Vaccinations"
            />
          </Col>
          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Vaccinations by Age Group"
              labels={data?.vaccinationsByAgeGroup?.map((item) => item.ageGroup) || []}
              data={data?.vaccinationsByAgeGroup?.map((item) => item.count) || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']}
            />
          </Col>
          <Col xs={24}>
            <LineChartCard
              title="Daily Vaccinations Trend"
              labels={data?.dailyVaccinations?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Vaccinations',
                  data: data?.dailyVaccinations?.map((item) => item.count) || [],
                  borderColor: chartColors.primary,
                  backgroundColor: chartColors.primary + '20',
                },
              ]}
              yAxisLabel="Count"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ImmunizationAnalytics;
