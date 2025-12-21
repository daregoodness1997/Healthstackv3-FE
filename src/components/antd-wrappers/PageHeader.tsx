/**
 * Page Header Component
 * Consistent page header with title and action buttons
 */

import React, { ReactNode } from 'react';
import { Typography, Space, Divider } from 'antd';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  children?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  extra,
  children,
}) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: subtitle ? '8px' : '16px',
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Typography.Text type="secondary">{subtitle}</Typography.Text>
          )}
        </div>
        {extra && <Space>{extra}</Space>}
      </div>
      {children}
      <Divider />
    </div>
  );
};

export default PageHeader;
