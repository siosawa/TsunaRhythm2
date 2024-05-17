"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  // ユーザー情報を格納するためのstate
  const [users, setUsers] = useState([]);
  // エラーメッセージを格納するためのstate
  const [error, setError] = useState('');

  // コンポーネントの初回レンダー時にAPIリクエストを送る
  useEffect(() => {
    // ユーザー情報を取得する非同期関数
    const getUser = async () => {
      try {
        // APIにGETリクエストを送る
        const res = await axios.get("http://localhost:3000/api/v1/users", {
          withCredentials: true  // クッキーを含める設定
        });

        // レスポンスが配列であることを確認する
        if (Array.isArray(res.data)) {
          // ユーザー情報をstateに設定する
          setUsers(res.data);
        } else {
          console.error("APIレスポンスは配列ではありません:", res.data);
          setError("データの取得に失敗しました。");
        }
      } catch (err) {
        // API呼び出しが失敗した場合のエラーハンドリング
        console.error("API呼び出しに失敗しました:", err);
        setError("データの取得に失敗しました。");
      }
    };

    // 非同期関数を実行する
    getUser();
  }, []); // 空の依存配列により、コンポーネントの初回マウント時にのみ実行される

  // エラーメッセージが存在する場合はそれを表示
  if (error) {
    return <div>{error}</div>;
  }

  // ユーザー情報をリスト表示
  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>
          <p>名前: {user.name}</p>
          <p>メールアドレス: {user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
