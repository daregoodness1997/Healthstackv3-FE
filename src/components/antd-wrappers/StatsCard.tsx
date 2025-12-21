/**
 * Stats Card Component
 * Display statistics with icon and trend
 */

import React, { ReactNode } from 'react';
import { Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatsCardProps {
  title: string;
  value: number | string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  icon?: ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  loading?: boolean;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  trendValue,
  loading = false,
  onClick,
}) => {
  return (
    <Card
      hoverable={!!onClick}
      loading={loading}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          {icon}
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ fontSize: '24px' }}
          />
        </Space>
        {trend && trendValue && (
          <Space>
            {trend === 'up' ? (
              <ArrowUpOutlined style={{ color: '#3f8600' }} />
            ) : (
              <ArrowDownOutlined style={{ color: '#cf1322' }} />
            )}
            <span style={{ color: trend === 'up' ? '#3f8600' : '#cf1322' }}>
              {trendValue}
            </span>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default StatsCard;
