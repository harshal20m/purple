import Button from "./Button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  // Calculate which pages to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust start if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {/* First page */}
      {startPage > 1 && (
        <>
          <PageButton
            page={1}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <PageButton
          key={page}
          page={page}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      ))}

      {/* Last page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <PageButton
            page={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </>
      )}

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

const PageButton = ({ page, currentPage, onPageChange }) => {
  const isActive = page === currentPage;

  return (
    <button
      onClick={() => onPageChange(page)}
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      }`}
    >
      {page}
    </button>
  );
};

export default Pagination;
