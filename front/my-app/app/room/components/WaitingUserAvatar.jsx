import React from "react";

const WaitingUserAvatar = ({ userAvatars }) => {
  return (
    <div
      className="absolute right-48 flex -space-x-4 z-30 p-4"
      style={{ top: "185mm" }}
    >
      {userAvatars.map((user) =>
        user.avatarUrl ? (
          <div key={user.id} className="relative">
            <img
              src={`http://localhost:3000${user.avatarUrl}`}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="absolute bottom-[-8px] left-0 right-0 h-1 bg-black"></div>
          </div>
        ) : (
          <div
            key={user.id}
            className="relative flex items-center justify-center bg-gray-300 text-white text-xs font-bold rounded-full"
            style={{ width: 80, height: 80, whiteSpace: "nowrap" }}
          >
            NO IMAGE
            <div className="absolute bottom-[-8px] left-0 right-0 h-1 bg-black"></div>
          </div>
        )
      )}
    </div>
  );
};

export default WaitingUserAvatar;
