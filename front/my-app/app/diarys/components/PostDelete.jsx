"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";

const PostDelete = ({ postId, posts, setPosts }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("ポストの削除に失敗しました:", error);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl"
    >
      削除
    </Button>
  );
};

export default PostDelete;
