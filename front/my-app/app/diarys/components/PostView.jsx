import { useEffect, useState } from "react";
import axios from "axios";

const PostView = ({ reload }) => {
  const [users, setUsers] = useState();
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/posts");
      setUsers(res.data);
    };
    getUser();
    // 空の配列がないと無限ループする
  }, [reload]);

  return (
    <div>
      {users?.map((posts) => {
        return (
          <div key={posts.id}>
            <p>タイトル: {posts.title}</p>
            <p>投稿: {posts.content}</p>
            <p>送信日時: {posts.created_at}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PostView;
