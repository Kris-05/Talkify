import express from "express";
import isAuthenticated from "../middleware/isAuth.js";
import { createNewChat, getAllChats, getMessagesByChat, sendMessage } from "../controllers/chat.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/chat/new", isAuthenticated, createNewChat);
router.get("/chat/allChats", isAuthenticated, getAllChats);
router.post("/message", isAuthenticated, upload.single('file'), sendMessage);
router.get("/message/:chatId", isAuthenticated, getMessagesByChat);

export default router;