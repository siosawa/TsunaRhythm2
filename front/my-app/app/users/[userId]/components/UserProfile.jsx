// UserPostViewで使用
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const UserProfile = ({ user }) => {
  if (!user) return <div>ローディング中...</div>;

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

export default UserProfile;
