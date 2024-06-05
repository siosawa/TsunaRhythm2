"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostInput from "@/app/diarys/components/PostInput";
import UserPostsView from "@/app/users/[userId]/components/UserPostsView";

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload);
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
        const user = await response.json();
        setUser(user);
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
      }
    };

    const fetchUserPostsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/posts/user/${userId}`,
          {
            credentials: "include",
          }
        );
        const userPosts = await response.json();
        setUserPosts(userPosts.posts || []);
      } catch (error) {
        console.error("ユーザーポストの取得に失敗しました:", error);
      }
    };

    fetchUserData();
    fetchUserPostsData();
  }, [userId, reload]);

  if (!user) return <div>読み込み中...</div>;

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <PostInput onPostSuccess={handleReload} />
      </div>
      <UserPostsView
        reload={reload}
        userId={userId}
        userPosts={userPosts}
        user={user}
      />
    </div>
  );
}
