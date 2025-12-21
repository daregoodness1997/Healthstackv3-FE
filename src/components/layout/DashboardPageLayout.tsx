import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface DashboardPageLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  headerActions?: React.ReactNode;
}

const PageHeader = styled.div`
  margin-bottom: 24px;

  .page-breadcrumb {
    margin-bottom: 16px;
  }

  .page-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
  }
`;

const PageContent = styled.div`
  height: 100%;
  overflow: auto;

  @media (max-width: 768px) {
    /* Mobile optimizations if needed */
  }
`;

/**
 * DashboardPageLayout - A consistent layout wrapper for dashboard pages
 *
 * This component provides a standardized structure for dashboard pages with:
 * - Optional breadcrumb navigation
 * - Page title
 * - Header actions (buttons, filters, etc.)
 * - Properly styled content area
 *
 * @example
 * ```tsx
 * <DashboardPageLayout
 *   title="Pharmacy Dashboard"
 *   breadcrumbs={[
 *     { title: 'Home', href: '/app/dashboard' },
 *     { title: 'Pharmacy', href: '/app/pharmacy' },
 *     { title: 'Dashboard' }
 *   ]}
 *   headerActions={<Button type="primary">Add New</Button>}
 * >
 *   <YourContent />
 * </DashboardPageLayout>
 * ```
 */
const DashboardPageLayout: React.FC<DashboardPageLayoutProps> = ({
  children,
  breadcrumbs,
  title,
  headerActions,
}) => {
  return (
    <>
      {(breadcrumbs || title) && (
        <PageHeader>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb
              className="page-breadcrumb"
              items={[
                {
                  href: '/app/dashboard',
                  title: <HomeOutlined />,
                },
                ...breadcrumbs.map((item) => ({
                  href: item.href,
                  title: item.title,
                })),
              ]}
            />
          )}

          {title && (
            <div className="page-header-content">
              <h1>{title}</h1>
              {headerActions && <div>{headerActions}</div>}
            </div>
          )}
        </PageHeader>
      )}

      <PageContent>{children}</PageContent>
    </>
  );
};

export default DashboardPageLayout;
