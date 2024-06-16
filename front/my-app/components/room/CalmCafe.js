import React from "react";
import Image from "next/image";

const CalmCafe = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 z-10">
      <div className="relative w-[500px] md:w-[700px]">
        <Image
          src="/CalmCafe.PNG"
          alt="Calm Cafe"
          width={900}
          height={500}
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute flex items-center top-[51%] right-[13%] md:top-[51%] md:right-[14%]">
          <button
            className="bg-white bg-opacity-50 w-9 h-9 md:w-12 md:h-12 rounded-full ml-2"
            onClick={() => alert('Button clicked!')}
          ></button>
        </div>
        <button
          className="absolute bg-white bg-opacity-50 w-9 h-9 top-[43%] right-[27%] md:w-12 md:h-12 rounded-full md:top-[43%] md:right-[28%]"
          onClick={() => alert('Button clicked!')}
        ></button>
        <button
          className="absolute bg-white bg-opacity-50 w-9 h-9 top-[35%] right-[41%] md:w-12 md:h-12 rounded-full md:top-[35%] md:right-[42%]"
          onClick={() => alert('Button clicked!')}
        ></button>
        <button
          className="absolute bg-white bg-opacity-50 w-9 h-9 top-[62%] right-[46%] md:w-12 md:h-12 rounded-full md:top-[63%] md:right-[47%]"
          onClick={() => alert('Button clicked!')}
        ></button>
        <button
          className="absolute bg-white bg-opacity-50 w-9 h-9 top-[69%] right-[35%] md:w-12 md:h-12 rounded-full md:top-[69%] md:right-[35%]"
          onClick={() => alert('Button clicked!')}
        ></button>
      </div>
    </div>
  );
};

export default CalmCafe;
