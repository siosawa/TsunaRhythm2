import { useEffect } from "react";
import axios from "axios";

interface User {
  name: string;
}

interface Post {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  title: string;
  user: User;
  current_user_id: number;
}

interface FetchPostsProps {
  currentPage: number;
  setPosts: (posts: Post[]) => void;
  setTotalPages: (totalPages: number) => void;
  reload: boolean;
}

const FetchPosts = ({ currentPage, setPosts, setTotalPages, reload }: FetchPostsProps) => {
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts?page=${currentPage}`,
          {
            withCredentials: true,
          }
        );

        setPosts(response.data.posts);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };
    fetchPosts();
  }, [currentPage, reload]);

  return null;
};

export default FetchPosts;
