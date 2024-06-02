// useFetchUsersでフォロー・フォロー解除のためのデータフェッチと

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./components/UserCard";
import useFetchUsers from "./components/useFetchUsers";
import PaginationHandler from "./components/PagenationHandler";

// メインコンポーネント
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const [followings, setFollowings] = useState(new Set());
  const [followStates, setFollowStates] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/current_user",
          {
            withCredentials: true,
          }
        );
        const userData = response.data;
        setUserId(userData.id);
      } catch (error) {
        console.error("現在のユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useFetchUsers(
    currentPage,
    userId,
    setUsers,
    setTotalPages,
    setFollowings,
    setFollowStates,
    setError
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      {users?.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          followings={followings}
          followStates={followStates}
          setFollowStates={setFollowStates}
          setFollowings={setFollowings}
        />
      ))}
      <PaginationHandler
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default UsersList;
