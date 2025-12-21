/**
 * Data Card Component
 * Consistent card layout for displaying data
 */

import React, { ReactNode, CSSProperties } from 'react';
import { Card as AntCard, Space, Typography } from 'antd';

const { Text } = Typography;

interface DataCardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode[];
  hoverable?: boolean;
  loading?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  extra?: ReactNode;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  icon,
  children,
  actions,
  hoverable = false,
  loading = false,
  style,
  onClick,
  extra,
}) => {
  return (
    <AntCard
      hoverable={hoverable}
      loading={loading}
      style={{ marginBottom: '16px', ...style }}
      onClick={onClick}
      actions={actions}
    >
      {(title || icon || extra) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <Space>
            {icon}
            {title && <Text strong>{title}</Text>}
          </Space>
          {extra}
        </div>
      )}
      {children}
    </AntCard>
  );
};

export default DataCard;
