import React from "react";
import Image from "next/image";

const Universe = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 z-10">
      <div className="">
        <Image
          src="/Universe.PNG"
          alt="Universe"
          width={1200}
          height={800}
          layout="intrinsic"
        />
      </div>
    </div>
  );
};

export default Universe;
