import FollowButton from "@/app/users/components/FollowButton";

const UserCard = ({
  user,
  followings,
  followStates,
  setFollowStates,
  setFollowings,
}) => {
  return (
    <div
      key={user.id}
      className="bg-white shadow-md rounded-lg p-6 mb-4 flex justify-between items-center"
    >
      <div>
        <p className="text-lg font-semibold mb-2">名前: {user.name}</p>
        <p className="text-gray-600 mb-1">メールアドレス: {user.email}</p>
        <p className="text-gray-600 mb-1">ID: {user.id}</p>
        <p className="text-gray-600 mb-1">ポスト数: {user.posts_count}</p>
        <p className="text-gray-600">
          アカウント作成日: {new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>
      <FollowButton
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
