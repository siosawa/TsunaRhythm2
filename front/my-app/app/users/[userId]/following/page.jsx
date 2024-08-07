"use client";
import { useState } from "react";
import UserCard from "@/app/users/components/UserCard";
import FetchFollowing from "@/app/users/[userId]/following/components/FetchFollowing";
import PaginationHandler from "@/app/users/components/PagenationHandler";
import FetchCurrentUser from "@/components/FetchCurrentUser";

// メインコンポーネント
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followings, setFollowings] = useState(new Set());
  const [followStates, setFollowStates] = useState({});

  // CurrentUserのデータを受け取り、idを抽出して設定
  const handleSetCurrentUser = (userData) => {
    setCurrentUserId(userData.id);
  };

  return (
    <div className="p-4 mt-8">
      <FetchCurrentUser setCurrentUser={handleSetCurrentUser} />
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
