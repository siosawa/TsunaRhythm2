import React from "react";
import Image from "next/image";

const CalmCafe = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 z-10">
      <div className="">
        <Image
          src="/CalmCafe.PNG"
          alt="Calm Cafe"
          width={700}
          height={500}
          layout="intrinsic"
        />
      </div>
    </div>
  );
};

export default CalmCafe;
