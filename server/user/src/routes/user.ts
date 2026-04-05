import express from "express";
import {
  getAllUsers,
  getAUser,
  loginUser,
  myProfile,
  updateName,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/profile", isAuth, myProfile);
router.get("/user/allUsers", isAuth, getAllUsers);
router.get("/user/:id", getAUser);
router.patch("/update/user", isAuth, updateName);

export default router;
