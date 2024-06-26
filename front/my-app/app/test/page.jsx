"use client";
import Image from "next/image";

const FrameBeach = () => {
  return (
    <>
      <div className="flex items-center justify-center fixed inset-0 z-10">
        <div className="relative w-[500px] md:w-[700px]">
          <Image
            src="/FrameBeach.jpg"
            alt="FrameBeach"
            width={900}
            height={500}
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </>
  );
};

export default FrameBeach;
