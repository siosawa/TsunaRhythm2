// 後にdiarys/componentsディレクトリでClientComp.jsを定義してそこで
// サーバサイドレンダリングが必要な部分だけコンポーネント化してuseClientを実行するのがおそらく望ましい
"use client"
import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState();
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/users");
      setUsers(res.data);
    };
    getUser();
    // 空の配列がないと無限ループする
  }, []);

  return (
    <div>
      {users?.map((users) => {
        return (
          <div key={users.id}>
            <p>名前: {users.name}</p>
            <p>メールアドレス: {users.email}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Users;