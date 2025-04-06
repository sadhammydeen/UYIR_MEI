import React from 'react';
import Button from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex space-x-1">
        {pages.map((page, i) => {
          if (page === '...') {
            return (
              <Button 
                key={`ellipsis-${i}`} 
                variant="outline" 
                size="sm" 
                disabled
                className="cursor-default"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }

          const pageNumber = Number(page);
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function generatePagination(currentPage: number, totalPages: number): (string | number)[] {
  // Logic to generate page numbers with ellipsis
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
} 