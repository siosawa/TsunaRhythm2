"use client";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PostDelete = ({ postId, posts, setPosts }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post.id !== postId));
      closeDialog();
    } catch (error) {
      console.error("ポストの削除に失敗しました:", error);
      setError("ポストの削除に失敗しました。");
    }
  };

  const openDialog = () => {
    setError(""); // ダイアログを開く際にエラーメッセージをリセット
    setIsDialogOpen(true);
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <Button
        onClick={openDialog}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl"
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
                className="bg-gray-200 hover:bg-gray-300 rounded-3xl"
                onClick={closeDialog}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                className="rounded-3xl  bg-red-600 hover:bg-red-700"
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
