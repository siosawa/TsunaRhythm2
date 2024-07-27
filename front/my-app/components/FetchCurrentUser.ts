import { useEffect } from "react";
import axios from "axios";

interface Avatar {
  url: string;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  following: number;
  followers: number;
  posts_count: number;
  work: string;
  profile_text: string;
  avatar: Avatar;
}

interface FetchCurrentUserProps {
  setCurrentUser: (user: CurrentUser | null) => void;
}

const FetchCurrentUser: React.FC<FetchCurrentUserProps> = ({ setCurrentUser }) => {
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get<CurrentUser>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/current_user`,
          {
            withCredentials: true,
          }
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
