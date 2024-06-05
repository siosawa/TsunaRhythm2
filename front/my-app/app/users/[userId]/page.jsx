"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PostInput from "@/app/diarys/components/PostInput";
import UserPostsView from "@/app/users/[userId]/components/UserPostsView";

const UserProfile = ({ user }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" asChild>
              <Link href={`/users/${user.id}/following`}>
                フォロー {user.following_count}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href={`/users/${user.id}/followers`}>
                フォロワー {user.followers_count}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button variant="ghost" asChild>
          <Link href="/edit-profile">プロフィール編集</Link>
        </Button>
      </div>
      <div className="mt-2">
        <label className="block text-gray-700">主なワーク: {user.work}</label>
      </div>
      <div className="mt-2">
        <label className="block text-gray-700">
          プロフィール文: {user.profile_text}
        </label>
      </div>
    </div>
  );
};

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
    <div className="container mx-auto p-6">
      <UserProfile user={user} />
      <div className="flex items-center justify-between mt-4">
        <PostInput onPostSuccess={handleReload} />
        <Button
          variant="ghost"
          asChild
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          <Link href="/mypage">自分の日記</Link>
        </Button>
      </div>
      <UserPostsView reload={reload} userId={userId} userPosts={userPosts} />
    </div>
  );
}
