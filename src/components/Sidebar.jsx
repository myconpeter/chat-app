import React from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-[#8185B2]/10 text-white h-full p-5 rounded-l-2xl ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="">
        <div className="flex items-center justify-between">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="menu_icon" className="max-h-5 cursor-pointer" />
            <div
              className="absolute top-full mt-2 w-40  bg-gray-500 text-black
             rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 p-3 hidden group-hover:block"
            >
              <p
                onClick={() => {
                  navigate("/profile");
                }}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-50" />
              <p className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-white/10 rounded-full px-3 py-2 mt-5">
          <img src={assets.search_icon} alt="search_icon" className="w-3" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent border-none outline-none ml-3 w-full text-xs text-white flex-1 placeholder-gray-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-5 h-[80%] overflow-y-auto pr-2">
        {userDummyData.map((user, index) => (
          <div>
            <img
              src={user.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {index < 3 ? <span>Online</span> : <span>Offline</span>}
            </div>
            {index > 2 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
