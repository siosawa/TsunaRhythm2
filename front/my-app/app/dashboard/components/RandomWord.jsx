"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const RandomWord = () => {
  const [word, setWord] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/randomWord")
      .then((response) => {
        const randomWords = response.data;
        console.log("RandomWords:", randomWords);
        if (randomWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * randomWords.length);
          setWord(randomWords[randomIndex].message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="p-5 w-[5cm] h-[5cm] bg-white shadow-custom-dark rounded-3xl flex items-center justify-center text-center">
      <p className="font-bold">{word}</p>
    </div>
  );
};

export default RandomWord;
