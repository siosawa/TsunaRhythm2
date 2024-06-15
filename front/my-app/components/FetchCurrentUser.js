import { useEffect } from "react";
import axios from "axios";

const FetchCurrentUser = ({ setCurrentUser }) => {
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/current_user",
          {
            withCredentials: true,
          },
        );

        console.log("取得したデータ:", response.data); // ここでデータをコンソールに出力
        setCurrentUser(response.data);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        // 現在のパスがルートURLでない場合にリダイレクト
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    };

    fetchCurrentUser();
  }, [setCurrentUser]);

  return null;
};

export default FetchCurrentUser;
