import React, { useContext, useMemo } from 'react';
import { Card, Col, Row, Select, Button, DatePicker, Space } from 'antd';
import { UserContext } from '../../../context';
import { useBloodbankAnalytics } from '../../../hooks/queries/useBloodbankAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { LineChartCard } from '../../../components/analytics/LineChartCard';
import { DoughnutChartCard } from '../../../components/analytics/DoughnutChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  MedicineBoxOutlined,
  CheckCircleOutlined,
  SendOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const BloodBankAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useBloodbankAnalytics(
    facilityId,
    filters.startDate ? new Date(filters.startDate) : undefined,
    filters.endDate ? new Date(filters.endDate) : undefined,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Units',
        value: data?.totalUnits || 0,
        icon: 'MedicineBoxOutlined',
        color: '#1890ff',
      },
      {
        title: 'Available Units',
        value: data?.availableUnits || 0,
        icon: 'CheckCircleOutlined',
        color: '#52c41a',
      },
      {
        title: 'Issued Units',
        value: data?.issuedUnits || 0,
        icon: 'SendOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Expiring Soon',
        value: data?.expiringUnits?.length || 0,
        icon: 'WarningOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    MedicineBoxOutlined: <MedicineBoxOutlined style={{ fontSize: 24 }} />,
    CheckCircleOutlined: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    SendOutlined: <SendOutlined style={{ fontSize: 24 }} />,
    WarningOutlined: <WarningOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    bloodGroup: [
      '#f5222d',
      '#fa541c',
      '#fa8c16',
      '#faad14',
      '#a0d911',
      '#52c41a',
      '#13c2c2',
      '#1890ff',
    ],
    donors: ['#52c41a', '#fa8c16', '#f5222d'],
    issuance: '#f5222d',
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
              title="Units by Blood Group"
              labels={
                data?.unitsByBloodGroup?.map((item) => item.bloodGroup) || []
              }
              data={data?.unitsByBloodGroup?.map((item) => item.units) || []}
              colors={chartColors.bloodGroup}
              dataLabel="Units"
            />
          </Col>

          <Col xs={24} lg={12}>
            <DoughnutChartCard
              title="Donors by Type"
              labels={data?.donorsByType?.map((item) => item.type) || []}
              data={data?.donorsByType?.map((item) => item.count) || []}
              colors={chartColors.donors}
            />
          </Col>

          <Col xs={24}>
            <LineChartCard
              title="Daily Issuance Trend"
              labels={data?.dailyIssuance?.map((item) => item.date) || []}
              datasets={[
                {
                  label: 'Units Issued',
                  data: data?.dailyIssuance?.map((item) => item.units) || [],
                  borderColor: chartColors.issuance,
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

export default BloodBankAnalytics;
