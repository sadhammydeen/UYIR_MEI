import React from 'react';
import Button from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;

    // Calculate range of pages to show around current page
    const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPage);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage);

    // Determine if we need to show ellipses
    const shouldShowLeftDots = leftSiblingIndex > firstPage + 1;
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1;

    // Generate page numbers
    const pageNumbers = [];

    // Always add first page
    if (firstPage < leftSiblingIndex) {
      pageNumbers.push(firstPage);
    }

    // Add left ellipsis if needed
    if (shouldShowLeftDots) {
      pageNumbers.push(-1); // Using -1 to indicate ellipsis
    }

    // Add page numbers around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i);
    }

    // Add right ellipsis if needed
    if (shouldShowRightDots) {
      pageNumbers.push(-2); // Using -2 to indicate ellipsis (different key than left)
    }

    // Always add last page
    if (lastPage > rightSiblingIndex) {
      pageNumbers.push(lastPage);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePagination();

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {/* Page numbers */}
      {pageNumbers.map((pageNumber, index) => {
        // Render ellipsis
        if (pageNumber < 0) {
          return (
            <Button 
              key={pageNumber} 
              variant="outline" 
              size="icon" 
              disabled
              className="cursor-default"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More pages</span>
            </Button>
          );
        }

        // Render page number
        return (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}

      {/* Next page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}
