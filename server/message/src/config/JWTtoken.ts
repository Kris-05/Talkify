import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET as string;

export const generateToken = (user: any) => {
    return jwt.sign({ user }, secret, { expiresIn: "15d" });
};

export const verifyToken = (token: any) => {
    return jwt.verify(token, secret);
};
