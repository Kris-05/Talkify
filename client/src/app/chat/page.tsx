"use client";

import ChatSidebar from "@/components/ChatSidebar";
import Loading from "@/components/Loading";
import { chat_service, useAppData, User } from "@/context/appContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import MessageInput from "@/components/MessageInput";
import { SocketData } from "@/context/socketContext";

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

const Chat = () => {
  const {
    loading,
    isAuth,
    logoutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();

  const { onlineUsers, socket } = SocketData();
  // console.log(onlineUsers);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  const handleLogout = () => logoutUser();

  async function createChat(u: User) {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${chat_service}/api/v2/chat/new`,
        {
          userId: loggedInUser?._id,
          receiverId: u._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSelectedUser(data.chatId);
      setShowAllUsers(false);
      await fetchChats();
    } catch (e) {
      toast.error("Failed to start chat");
      console.log(e);
    }
  }

  async function fetchChat() {
    const token = Cookies.get("token");

    try {
      const { data } = await axios.get(
        `${chat_service}/api/v2/message/${selectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages(data.messages);
      setUser(data.user);
      await fetchChats();
    } catch (e) {
      toast.error("Failed to load message");
      console.log(e);
    }
  }

  const moveChatToTop = (
    chatId: string,
    newMsg: any,
    updatedUnSeenCount = true,
  ) => {
    setChats((prev) => {
      if (!prev) return null;

      const updatedChats = [...prev];
      const chatIdx = updatedChats.findIndex(
        (chat) => chat?.chat?._id === chatId,
      );

      if (chatIdx !== -1) {
        const [moveChat] = updatedChats.splice(chatIdx, 1);
        if (moveChat) {
          const updatedChat = {
            ...moveChat,
            chat: {
              ...moveChat.chat,
              latestMessage: {
                text: newMsg.text,
                sender: newMsg.sender,
              },
              updatedAt: new Date().toString(),
              unseenCount:
                updatedUnSeenCount && newMsg.sender !== loggedInUser?._id
                  ? (moveChat.chat.unseenCount || 0) + 1
                  : moveChat.chat.unseenCount || 0,
            },
          };
          updatedChats.unshift(updatedChat);
        }
      }
      return updatedChats;
    });
  };

  const resetUnseenCount = (chatId: string) => {
    setChats((prev) => {
      if (!prev) return null;

      return prev.map((chat) => {
        if (chat.chat._id === chatId) {
          return {
            ...chat,
            chat: {
              ...chat.chat,
              unseenCount: 0,
            },
          };
        }

        return chat;
      });
    });
  };

  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) return;
    if (!selectedUser) return;

    // socket setup
    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
      setTypingTimeOut(null);
    }

    socket?.emit("stopTyping", {
      chatId: selectedUser,
      userId: loggedInUser?._id,
    });

    const token = Cookies.get("token");

    try {
      const formData = new FormData();
      formData.append("chatId", selectedUser);

      if (message.trim()) {
        formData.append("text", message);
      }

      if (imageFile) {
        formData.append("file", imageFile);
      }

      const { data } = await axios.post(
        `${chat_service}/api/v2/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setMessages((prev) => {
        const curr = prev || [];
        const exists = curr.some((msg) => msg._id === data.message._id);

        if (!exists) {
          return [...curr, data.message];
        }
        return curr;
      });

      setMessage("");
      const displayText = imageFile ? "📷 image" : message;
      moveChatToTop(
        selectedUser!,
        { text: displayText, sender: data.sender },
        false,
      );
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    if (!selectedUser || !socket) return;

    // socket setup
    if (value.trim()) {
      socket.emit("startTyping", {
        chatId: selectedUser,
        userId: loggedInUser?._id,
      });
    }

    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
    }

    const timeout = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedUser,
        userId: loggedInUser?._id,
      });
    }, 2000);

    setTypingTimeOut(timeout);
  };

  useEffect(() => {
    socket?.on("newMessage", (msg) => {
      console.log("Received newMessage", msg);

      if (selectedUser === msg.chatId) {
        setMessages((prev) => {
          const currMsgs = prev || [];
          const msgExists = currMsgs.some((message) => message._id === msg._id);
          if (!msgExists) {
            return [...currMsgs, msg];
          }
          return currMsgs;
        });

        moveChatToTop(msg.chatId, msg, false);
      } else {
        moveChatToTop(msg.chatId, msg, true);
      }
    });

    socket?.on("messagesSeen", (data) => {
      console.log("Message seen by:", data);
      if (selectedUser === data.chatId) {
        setMessages((prev) => {
          if (!prev) return null;
          return prev.map((msg) => {
            if (
              msg.sender === loggedInUser?._id &&
              data.messageIds &&
              data.messageIds.includes(msg._id)
            ) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString(),
              };
            } else if (msg.sender === loggedInUser?._id && !data.messageIds) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString(),
              };
            }
            return msg;
          });
        });
      }
    });

    socket?.on("userStartedTyping", (data) => {
      console.log("Received userStartedTyping", data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(true);
      }
    });

    socket?.on("userStoppedTyping", (data) => {
      console.log("Received userStoppedTyping", data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("messagesSeen");
      socket?.off("userStartedTyping");
      socket?.off("userStoppedTyping");
    };
  }, [socket, selectedUser, setChats, loggedInUser?._id]);

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
      setIsTyping(false);

      resetUnseenCount(selectedUser);

      socket?.emit("joinChat", selectedUser);

      return () => {
        socket?.emit("leaveChat", selectedUser);
        setMessages(null);
      };
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    return () => {
      if (typingTimeOut) {
        clearTimeout(typingTimeOut);
      }
    };
  }, [typingTimeOut]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ChatSidebar
        sideBarOpen={sidebarOpen}
        setSideBarOpen={setSidebarOpen}
        showAllUsers={showAllUsers}
        setshowAllUsers={setShowAllUsers}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
        createChat={createChat}
        onlineUsers={onlineUsers}
      />
      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10">
        <ChatHeader
          user={user}
          setSideBarOpen={setSidebarOpen}
          isTyping={isTyping}
          onlineUsers={onlineUsers}
        />

        <ChatMessages
          selecteduser={selectedUser}
          messages={messages}
          currentUser={loggedInUser}
        />

        <MessageInput
          selectedUser={selectedUser}
          message={message}
          setMessage={handleTyping}
          handleMsgSend={handleMessageSend}
        />
      </div>
    </div>
  );
};

export default Chat;
