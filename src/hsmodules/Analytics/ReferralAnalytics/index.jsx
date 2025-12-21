import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useReferralAnalytics } from '../../../hooks/queries/useReferralAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  SwapOutlined,
  LoginOutlined,
  LogoutOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ReferralAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useReferralAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Referrals',
        value: (data?.totalReferrals || 0).toLocaleString(),
        icon: 'SwapOutlined',
        color: '#1890ff',
      },
      {
        title: 'Incoming',
        value: (data?.incomingReferrals || 0).toLocaleString(),
        icon: 'LoginOutlined',
        color: '#52c41a',
      },
      {
        title: 'Outgoing',
        value: (data?.outgoingReferrals || 0).toLocaleString(),
        icon: 'LogoutOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Avg Response Time',
        value: `${data?.averageResponseTime || 0} hrs`,
        icon: 'FieldTimeOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    SwapOutlined: <SwapOutlined style={{ fontSize: 24 }} />,
    LoginOutlined: <LoginOutlined style={{ fontSize: 24 }} />,
    LogoutOutlined: <LogoutOutlined style={{ fontSize: 24 }} />,
    FieldTimeOutlined: <FieldTimeOutlined style={{ fontSize: 24 }} />,
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
            <DoughnutChartCard
              title="Referrals by Status"
              labels={data?.referralsByStatus?.map((item) => item.status) || []}
              data={data?.referralsByStatus?.map((item) => item.count) || []}
              colors={['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']}
            />
          </Col>
          <Col xs={24} lg={12}>
            <BarChartCard
              title="Referrals by Specialty"
              labels={data?.referralsBySpecialty?.map((item) => item.specialty) || []}
              data={data?.referralsBySpecialty?.map((item) => item.count) || []}
              colors={Array(data?.referralsBySpecialty?.length || 0).fill(chartColors.primary)}
              dataLabel="Referrals"
            />
          </Col>
          <Col xs={24}>
            <LineChartCard
              title="Monthly Referrals Trend"
              labels={data?.monthlyReferrals?.map((item) => item.month) || []}
              datasets={[
                {
                  label: 'Outgoing',
                  data: data?.monthlyReferrals?.map((item) => item.outgoing) || [],
                  borderColor: chartColors.primary,
                  backgroundColor: chartColors.primary + '20',
                },
                {
                  label: 'Incoming',
                  data: data?.monthlyReferrals?.map((item) => item.incoming) || [],
                  borderColor: '#52c41a',
                  backgroundColor: '#52c41a' + '20',
                },
              ]}
              yAxisLabel="Referrals"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ReferralAnalytics;
