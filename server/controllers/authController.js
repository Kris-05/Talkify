import { genSalt } from "bcrypt";
import { getPrismaClient } from "../utils/prismaClient.js";
import { createToken } from "../utils/createToken.js";
import bcrypt from "bcrypt";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        data: user,
        message: "user found!",
      });
    }
  } catch (err) {
    next(err);
  }
};

export const signUpUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const prisma = getPrismaClient();
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    res.cookie("jwt", createToken(email, newUser.id), {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: "User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: "User info retrieved successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};
