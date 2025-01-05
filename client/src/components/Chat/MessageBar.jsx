import React from "react";
import {BsEmojiSmile} from "react-icons/bs"
import { FaMicrophone } from "react-icons/fa";
import {ImAttachment} from "react-icons/im"
import { MdSend } from "react-icons/md";

function MessageBar() {
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
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend title="Send message" className="text-panel-header-icon cursor-pointer text-xl"/>
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
