import { useEffect, useState } from "react";
import axios from "axios";

const PostView = ({ reload }) => {
  const [users, setUsers] = useState();
  const [editingPost, setEditingPost] = useState(null); // 追加: 編集中のポストを管理するステート
  const [newContent, setNewContent] = useState(""); // 追加: 編集中の新しい内容を管理するステート

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/posts");
      setUsers(res.data);
    };
    getUser();
    // 空の配列がないと無限ループする
  }, [reload]);

  // 追加: ポスト削除機能
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/posts/${id}`,{
        withCredentials: true, // クッキーを含める設定
      },);
      setUsers(users.filter(post => post.id !== id)); // 削除後にローカルの状態を更新
    } catch (error) {
      console.error("ポストの削除に失敗しました:", error);
    }
  };

  // 追加: ポスト編集機能の保存処理
  const handleSave = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/v1/posts/${id}`, { content: newContent },        {
        withCredentials: true, // クッキーを含める設定
      },);
      setUsers(users.map(post => post.id === id ? { ...post, content: response.data.content } : post)); // 編集後にローカルの状態を更新
      setEditingPost(null); // 編集モードを終了
    } catch (error) {
      console.error("ポストの編集に失敗しました:", error);
    }
  };

  return (
    <div>
      {users?.map((post) => {
        return (
          <div key={post.id}>
            <p>タイトル: {post.title}</p>
            <p>投稿: {post.content}</p>
            <p>送信日時: {post.created_at}</p>
            {editingPost === post.id ? (
              // 追加: 編集モードの場合
              <div>
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <button onClick={() => handleSave(post.id)}>保存</button>
                <button onClick={() => setEditingPost(null)}>キャンセル</button>
              </div>
            ) : (
              // 通常モードの場合
              <div>
                <button onClick={() => setEditingPost(post.id)}>編集</button>
                <button onClick={() => handleDelete(post.id)}>削除</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostView;
