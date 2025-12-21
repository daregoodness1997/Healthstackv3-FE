import { Card, Col, Row, DatePicker, Button, Select, Tag, Space } from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined,
  CalendarOutlined,
  SyncOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  CalendarFilled,
  ScheduleFilled,
  CheckCircleFilled,
  ClockCircleFilled,
  UserSwitchOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import { useAppointmentAnalytics } from '../../../hooks/queries/useAppointmentAnalytics';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  StatCard,
  LineChartCard,
  DoughnutChartCard,
  BarChartCard,
} from '../../../components/analytics';
import { useQueryClient } from '@tanstack/react-query';
import { appointmentAnalyticsKeys } from '../../../hooks/queries/useAppointmentAnalytics';

const { RangePicker } = DatePicker;

const AppointmentAnalyticsRefactored = () => {
  const queryClient = useQueryClient();
  const { filters, setFilters } = useAnalyticsStore();

  const { data, isLoading, isError, refetch } =
    useAppointmentAnalytics(filters);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: appointmentAnalyticsKeys.all });
    refetch();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting report...');
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    window.print();
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        Loading analytics...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'red' }}>
        Error loading analytics data
      </div>
    );
  }

  const statIcons = {
    total: <CalendarFilled style={{ fontSize: '24px', color: '#1890ff' }} />,
    scheduled: (
      <ScheduleFilled style={{ fontSize: '24px', color: '#52c41a' }} />
    ),
    followup: <SyncOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
    completed: (
      <CheckCircleFilled style={{ fontSize: '24px', color: '#52c41a' }} />
    ),
    waiting: (
      <ClockCircleFilled style={{ fontSize: '24px', color: '#722ed1' }} />
    ),
    utilization: (
      <UserSwitchOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />
    ),
    conversion: (
      <PercentageOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
    ),
  };

  const statBgColors = {
    total: '#e6f7ff',
    scheduled: '#f6ffed',
    followup: '#fffbe6',
    completed: '#f6ffed',
    waiting: '#f9f0ff',
    utilization: '#e6fffb',
    conversion: '#fff0f6',
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
            <Select
              value={filters.department}
              onChange={(value) => setFilters({ department: value })}
              placeholder="Select Department"
              style={{ minWidth: '180px' }}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'cardiology', label: 'Cardiology' },
                { value: 'neurology', label: 'Neurology' },
                { value: 'orthopedics', label: 'Orthopedics' },
                { value: 'pediatrics', label: 'Pediatrics' },
                { value: 'psychiatry', label: 'Psychiatry' },
                { value: 'radiology', label: 'Radiology' },
                { value: 'surgery', label: 'Surgery' },
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
          {data.stats.map((stat) => (
            <Col key={stat.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <StatCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={statIcons[stat.id as keyof typeof statIcons]}
                bgColor={statBgColors[stat.id as keyof typeof statBgColors]}
              />
            </Col>
          ))}
        </Row>

        {/* Appointments Status Chart */}
        <Row style={{ marginTop: '24px' }}>
          <Col xs={24}>
            <LineChartCard
              title="Appointments Status"
              labels={data.statusTimeline.labels}
              datasets={data.statusTimeline.datasets}
              yAxisLabel="Number of Appointments"
              xAxisLabel="Month"
            />
          </Col>
        </Row>

        {/* Age and Gender Charts */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} md={12}>
            <DoughnutChartCard
              title="Patient Visit by Age"
              labels={data.ageDistribution.labels}
              data={data.ageDistribution.data}
              colors={data.ageDistribution.colors}
              centerText={{
                line1: `Patients: ${data.ageDistribution.total}`,
                line2: `${data.ageDistribution.change}% less last month`,
              }}
            />
          </Col>
          <Col xs={24} md={12}>
            <DoughnutChartCard
              title="Patient Visit by Gender"
              labels={data.genderDistribution.labels}
              data={data.genderDistribution.data}
              colors={data.genderDistribution.colors}
              centerText={{
                line1: `Patients: ${data.genderDistribution.total}`,
                line2: `+${data.genderDistribution.change}% less last month`,
              }}
            />
          </Col>
        </Row>

        {/* Marital Status and Location */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} md={12}>
            <DoughnutChartCard
              title="Patients by Marital Status"
              labels={data.maritalStatus.labels}
              data={data.maritalStatus.data}
              colors={data.maritalStatus.colors}
              centerText={{
                line1: `Patients: ${data.maritalStatus.total}`,
                line2: `+${data.maritalStatus.change}% less last month`,
              }}
            />
          </Col>
          <Col xs={24} md={12}>
            <BarChartCard
              title="Appointment Location"
              labels={data.appointmentLocation.labels}
              data={data.appointmentLocation.data}
              colors={data.appointmentLocation.colors}
              dataLabel="Appointments"
              horizontal
            />
          </Col>
        </Row>

        {/* Religion and Profession */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} md={12}>
            <DoughnutChartCard
              title="Patients by Religion"
              labels={data.religionDistribution.labels}
              data={data.religionDistribution.data}
              colors={data.religionDistribution.colors}
              centerText={{
                line1: `Patients: ${data.religionDistribution.total}`,
                line2: `+${data.religionDistribution.change}% less last month`,
              }}
            />
          </Col>
          <Col xs={24} md={12}>
            <BarChartCard
              title="Patients by Profession"
              labels={data.professionDistribution.labels}
              data={data.professionDistribution.data}
              colors={data.professionDistribution.colors}
              dataLabel="Patients"
              horizontal
            />
          </Col>
        </Row>

        {/* Appointment Type and Class */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} md={12}>
            <DoughnutChartCard
              title="Appointment Type"
              labels={data.appointmentType.labels}
              data={data.appointmentType.data}
              colors={data.appointmentType.colors}
              centerText={{
                line1: `Patients: ${data.appointmentType.total}`,
                line2: `+${data.appointmentType.change}% less last month`,
              }}
            />
          </Col>
          <Col xs={24} md={12}>
            <DoughnutChartCard
              title="Appointment Class"
              labels={data.appointmentClass.labels}
              data={data.appointmentClass.data}
              colors={data.appointmentClass.colors}
              centerText={{
                line1: `Patients: ${data.appointmentClass.total}`,
                line2: `+${data.appointmentClass.change}% less last month`,
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AppointmentAnalyticsRefactored;
