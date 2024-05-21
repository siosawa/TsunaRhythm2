const user = {
  name: 'sawata',
  following: 14,
  followers: 12,
};

export default function Home() {
  return (
    <div>
      <UserProfile user={user} />
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
            <span>フォロー{user.following}</span>
            <span>フォロワー{user.followers}</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded">プロフィール編集</button>
      </div>
      <div className="mt-2">
        <label className="block text-gray-700">主なワーク:</label>
      </div>
    </div>
  );
};
