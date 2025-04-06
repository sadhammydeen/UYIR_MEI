"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FixedSizeList, ListOnItemsRenderedProps } from 'react-window';
import { cn } from '@/lib/utils';
import debounce from 'lodash.debounce';

interface VirtualizedListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
  overscanCount?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  keyExtractor?: (item: T, index: number) => string;
  emptyComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  isLoading?: boolean;
}

export function VirtualizedList<T>({
  data,
  renderItem,
  itemHeight,
  className,
  overscanCount = 5,
  onEndReached,
  endReachedThreshold = 0.8,
  keyExtractor = (_, index) => index.toString(),
  emptyComponent,
  loadingComponent,
  isLoading = false,
}: VirtualizedListProps<T>) {
  const listRef = useRef<FixedSizeList | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (listContainerRef.current) {
        setDimensions({
          width: listContainerRef.current.clientWidth,
          height: listContainerRef.current.clientHeight,
        });
      }
    };

    const debouncedUpdateDimensions = debounce(updateDimensions, 100);

    updateDimensions();
    window.addEventListener('resize', debouncedUpdateDimensions);

    return () => {
      window.removeEventListener('resize', debouncedUpdateDimensions);
    };
  }, []);

  // Handle end reached for pagination/infinite scrolling
  const handleItemsRendered = useCallback(
    (props: ListOnItemsRenderedProps) => {
      if (!onEndReached) return;

      const { visibleStopIndex } = props;
      const threshold = data.length * endReachedThreshold;

      if (visibleStopIndex >= threshold) {
        onEndReached();
      }
    },
    [data.length, endReachedThreshold, onEndReached]
  );

  // Force recompute and rerender when data changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [data]);

  // Row renderer
  const rowRenderer = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = data[index];
      return (
        <div style={style} key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </div>
      );
    },
    [data, renderItem, keyExtractor]
  );

  // Show empty component if no data
  if (data.length === 0 && !isLoading) {
    return (
      <div className={cn('w-full h-full flex items-center justify-center', className)}>
        {emptyComponent || <div className="text-gray-500">No data available</div>}
      </div>
    );
  }

  // Show loading component
  if (isLoading && data.length === 0) {
    return (
      <div className={cn('w-full h-full flex items-center justify-center', className)}>
        {loadingComponent || <div className="text-gray-500">Loading...</div>}
      </div>
    );
  }

  return (
    <div 
      ref={listContainerRef} 
      className={cn('w-full h-full', className)}
    >
      {dimensions.height > 0 && dimensions.width > 0 && (
        <FixedSizeList
          ref={listRef}
          height={dimensions.height}
          width={dimensions.width}
          itemCount={data.length}
          itemSize={itemHeight}
          overscanCount={overscanCount}
          onItemsRendered={handleItemsRendered}
        >
          {rowRenderer}
        </FixedSizeList>
      )}
    </div>
  );
} 