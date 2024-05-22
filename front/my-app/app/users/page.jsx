"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/users", {
          withCredentials: true, // クッキーを含める設定
        });

        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.error("APIレスポンスは配列ではありません:", res.data);
          setError("データの取得に失敗しました。");
        }
      } catch (err) {
        console.error("API呼び出しに失敗しました:", err);
        setError("データの取得に失敗しました。");
      }
    };

    getUser();
  }, []); // 空の依存配列により、コンポーネントの初回マウント時にのみ実行される

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>
          <p>名前: {user.name}</p>
          <p>メールアドレス: {user.email}</p>
          <p>id: {user.id}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
