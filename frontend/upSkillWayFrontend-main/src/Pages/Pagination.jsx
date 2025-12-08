import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNext, 
  hasPrev 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1 py-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 ${
          hasPrev
            ? 'bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}-${Math.random()}`}
                className="flex items-center justify-center w-9 h-9 text-gray-400 text-sm"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={`page-${page}-${index}`}
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 ${
          hasNext
            ? 'bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;