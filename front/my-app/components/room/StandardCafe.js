import React from "react";
import Image from "next/image";

const StandardCafe = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 z-10">
      <div className="">
        <Image
          src="/StandardCafe.PNG"
          alt="Standard Cafe"
          width={750}
          height={500}
          layout="intrinsic"
        />
      </div>
    </div>
  );
};

export default StandardCafe;
