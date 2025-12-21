/**
 * Example Dashboard Page Implementations
 *
 * This file demonstrates different ways to structure dashboard pages
 * with the new layout system.
 */

import React from 'react';
import { Button, Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import DashboardPageLayout from '../../components/layout/DashboardPageLayout';
import { DashboardPageWrapper } from '../dashBoardUiComponent/core-ui/styles';

// ============================================================================
// Example 1: Modern Approach with DashboardPageLayout (Recommended)
// ============================================================================

export const ModernDashboardExample: React.FC = () => {
  return (
    <DashboardPageLayout
      title="Pharmacy Dashboard"
      breadcrumbs={[
        { title: 'Pharmacy', href: '/app/pharmacy' },
        { title: 'Dashboard' },
      ]}
      headerActions={
        <>
          <Button style={{ marginRight: 8 }}>Export</Button>
          <Button type="primary">Add Prescription</Button>
        </>
      }
    >
      {/* Your dashboard content goes here */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Patients"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Prescriptions"
              value={93}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Revenue"
              value={112893}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Activities">
        {/* Your table or list content */}
        <p>Content goes here...</p>
      </Card>
    </DashboardPageLayout>
  );
};

// ============================================================================
// Example 2: Using Legacy DashboardPageWrapper (Still Supported)
// ============================================================================

export const LegacyDashboardExample: React.FC = () => {
  return (
    <DashboardPageWrapper>
      <div style={{ padding: '20px' }}>
        <h1>Pharmacy Dashboard</h1>

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Patients"
                value={1128}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Prescriptions"
                value={93}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Revenue"
                value={112893}
                prefix={<DollarOutlined />}
                precision={2}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Recent Activities" style={{ marginTop: 24 }}>
          <p>Content goes here...</p>
        </Card>
      </div>
    </DashboardPageWrapper>
  );
};

// ============================================================================
// Example 3: Simple Direct Approach (No Wrapper)
// ============================================================================

export const SimpleDashboardExample: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Dashboard</h1>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Quick Stats">
            <p>Your content here</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Items">
            <p>Your content here</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// ============================================================================
// Example 4: Complex Layout with Multiple Sections
// ============================================================================

export const ComplexDashboardExample: React.FC = () => {
  return (
    <DashboardPageLayout
      title="Advanced Analytics Dashboard"
      breadcrumbs={[
        { title: 'Analytics', href: '/app/analytics' },
        { title: 'Advanced Dashboard' },
      ]}
      headerActions={<Button type="primary">Generate Report</Button>}
    >
      {/* Statistics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Users" value={1128} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Active Sessions" value={93} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Revenue" value={112893} prefix="$" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Growth" value={11.28} suffix="%" />
          </Card>
        </Col>
      </Row>

      {/* Main Content Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Performance Chart" style={{ marginBottom: 16 }}>
            {/* Your chart component */}
            <div
              style={{
                height: 300,
                background: '#f0f2f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Chart Placeholder
            </div>
          </Card>

          <Card title="Recent Transactions">
            {/* Your table component */}
            <div
              style={{
                height: 400,
                background: '#f0f2f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Table Placeholder
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Quick Actions" style={{ marginBottom: 16 }}>
            <Button block style={{ marginBottom: 8 }}>
              Action 1
            </Button>
            <Button block style={{ marginBottom: 8 }}>
              Action 2
            </Button>
            <Button block>Action 3</Button>
          </Card>

          <Card title="Notifications">
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}
                >
                  Notification {i}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </DashboardPageLayout>
  );
};

// ============================================================================
// Key Points:
// ============================================================================
/*
1. All examples will properly scroll within the dashboard's main content area
2. No content will overflow beyond the viewport
3. The sidebar and top menu remain fixed
4. Content naturally expands to fit its content
5. Responsive design works automatically with Ant Design's grid system
6. Choose the approach that best fits your needs:
   - Modern: Best for new pages, most consistent
   - Legacy: For existing pages, minimal changes needed
   - Simple: For straightforward pages without complex layouts
   - Complex: For feature-rich dashboards with multiple sections
*/
