import { useEffect, useState } from "react";
import axios from "axios";

const PostView = ({ reload }) => {
  const [users, setUsers] = useState([]); // 初期値を空の配列に設定
  const [posts, setPosts] = useState([]); // 初期値を空の配列に設定
  const [currentUser, setCurrentUser] = useState(null); // 初期値をnullに設定
  const [editingPost, setEditingPost] = useState(null); // 編集中のポストを管理するステート
  const [newContent, setNewContent] = useState(""); // 編集中の新しい内容を管理するステート

  useEffect(() => {
    const fetchUsersAndCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/posts_user", {
          withCredentials: true, // クッキーを含める設定
        });
        const usersWithCurrentUserId = res.data.users.map(user => ({
          ...user,
          current_user_id: res.data.current_user.id
        }));
        setUsers(usersWithCurrentUserId);
        setCurrentUser(res.data.current_user);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };
    fetchUsersAndCurrentUser();
  }, [reload]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/posts", {
          withCredentials: true, // クッキーを含める設定
        });
        setPosts(res.data);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };
    fetchPosts();
  }, [reload]);

  // ポスト削除機能
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/posts/${postId}`, {
        withCredentials: true, // クッキーを含める設定
      });
      setPosts(posts.filter(post => post.id !== postId)); // 削除後にローカルの状態を更新
    } catch (error) {
      console.error("ポストの削除に失敗しました:", error);
    }
  };

  // ポスト編集機能の保存処理
  const handleSave = async (postId) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/v1/posts/${postId}`, { content: newContent }, {
        withCredentials: true, // クッキーを含める設定
      });
      setPosts(posts.map(post => post.id === postId ? { ...post, content: response.data.content } : post)); // 編集後にローカルの状態を更新
      setEditingPost(null); // 編集モードを終了
    } catch (error) {
      console.error("ポストの編集に失敗しました:", error);
    }
  };

  if (!users.length || !posts.length) {
    return <div>Loading...</div>; // ユーザーまたはポストがロード中の場合の表示
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => {
        const user = users.find((user) => user.id === post.user_id);
        return (
          <div key={post.id} className="border-b border-gray-200 py-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
              <div>
                <p className="text-lg font-semibold">{user ? user.name : "Unknown User"}</p>
                <p className="text-sm text-gray-500">{post.created_at}</p>
              </div>
            </div>
            <p className="mb-2 text-gray-800">タイトル: {post.title}</p>
            <p className="mb-4 text-gray-600">投稿: {post.content}</p>
            {editingPost === post.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <div className="space-x-2">
                  <button
                    onClick={() => handleSave(post.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-x-2">
                {post.user_id === user?.current_user_id && (
                  <>
                    <button
                      onClick={() => setEditingPost(post.id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      削除
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostView;
