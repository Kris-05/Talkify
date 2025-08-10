import { Router } from "express";
import { checkUser, loginUser, signUpUser, getUserInfo } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// not used
router.post("/check-user", checkUser);

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/userinfo", verifyToken, getUserInfo);

export default router;