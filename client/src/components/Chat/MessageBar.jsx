import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState } from "react";
import {BsEmojiSmile} from "react-icons/bs"
import { FaMicrophone } from "react-icons/fa";
import {ImAttachment} from "react-icons/im"
import { MdSend } from "react-icons/md";

function MessageBar() {

  const [{ userInfo, currentChatUser, socket}, dispatch] = useStateProvider();

  const [message, setMessage] = useState();

  const sendMessage = async () => {
    try {
      const {data} = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message
      }); 
      socket.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message:data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      })

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile title="Emoji" className="text-panel-header-icon cursor-pointer text-xl"/>
          <ImAttachment title="Attach-file" className="text-panel-header-icon cursor-pointer text-xl"/>
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a Mesaage"
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            onChange={e => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend 
            title="Send message"
            className="text-panel-header-icon cursor-pointer text-xl"
            onClick={sendMessage}
          />
          </button>
          {/* <button>
            <FaMicrophone title="Record" className="text-panel-header-icon cursor-pointer text-xl"/>
          </button> */}
        </div>
      </>
    </div>
  )
}

export default MessageBar;
