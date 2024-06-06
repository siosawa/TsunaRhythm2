"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostInput from "@/app/diarys/components/PostInput";
import UserPostsView from "@/app/users/[userId]/components/UserPostsView";

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleReload = () => {
    setReload(!reload);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/${userId}`,
          {
            credentials: "include",
          }
        );
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) return <div>読み込み中...</div>;

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <PostInput onPostSuccess={handleReload} />
      </div>
      <UserPostsView
        reload={reload}
        userId={userId}
        user={user}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
