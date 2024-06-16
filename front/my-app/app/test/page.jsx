import Image from "next/image";

const AvatarComponent = () => {
  const avatarUrl = "http://localhost:3000/uploads/user/avatar/2/IMG_1515.jpg";

  return (
    <div>
      <p className="text-3xl mt-16">アバターを表示</p>
      <Image
        src={avatarUrl}
        alt="User Avatar"
        width={500} // 必要に応じてサイズを指定
        height={150} // 必要に応じてサイズを指定
      />
    </div>
  );
};

export default AvatarComponent;
