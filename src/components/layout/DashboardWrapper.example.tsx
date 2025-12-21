/**
 * DashboardWrapper Usage Examples
 *
 * This file demonstrates various ways to use the DashboardWrapper components
 * for creating consistent, beautiful dashboard layouts.
 */

import React from 'react';
import { Button, Space } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  PlusOutlined,
  FileOutlined,
} from '@ant-design/icons';
import {
  DashboardWrapper,
  StatCard,
  GridLayout,
  GridCol,
  Section,
  ContentCard,
  EmptyState,
} from './DashboardWrapper';
import { Col } from 'antd';

/**
 * Example 1: Basic Dashboard with Stats
 */
export const BasicDashboardExample = () => {
  return (
    <DashboardWrapper
      title="Dashboard Overview"
      subtitle="Welcome back! Here's what's happening today."
      extra={
        <Space>
          <Button>Export</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            New Entry
          </Button>
        </Space>
      }
    >
      {/* Stats Grid */}
      <GridLayout gutter={[16, 16]}>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Total Patients"
            value={1234}
            icon={<UserOutlined />}
            color="#1890ff"
            trend={{ value: 12, isPositive: true }}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Revenue"
            value="₦2.5M"
            icon={<DollarOutlined />}
            color="#52c41a"
            trend={{ value: 8, isPositive: true }}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Appointments"
            value={89}
            icon={<ShoppingCartOutlined />}
            color="#faad14"
            trend={{ value: 3, isPositive: false }}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Staff Online"
            value={45}
            icon={<TeamOutlined />}
            color="#722ed1"
          />
        </Col>
      </GridLayout>

      {/* Content Sections */}
      <Section title="Recent Activity" spacing="32px">
        <ContentCard title="Patient Visits">
          <p>Content goes here...</p>
        </ContentCard>
      </Section>
    </DashboardWrapper>
  );
};

/**
 * Example 2: Two-Column Layout
 */
export const TwoColumnLayoutExample = () => {
  return (
    <DashboardWrapper title="Patient Overview">
      <GridLayout>
        <Col {...GridCol.TwoThirds}>
          <ContentCard title="Patient Details" bordered={false}>
            <p>Main content area - 2/3 width</p>
          </ContentCard>
        </Col>
        <Col {...GridCol.Third}>
          <ContentCard title="Quick Actions" bordered={false}>
            <p>Sidebar content - 1/3 width</p>
          </ContentCard>
        </Col>
      </GridLayout>
    </DashboardWrapper>
  );
};

/**
 * Example 3: Empty State
 */
export const EmptyStateExample = () => {
  return (
    <DashboardWrapper title="Appointments">
      <ContentCard>
        <EmptyState
          icon={<FileOutlined />}
          title="No appointments found"
          description="Get started by creating your first appointment"
          action={
            <Button type="primary" icon={<PlusOutlined />}>
              Create Appointment
            </Button>
          }
        />
      </ContentCard>
    </DashboardWrapper>
  );
};

/**
 * Example 4: Complex Multi-Section Dashboard
 */
export const ComplexDashboardExample = () => {
  return (
    <DashboardWrapper
      title="Analytics Dashboard"
      subtitle="Real-time insights and metrics"
    >
      {/* Top Stats Row */}
      <Section spacing="24px">
        <GridLayout gutter={[16, 16]}>
          <Col {...GridCol.Quarter}>
            <StatCard
              title="Active Users"
              value={5420}
              icon={<UserOutlined />}
              color="#1890ff"
              loading={false}
            />
          </Col>
          <Col {...GridCol.Quarter}>
            <StatCard
              title="Revenue"
              value="₦15.2M"
              icon={<DollarOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col {...GridCol.Quarter}>
            <StatCard
              title="Orders"
              value={892}
              icon={<ShoppingCartOutlined />}
              color="#faad14"
            />
          </Col>
          <Col {...GridCol.Quarter}>
            <StatCard
              title="Team Members"
              value={24}
              icon={<TeamOutlined />}
              color="#722ed1"
            />
          </Col>
        </GridLayout>
      </Section>

      {/* Charts Section */}
      <Section title="Performance" extra={<Button>View Details</Button>}>
        <GridLayout gutter={[16, 16]}>
          <Col {...GridCol.TwoThirds}>
            <ContentCard title="Revenue Trends">
              <div
                style={{ height: 300, background: '#fafafa', borderRadius: 4 }}
              >
                Chart placeholder
              </div>
            </ContentCard>
          </Col>
          <Col {...GridCol.Third}>
            <ContentCard title="Top Products">
              <div
                style={{ height: 300, background: '#fafafa', borderRadius: 4 }}
              >
                List placeholder
              </div>
            </ContentCard>
          </Col>
        </GridLayout>
      </Section>

      {/* Tables Section */}
      <Section title="Recent Transactions">
        <ContentCard>
          <div
            style={{ minHeight: 400, background: '#fafafa', borderRadius: 4 }}
          >
            Table placeholder
          </div>
        </ContentCard>
      </Section>
    </DashboardWrapper>
  );
};

/**
 * Example 5: Loading State
 */
export const LoadingStateExample = () => {
  return (
    <DashboardWrapper title="Loading Dashboard">
      <GridLayout gutter={[16, 16]}>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Loading..."
            value={0}
            icon={<UserOutlined />}
            color="#1890ff"
            loading={true}
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Loading..."
            value={0}
            icon={<DollarOutlined />}
            color="#52c41a"
            loading={true}
          />
        </Col>
      </GridLayout>
    </DashboardWrapper>
  );
};

/**
 * Example 6: Responsive Grid
 */
export const ResponsiveGridExample = () => {
  return (
    <DashboardWrapper title="Responsive Layout">
      <GridLayout gutter={[16, 16]}>
        {/* Full width on mobile, half on tablet+, third on desktop */}
        <Col xs={24} sm={12} md={8}>
          <ContentCard title="Card 1">Content</ContentCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ContentCard title="Card 2">Content</ContentCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ContentCard title="Card 3">Content</ContentCard>
        </Col>
      </GridLayout>
    </DashboardWrapper>
  );
};

/**
 * Usage Instructions:
 *
 * 1. Import the components you need:
 *    import { DashboardWrapper, StatCard, GridLayout, GridCol } from '@/components/layout/DashboardWrapper';
 *
 * 2. Wrap your dashboard content:
 *    <DashboardWrapper title="My Dashboard">
 *      {Your content here}
 *    </DashboardWrapper>
 *
 * 3. Use GridLayout for responsive layouts:
 *    <GridLayout>
 *      <Col {...GridCol.Quarter}>...</Col>
 *    </GridLayout>
 *
 * 4. Use StatCard for metrics:
 *    <StatCard title="Users" value={100} icon={<UserOutlined />} color="#1890ff" />
 *
 * 5. Use Section to organize content:
 *    <Section title="My Section">
 *      <ContentCard>...</ContentCard>
 *    </Section>
 */
