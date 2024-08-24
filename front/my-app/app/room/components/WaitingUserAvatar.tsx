import React from "react";

interface UserAvatar {
  id: number;
  name: string;
  avatarUrl?: string | null;
}

interface WaitingUserAvatarProps {
  userAvatars: UserAvatar[];
}

const WaitingUserAvatar = ({ userAvatars }: WaitingUserAvatarProps) => {
  return (
    <div
      className="absolute right-48 flex -space-x-4 z-30 p-4 opacity-70"
      style={{ top: "165mm" }}
    >
      {userAvatars.map((user) =>
        user.avatarUrl ? (
          <div key={user.id} className="relative w548:h847:block hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_RAILS_URL}${user.avatarUrl}`}
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
            className="relative items-center justify-center bg-gray-300 text-white text-xs font-bold rounded-full w548:h847:flex hidden"
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
