interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PostPagination: React.FC<PostPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5; 
    const halfWindow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(currentPage - halfWindow, 1);
    let endPage = Math.min(currentPage + halfWindow, totalPages);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center space-x-4 mt-6">
      {renderPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === currentPage}
          className={`px-4 py-2 rounded ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default PostPagination;
