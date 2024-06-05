import React from "react";

const index = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/background_movie.MP4"
        autoPlay
        loop
        muted
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 z-10"></div>
      {/* ここにコードを追加 */}
    </div>
  );
};

export default index;
