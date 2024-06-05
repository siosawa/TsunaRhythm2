"use client"; // のちのち消したい
import PostInput from "./components/PostInput";
import PostView from "./components/PostView";
import { useState } from "react";

const Post = () => {
  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload);
  };

  return (
    <>
      <PostInput onPostSuccess={handleReload} />
      <PostView reload={reload} />
    </>
  );
};

export default Post;
