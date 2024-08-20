import React from "react";
import Image from "next/image";

const RootCalmCafe = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center fixed inset-0 z-10">
      <div className="hidden md:block">
        <Image
          src="/CalmCafe.PNG"
          alt="Calm Cafe"
          width={800}
          height={600}
          layout="intrinsic"
        />
      </div>
    </div>
  );
};

export default RootCalmCafe;
