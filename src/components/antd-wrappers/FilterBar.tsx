/**
 * Filter Bar Component
 * Consistent filter layout for list pages
 */

import React, { ReactNode } from 'react';
import { Space, Card } from 'antd';

interface FilterBarProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children, style }) => {
  return (
    <Card
      style={{
        marginBottom: '24px',
        ...style,
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <Space
        wrap
        size="middle"
        style={{ width: '100%', justifyContent: 'flex-start' }}
      >
        {children}
      </Space>
    </Card>
  );
};

export default FilterBar;
