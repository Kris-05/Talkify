import { Router } from "express";
import { checkUser, loginUser, signUpUser } from "../controllers/authController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/signup", signUpUser);
router.post("/login", loginUser);

export default router;