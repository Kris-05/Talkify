import { Router } from "express";
import { checkUser, loginUser, signUpUser, getUserInfo, updateProfile, logoutUser } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// not used
router.post("/check-user", checkUser);

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/userinfo", verifyToken, getUserInfo);
router.post("/update-profile", verifyToken, updateProfile); 
router.post("/logout", logoutUser);

export default router;