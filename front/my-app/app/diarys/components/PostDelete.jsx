import axios from "axios";

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
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-500 text-white rounded-md"
    >
      削除
    </button>
  );
};

export default PostDelete;
