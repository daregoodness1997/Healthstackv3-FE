import React, { useContext, useMemo } from 'react';
import {
  Card,
  Col,
  Row,
  Select,
  Button,
  DatePicker,
  Space,
  Statistic,
} from 'antd';
import { UserContext } from '../../../context';
import { useCorporateAnalytics } from '../../../hooks/queries/useCorporateAnalytics';
import { StatCard } from '../../../components/analytics/StatCard';
import { BarChartCard } from '../../../components/analytics/BarChartCard';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  TeamOutlined,
  FileProtectOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const CorporateAnalytics = () => {
  const { user } = useContext(UserContext);
  const { filters, setFilters, resetFilters } = useAnalyticsStore();
  const facilityId = user?.currentEmployee?.facilityId || 'default';

  const { data, isLoading, isError, error, refetch } = useCorporateAnalytics(
    facilityId,
    filters.startDate,
    filters.endDate,
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total Employees',
        value: data?.totalEmployees || 0,
        icon: 'TeamOutlined',
        color: '#1890ff',
      },
      {
        title: 'Active Plans',
        value: data?.activePlans || 0,
        icon: 'FileProtectOutlined',
        color: '#52c41a',
      },
      {
        title: 'Total Dependents',
        value: data?.totalDependents || 0,
        icon: 'UsergroupAddOutlined',
        color: '#13c2c2',
      },
      {
        title: 'Utilization Rate',
        value: `${0}%`,
        icon: 'RiseOutlined',
        color: '#fa8c16',
      },
    ],
    [data],
  );

  const iconMap = {
    TeamOutlined: <TeamOutlined style={{ fontSize: 24 }} />,
    FileProtectOutlined: <FileProtectOutlined style={{ fontSize: 24 }} />,
    UsergroupAddOutlined: <UsergroupAddOutlined style={{ fontSize: 24 }} />,
    RiseOutlined: <RiseOutlined style={{ fontSize: 24 }} />,
  };

  const chartColors = {
    department: [
      '#1890ff',
      '#52c41a',
      '#722ed1',
      '#fa8c16',
      '#13c2c2',
      '#eb2f96',
    ],
    metrics: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'],
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
          <Col xs={24} lg={16}>
            <BarChartCard
              title="Claims by Department"
              labels={
                data?.claimsByDepartment?.map((item) => item.department) || []
              }
              data={data?.claimsByDepartment?.map((item) => item.claims) || []}
              colors={chartColors.department}
              dataLabel="Claims"
            />
          </Col>

          <Col xs={24} lg={8}>
            <Card style={{ height: '100%' }}>
              <div style={{ padding: '20px 0' }}>
                <h3 style={{ marginBottom: 24, fontSize: 16, fontWeight: 600 }}>
                  Employee Engagement
                </h3>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    Enrollment Rate
                  </div>
                  <Statistic
                    value={data?.employeeEngagement?.enrollmentRate || 0}
                    suffix="%"
                    valueStyle={{ color: '#1890ff', fontSize: 32 }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    Satisfaction Score
                  </div>
                  <Statistic
                    value={data?.employeeEngagement?.satisfactionScore || 0}
                    suffix="/10"
                    valueStyle={{ color: '#52c41a', fontSize: 32 }}
                  />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24}>
            <BarChartCard
              title="Health Metrics"
              labels={data?.healthMetrics?.map((item) => item.metric) || []}
              data={data?.healthMetrics?.map((item) => item.value) || []}
              colors={chartColors.metrics}
              dataLabel="Value"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CorporateAnalytics;
