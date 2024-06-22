"use client";

import React, { useState, useRef, useEffect } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";
import cable from "@/utils/cable";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const GroupChat = () => {
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // 初期状態を閉じる
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUsers, setOtherUsers] = useState({});

  const chatsEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/chats?room_id=1`,
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

      // Set up Action Cable subscription
      const subscription = cable.subscriptions.create(
        { channel: "ChatChannel", room: 1 },
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
  }, [currentUser]);

  useEffect(() => {
    const fetchOtherUser = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/${userId}`,
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
        room_id: 1,
      },
    };

    console.log("Sending chat:", chatData);

    setNewChat(""); // Clear input field immediately after sending the chat to improve UX

    try {
      const response = await fetch("http://localhost:3000/api/v1/chats", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {
        console.error("Failed to send chat", chatData);
      } else {
        const newChat = await response.json();
        console.log("Chat sent successfully:", newChat);
        // No need to manually add the new chat to state, as it will be received through Action Cable
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
      <div className="p-1 rounded-3xl bg-white shadow-custom-dark absolute z-30 w-68 right-10 mt-7 md:right-10 md:mt-52">
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
                        src={`http://localhost:3000${otherUsers[chat.user_id].avatar.url}`}
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
                        ? "You"
                        : otherUsers[chat.user_id]?.name || "User"}
                    </strong>
                    <div
                      className={`text-sm rounded-lg p-2 mt-1 ${
                        chat.user_id === currentUser?.id
                          ? "bg-blue-100 text-left"
                          : "bg-gray-100"
                      }`}
                    >
                      {chat.content}
                    </div>
                  </div>
                  {chat.user_id === currentUser?.id && (
                    <img
                      src={`http://localhost:3000${currentUser.avatar.url}`}
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
