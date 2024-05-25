import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";

const PostView = ({ reload }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      try {
        const [userRes, postRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/posts_user", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/v1/posts", {
            withCredentials: true,
          }),
        ]);

        const usersWithCurrentUserId = userRes.data.users.map((user) => ({
          ...user,
          current_user_id: userRes.data.current_user.id,
        }));
        setUsers(usersWithCurrentUserId);
        setPosts(postRes.data);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };
    fetchUsersAndPosts();
  }, [reload]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("ポストの削除に失敗しました:", error);
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post.id);
    setNewContent(post.content);
    setNewTitle(post.title);
  };

  const handleSave = async (postId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/posts/${postId}`,
        { title: newTitle, content: newContent },
        {
          withCredentials: true,
        },
      );
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                title: response.data.title,
                content: response.data.content,
              }
            : post,
        ),
      );
      setEditingPost(null);
    } catch (error) {
      console.error("ポストの編集に失敗しました:", error);
    }
  };

  if (!users.length || !posts.length) {
    return <div>Loading...</div>; // データがロード中の場合の表示
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => {
        const user = users.find((user) => user.id === post.user_id);
        const formattedDate = format(
          new Date(post.created_at),
          "yyyy/M/d HH:mm",
          { locale: ja },
        );
        return (
          <div key={post.id} className="border-b border-gray-200 py-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>
            </div>
            {editingPost === post.id ? (
              <div className="space-y-2">
                <label className="block">
                  <span className="text-gray-700">タイトル：</span>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">投稿：</span>
                  <input
                    type="text"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </label>
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
              <div>
                <p className="mb-2 text-gray-800">タイトル: {post.title}</p>
                <p className="mb-4 text-gray-600">投稿: {post.content}</p>
                <div className="space-x-2">
                  {post.user_id === user?.current_user_id && (
                    <>
                      <button
                        onClick={() => handleEditClick(post)}
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostView;
