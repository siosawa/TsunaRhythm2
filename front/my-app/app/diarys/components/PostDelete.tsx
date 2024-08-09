"use client";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Post型の定義
interface Post {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  title: string;
  user: {
    name: string;
  };
  current_user_id: number;
}

interface PostDeleteProps {
  postId: number;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

const PostDelete = ({ postId, posts, setPosts }: PostDeleteProps): JSX.Element => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>("");

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}`,
        {
          withCredentials: true,
        }
      );
      setPosts(posts.filter((post) => post.id !== postId));
      closeDialog();
    } catch (error: any) {
      console.error("ポストの削除に失敗しました:", error);
      setError("ポストの削除に失敗しました。");
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <Button
        onClick={openDialog}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-3xl"
      >
        削除
      </Button>
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-center">
              <p>日記を削除してよろしいですか？</p>
              <p>この操作は取り消せません。</p>
            </h3>
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-3xl"
                onClick={closeDialog}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                className="rounded-3xl bg-red-500 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                削除する
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDelete;
