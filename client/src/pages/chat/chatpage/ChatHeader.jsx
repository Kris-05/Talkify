import Avatar from "@/components/common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { userInfo } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-3 md:px-6 lg:px-8 shadow-md">
      <div className="flex gap-4 items-center">
        <Avatar type="sm" image={userInfo?.profilePic} />
        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm md:text-base">
            {userInfo?.name}
          </span>
          <span className="text-green-400 text-xs">online</span>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <MdCall className="text-gray-400 hover:text-white cursor-pointer text-xl transition-colors" />
        <IoVideocam className="text-gray-400 hover:text-white cursor-pointer text-xl transition-colors" />
        <BiSearchAlt2 className="text-gray-400 hover:text-white cursor-pointer text-xl transition-colors" />
        <button className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors text-2xl">
          <RiCloseFill />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
