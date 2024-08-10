"use client";
import PostInput from "./components/PostInput";
import PostView from "./components/PostView";
import { useState } from "react";

const Post = (): JSX.Element => {
  const [reload, setReload] = useState<boolean>(false);

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
