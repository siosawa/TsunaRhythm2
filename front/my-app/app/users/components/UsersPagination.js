// PagenationHandlerで使用
// currentPage、totalPages、onPageChangeのプロパティを受け取り、
// ユーザーが異なるページに移動できるようにボタンをレンダリング
"use client";
import React from "react";

const UsersPagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // 表示するページ数を制限
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
    <div className="flex justify-center mt-4">
      {renderPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-3 py-1 border rounded ${
            page === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default UsersPagination;
