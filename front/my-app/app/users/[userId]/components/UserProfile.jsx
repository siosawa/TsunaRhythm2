import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const UserProfile = ({ user }) => {
  if (!user) return <div>ローディング中...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4">
        {user && user.avatar && user.avatar.url ? (
          <img
            src={`http://localhost:3000${user.avatar.url}`}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full"
          />
        ) : (
          <div
            className="flex items-center justify-center bg-gray-300 text-white text-xs font-bold rounded-full"
            style={{ width: 70, height: 70, whiteSpace: "nowrap" }}
          >
            NO IMAGE
          </div>
        )}
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
