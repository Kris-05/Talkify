import { generateToken } from "../config/JWTtoken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { redisClient } from "../config/redis.js";
import TryCatch from "../config/tryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/user.js";

export const loginUser = TryCatch(async (req: any, res: any) => {
  const { email } = req.body;

  const rateLimitKey = `OTP:RateLimit:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);

  if (rateLimit) {
    res.status(429).json({
      msg: "Too many request. Wait for 1 min",
    });
    return;
  }

  const OTP = Math.floor(100000 + Math.random() * 900000).toString();
  const OTPKey = `OTP:${email}`;

  await redisClient.set(OTPKey, OTP, {
    EX: 300,
  });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "Your OTP code",
    body: `Your OTP is ${OTP}. It's valid for 5 minutes`,
  };

  await publishToQueue("send-otp", message);

  res.status(200).json({
    message: "OTP sent to your mail",
  });
});

export const verifyUser = TryCatch(async (req: any, res: any) => {
  const { email, otp: enteredOTP } = req.body;

  if (!email || !enteredOTP) {
    res.status(400).json({
      message: "Email and OTP required",
    });
    return;
  }

  const OTPKey = `OTP:${email}`;
  const storedOTP = await redisClient.get(OTPKey);

  if (!storedOTP || storedOTP !== enteredOTP) {
    res.status(400).json({
      message: "Invalid OTP or expired OTP",
    });
    return;
  }

  await redisClient.del(OTPKey);

  let user = await User.findOne({ email });

  if (!user) {
    const name = email.split("@")[0];
    user = await User.create({ name, email });
  }

  const token = generateToken(user);

  res.status(201).json({
    message: "User verified & created successfully",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res: any) => {
  const user = req.user;
  res.status(200).json(user);
});

export const updateName = TryCatch(async (req: AuthenticatedRequest, res: any) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    res.status(404).json({
      message: "User not found. Pls Login",
    });
    return;
  }

  user.name = req.body.name;
  await user.save();

  const token = generateToken(user);

  res.status(200).json({
    message: "User details updated",
    user,
    token,
  });
});

export const getAllUsers = TryCatch(async (req: AuthenticatedRequest, res: any) => {
  const users = await User.find();
  res.json(users);
});

export const getAUser = TryCatch(async (req: AuthenticatedRequest, res: any) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
