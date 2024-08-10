"use client";
import React, { useState, useRef, useEffect } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";
import cable from "@/utils/cable";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const GroupChat = ({ room_id }) => {
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUsers, setOtherUsers] = useState({});

  const chatsEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/chats?room_id=${room_id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
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
          received(data) {
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
    const fetchOtherUser = async (userId) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setOtherUsers((prev) => ({ ...prev, [userId]: data }));
        } else {
          console.error(`Failed to fetch user ${userId}`);
        }
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/chats`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatData),
        }
      );

      if (!response.ok) {
        console.error("Failed to send chat", chatData);
      } else {
        const newChat = await response.json();
        console.log("Chat sent successfully:", newChat);
      }
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

  const handleKeyDown = (event) => {
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
