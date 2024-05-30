"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import UsersPagination from "./components/UsersComponents";

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
      <UsersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageClick}
      />
    </div>
  );
};

export default Users;
