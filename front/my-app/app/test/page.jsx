"use client";

import React, { useEffect, useState } from "react";
import cable from "@/utils/cable";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/messages?room_id=1`,
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
          setMessages(data);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentUser) {
      fetchMessages();

      // Set up Action Cable subscription
      const subscription = cable.subscriptions.create(
        { channel: "ChatChannel", room: 1 },
        {
          received(data) {
            setMessages((prevMessages) => [...prevMessages, data]);
          },
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUser]);

  const handleSendMessage = async () => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    const messageData = {
      message: {
        content: message,
        user_id: currentUser.id,
        room_id: 1,
      },
    };

    console.log("Sending message:", messageData);

    setMessage(""); // Clear input field immediately after sending the message to improve UX

    try {
      const response = await fetch("http://localhost:3000/api/v1/messages", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        console.error("Failed to send message", messageData);
      } else {
        const newMessage = await response.json();
        console.log("Message sent successfully:", newMessage);
        // No need to manually add the new message to state, as it will be received through Action Cable
      }
    } catch (error) {
      console.error("Error sending message:", error, messageData);
    }
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div>
        <div>
          {messages.map((msg) => (
            <div key={msg.id}>{msg.content}</div>
          ))}
        </div>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </>
  );
};

export default Message;
