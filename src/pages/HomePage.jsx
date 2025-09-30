import React, { useState } from "react";
import RightSidebar from "../components/RightSidebar";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(true);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-200 rounded-2xl overflow-hidden h-[100%] relative grid grid-cols-1 md:grid-cols-[20rem_1fr_20rem]`}
      >
        <Sidebar selectedUser={selectedUser} />

        <ChatContainer className={selectedUser ? "" : "md:col-span-2"} />

        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;
