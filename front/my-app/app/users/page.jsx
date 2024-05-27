"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/users?page=${currentPage}`,
          {
            withCredentials: true, // クッキーを含める設定
          }
        );

        if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
          setTotalPages(res.data.total_pages);
        } else {
          console.error("APIレスポンスは正しくありません:", res.data);
          setError("データの取得に失敗しました。");
        }
      } catch (err) {
        console.error("API呼び出しに失敗しました:", err);
        setError("データの取得に失敗しました。");
      }
    };

    getUser();
  }, [currentPage]); // currentPageが変わるたびに実行される

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

  const handlePageClick = (page) => {
    if (page !== currentPage && typeof page === "number") {
      setCurrentPage(page);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      {users?.map((user) => (
        <div key={user.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <p className="text-lg font-semibold mb-2">名前: {user.name}</p>
          <p className="text-gray-600 mb-1">メールアドレス: {user.email}</p>
          <p className="text-gray-600 mb-1">ID: {user.id}</p>
          <p className="text-gray-600 mb-1">ポスト数: {user.posts_count}</p>
          <p className="text-gray-600">
            アカウント作成日: {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
      <div className="flex justify-center mt-4">
        {renderPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            className={`mx-1 px-3 py-1 border rounded ${page === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Users;
