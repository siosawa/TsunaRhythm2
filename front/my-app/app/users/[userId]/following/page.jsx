"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "@/app/users/components/UserCard";
import FetchFollowing from "@/app/users/[userId]/following/components/FetchFollowing";
import PaginationHandler from "@/app/users/components/PagenationHandler";

// メインコンポーネント
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);
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
        setCurrentUserId(userData.id);
      } catch (error) {
        console.error("現在のユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="p-4 mt-8">
      <FetchFollowing
        currentPage={currentPage}
        currentUserId={currentUserId}
        setUsers={setUsers}
        setTotalPages={setTotalPages}
        setFollowings={setFollowings}
        setFollowStates={setFollowStates}
        setError={setError}
      />
      {error && <div>{error}</div>}
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
