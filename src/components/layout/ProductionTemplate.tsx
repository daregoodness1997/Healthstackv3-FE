/**
 * Real-World Dashboard Template
 *
 * This is a complete, production-ready dashboard example that you can copy
 * and customize for your specific module needs.
 */

import React, { useState, useContext } from 'react';
import { Button, Table, Space, Tag, Avatar, Dropdown } from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  DashboardWrapper,
  StatCard,
  GridLayout,
  GridCol,
  Section,
  ContentCard,
  EmptyState,
} from '../../../components/layout';
import { Col } from 'antd';
import { UserContext } from '../../../context';

/**
 * Production-Ready Dashboard Component
 * Demonstrates all features and best practices
 */
const ProductionDashboard = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Mock data - Replace with real API calls
  const stats = {
    totalClients: 1234,
    activeToday: 45,
    revenue: '₦2,450,000',
    appointments: 89,
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Patient',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: 'green',
          pending: 'orange',
          inactive: 'red',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `₦${amount.toLocaleString()}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'View Details',
                onClick: () => handleView(record),
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit',
                onClick: () => handleEdit(record),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
                danger: true,
                onClick: () => handleDelete(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Mock table data
  const dataSource = [
    {
      key: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      lastVisit: '2024-12-01',
      amount: 50000,
      avatar: null,
    },
    {
      key: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'pending',
      lastVisit: '2024-11-28',
      amount: 75000,
      avatar: null,
    },
    {
      key: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'active',
      lastVisit: '2024-12-02',
      amount: 120000,
      avatar: null,
    },
  ];

  // Action handlers
  const handleView = (record: any) => {
    console.log('View:', record);
  };

  const handleEdit = (record: any) => {
    console.log('Edit:', record);
  };

  const handleDelete = (record: any) => {
    console.log('Delete:', record);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleAddNew = () => {
    console.log('Add new');
  };

  // Row selection
  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: any) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  return (
    <DashboardWrapper
      title={`Welcome back, ${user?.currentEmployee?.firstname || 'User'}`}
      subtitle="Here's what's happening in your facility today"
      extra={
        <Space>
          <Button icon={<FilterOutlined />}>Filter</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Export
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New
          </Button>
        </Space>
      }
    >
      {/* Statistics Overview */}
      <GridLayout gutter={[16, 16]}>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<UserOutlined />}
            color="#1890ff"
            trend={{ value: 12.5, isPositive: true }}
            loading={loading}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Active Today"
            value={stats.activeToday}
            icon={<CalendarOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            icon={<DollarOutlined />}
            color="#722ed1"
            trend={{ value: 8.2, isPositive: true }}
            loading={loading}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Appointments"
            value={stats.appointments}
            icon={<CalendarOutlined />}
            color="#faad14"
            trend={{ value: 3.1, isPositive: false }}
            loading={loading}
          />
        </Col>
      </GridLayout>

      {/* Recent Activity Section */}
      <Section
        title="Recent Patients"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
            <Button type="link">View All</Button>
          </Space>
        }
        spacing="32px"
      >
        <ContentCard>
          {dataSource.length > 0 ? (
            <Table
              dataSource={dataSource}
              columns={columns}
              rowSelection={rowSelection}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
              }}
              loading={loading}
            />
          ) : (
            <EmptyState
              icon={<UserOutlined />}
              title="No patients found"
              description="Start by adding your first patient record"
              action={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddNew}
                >
                  Add Patient
                </Button>
              }
            />
          )}
        </ContentCard>
      </Section>

      {/* Two Column Section - Charts & Activity */}
      <GridLayout gutter={[16, 16]}>
        <Col {...GridCol.TwoThirds}>
          <Section title="Revenue Trends">
            <ContentCard>
              <div
                style={{
                  height: 300,
                  background: '#fafafa',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8c8c8c',
                }}
              >
                Chart Component Goes Here
                <br />
                (e.g., Recharts, Chart.js, etc.)
              </div>
            </ContentCard>
          </Section>
        </Col>

        <Col {...GridCol.Third}>
          <Section title="Quick Stats">
            <ContentCard>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: '100%' }}
              >
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                    Average Visit Duration
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#1890ff',
                    }}
                  >
                    45 mins
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                    Patient Satisfaction
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#52c41a',
                    }}
                  >
                    4.8/5.0
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                    Pending Appointments
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#faad14',
                    }}
                  >
                    12
                  </div>
                </div>
              </Space>
            </ContentCard>
          </Section>
        </Col>
      </GridLayout>

      {/* Additional Information */}
      <Section title="Additional Information">
        <GridLayout gutter={[16, 16]}>
          <Col {...GridCol.Third}>
            <ContentCard title="Recent Activity">
              <div style={{ padding: '16px 0' }}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <div
                    style={{
                      borderLeft: '3px solid #1890ff',
                      paddingLeft: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>Patient checked in</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      2 mins ago
                    </div>
                  </div>
                  <div
                    style={{
                      borderLeft: '3px solid #52c41a',
                      paddingLeft: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>Payment received</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      15 mins ago
                    </div>
                  </div>
                  <div
                    style={{
                      borderLeft: '3px solid #722ed1',
                      paddingLeft: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>New appointment</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      1 hour ago
                    </div>
                  </div>
                </Space>
              </div>
            </ContentCard>
          </Col>

          <Col {...GridCol.Third}>
            <ContentCard title="Upcoming Tasks">
              <div style={{ padding: '16px 0' }}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <div>
                    <Tag color="red">Urgent</Tag>
                    <span style={{ marginLeft: 8 }}>Follow-up call</span>
                  </div>
                  <div>
                    <Tag color="orange">High</Tag>
                    <span style={{ marginLeft: 8 }}>Review lab results</span>
                  </div>
                  <div>
                    <Tag color="blue">Normal</Tag>
                    <span style={{ marginLeft: 8 }}>
                      Update patient records
                    </span>
                  </div>
                </Space>
              </div>
            </ContentCard>
          </Col>

          <Col {...GridCol.Third}>
            <ContentCard title="Notifications">
              <div style={{ padding: '16px 0' }}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <div style={{ fontSize: '13px' }}>
                    <div>🔔 New message from Dr. Smith</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                      5 mins ago
                    </div>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <div>📋 Lab results ready</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                      20 mins ago
                    </div>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <div>✅ Appointment confirmed</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                      1 hour ago
                    </div>
                  </div>
                </Space>
              </div>
            </ContentCard>
          </Col>
        </GridLayout>
      </Section>
    </DashboardWrapper>
  );
};

export default ProductionDashboard;

/**
 * HOW TO USE THIS TEMPLATE:
 *
 * 1. Copy this file to your module folder
 * 2. Update the stats with your actual data
 * 3. Modify the table columns for your data model
 * 4. Replace mock data with API calls
 * 5. Customize colors and icons to match your module
 * 6. Add your specific business logic
 * 7. Update action handlers with real functionality
 *
 * RECOMMENDED STRUCTURE:
 * - Keep statistics in the top row
 * - Main data table in the middle
 * - Additional charts/info at the bottom
 * - Use consistent spacing (16px/24px/32px)
 * - Add loading states for all async operations
 * - Include empty states when no data
 */
