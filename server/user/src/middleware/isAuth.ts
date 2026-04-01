import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/JWTtoken.js";
import type { IUser } from "../model/user.js";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Pls Login - No Auth Header",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decodedValue = verifyToken(token) as JwtPayload;

    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({
        message: "Invalid Token",
      });
      return;
    }

    req.user = decodedValue.user;
    next();
  } catch (e: any) {
    res.status(401).json({
      message: "Pls Login - JWT error",
    });
  }
};
