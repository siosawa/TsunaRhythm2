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
      className="text-black bg-transparent hover:bg-gray-100"
    >
      削除
    </Button>
  );
};

export default PostDelete;
