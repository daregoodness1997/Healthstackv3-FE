/**
 * Migration Guide: Converting to New Dashboard Wrapper
 *
 * This file shows before/after examples of converting existing dashboard pages
 * to use the new DashboardWrapper components.
 */

import React from 'react';
import { Button, Table } from 'antd';
import { PlusOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import {
  DashboardWrapper,
  StatCard,
  GridLayout,
  GridCol,
  Section,
  ContentCard,
} from '../../components/layout';
import { Col } from 'antd';

/**
 * BEFORE: Old Dashboard Pattern
 * ================================
 *
 * const OldDashboard = () => {
 *   return (
 *     <div style={{ padding: '24px' }}>
 *       <div style={{ marginBottom: '24px' }}>
 *         <h2>Client Dashboard</h2>
 *       </div>
 *
 *       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
 *         <div style={{ background: '#1890ff', padding: '20px', borderRadius: '8px' }}>
 *           <div style={{ color: 'white' }}>Total Clients</div>
 *           <div style={{ fontSize: '24px', color: 'white' }}>1,234</div>
 *         </div>
 *         ...more stats
 *       </div>
 *
 *       <div style={{ marginTop: '24px', background: 'white', padding: '24px' }}>
 *         <h3>Recent Clients</h3>
 *         <Table dataSource={data} columns={columns} />
 *       </div>
 *     </div>
 *   );
 * };
 */

/**
 * AFTER: New Dashboard Pattern with DashboardWrapper
 * ===================================================
 */
export const ModernClientDashboard = () => {
  // Your data and logic here
  const clientStats = {
    total: 1234,
    active: 980,
    revenue: '₦2.5M',
    newToday: 45,
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const data = [
    { key: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' },
    // ... more data
  ];

  return (
    <DashboardWrapper
      title="Client Dashboard"
      subtitle="Manage and monitor your clients"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          Add New Client
        </Button>
      }
    >
      {/* Stats Overview Section */}
      <GridLayout gutter={[16, 16]}>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Total Clients"
            value={clientStats.total}
            icon={<UserOutlined />}
            color="#1890ff"
            trend={{ value: 12, isPositive: true }}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Active Clients"
            value={clientStats.active}
            icon={<UserOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Total Revenue"
            value={clientStats.revenue}
            icon={<DollarOutlined />}
            color="#722ed1"
            trend={{ value: 8, isPositive: true }}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="New Today"
            value={clientStats.newToday}
            icon={<UserOutlined />}
            color="#faad14"
          />
        </Col>
      </GridLayout>

      {/* Recent Clients Section */}
      <Section
        title="Recent Clients"
        extra={<Button>View All</Button>}
        spacing="32px"
      >
        <ContentCard>
          <Table
            dataSource={data}
            columns={columns}
            pagination={{ pageSize: 10 }}
          />
        </ContentCard>
      </Section>

      {/* Additional Sections */}
      <GridLayout gutter={[16, 16]}>
        <Col {...GridCol.Half}>
          <ContentCard title="Client Distribution">
            <div
              style={{ height: 300, background: '#fafafa', borderRadius: 4 }}
            >
              Chart placeholder - Add your chart component here
            </div>
          </ContentCard>
        </Col>
        <Col {...GridCol.Half}>
          <ContentCard title="Recent Activities">
            <div
              style={{ height: 300, background: '#fafafa', borderRadius: 4 }}
            >
              Activity list placeholder
            </div>
          </ContentCard>
        </Col>
      </GridLayout>
    </DashboardWrapper>
  );
};

/**
 * STEP-BY-STEP MIGRATION GUIDE
 * =============================
 *
 * 1. Replace container div with DashboardWrapper:
 *    <div> → <DashboardWrapper title="..." subtitle="...">
 *
 * 2. Convert manual grid to GridLayout:
 *    <div style={{ display: 'grid' }}> → <GridLayout gutter={[16, 16]}>
 *
 * 3. Use GridCol for responsive columns:
 *    <div> → <Col {...GridCol.Quarter}> or <Col {...GridCol.Half}>
 *
 * 4. Replace custom stat cards with StatCard:
 *    <div style={{ background: '#1890ff' }}> → <StatCard title="..." value={...} />
 *
 * 5. Wrap content sections with Section and ContentCard:
 *    <div> → <Section title="..."><ContentCard>...</ContentCard></Section>
 *
 * 6. Add icons from @ant-design/icons:
 *    import { UserOutlined, DollarOutlined } from '@ant-design/icons';
 *
 * 7. Use 'extra' prop for header actions:
 *    <DashboardWrapper extra={<Button>Action</Button>}>
 */

/**
 * BENEFITS OF NEW PATTERN
 * ========================
 *
 * ✅ Consistent styling across all dashboards
 * ✅ Automatic responsive behavior
 * ✅ Reduced boilerplate code
 * ✅ Better accessibility
 * ✅ Smooth animations and transitions
 * ✅ Built-in loading states
 * ✅ Standardized spacing and shadows
 * ✅ Easy to maintain and update
 * ✅ Type-safe with TypeScript
 * ✅ Follows Ant Design guidelines
 */

export default ModernClientDashboard;
