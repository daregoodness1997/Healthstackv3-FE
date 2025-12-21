import React from 'react';
import { Card, Row, Col, Space, Typography } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

// Styled components for dashboard layouts
export const DashboardContainer = styled.div`
  padding: 0;
  max-width: 100%;
`;

export const DashboardHeader = styled.div`
  margin-bottom: 24px;
`;

export const DashboardSection = styled.div<{ $spacing?: string }>`
  margin-bottom: ${(props) => props.$spacing || '24px'};
`;

export const StatsCard = styled(Card)`
  height: 100%;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .ant-card-body {
    padding: 20px;
  }
`;

export const ContentCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }

  .ant-card-body {
    padding: 24px;
  }
`;

// Dashboard Wrapper Component
interface DashboardWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode;
  className?: string;
}

export const DashboardWrapper: React.FC<DashboardWrapperProps> = ({
  children,
  title,
  subtitle,
  extra,
  className,
}) => {
  return (
    <DashboardContainer className={className}>
      {(title || subtitle || extra) && (
        <DashboardHeader>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            {title && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  {title}
                </Title>
                {extra && <div>{extra}</div>}
              </div>
            )}
            {subtitle && (
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {subtitle}
              </Text>
            )}
          </Space>
        </DashboardHeader>
      )}
      {children}
    </DashboardContainer>
  );
};

// Grid Layout Helpers
interface GridLayoutProps {
  children: React.ReactNode;
  gutter?: [number, number] | number;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  gutter = [16, 16],
}) => {
  return <Row gutter={gutter}>{children}</Row>;
};

// Common grid column configurations
export const GridCol = {
  Full: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
  Half: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 },
  Third: { xs: 24, sm: 12, md: 8, lg: 8, xl: 8 },
  Quarter: { xs: 24, sm: 12, md: 12, lg: 6, xl: 6 },
  TwoThirds: { xs: 24, sm: 24, md: 16, lg: 16, xl: 16 },
  ThreeQuarters: { xs: 24, sm: 24, md: 18, lg: 18, xl: 18 },
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = '#1890ff',
  loading = false,
  prefix,
  suffix,
  trend,
}) => {
  return (
    <StatsCard loading={loading} bordered={false}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {title}
          </Text>
          {icon && (
            <div
              style={{
                color,
                fontSize: '24px',
                opacity: 0.8,
              }}
            >
              {icon}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
          }}
        >
          {prefix}
          <Title level={2} style={{ margin: 0, color }}>
            {value}
          </Title>
          {suffix}
        </div>

        {trend && (
          <Text
            style={{
              fontSize: '12px',
              color: trend.isPositive ? '#52c41a' : '#ff4d4f',
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Text>
        )}
      </Space>
    </StatsCard>
  );
};

// Section Component
interface SectionProps {
  title?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  spacing?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  extra,
  children,
  spacing,
}) => {
  return (
    <DashboardSection $spacing={spacing}>
      {(title || extra) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          {title && (
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
          )}
          {extra}
        </div>
      )}
      {children}
    </DashboardSection>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        background: '#fafafa',
        borderRadius: '8px',
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: '48px',
            color: '#d9d9d9',
            marginBottom: '16px',
          }}
        >
          {icon}
        </div>
      )}
      <Title level={4} style={{ color: '#8c8c8c', marginBottom: '8px' }}>
        {title}
      </Title>
      {description && (
        <Text
          type="secondary"
          style={{ display: 'block', marginBottom: '16px' }}
        >
          {description}
        </Text>
      )}
      {action}
    </div>
  );
};

export default DashboardWrapper;
