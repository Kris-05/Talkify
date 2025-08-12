import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log("Send:", message);
      setMessage("");
    }
  };

  return (
    <div className="h-[10vh] border-t border-[#2f303b] flex items-center gap-4 px-4 sm:px-6 bg-[#1c1d25]">
      <div className="flex flex-1 items-center gap-3 bg-[#2a2b33] rounded-full px-4 py-2 shadow-sm">
        <input
          type="text"
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-lg" />
        </button>
        <div className="relative flex items-center">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setOpen(true)}
          >
            <RiEmojiStickerLine className="text-xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <div className="w-56 md:w-72 lg:w-full max-h-[300px] overflow-y-auto">
              <EmojiPicker
                theme="dark"
                open={open}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSend}
        className="hover:bg-neutral-600 p-2 rounded-full transition"
      >
        <IoSend className="text-white text-lg" />
      </button>
    </div>
  );
};

export default MessageBar;
