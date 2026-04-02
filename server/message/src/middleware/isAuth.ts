import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/JWTtoken.js";
import type { JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Pls Login - No Auth Header" });
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
  } catch (e) {
    res.status(401).json({ message: "Pls Login - JWT Error" });
  }
};

export default isAuthenticated;