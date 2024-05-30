"use client";
import { useEffect, useState } from "react";
import PostInput from "@/app/diarys/components/PostInput";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [reload, setReload] = useState(false);
  const handleReload = () => {
    setReload(!reload);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/current_user",
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
  }, []);

  if (!user) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <UserProfile user={user} />
      <PostInput onPostSuccess={handleReload} />
      <UserPostView posts={user.posts || []} />
    </div>
  );
}

const UserProfile = ({ user }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/following">フォロー{user.following}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/followers">フォロワー{user.followers}</Link>
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
        <label className="block text-gray-700">主なワーク:{user.work}</label>
      </div>
    </div>
  );
};

const UserPostView = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <p>タイトル: {post.title}</p>
          <p>投稿: {post.content}</p>
          <p>送信日時: {post.created_at}</p>
        </div>
      ))}
    </div>
  );
};
