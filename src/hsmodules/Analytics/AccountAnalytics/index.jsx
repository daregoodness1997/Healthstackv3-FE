import React, { useContext } from 'react';
import { Card, Col, Row, DatePicker, Button, Select } from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined,
  CalendarOutlined,
  SyncOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { UserContext } from '../../../context';
import { useAccountsAnalytics } from '../../../hooks/queries/useAccountsAnalytics';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  StatCard,
  LineChartCard,
  DoughnutChartCard,
  BarChartCard,
} from '../../../components/analytics';
import { useQueryClient } from '@tanstack/react-query';

const { RangePicker } = DatePicker;

const AccountAnalytics = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const { filters, setFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useAccountsAnalytics(
    facilityId,
    filters.startDate,
    filters.endDate,
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['accounts-analytics'] });
    refetch();
  };

  const handleExport = () => {
    console.log('Exporting accounts report...');
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        Loading analytics...
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '24px' }}>
        <div
          style={{ textAlign: 'center', color: 'red', marginBottom: '16px' }}
        >
          Error loading analytics data: {error?.message || 'Unknown error'}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={handleRefresh} type="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Use data with safe fallbacks
  const accountsData = data || {
    totalRevenue: 0,
    totalExpenses: 0,
    outstandingPayments: 0,
    revenueByDepartment: [],
    expensesByCategory: [],
    monthlyTrend: [],
  };

  const stats = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: `₦${accountsData.totalRevenue?.toLocaleString() || '0'}`,
      change: '+12',
      trend: 'up',
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: `₦${accountsData.totalExpenses?.toLocaleString() || '0'}`,
      change: '-5',
      trend: 'down',
    },
    {
      id: 'outstanding',
      title: 'Outstanding Payments',
      value: `₦${accountsData.outstandingPayments?.toLocaleString() || '0'}`,
      change: '+8',
      trend: 'up',
    },
    {
      id: 'profit',
      title: 'Net Profit',
      value: `₦${((accountsData.totalRevenue || 0) - (accountsData.totalExpenses || 0)).toLocaleString()}`,
      change: '+15',
      trend: 'up',
    },
  ];

  const statIcons = {
    revenue: <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
    expenses: <FallOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
    outstanding: (
      <WalletOutlined style={{ fontSize: '24px', color: '#faad14' }} />
    ),
    profit: <RiseOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
  };

  const statBgColors = {
    revenue: '#f6ffed',
    expenses: '#fff1f0',
    outstanding: '#fffbe6',
    profit: '#e6f7ff',
  };

  return (
    <div>
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Select
              value={filters.timeRange}
              onChange={(value) => setFilters({ timeRange: value })}
              style={{ minWidth: '140px' }}
              options={[
                { value: '1 Month', label: 'Last Month' },
                { value: '3 Months', label: 'Last 3 Months' },
                { value: '6 Months', label: 'Last 6 Months' },
                { value: '1 Year', label: 'Last Year' },
              ]}
            />
            <RangePicker
              suffixIcon={<CalendarOutlined />}
              style={{ minWidth: '260px' }}
              placeholder={['Start Date', 'End Date']}
              onChange={(dates) => {
                if (dates) {
                  setFilters({
                    startDate: dates[0]?.toISOString(),
                    endDate: dates[1]?.toISOString(),
                  });
                } else {
                  setFilters({ startDate: undefined, endDate: undefined });
                }
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Button
              icon={<SyncOutlined />}
              type="default"
              onClick={handleRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button
              icon={<PrinterOutlined />}
              type="default"
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              onClick={handleExport}
            >
              Export Report
            </Button>
          </div>
        </div>
      </Card>

      <div
        style={{
          width: '100%',
          background: '#f1f1f1',
          minHeight: '100vh',
          padding: '24px',
        }}
      >
        {/* Stat Cards */}
        <Row gutter={[16, 16]}>
          {stats.map((stat) => (
            <Col key={stat.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <StatCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={statIcons[stat.id]}
                bgColor={statBgColors[stat.id]}
              />
            </Col>
          ))}
        </Row>

        {/* Revenue by Department */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} md={12}>
            <BarChartCard
              title="Revenue by Department"
              labels={
                data?.revenueByDepartment?.map((item) => item.department) || []
              }
              data={data?.revenueByDepartment?.map((item) => item.amount) || []}
              colors={['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']}
              dataLabel="Revenue"
            />
          </Col>

          {/* Expenses by Category */}
          <Col xs={24} md={12}>
            <DoughnutChartCard
              title="Expenses by Category"
              labels={
                data?.expensesByCategory?.map((item) => item.category) || []
              }
              data={data?.expensesByCategory?.map((item) => item.amount) || []}
              colors={['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']}
            />
          </Col>
        </Row>

        {/* Monthly Financial Trend */}
        <Row style={{ marginTop: '24px' }}>
          <Col xs={24}>
            <LineChartCard
              title="Monthly Financial Trend"
              labels={data?.monthlyTrend?.map((item) => item.month) || []}
              datasets={[
                {
                  label: 'Revenue',
                  data: data?.monthlyTrend?.map((item) => item.revenue) || [],
                  borderColor: '#52c41a',
                  backgroundColor: 'rgba(82, 196, 26, 0.1)',
                },
                {
                  label: 'Expenses',
                  data: data?.monthlyTrend?.map((item) => item.expenses) || [],
                  borderColor: '#f5222d',
                  backgroundColor: 'rgba(245, 34, 45, 0.1)',
                },
              ]}
              yAxisLabel="Amount (₦)"
              xAxisLabel="Month"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AccountAnalytics;
