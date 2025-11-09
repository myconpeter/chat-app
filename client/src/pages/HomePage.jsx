import React, { useContext } from "react";
import RightSidebar from "../components/RightSidebar";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import { ChatContext } from "../context/chatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-200 rounded-2xl overflow-hidden h-[100%] relative grid grid-cols-1 ${
          selectedUser ? "md:grid-cols-[16rem_1fr_10rem]" : "md:grid-cols-[20rem_1fr]"
        }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
