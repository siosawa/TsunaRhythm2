"use client";

import React, { useEffect, useState } from "react";
import cable from "@/utils/cable";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleSendChat = async () => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    const chatData = {
      chat: {
        content: chat,
        user_id: currentUser.id,
        room_id: 1,
      },
    };

    console.log("Sending chat:", chatData);

    setChat(""); // Clear input field immediately after sending the chat to improve UX

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

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div>
        <div>
          {chats.map((msg) => (
            <div key={msg.id}>{msg.content}</div>
          ))}
        </div>
        <input value={chat} onChange={(e) => setChat(e.target.value)} />
        <button onClick={handleSendChat}>Send</button>
      </div>
    </>
  );
};

export default Chat;
