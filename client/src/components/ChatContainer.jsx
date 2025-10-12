import React, { useRef, useEffect } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../libs/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-xl">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={assets.profile_martin} alt="profile_image" className="w-8 rounded-full" />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          Martin Johnson <span className="w-2 h-2 rounded-full bg-green-600"></span>{" "}
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
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-4 pb-6">
        {messagesDummyData.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              message.senderId !== "680f50e4f10f3cd28382ecf9" && "flex-row-reverse"
            }`}
          >
            {message.image ? (
              <img
                src={message.image}
                alt=""
                className="max-w-[230px] border border-gray-700  rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] mt-2 font-light rounded-lg break-all bg-violet-500/30 text-white ${
                  message.senderId === "680f50e4f10f3cd28382ecf9"
                    ? "rounded-br-none"
                    : "rounded-br-none"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  message.senderId === "680f50e4f10f3cd28382ecf9"
                    ? assets.avatar_icon
                    : assets.profile_martin
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-white"> {formatMessageTime(message.createdAt)}</p>
            </div>
          </div>
        ))}

        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area =========== bottom area */}

      <div className="absolute bottom-0 left-0 right-10 flex items-center gap-3 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center bg-white/10 rounded-full flex-11/12 px-3">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="icon" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <img src={assets.send_button} alt="send" className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className="h-full w-full flex flex-col items-center justify-center gap-5 text-white">
      <img src={assets.logo_icon} alt="chat_icon" className="max-w-[150px]" />
      <p className="text-2xl">Chat anywhere oddd, anytime</p>
    </div>
  );
};

export default ChatContainer;
