"use client";
import { useState } from "react";
import UserCard from "@/app/users/components/UserCard";
import FetchFollowers from "@/app/users/[userId]/followers/components/FetchFollowers";
import PaginationHandler from "@/app/users/components/PagenationHandler";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followings, setFollowings] = useState(new Set());
  const [followStates, setFollowStates] = useState({});

  const handleSetCurrentUser = (userData) => {
    setCurrentUserId(userData.id);
  };

  return (
    <div className="p-4 mt-8">
      <FetchCurrentUser setCurrentUser={handleSetCurrentUser} />
      <FetchFollowers
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
