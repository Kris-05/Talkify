import Avatar from "@/components/common/Avatar";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { useAppStore } from "@/store";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { LOGOUT_ROUTE } from "@/utils/apiRoutes";

const ChatListHeader = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const logout = async () => {
    console.log("Logging out...");
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );

      if(res.status === 200) {
        toast.success("Logged out successfully");
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-3 bg-[#2a2b33]">
      <div className="cursor-pointer flex justify-center items-center gap-3">
        <Avatar type="sm" image={userInfo?.profilePic} />
        <h6>{userInfo?.name} (You)</h6>
      </div>

      <div className="flex gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="cursor-pointer text-xl"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-300 cursor-pointer text-xl"
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatListHeader;
