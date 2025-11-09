import React, { useRef, useEffect, useContext, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../libs/utils";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();

  const [input, setInput] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleImageSend = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async function () {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-xl">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile_image"
          className="w-8 rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) ? (
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
          )}{" "}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="arrow-icon"
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} alt="help" className="hidden  sm:flex max-w-5" />
      </div>

      {/* chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-4 pb-6 space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar - Show on left for received messages */}
              {!isOwnMessage && (
                <div className="flex flex-col items-center gap-1 mb-1">
                  <img
                    src={selectedUser.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}

              {/* Message Content */}
              <div
                className={`flex flex-col ${
                  isOwnMessage ? "items-end" : "items-start"
                } max-w-[70%]`}
              >
                {message.image ? (
                  <div
                    className={`rounded-lg overflow-hidden ${
                      isOwnMessage ? "rounded-br-none" : "rounded-bl-none"
                    }`}
                  >
                    <img
                      src={message.image}
                      alt=""
                      className="max-w-[280px] w-full h-auto border border-gray-700"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 px-1">
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                ) : (
                  <div
                    className={`relative px-3 py-2 rounded-lg break-words ${
                      isOwnMessage
                        ? "bg-violet-500/30 text-white rounded-br-none"
                        : "bg-gray-700/50 text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-[10px] text-gray-300 mt-1 text-right">
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Avatar - Show on right for sent messages */}
              {isOwnMessage && (
                <div className="flex flex-col items-center gap-1 mb-1">
                  <img
                    src={authUser.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area =========== bottom area */}

      <div className="absolute bottom-0 left-0 right-10 flex items-center gap-3 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center bg-white/10 rounded-full flex-11/12 px-3">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            value={input}
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleImageSend}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="icon" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <img
          src={assets.send_button}
          alt="send"
          className="w-7 cursor-pointer"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  ) : (
    <div className="h-full w-full flex flex-col items-center justify-center gap-5 text-white">
      <img src={assets.logo_icon} alt="chat_icon" className="max-w-[150px]" />
      <p className="text-2xl">Chat anywhere, anytime</p>
    </div>
  );
};

export default ChatContainer;
