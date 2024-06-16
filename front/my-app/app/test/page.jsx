const AvatarComponent = () => {
  const avatarUrl = "http://localhost:3000/uploads/user/avatar/2/IMG_1515.jpg";

  return (
    <div>
      <img
        src={avatarUrl}
        alt="User Avatar"
        width={100} // 必要に応じてサイズを指定
        height={100} // 必要に応じてサイズを指定
        style={{ borderRadius: "50%" }}
      />
    </div>
  );
};

export default AvatarComponent;
