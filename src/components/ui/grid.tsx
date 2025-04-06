import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6;
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  mdCols,
  lgCols,
  gap = 'md',
  className,
}) => {
  const getColsClass = (columns: number): string => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      default: return 'grid-cols-1';
    }
  };

  const getMdColsClass = (columns?: number): string => {
    if (!columns) return '';
    switch (columns) {
      case 1: return 'md:grid-cols-1';
      case 2: return 'md:grid-cols-2';
      case 3: return 'md:grid-cols-3';
      case 4: return 'md:grid-cols-4';
      case 5: return 'md:grid-cols-5';
      case 6: return 'md:grid-cols-6';
      default: return '';
    }
  };

  const getLgColsClass = (columns?: number): string => {
    if (!columns) return '';
    switch (columns) {
      case 1: return 'lg:grid-cols-1';
      case 2: return 'lg:grid-cols-2';
      case 3: return 'lg:grid-cols-3';
      case 4: return 'lg:grid-cols-4';
      case 5: return 'lg:grid-cols-5';
      case 6: return 'lg:grid-cols-6';
      default: return '';
    }
  };

  const getGapClass = (gapSize: string): string => {
    switch (gapSize) {
      case 'none': return 'gap-0';
      case 'xs': return 'gap-2';
      case 'sm': return 'gap-4';
      case 'md': return 'gap-6';
      case 'lg': return 'gap-8';
      case 'xl': return 'gap-12';
      default: return 'gap-6';
    }
  };

  return (
    <div 
      className={cn(
        'grid',
        getColsClass(cols),
        getMdColsClass(mdCols),
        getLgColsClass(lgCols),
        getGapClass(gap),
        className
      )}
    >
      {children}
    </div>
  );
};

export default Grid; 