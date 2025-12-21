import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useEpidemiologyAnalytics } from '../../../hooks/queries/useEpidemiologyAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  FileProtectOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const EpidemiologyAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useEpidemiologyAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Cases',
        value: data?.totalCases || 0,
        icon: 'FileProtectOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Cases',
        value: data?.activeCases || 0,
        icon: 'AlertOutlined',
        color: '#f5222d',
      },
      {
        title: 'Resolved Cases',
        value: data?.resolvedCases || 0,
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Outbreak Alerts',
        value: data?.outbreakAlerts || 0,
        icon: 'WarningOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    FileProtectOutlined: <FileProtectOutlined style={{ fontSize: 24 }} />,
    AlertOutlined: <AlertOutlined style={{ fontSize: 24 }} />,
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    WarningOutlined: <WarningOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    disease: [
      '#f5222d',
      '#fa541c',
      '#fa8c16',
      '#faad14',
      '#a0d911',
      '#52c41a',
      '#13c2c2',
    ],
    region: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2'],
    trend: '#f5222d',
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
              title="Cases by Disease"
              labels={data?.casesByDisease?.map((item) => item.disease) || []}
              data={data?.casesByDisease?.map((item) => item.count) || []}
              colors={chartColors.disease}
              dataLabel="Cases"
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Cases by Region"
              labels={data?.casesByRegion?.map((item) => item.region) || []}
              data={data?.casesByRegion?.map((item) => item.count) || []}
              colors={chartColors.region}
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Trends Over Time"
              labels={data?.trendsOverTime?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Cases',
                  data: data?.trendsOverTime?.map((item) => item.cases) || [],
                  borderColor: chartColors.trend,
                  backgroundColor: 'rgba(245, 34, 45, 0.1)',
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EpidemiologyAnalytics;
