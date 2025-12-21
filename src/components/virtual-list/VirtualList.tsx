/**
 * Virtual List Component
 *
 * Efficiently renders large lists using virtualization
 * Only renders visible items for better performance
 */

import React, { useRef, ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Spin } from 'antd';

interface VirtualListProps<T> {
  items: T[];
  estimateSize?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  height?: string | number;
  isLoading?: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  className?: string;
}

export function VirtualList<T>({
  items,
  estimateSize = 60,
  overscan = 5,
  renderItem,
  height = '600px',
  isLoading = false,
  loadingComponent,
  emptyComponent,
  className,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height,
        }}
      >
        {loadingComponent || <Spin size="large" />}
      </div>
    );
  }

  if (items.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return (
    <div
      ref={parentRef}
      className={className}
      style={{
        height,
        overflow: 'auto',
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList;
