import { useEffect } from "react";
import axios from "axios";

const FetchPosts = ({ currentPage, setPosts, setTotalPages, reload }) => {
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts?page=${currentPage}`,
          {
            withCredentials: true,
          },
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
