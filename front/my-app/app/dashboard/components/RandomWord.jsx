import * as React from "react";

const RandomWord = () => {
  // 静的なランダムメッセージの配列
  // VSコードがstingと理解しているのでコロンStrongは不要。基本的に型推論がつかないときだけ型を明示するようにする。
  const randomWords = [
    "自分を信じて、一歩一歩進んでいこう。",
    "小さな進歩も大きな成果につながる。",
    "休むことも大切。リフレッシュしてまた頑張ろう。",
    "努力はあなたの自信になる",
    "目標に向かって進むあなたを応援しているよ。",
    "自分のペースで進んで大丈夫。",
    "失敗は成長のチャンス。前向きに捉えよう。",
    "焦らず、ゆっくり進んでいこう。",
    "自分を大切にしながら頑張ろう。",
    "いつも頑張っている自分を褒めてあげよう。",
    "周りのサポートを受け入れることも大事。",
    "自分の夢を信じて、前に進もう。",
    "休むことは怠けることじゃないよ。",
    "小さな成功も大切に喜ぼう。",
    "あなたの努力は必ず実を結ぶ。",
    "自分の力を信じて、前進しよう。",
    "焦らずに、マイペースで進んでいこう。",
    "他人と比べず、自分のペースを大事にしよう。",
    "心配事があれば、誰かに話してみよう。",
    "リフレッシュして、新しい気持ちで頑張ろう。",
  ];

  // ランダムなインデックスを生成
  const randomIndex = Math.floor(Math.random() * randomWords.length);
  const word = randomWords[randomIndex];

  return (
    <div className="px-4 w-48 h-52 bg-white shadow-custom-dark rounded-3xl flex items-center justify-center text-center border-2 border-orange-500">
      <p className="font-bold">{word}</p>
    </div>
  );
};

export default RandomWord;
