import React, { useContext } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space, Spin } from 'antd';
import { UserContext } from '../../../context';
import { clientAnalyticsService } from '../../../services/analytics/clientAnalytics.service';
import { StatCard } from '../../../components/analytics/StatCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import { useQuery } from '@tanstack/react-query';
import {
  UserOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ClientAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['client-analytics', filters],
    queryFn: async () => {
      const stats = await clientAnalyticsService.getStats(filters);
      const registrationTimeline =
        await clientAnalyticsService.getRegistrationTimeline(filters);
      const ageDistribution =
        await clientAnalyticsService.getAgeDistribution(filters);
      const genderDistribution =
        await clientAnalyticsService.getGenderDistribution(filters);
      return {
        stats,
        registrationTimeline,
        ageDistribution,
        genderDistribution,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const iconMap = {
    'total-clients': <UserOutlined style={{ fontSize: 24 }} />,
    'new-clients': <UserAddOutlined style={{ fontSize: 24 }} />,
    'active-clients': <CheckCircleOutlined style={{ fontSize: 24 }} />,
    'inactive-clients': <CloseCircleOutlined style={{ fontSize: 24 }} />,
  };

  const colorMap = {
    'total-clients': '#1890ff',
    'new-clients': '#52c41a',
    'active-clients': '#13c2c2',
    'inactive-clients': '#fa8c16',
  };

  if (isLoading)
    return (
      <div style={{ padding: 24 }}>
        <Spin size="large" />
      </div>
    );
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
          {data?.stats?.map((stat) => (
            <Col key={stat.id} xs={24} sm={12} lg={6}>
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={iconMap[stat.id]}
                color={colorMap[stat.id]}
              />
            </Col>
          ))}
        </Row>

        {/* Charts Grid */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <LineChartCard
              title="Client Registration Timeline"
              labels={data?.registrationTimeline?.labels || []}
              datasets={(data?.registrationTimeline?.datasets || []).map(
                (ds) => ({
                  label: ds.label,
                  data: ds.data,
                  borderColor: ds.borderColor,
                  backgroundColor: ds.backgroundColor,
                }),
              )}
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Age Distribution"
              labels={data?.ageDistribution?.labels || []}
              data={data?.ageDistribution?.data || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2']}
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Gender Distribution"
              labels={data?.genderDistribution?.labels || []}
              data={data?.genderDistribution?.data || []}
              colors={['#1890ff', '#f5222d', '#faad14']}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ClientAnalytics;
