import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: ReactNode;
  bgColor?: string;
}

export const StatCard = ({
  title,
  value,
  change,
  trend,
  icon,
  bgColor = '#e6f7ff',
}: StatCardProps) => {
  const trendColor = trend === 'up' ? '#3f8600' : '#cf1322';

  return (
    <Card variant="borderless" style={{ height: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Statistic
            title={
              <span
                style={{
                  fontSize: '13px',
                  color: '#666',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                {title}
              </span>
            }
            value={value}
            valueStyle={{
              fontSize: 'clamp(20px, 4vw, 24px)',
              fontWeight: '600',
              color: '#262626',
            }}
            prefix={
              trend === 'up' ? (
                <ArrowUpOutlined
                  style={{ fontSize: '14px', color: trendColor }}
                />
              ) : (
                <ArrowDownOutlined
                  style={{ fontSize: '14px', color: trendColor }}
                />
              )
            }
            suffix={
              <span
                style={{
                  fontSize: '12px',
                  color: trendColor,
                  fontWeight: '500',
                }}
              >
                {trend === 'up' ? '+' : ''}
                {change}%
              </span>
            }
          />
        </div>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'scale(1.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
