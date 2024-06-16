import React, { useState, useRef, useEffect } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";

const GroupChat = () => {
  const [messages, setMessages] = useState([
    {
      content: "テキストテキストテキストテキスト",
      user: { name: "まい", avatar: "url-to-mai-avatar" },
    },
    {
      content: "テキストテキストテキストテキストテキストテキストテキスト",
      user: { name: "太郎", avatar: "url-to-taro-avatar" },
    },
    {
      content: "テキストテキストテキストテキストテキストテキスト",
      user: { name: "花子", avatar: "url-to-hanako-avatar" },
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // 初期状態を閉じる

  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        {
          content: newMessage,
          user: { name: "You", avatar: "url-to-your-avatar" },
        },
      ]);
      setNewMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      handleSendMessage();
    }
  };

  return (
    <div className="p-1 rounded-3xl bg-white shadow-custom-dark absolute z-30 w-68 right-10 mt-7 md:right-10 md:mt-52">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-center flex-grow">ルームチャット</h2>
        <button onClick={toggleChat} className="text-gray-500 mr-2">
          <TbTriangleInvertedFilled />
        </button>
      </div>
      {isChatOpen && (
        <>
          <div className=" h-96 overflow-y-scroll mb-1 p-2">
            <div className="text-center text-xs text-gray-400 mb-2">
              チャットは100件まで保存されます
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 flex items-start ${
                  message.user.name === "You" ? "justify-end" : ""
                }`}
              >
                {message.user.name !== "You" && (
                  <img
                    src={message.user.avatar}
                    alt={message.user.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                <div>
                  <strong
                    className={
                      message.user.name === "You" ? "text-right block" : ""
                    }
                  >
                    {message.user.name}
                  </strong>
                  <div
                    className={`text-sm rounded-lg p-2 mt-1 ${
                      message.user.name === "You"
                        ? "bg-blue-100 text-left"
                        : "bg-gray-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
                {message.user.name === "You" && (
                  <img
                    src={message.user.avatar}
                    alt={message.user.name}
                    className="w-10 h-10 rounded-full ml-2"
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center p-2">
            <input
              type="text"
              className="flex-grow rounded-full p-1 mr-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Aa"
            />
            <button
              onClick={handleSendMessage}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2"
            >
              <IoMdSend />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GroupChat;
