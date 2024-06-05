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
    <div className="relative min-h-screen">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/background_movie.MP4"
        autoPlay
        loop
        muted
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 z-10"></div>{" "}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
        <PostInput onPostSuccess={handleReload} />
        <PostView reload={reload} />
      </div>
    </div>
  );
};

export default Post;
