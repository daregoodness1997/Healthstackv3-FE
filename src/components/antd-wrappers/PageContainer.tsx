/**
 * Page Container Component
 * Consistent page layout with padding and background
 */

import React, { ReactNode, CSSProperties } from 'react';

interface PageContainerProps {
  children: ReactNode;
  style?: CSSProperties;
  noPadding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  style,
  noPadding = false,
}) => {
  return (
    <div
      style={{
        padding: noPadding ? 0 : '24px',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f0f2f5',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
