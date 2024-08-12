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
      className="bg-white shadow-md rounded-3xl p-6 mb-5 mx-3 flex items-center md:mx-20 lg:mx-52 2xl:mx-96"
    >
      {user && user.avatar && user.avatar.url ? (
        <Link href={`/users/${user.id}`}>
          <img
            src={`${process.env.NEXT_PUBLIC_RAILS_URL}${user.avatar.url}`}
            alt={user.name}
            width={70}
            height={70}
            className="rounded-full relative -top-5 hover:opacity-80"
          />
        </Link>
      ) : (
        <div
          className="flex items-center justify-center bg-gray-300 text-white text-xs font-bold rounded-full relative -top-5"
          style={{ width: 70, height: 70, whiteSpace: "nowrap" }}
        >
          NO IMAGE
        </div>
      )}
      <div className="ml-4 flex-grow">
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
