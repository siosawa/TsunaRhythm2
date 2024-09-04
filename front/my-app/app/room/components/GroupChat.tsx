"use client";
import React, { useState, useRef, useEffect } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";
import cable from "@/utils/cable";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import axios from "axios";

// 型定義
interface Chat {
  id: number;
  content: string;
  user_id: number;
  room_id: number;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  work: string;
  profile_text: string;
  avatar: {
    url: string;
  };
  posts_count: number;
  followers_count: number;
  following_count: number;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  following: number;
  followers: number;
  posts_count: number;
  work: string;
  profile_text: string | null;
  avatar: {
    url: string | null;
  };
}

interface GroupChatProps {
  room_id: number;
}

const GroupChat = ({ room_id }: GroupChatProps): JSX.Element => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [newChat, setNewChat] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [otherUsers, setOtherUsers] = useState<{ [key: number]: User }>({});

  const chatsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/chats`,
          {
            params: { room_id },
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const data: Chat[] = response.data;
          setChats(data);
        } else {
          console.error("Failed to fetch chats");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (currentUser) {
      fetchChats();

      const subscription = cable.subscriptions.create(
        { channel: "ChatChannel", room: room_id },
        {
          received(data: Chat) {
            setChats((prevChats) => [...prevChats, data]);
          },
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUser, room_id]);

  useEffect(() => {
    const fetchOtherUser = async (userId: number) => {
      try {
        const response = await axios.get<User>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setOtherUsers((prev) => ({ ...prev, [userId]: response.data }));
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
      }
    };

    chats.forEach((chat) => {
      if (chat.user_id !== currentUser?.id && !otherUsers[chat.user_id]) {
        fetchOtherUser(chat.user_id);
      }
    });
  }, [chats, currentUser, otherUsers]);

  const handleSendChat = async () => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    const chatData = {
      chat: {
        content: newChat,
        user_id: currentUser.id,
        room_id: room_id,
      },
    };

    console.log("Sending chat:", chatData);

    setNewChat("");

    try {
      const response = await axios.post<Chat>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/chats`,
        chatData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Chat sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending chat:", error, chatData);
    }
  };

  const scrollToBottom = () => {
    chatsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chats, isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      handleSendChat();
    }
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="p-1 rounded-3xl bg-white shadow-custom-dark absolute w-68 right-10 mt-7 md:right-10 md:mt-20 z-30">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-center flex-grow">ルームチャット</h2>
          <button onClick={toggleChat} className="text-gray-500 mr-2">
            <TbTriangleInvertedFilled />
          </button>
        </div>
        {isChatOpen && (
          <>
            <div className="h-96 overflow-y-scroll mb-1 p-2">
              <div className="text-center text-xs text-gray-400 mb-2">
                チャットは100件まで保存されます
              </div>
              {chats.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-3 flex items-start ${
                    chat.user_id === currentUser?.id ? "justify-end" : ""
                  }`}
                >
                  {chat.user_id !== currentUser?.id &&
                    otherUsers[chat.user_id] && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_RAILS_URL}${otherUsers[chat.user_id].avatar.url}`}
                        alt="otherUser Avatar"
                        className="w-10 h-10 rounded-full mr-2"
                      />
                    )}
                  <div>
                    <strong
                      className={
                        chat.user_id === currentUser?.id
                          ? "text-right block"
                          : ""
                      }
                    >
                      {chat.user_id === currentUser?.id
                        ? ""
                        : otherUsers[chat.user_id]?.name || "User"}
                    </strong>
                    <div
                      className={`text-sm p-2 mt-1 ${
                        chat.user_id === currentUser?.id
                          ? "bg-blue-100 text-left rounded-tl-lg rounded-br-lg rounded-bl-lg"
                          : "bg-gray-100 rounded-tr-lg rounded-bl-lg rounded-br-lg"
                      }`}
                    >
                      {chat.content}
                    </div>
                  </div>

                  {chat.user_id === currentUser?.id && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_RAILS_URL}${currentUser.avatar.url}`}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full ml-2"
                    />
                  )}
                </div>
              ))}
              <div ref={chatsEndRef} />
            </div>
            <div className="flex items-center p-2">
              <input
                type="text"
                className="flex-grow rounded-full p-1 mr-1"
                value={newChat}
                onChange={(e) => setNewChat(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Aa"
              />
              <button
                onClick={handleSendChat}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2"
              >
                <IoMdSend />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GroupChat;