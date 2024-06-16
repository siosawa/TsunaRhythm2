import React from "react";
import Image from "next/image";

const TsunaRhythm = () => {
  return (
    <div className="z-10">
      <Image
        src="/TsunaRhythm_logo.PNG"
        alt="TsunaRhythm"
        width={500}
        height={600}
        layout="intrinsic"
      />
    </div>
  );
};

export default TsunaRhythm;
