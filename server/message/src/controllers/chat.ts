import axios from "axios";
import TryCatch from "../config/tryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { Chat } from "../model/chat.js";
import { Message } from "../model/message.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { receiverId } = req.body;

    if (!receiverId) {
      res.status(401).json({ message: "Other userId is required" });
      return;
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, receiverId], $size: 2 },
    });

    if (existingChat) {
      res.json({
        message: "Chat already exists",
        chatId: existingChat._id,
      });
      return;
    }

    const newChat = await Chat.create({
      users: [userId, receiverId],
    });
    res.status(201).json({
      message: "Chat created",
      chatId: newChat._id,
    });
  },
);

export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized - User id missing" });
    return;
  }

  const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

  const chatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find((id) => id !== userId);
      const unseenCount = await Message.countDocuments({
        chatId: chat._id,
        sender: { $ne: userId },
        seen: false,
      });

      try {
        const data = await axios.get(
          `${process.env.USER_SERVICE}/api/v2/user/${otherUserId}`,
        );
        return {
          user: data.data,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      } catch (e) {
        console.log(e);
        return {
          user: { _id: otherUserId, name: "Unknown User" },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      }
    }),
  );
  res.json({
    chats: chatWithUserData,
  });
});

export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res) => {
  const senderId = req.user?._id;
  const { chatId, text } = req.body;
  const imageFile = req.file;

  if (!senderId) {
    res.status(401).json({ message: "Unauthorized - Sender User id missing" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ message: "Chat ID required" });
    return;
  }

  if (!text && !imageFile) {
    res.status(400).json({ message: "Message text or image required" });
    return;
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404).json({ message: "Chat not found" });
    return;
  }

  const isUserInChat = chat.users.some(
    (userId) => userId.toString() === senderId.toString(),
  );
  if (!isUserInChat) {
    res
      .status(403)
      .json({ message: "Forbidden - User not in chat, User not registerd" });
    return;
  }

  const recieverId = chat.users.find(
    (id) => id.toString() !== senderId.toString(),
  );
  if (!recieverId) {
    res
      .status(401)
      .json({ message: "Unauthorized - Reciever User id missing" });
    return;
  }

  // socket setup

  let messageData: any = {
    chatId: chatId,
    sender: senderId,
    seen: false,
    seenAt: undefined,
  };

  if (imageFile) {
    messageData.image = {
      url: imageFile.path,
      publicId: imageFile.filename,
    };
    messageData.messageType = "image";
    messageData.text = text || "";
  } else {
    messageData.text = text;
    messageData.messageType = "text";
  }

  const msg = new Message(messageData);
  const savedMsg = await msg.save();

  const latestMsg = imageFile ? "📷 Image" : text;
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: {
      text: latestMsg,
      sender: senderId,
    },
    updatedAt: new Date(),
  }, {new: true});

  // emit to socket

  res.status(201).json({
    status: "Message sent",
    messageId: savedMsg._id,
    message: savedMsg,
    sender: senderId,
  });
});

export const getMessagesByChat = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;
  const { chatId } = req.params;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized - User id missing" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ message: "Chat ID required" });
    return;
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404).json({ message: "Chat not found" });
    return;
  }

  const isUserInChat = chat.users.some(
    (userId) => userId.toString() === userId.toString(),
  );
  if (!isUserInChat) {
    res
      .status(403)
      .json({ message: "Forbidden - User not in chat, User not registerd" });
    return;
  }

  const messagesToMarkSeen = await Message.find({
    chatId: chatId,
    sender: { $ne: userId },
    seen: false,
  });
  await Message.updateMany({
    chatId: chatId,
    sender: { $ne: userId },
    seen: false,
  }, { seen: true, seenAt: new Date() });

  const messages = await Message.find({ chatId: chatId }).sort({ createdAt: 1 });
  const receiverId = chat.users.find(
    (id) => id.toString() !== userId.toString(),
  );

  try {
    const { data } = await axios.get(
      `${process.env.USER_SERVICE}/api/v2/user/${receiverId}`,
    );

    if(!receiverId){
      res.status(403).json({ message: "Forbidden - No reciever found" });
      return;
    }
    
    // socket work

    res.json({
      messages,
      user: data,
    })
  } catch (e) {
    console.log(e);
    res.json({
      messages,
      user: { _id: receiverId, name: "Unknown User" },
    });
  }
});