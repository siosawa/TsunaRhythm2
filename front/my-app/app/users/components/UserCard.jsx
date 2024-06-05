import { useEffect } from "react";
import FollowUnfollowButton from "@/app/users/components/FollowUnfollowButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserCard = ({
  user,
  followings,
  followStates,
  setFollowStates,
  setFollowings,
}) => {
  useEffect(() => {
    console.log("User data:", user);
    console.log("Followings:", followings);
    console.log("FollowStates:", followStates);
  }, [user, followings, followStates]);

  return (
    <div
      key={user.id}
      className="bg-white shadow-md rounded-3xl p-6 mb-5 mx-3 flex justify-between items-center md:mx-20 lg:mx-52 2xl:mx-96"
    >
      <div>
        <Link href={`/users/${user.id}`}>
          <Button className="text-lg font-semibold mb-2 hover:underline bg-transparent text-black hover:bg-transparent">
            {user.name}
          </Button>
        </Link>
        <Link href={`/users/${user.id}/following`}>
          <Button className="text-lg font-semibold mb-2 hover:underline bg-transparent text-black hover:bg-transparent">
            フォロー {user.following_count}
          </Button>
        </Link>
        <Link href={`/users/${user.id}/followers`}>
          <Button className="text-lg font-semibold mb-2 hover:underline bg-transparent text-black hover:bg-transparent">
            フォロワー {user.followers_count}
          </Button>
        </Link>
        <p className="text-gray-600 mb-1">
          ポスト数: {user.posts_count} ワーク: {user.work}
        </p>
        <p className="text-gray-800 mb-1">{user.profile_text}</p>
        {/* <p className="text-gray-600">
          アカウント作成日: {new Date(user.created_at).toLocaleDateString()}
        </p> */}
      </div>
      <FollowUnfollowButton
        userId={user.id}
        isFollowing={followings.has(user.id)}
        followStates={followStates}
        setFollowStates={setFollowStates}
        setFollowings={setFollowings}
      />
    </div>
  );
};

export default UserCard;
